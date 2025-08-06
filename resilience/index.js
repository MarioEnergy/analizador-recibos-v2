/**
 * 🛡️ RESILIENCE SYSTEM V4.0 - Energy Saver Costa Rica
 * Punto de entrada principal del sistema de resiliencia
 * Integra todos los módulos anti-falla con el sistema V3.0
 */

import { IntelligentRecoverySystem } from './automation/intelligent-recovery.js';

// Instancia global del sistema de resiliencia
let recoverySystem = null;

/**
 * Inicializa el sistema de resiliencia V4.0
 */
async function initializeResilience() {
    try {
        console.log('🛡️ Inicializando Sistema Resiliencia V4.0...');
        
        // Crear instancia del sistema de recuperación
        recoverySystem = new IntelligentRecoverySystem();
        
        // Hacer disponible globalmente
        if (typeof window !== 'undefined') {
            window.resilienceSystem = recoverySystem;
            window.resilienceV4 = {
                status: () => recoverySystem.getSystemStatus(),
                reset: () => recoverySystem.reset(),
                checkHealth: () => recoverySystem.performSystemCheck()
            };
        }
        
        console.log('✅ Sistema Resiliencia V4.0 activo y monitoreando');
        
        // Mostrar notificación de éxito
        showInitializationSuccess();
        
        return recoverySystem;
        
    } catch (error) {
        console.error('❌ Error inicializando resiliencia:', error);
        showInitializationError(error);
        return null;
    }
}

/**
 * Muestra notificación de inicialización exitosa
 */
function showInitializationSuccess() {
    if (typeof document === 'undefined') return;
    
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 99999;
            text-align: center;
            animation: fadeInUp 0.5s ease-out;
        ">
            <h3 style="margin: 0 0 10px 0;">
                🛡️ Sistema Anti-Falla V4.0 Activo
            </h3>
            <p style="margin: 0;">
                Tu sistema ahora es prácticamente indestructible
            </p>
        </div>
        
        <style>
            @keyframes fadeInUp {
                from { 
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        </style>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

/**
 * Muestra error de inicialización
 */
function showInitializationError(error) {
    if (typeof document === 'undefined') return;
    
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #F44336;
            color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 100000;
            text-align: center;
            max-width: 400px;
        ">
            <h3 style="margin: 0 0 15px 0;">
                ⚠️ Error en Sistema Resiliencia
            </h3>
            <p style="margin: 0 0 20px 0;">
                El sistema anti-falla no pudo inicializarse completamente.
                El sistema V3.0 sigue funcionando normalmente.
            </p>
            <button onclick="this.parentElement.remove()"
                    style="
                        padding: 10px 30px;
                        background: white;
                        color: #F44336;
                        border: none;
                        border-radius: 5px;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                ENTENDIDO
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
}

// Auto-inicialización si se carga en browser
if (typeof window !== 'undefined') {
    // Esperar a que DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeResilience);
    } else {
        // DOM ya está listo
        initializeResilience();
    }
}

// Exportar funciones principales
export { initializeResilience, recoverySystem };
export default initializeResilience;
