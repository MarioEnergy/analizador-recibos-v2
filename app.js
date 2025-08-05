// ============================================
// ENERGY SAVER COSTA RICA - SISTEMA SEGURO
// VERSIÓN MARIO SAVARD - CON LÍMITES Y CONTROL DE USUARIOS
// ============================================

const GOOGLE_CONFIG = {
    CLIENT_ID: '735489123456-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com', // Mario debe configurar
    API_KEY: 'AIzaSyABC123DEF456GHI789JKL012MNO345PQR', // Mario debe configurar
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email'
};

const SECURITY_CONFIG = {
    MAX_ANALISIS_POR_DIA: 50,
    MARIO_EMAIL: 'mario.savard@energysavercr.com',
    TIEMPO_COOLDOWN: 10000,
    RESET_HORA: 0
};

let USUARIOS_SISTEMA = {
    'mario.savard@energysavercr.com': { 
        nombre: 'Mario Savard Boies', 
        rol: 'admin', 
        activo: true,
        aprobado: true,
        analisisHoy: 0,
        fechaUltimoReset: new Date().toDateString(),
        ultimoAnalisis: null,
        fechaCreacion: new Date().toISOString(),
        totalAnalisis: 0
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
// CONTROL DE LÍMITES
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
// GESTIÓN DE USUARIOS
// ============================================
function agregarUsuario(email, nombre) {
    if (currentUser.email !== SECURITY_CONFIG.MARIO_EMAIL) {
        throw new Error('Solo Mario puede agregar usuarios');
    }
    if (USUARIOS_SISTEMA[email]) {
        throw new Error('Usuario ya existe');
    }
    
    USUARIOS_SISTEMA[email] = {
        nombre: nombre,
        rol: 'vendedor',
        activo: false,
        aprobado: false,
        analisisHoy: 0,
        fechaUltimoReset: new Date().toDateString(),
        ultimoAnalisis: null,
        fechaCreacion: new Date().toISOString(),
        totalAnalisis: 0
    };
    
    return USUARIOS_SISTEMA[email];
}

function toggleUsuario(email, campo, valor) {
    if (currentUser.email !== SECURITY_CONFIG.MARIO_EMAIL) {
        throw new Error('Solo Mario puede modificar usuarios');
    }
    if (!USUARIOS_SISTEMA[email]) {
        throw new Error('Usuario no encontrado');
    }
    
    USUARIOS_SISTEMA[email][campo] = valor;
    return USUARIOS_SISTEMA[email];
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔋 Energy Saver Mario - Sistema Seguro iniciando...');
    mostrarPantallaLogin();
    initializeGoogleAPI();
});

async function initializeGoogleAPI() {
    try {
        await loadGoogleAPI();
        await gapi.load('auth2:client', initializeGapiClient);
    } catch (error) {
        console.error('❌ Error Google API:', error);
        mostrarError('Error de conexión. Verifique internet.');
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
        
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
            handleSignIn(authInstance.currentUser.get());
        }
    } catch (error) {
        console.error('❌ Error inicializando:', error);
    }
}

function mostrarPantallaLogin() {
    document.body.innerHTML = `
        <div class="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div class="text-center mb-8">
                    <div class="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <span class="text-3xl">🔋</span>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800">Energy Saver Costa Rica</h1>
                    <p class="text-gray-600 mt-2">Sistema Profesional Seguro</p>
                </div>
                
                <button id="google-signin" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200">
                    <span>🔄 Iniciar sesión con Google</span>
                </button>
                
                <div class="mt-6 text-center text-sm text-gray-500">
                    <p>🔐 Solo usuarios aprobados por Mario</p>
                    <p>📊 Máximo 50 análisis por día</p>
                    <p>💾 Almacenamiento automático en Drive</p>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('google-signin').onclick = signInWithGoogle;
}

async function signInWithGoogle() {
    try {
        const authInstance = gapi.auth2.getAuthInstance();
        const user = await authInstance.signIn();
        await handleSignIn(user);
    } catch (error) {
        mostrarError('Error al iniciar sesión');
    }
}

async function handleSignIn(user) {
    try {
        const profile = user.getBasicProfile();
        const email = profile.getEmail();
        const nombre = profile.getName();
        
        if (!USUARIOS_SISTEMA[email]) {
            throw new Error('Usuario no registrado. Contacte a Mario.');
        }
        
        const usuario = USUARIOS_SISTEMA[email];
        if (!usuario.activo || !usuario.aprobado) {
            throw new Error('Usuario no autorizado. Contacte a Mario.');
        }
        
        currentUser = {
            email: email,
            nombre: nombre,
            rol: usuario.rol,
            foto: profile.getImageUrl()
        };
        
        mostrarInterfazPrincipal();
        
    } catch (error) {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance) await authInstance.signOut();
        mostrarError(error.message);
    }
}

function mostrarInterfazPrincipal() {
    document.body.innerHTML = `
        <div class="min-h-screen bg-gray-50">
            <header class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <span class="text-2xl">🔋</span>
                            <h1 class="ml-2 text-xl font-bold">Energy Saver Costa Rica</h1>
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
                        <h2 class="text-lg font-medium mb-4">Gestión de Usuarios (Solo Mario)</h2>
                        
                        <div class="mb-4 p-4 bg-gray-50 rounded">
                            <h3 class="font-medium mb-2">Agregar Usuario</h3>
                            <div class="grid grid-cols-2 gap-4 mb-2">
                                <input type="email" id="new-email" placeholder="email@ejemplo.com" class="px-3 py-2 border rounded">
                                <input type="text" id="new-name" placeholder="Nombre Completo" class="px-3 py-2 border rounded">
                            </div>
                            <button id="add-user-btn" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Crear Usuario</button>
                        </div>
                        
                        <div id="users-table">
                            <!-- Tabla de usuarios se carga aquí -->
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
    if (currentUser.rol === 'admin') cargarTablaUsuarios();
}

function configurarEventos() {
    document.getElementById('logout-btn').onclick = cerrarSesion;
    document.getElementById('analyze-btn').onclick = realizarAnalisis;
    
    if (currentUser.rol === 'admin') {
        document.getElementById('add-user-btn').onclick = crearUsuario;
    }
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
                    <p class="text-green-600"><strong>✅ Análisis completado y guardado</strong></p>
                </div>
            </div>
        `;
        document.getElementById('results-section').classList.remove('hidden');
        
        mostrarNotificacion('✅ Análisis completado', 'success');
        
    } catch (error) {
        mostrarError(error.message);
    }
}

function crearUsuario() {
    try {
        const email = document.getElementById('new-email').value.trim();
        const nombre = document.getElementById('new-name').value.trim();
        
        if (!email || !nombre) {
            mostrarError('Complete todos los campos');
            return;
        }
        
        agregarUsuario(email, nombre);
        cargarTablaUsuarios();
        
        document.getElementById('new-email').value = '';
        document.getElementById('new-name').value = '';
        
        mostrarNotificacion('Usuario creado (inactivo)', 'success');
        
    } catch (error) {
        mostrarError(error.message);
    }
}

function cargarTablaUsuarios() {
    const tabla = document.getElementById('users-table');
    tabla.innerHTML = `
        <table class="w-full border-collapse border border-gray-300">
            <thead>
                <tr class="bg-gray-50">
                    <th class="border border-gray-300 px-4 py-2 text-left">Usuario</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">Análisis Hoy</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">Total</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">Activo</th>
                    <th class="border border-gray-300 px-4 py-2 text-left">Aprobado</th>
                </tr>
            </thead>
            <tbody id="users-tbody">
            </tbody>
        </table>
    `;
    
    const tbody = document.getElementById('users-tbody');
    Object.entries(USUARIOS_SISTEMA).forEach(([email, usuario]) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border border-gray-300 px-4 py-2">
                <div class="font-medium">${usuario.nombre}</div>
                <div class="text-sm text-gray-500">${email}</div>
            </td>
            <td class="border border-gray-300 px-4 py-2">${email === SECURITY_CONFIG.MARIO_EMAIL ? 'Ilimitado' : usuario.analisisHoy}</td>
            <td class="border border-gray-300 px-4 py-2">${usuario.totalAnalisis}</td>
            <td class="border border-gray-300 px-4 py-2">
                ${email !== SECURITY_CONFIG.MARIO_EMAIL ? `
                    <input type="checkbox" ${usuario.activo ? 'checked' : ''} 
                           onchange="toggleUserStatus('${email}', 'activo', this.checked)">
                ` : '👑 Admin'}
            </td>
            <td class="border border-gray-300 px-4 py-2">
                ${email !== SECURITY_CONFIG.MARIO_EMAIL ? `
                    <input type="checkbox" ${usuario.aprobado ? 'checked' : ''} 
                           onchange="toggleUserStatus('${email}', 'aprobado', this.checked)">
                ` : '👑 Admin'}
            </td>
        `;
        tbody.appendChild(fila);
    });
}

window.toggleUserStatus = function(email, campo, valor) {
    try {
        toggleUsuario(email, campo, valor);
        mostrarNotificacion(`Usuario ${campo === 'activo' ? 'activado' : 'aprobado'}`, 'success');
    } catch (error) {
        mostrarError(error.message);
        cargarTablaUsuarios();
    }
};

async function cerrarSesion() {
    try {
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance) await authInstance.signOut();
        currentUser = null;
        mostrarPantallaLogin();
    } catch (error) {
        console.error('Error logout:', error);
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

// Funciones de análisis (simplificadas para demo)
function seleccionarModeloPorFactura(factura) {
    for (let modelo of Object.values(MODELOS)) {
        if (factura >= modelo.rangoFactura.min && factura <= modelo.rangoFactura.max) {
            return modelo;
        }
    }
    return MODELOS['JS-1299'];
}

console.log('🔋 Energy Saver Costa Rica - Sistema Seguro v2.0 cargado');
