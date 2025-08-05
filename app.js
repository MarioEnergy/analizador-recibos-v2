// ENERGY SAVER - VERSIONE MINIMAL CHE CARICA SEMPRE
console.log('🔋 Energy Saver - Caricamento iniziato...');

const USUARIOS_SISTEMA = {
    'mariosavardenergysaver@gmail.com': {
        nombre: 'Mario Savard Boies',
        rol: 'admin',
        activo: true,
        aprobado: true,
        password: 'Mario13&07@@'
    }
};

let currentUser = null;

// INIZIALIZZAZIONE SICURA
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM caricato, inizializzando...');
    mostrarPantallaLogin();
});

// LOGIN SEMPLICE SICURO
function mostrarPantallaLogin() {
    console.log('🔑 Mostrando schermata login...');
    
    document.body.innerHTML = `
        <div style="min-height: 100vh; background: linear-gradient(135deg, #2563eb, #16a34a); display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: white; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); padding: 40px; max-width: 400px; width: 100%;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background: #dcfce7; padding: 20px; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 30px;">🔋</span>
                    </div>
                    <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">Energy Saver Costa Rica</h1>
                    <p style="color: #6b7280;">Sistema Profesional</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="font-size: 18px; font-weight: 500; color: #374151; text-align: center; margin-bottom: 20px;">Iniciar Sesión</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 5px;">Email</label>
                        <input type="email" id="manual-email" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="mariosavardenergysaver@gmail.com">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 5px;">Password</label>
                        <input type="password" id="manual-password" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;" placeholder="Mario13&07@@">
                    </div>
                    
                    <button id="manual-login" style="width: 100%; background: #2563eb; color: white; padding: 12px; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.2s;">
                        🔑 Iniciar Sesión
                    </button>
                </div>
                
                <div style="text-align: center; font-size: 14px; color: #6b7280;">
                    <p>🔐 Sistema seguro Energy Saver</p>
                    <p>📞 Soporte: 8722-6666</p>
                </div>
            </div>
        </div>
    `;
    
    // Eventi
    document.getElementById('manual-login').onclick = handleManualLogin;
    document.getElementById('manual-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleManualLogin();
    });
    
    console.log('✅ Login form mostrato');
}

// LOGIN HANDLER
function handleManualLogin() {
    console.log('🔄 Tentativo login...');
    
    const email = document.getElementById('manual-email').value.trim();
    const password = document.getElementById('manual-password').value.trim();
    
    if (!email || !password) {
        alert('❌ Complete todos los campos');
        return;
    }
    
    const usuario = USUARIOS_SISTEMA[email];
    if (!usuario) {
        alert('❌ Usuario no encontrado');
        return;
    }
    
    if (usuario.password !== password) {
        alert('❌ Password incorrecta');
        return;
    }
    
    // Login exitoso
    currentUser = {
        email: email,
        nombre: usuario.nombre,
        rol: usuario.rol
    };
    
    console.log('✅ Login exitoso:', email);
    mostrarSistema();
}

// SISTEMA PRINCIPAL
function mostrarSistema() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; background: #f9fafb;">
            <header style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 20px;">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 24px; margin-right: 10px;">🔋</span>
                        <h1 style="font-size: 20px; font-weight: bold; color: #1f2937;">Energy Saver Costa Rica</h1>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span style="font-weight: 500;">Bienvenido, ${currentUser.nombre}</span>
                        <button onclick="cerrarSesion()" style="background: #dc2626; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">Salir</button>
                    </div>
                </div>
            </header>
            
            <main style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 30px;">
                    <h2 style="font-size: 18px; font-weight: 500; color: #1f2937; margin-bottom: 20px;">📊 Nuevo Análisis Energético</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 5px;">Nombre del Cliente</label>
                        <input type="text" id="client-name" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px;" placeholder="Ej: Juan Pérez Rodríguez">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 5px;">Recibos Eléctricos</label>
                        <div style="border: 2px dashed #d1d5db; border-radius: 10px; padding: 40px; text-align: center; color: #6b7280;">
                            <p style="font-size: 16px; margin-bottom: 10px;">📁 Arrastra archivos aquí</p>
                            <p style="font-size: 14px;">JPG, PNG, PDF hasta 5MB</p>
                            <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" style="margin-top: 20px;">
                        </div>
                    </div>
                    
                    <button onclick="realizarAnalisis()" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
                        📊 Analizar Recibos
                    </button>
                    
                    <div id="resultados" style="margin-top: 30px; display: none;">
                        <!-- Resultados aquí -->
                    </div>
                </div>
            </main>
        </div>
    `;
    
    console.log('✅ Sistema principal mostrado');
}

// FUNCIONES GLOBALES
window.cerrarSesion = function() {
    currentUser = null;
    mostrarPantallaLogin();
};

window.realizarAnalisis = function() {
    const cliente = document.getElementById('client-name').value.trim();
    if (!cliente) {
        alert('❌ Ingrese el nombre del cliente');
        return;
    }
    
    // Simula análisis
    document.getElementById('resultados').innerHTML = `
        <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 20px;">
            <h3 style="color: #15803d; margin-bottom: 15px;">✅ Análisis Completado</h3>
            <p><strong>Cliente:</strong> ${cliente}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Equipo Recomendado:</strong> JS-1699</p>
            <p><strong>Ahorro Estimado:</strong> 22% mensual</p>
            <p><strong>ROI:</strong> 18 meses</p>
        </div>
    `;
    document.getElementById('resultados').style.display = 'block';
    
    alert('✅ Análisis completado correctamente!');
};

console.log('🔋 Energy Saver Sistema Minimal - Cargado correctamente');
