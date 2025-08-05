// ============================================
// ENERGY SAVER COSTA RICA - SISTEMA CON LOGIN FLESSIBILE
// VERSIÓN MARIO - LOGIN MANUAL + GOOGLE OAUTH
// ============================================

const GOOGLE_CONFIG = {
    CLIENT_ID: '636456552164-l6kras5i3kdj1htvf6lo262b4te2uos3.apps.googleusercontent.com',
    API_KEY: '636456552164-l6kras5i3kdj1htvf6lo262b4te2uos3.apps.googleusercontent.com', // Usando CLIENT_ID come API_KEY
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email'
};

const SECURITY_CONFIG = {
    MAX_ANALISIS_POR_DIA: 50,
    MARIO_EMAIL: 'mario@marioenergy.com', // Mario aggiorna con email vera
    TIEMPO_COOLDOWN: 10000,
    RESET_HORA: 0
};

// DATABASE UTENTI CON EMAIL DI GITHUB
let USUARIOS_SISTEMA = {
    'mario@marioenergy.com': { // Mario aggiorna con email vera
        nombre: 'Mario Savard Boies', 
        rol: 'admin', 
        activo: true,
        aprobado: true,
        analisisHoy: 0,
        fechaUltimoReset: new Date().toDateString(),
        ultimoAnalisis: null,
        fechaCreacion: new Date().toISOString(),
        totalAnalisis: 0,
        password: 'mario123' // Password temporanea per login manual
    }
};

const MODELOS = {
    'JS-1299': {
        nombre: 'JS-1299',
        rangoFactura: { min: 200000, max: 400000 },
        precio: 3200,
        instalacion: 500,
        iva: 491,
        precioTotal: 4191,
        primaInicial: 1100,
        cuotaMensual: 128,
        aplicacion: 'Residencial/Comercial pequeño'
    },
    'JS-1699': {
        nombre: 'JS-1699',
        rangoFactura: { min: 401000, max: 600000 },
        precio: 4000,
        instalacion: 500,
        iva: 585,
        precioTotal: 5085,
        primaInicial: 1300,
        cuotaMensual: 158,
        aplicacion: 'Comercial mediano'
    },
    'JS-2099': {
        nombre: 'JS-2099',
        rangoFactura: { min: 601000, max: 850000 },
        precio: 4600,
        instalacion: 500,
        iva: 663,
        precioTotal: 5763,
        primaInicial: 1500,
        cuotaMensual: 178,
        aplicacion: 'Comercial grande'
    },
    'JS-2499': {
        nombre: 'JS-2499',
        rangoFactura: { min: 851000, max: 2000000 },
        precio: 5200,
        instalacion: 500,
        iva: 741,
        precioTotal: 6441,
        primaInicial: 1750,
        cuotaMensual: 195,
        aplicacion: 'Industrial'
    }
};

let gapi, currentUser = null, TC_BCCR = 512;
let currentData = null, analisisActivo = false;
let userAnalisisHistory = [];

// ============================================
// CONTROL DE LÍMITES (igual que antes)
// ============================================
function verificarLimiteAnalisis(email) {
    const usuario = USUARIOS_SISTEMA[email];
    if (!usuario) throw new Error('Usuario no encontrado');
    if (!usuario.activo || !usuario.aprobado) throw new Error('Usuario no autorizado');
    
    if (email === SECURITY_CONFIG.MARIO_EMAIL) {
        return { permitido: true, restantes: 'Ilimitado' };
    }
    
    const hoy = new Date().toDateString();
    if (usuario.fechaUltimoReset !== hoy) {
        usuario.analisisHoy = 0;
        usuario.fechaUltimoReset = hoy;
    }
    
    if (usuario.analisisHoy >= SECURITY_CONFIG.MAX_ANALISIS_POR_DIA) {
        throw new Error(`Límite diario alcanzado (${SECURITY_CONFIG.MAX_ANALISIS_POR_DIA}). Intente mañana.`);
    }
    
    if (usuario.ultimoAnalisis) {
        const tiempoPasado = Date.now() - usuario.ultimoAnalisis;
        if (tiempoPasado < SECURITY_CONFIG.TIEMPO_COOLDOWN) {
            const segundos = Math.ceil((SECURITY_CONFIG.TIEMPO_COOLDOWN - tiempoPasado) / 1000);
            throw new Error(`Espere ${segundos} segundos antes del próximo análisis`);
        }
    }
    
    return { permitido: true, restantes: SECURITY_CONFIG.MAX_ANALISIS_POR_DIA - usuario.analisisHoy };
}

function registrarAnalisisRealizado(email) {
    const usuario = USUARIOS_SISTEMA[email];
    if (usuario && email !== SECURITY_CONFIG.MARIO_EMAIL) {
        usuario.analisisHoy++;
        usuario.ultimoAnalisis = Date.now();
        usuario.totalAnalisis++;
        actualizarContadorLimites();
    }
}

function actualizarContadorLimites() {
    const contador = document.getElementById('contador-limites');
    if (contador && currentUser) {
        if (currentUser.email === SECURITY_CONFIG.MARIO_EMAIL) {
            contador.innerHTML = '<span class="text-green-600">👑 Análisis ilimitados</span>';
        } else {
            const usuario = USUARIOS_SISTEMA[currentUser.email];
            const usado = usuario ? usuario.analisisHoy : 0;
            const restantes = SECURITY_CONFIG.MAX_ANALISIS_POR_DIA - usado;
            const color = restantes > 10 ? 'text-green-600' : restantes > 5 ? 'text-yellow-600' : 'text-red-600';
            contador.innerHTML = `<span class="${color}">📊 ${usado}/50 (${restantes} restantes)</span>`;
        }
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔋 Energy Saver Mario - Sistema con Login Flessibile iniciando...');
    mostrarPantallaLogin();
    initializeGoogleAPI();
});

async function initializeGoogleAPI() {
    try {
        await loadGoogleAPI();
        await gapi.load('auth2:client', initializeGapiClient);
    } catch (error) {
        console.error('❌ Error Google API:', error);
        // Continua sin Google si falla
        console.log('ℹ️ Sistema funcionará solo con login manual');
    }
}

function loadGoogleAPI() {
    return new Promise((resolve, reject) => {
        if (typeof gapi !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: GOOGLE_CONFIG.API_KEY,
            clientId: GOOGLE_CONFIG.CLIENT_ID,
            discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
            scope: GOOGLE_CONFIG.SCOPES
        });
        
        console.log('✅ Google API inizializada');
        
        // Check se già autenticato
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance && authInstance.isSignedIn.get()) {
            const user = authInstance.currentUser.get();
            const email = user.getBasicProfile().getEmail();
            
            // Se è già loggato con account autorizzato, login automatico
            if (USUARIOS_SISTEMA[email] && USUARIOS_SISTEMA[email].activo && USUARIOS_SISTEMA[email].aprobado) {
                console.log('🚀 Login automatico con Google per:', email);
                await handleGoogleSignIn(user);
                return;
            }
        }
        
        // Abilita pulsante Google
        const googleBtn = document.getElementById('google-signin');
        if (googleBtn) {
            googleBtn.disabled = false;
            googleBtn.innerHTML = `
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continuar con Google</span>
            `;
        }
        
    } catch (error) {
        console.error('❌ Error inizializzando Google Client:', error);
    }
}

// ============================================
// PANTALLA DE LOGIN FLESSIBILE
// ============================================
function mostrarPantallaLogin() {
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div class="text-center mb-8">
                    <div class="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <span class="text-3xl">🔋</span>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800">Energy Saver Costa Rica</h1>
                    <p class="text-gray-600 mt-2">Sistema Profesional</p>
                </div>
                
                <!-- Login Manual -->
                <div class="space-y-4 mb-6">
                    <h3 class="text-lg font-medium text-gray-700 text-center">Iniciar Sesión</h3>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="manual-email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                               placeholder="tu@email.com">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" id="manual-password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                               placeholder="Tu password">
                    </div>
                    
                    <button id="manual-login" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200">
                        🔑 Iniciar Sesión
                    </button>
                </div>
                
                <!-- Separador -->
                <div class="flex items-center my-6">
                    <div class="flex-1 border-t border-gray-300"></div>
                    <span class="px-4 text-sm text-gray-500">o</span>
                    <div class="flex-1 border-t border-gray-300"></div>
                </div>
                
                <!-- Login Google -->
                <button id="google-signin" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition duration-200" disabled>
                    <div class="loading-spinner w-5 h-5"></div>
                    <span>Cargando Google...</span>
                </button>
                
                <div class="mt-6 text-center text-sm text-gray-500">
                    <p>🔐 Solo usuarios autorizados por Mario</p>
                    <p>📊 Máximo 50 análisis por día</p>
                    <p>💾 Datos guardados automáticamente</p>
                </div>
                
                <!-- Info para Mario -->
                <div class="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                    <p class="font-medium">👑 Para Mario (Admin):</p>
                    <p>Email: mario@marioenergy.com</p>
                    <p>Password: mario123</p>
                    <p class="text-xs mt-2">* Cambia estos datos después del primer login</p>
                </div>
            </div>
        </div>
        
        <style>
            .loading-spinner {
                border: 2px solid #f3f3f3;
                border-top: 2px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // Configurar eventi
    document.getElementById('manual-login').onclick = handleManualLogin;
    document.getElementById('google-signin').onclick = signInWithGoogle;
    
    // Enter key per login
    document.getElementById('manual-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleManualLogin();
        }
    });
}

// ============================================ 
// LOGIN MANUAL
// ============================================
async function handleManualLogin() {
    try {
        const email = document.getElementById('manual-email').value.trim();
        const password = document.getElementById('manual-password').value.trim();
        
        if (!email || !password) {
            mostrarError('Complete todos los campos');
            return;
        }
        
        // Verificar credenziali
        const usuario = USUARIOS_SISTEMA[email];
        if (!usuario) {
            mostrarError('Usuario no encontrado');
            return;
        }
        
        if (usuario.password !== password) {
            mostrarError('Password incorrecta');
            return;
        }
        
        if (!usuario.activo || !usuario.aprobado) {
            mostrarError('Usuario no autorizado. Contacte a Mario.');
            return;
        }
        
        // Login riuscito
        currentUser = {
            email: email,
            nombre: usuario.nombre,
            rol: usuario.rol,
            foto: 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=' + usuario.nombre.charAt(0),
            loginType: 'manual'
        };
        
        console.log('✅ Login manual riuscito:', email);
        mostrarInterfazPrincipal();
        
    } catch (error) {
        console.error('❌ Error login manual:', error);
        mostrarError('Error en el login: ' + error.message);
    }
}

// ============================================
// LOGIN GOOGLE  
// ============================================
async function signInWithGoogle() {
    try {
        if (!gapi || !gapi.auth2) {
            mostrarError('Google API no disponible. Use login manual.');
            return;
        }
        
        const authInstance = gapi.auth2.getAuthInstance();
        const user = await authInstance.signIn();
        
        await handleGoogleSignIn(user);
        
    } catch (error) {
        console.error('❌ Error Google login:', error);
        mostrarError('Error con Google. Use login manual.');
    }
}

async function handleGoogleSignIn(user) {
    try {
        const profile = user.getBasicProfile();
        const email = profile.getEmail();
        const nombre = profile.getName();
        
        console.log('👤 Google login attempt:', email);
        
        // Verificar se l'utente è autorizzato
        const usuario = USUARIOS_SISTEMA[email];
        if (!usuario) {
            throw new Error(`Usuario ${email} no registrado. Contacte a Mario.`);
        }
        
        if (!usuario.activo || !usuario.aprobado) {
            throw new Error('Usuario no autorizado. Contacte a Mario.');
        }
        
        // Login riuscito
        currentUser = {
            email: email,
            nombre: nombre,
            rol: usuario.rol,
            foto: profile.getImageUrl(),
            loginType: 'google'
        };
        
        console.log('✅ Google login riuscito:', email);
        mostrarInterfazPrincipal();
        
    } catch (error) {
        console.error('❌ Error Google auth:', error);
        
        // Logout da Google se errore
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance) {
            await authInstance.signOut();
        }
        
        mostrarError(error.message);
    }
}

// ============================================
// INTERFAZ PRINCIPALE (resto uguale)
// ============================================
function mostrarInterfazPrincipal() {
    document.body.innerHTML = `
        <div class="min-h-screen bg-gray-50">
            <header class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <span class="text-2xl">🔋</span>
                            <h1 class="ml-2 text-xl font-bold">Energy Saver Costa Rica</h1>
                            <span class="ml-2 text-sm px-2 py-1 rounded ${currentUser.loginType === 'google' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">
                                ${currentUser.loginType === 'google' ? '🔗 Google' : '🔑 Manual'}
                            </span>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div id="contador-limites"></div>
                            <div class="flex items-center space-x-2">
                                <img src="${currentUser.foto}" class="w-8 h-8 rounded-full">
                                <span class="font-medium">${currentUser.nombre}</span>
                                <button id="logout-btn" class="text-red-600 hover:text-red-800">Salir</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="max-w-7xl mx-auto py-6 px-4">
                <div class="space-y-6">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-lg font-medium mb-4">Nuevo Análisis</h2>
                        
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Nombre del Cliente</label>
                            <input type="text" id="client-name" class="w-full px-3 py-2 border rounded-md" placeholder="Nombre completo">
                        </div>
                        
                        <button id="analyze-btn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            📊 Analizar Recibos
                        </button>
                    </div>
                    
                    ${currentUser.rol === 'admin' ? `
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-lg font-medium mb-4">Panel de Administración</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-4 bg-blue-50 rounded">
                                <h3 class="font-medium text-blue-800">Usuarios Totales</h3>
                                <p class="text-2xl font-bold text-blue-600">${Object.keys(USUARIOS_SISTEMA).length}</p>
                            </div>
                            <div class="p-4 bg-green-50 rounded">
                                <h3 class="font-medium text-green-800">Análisis Hoy</h3>
                                <p class="text-2xl font-bold text-green-600">∞</p>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div id="results-section" class="hidden">
                        <!-- Resultados aparecen aquí -->
                    </div>
                </div>
            </main>
        </div>
    `;
    
    configurarEventos();
    actualizarContadorLimites();
}

function configurarEventos() {
    document.getElementById('logout-btn').onclick = cerrarSesion;
    document.getElementById('analyze-btn').onclick = realizarAnalisis;
}

async function realizarAnalisis() {
    try {
        const limites = verificarLimiteAnalisis(currentUser.email);
        
        const clientName = document.getElementById('client-name').value.trim();
        if (!clientName) {
            mostrarError('Ingrese el nombre del cliente');
            return;
        }
        
        // Simular análisis
        currentData = {
            clientName: clientName,
            timestamp: new Date().toISOString(),
            usuario: currentUser.email
        };
        
        registrarAnalisisRealizado(currentUser.email);
        
        document.getElementById('results-section').innerHTML = `
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-medium mb-4">Resultados del Análisis</h2>
                <div class="space-y-2">
                    <p><strong>Cliente:</strong> ${clientName}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Análisis realizado por:</strong> ${currentUser.nombre}</p>
                    <p><strong>Método de login:</strong> ${currentUser.loginType === 'google' ? 'Google OAuth' : 'Login Manual'}</p>
                    <p class="text-green-600"><strong>✅ Análisis completado</strong></p>
                </div>
            </div>
        `;
        document.getElementById('results-section').classList.remove('hidden');
        
        mostrarNotificacion('✅ Análisis completado', 'success');
        
    } catch (error) {
        mostrarError(error.message);
    }
}

async function cerrarSesion() {
    try {
        if (currentUser.loginType === 'google' && gapi && gapi.auth2) {
            const authInstance = gapi.auth2.getAuthInstance();
            if (authInstance) await authInstance.signOut();
        }
        
        currentUser = null;
        mostrarPantallaLogin();
        
    } catch (error) {
        console.error('Error logout:', error);
        currentUser = null;
        mostrarPantallaLogin();
    }
}

function mostrarError(mensaje) {
    mostrarNotificacion('❌ ' + mensaje, 'error');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const colores = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const notif = document.createElement('div');
    notif.className = `fixed top-4 right-4 ${colores[tipo]} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notif.textContent = mensaje;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// Altre funzioni utility (seleccionarModeloPorFactura, etc.)
function seleccionarModeloPorFactura(factura) {
    for (let modelo of Object.values(MODELOS)) {
        if (factura >= modelo.rangoFactura.min && factura <= modelo.rangoFactura.max) {
            return modelo;
        }
    }
    return MODELOS['JS-1299'];
}

console.log('🔋 Energy Saver Costa Rica - Sistema Flexible v2.0 cargado');
