/**
 * 🔐 EMERGENCY AUTH MODULE - Energy Saver Costa Rica V4.0
 * Sistema de autenticación de emergencia para Mario
 * Permite acceso cuando el sistema de login principal falla
 */

import { CONFIG_BACKUP } from '../backup/backup-config.js';

/**
 * Sistema de Autenticación de Emergencia
 */
class EmergencyAuth {
    constructor() {
        this.emergencyCode = CONFIG_BACKUP.auth.emergencyCode || 'MARIO2025';
        this.isEmergencyMode = false;
        this.emergencySession = null;
        this.maxAttempts = 3;
        this.currentAttempts = 0;
        this.blockTime = 300000; // 5 minutos de bloqueo
        this.blocked = false;
        this.blockTimeout = null;
    }
    
    /**
     * Verifica si el sistema de auth principal está funcionando
     */
    async checkMainAuthStatus() {
        try {
            // Intenta cargar módulo auth principal
            const mainAuth = await import('../../modules/auth/auth.js');
            
            // Verifica si puede inicializar
            if (mainAuth && typeof mainAuth.default === 'function') {
                console.log('✅ Sistema auth principal disponible');
                return true;
            }
            return false;
            
        } catch (error) {
            console.warn('⚠️ Sistema auth principal no disponible:', error.message);
            return false;
        }
    }
    
    /**
     * Activa el modo de emergencia
     */
    async activateEmergencyMode() {
        // Primero verifica si auth principal funciona
        const mainAuthWorks = await this.checkMainAuthStatus();
        
        if (mainAuthWorks) {
            console.log('ℹ️ Auth principal funciona, no es necesario modo emergencia');
            return { success: false, reason: 'MAIN_AUTH_AVAILABLE' };
        }
        
        // Si está bloqueado por intentos fallidos
        if (this.blocked) {
            return { 
                success: false, 
                reason: 'BLOCKED', 
                message: 'Sistema bloqueado por seguridad. Intenta más tarde.' 
            };
        }
        
        // Activar modo emergencia
        this.isEmergencyMode = true;
        this.showEmergencyLogin();
        
        return { success: true, mode: 'EMERGENCY_ACTIVATED' };
    }
    
    /**
     * Muestra interfaz de login de emergencia
     */
    showEmergencyLogin() {
        if (typeof document === 'undefined') return;
        
        // Crear overlay de emergencia
        const overlay = document.createElement('div');
        overlay.id = 'emergency-auth-overlay';
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 100000;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    max-width: 400px;
                    width: 90%;
                ">
                    <h2 style="
                        color: #ff9800;
                        margin: 0 0 20px 0;
                        text-align: center;
                    ">
                        🚨 MODO EMERGENCIA
                    </h2>
                    
                    <p style="
                        text-align: center;
                        color: #666;
                        margin-bottom: 30px;
                    ">
                        Sistema de login principal no disponible.<br>
                        Mario, ingresa tu código de emergencia.
                    </p>
                    
                    <div id="emergency-error" style="
                        color: #f44336;
                        text-align: center;
                        margin-bottom: 20px;
                        display: none;
                    "></div>
                    
                    <input type="password" 
                           id="emergency-code-input" 
                           placeholder="Código de emergencia"
                           style="
                               width: 100%;
                               padding: 15px;
                               font-size: 16px;
                               border: 2px solid #ddd;
                               border-radius: 5px;
                               margin-bottom: 20px;
                               box-sizing: border-box;
                           "
                           onkeypress="if(event.key === 'Enter') document.getElementById('emergency-login-btn').click()">
                    
                    <button id="emergency-login-btn"
                            onclick="window.emergencyAuth.validateEmergencyCode()"
                            style="
                                width: 100%;
                                padding: 15px;
                                background: #ff9800;
                                color: white;
                                border: none;
                                border-radius: 5px;
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                                transition: background 0.3s;
                            "
                            onmouseover="this.style.background='#f57c00'"
                            onmouseout="this.style.background='#ff9800'">
                        ACCEDER
                    </button>
                    
                    <p style="
                        text-align: center;
                        color: #999;
                        margin-top: 20px;
                        font-size: 14px;
                    ">
                        Intentos restantes: <span id="attempts-remaining">${this.maxAttempts - this.currentAttempts}</span>
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    
                    <p style="
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                    ">
                        ¿Necesitas ayuda?<br>
                        📞 Llama al: <strong>8722-6666</strong>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Focus en input
        setTimeout(() => {
            const input = document.getElementById('emergency-code-input');
            if (input) input.focus();
        }, 100);
    }
    
    /**
     * Valida código de emergencia ingresado
     */
    validateEmergencyCode() {
        const input = document.getElementById('emergency-code-input');
        const errorDiv = document.getElementById('emergency-error');
        const code = input ? input.value.trim() : '';
        
        // Limpiar error previo
        if (errorDiv) {
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }
        
        // Validar código
        if (code === this.emergencyCode) {
            this.successfulEmergencyLogin();
        } else {
            this.failedLoginAttempt();
        }
    }
    
    /**
     * Login de emergencia exitoso
     */
    successfulEmergencyLogin() {
        console.log('✅ Login de emergencia exitoso');
        
        // Crear sesión de emergencia
        this.emergencySession = {
            id: this.generateSessionId(),
            user: 'MARIO_EMERGENCY',
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        };
        
        // Guardar en sessionStorage
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('emergency_session', JSON.stringify(this.emergencySession));
        }
        
        // Remover overlay
        const overlay = document.getElementById('emergency-auth-overlay');
        if (overlay) overlay.remove();
        
        // Mostrar notificación de éxito
        this.showSuccessNotification();
        
        // Resetear intentos
        this.currentAttempts = 0;
        
        // Notificar al sistema
        this.notifySystemEmergencyLogin();
    }
    
    /**
     * Intento de login fallido
     */
    failedLoginAttempt() {
        this.currentAttempts++;
        
        const errorDiv = document.getElementById('emergency-error');
        const attemptsSpan = document.getElementById('attempts-remaining');
        const input = document.getElementById('emergency-code-input');
        
        if (this.currentAttempts >= this.maxAttempts) {
            // Bloquear sistema
            this.blockEmergencyAccess();
        } else {
            // Mostrar error
            if (errorDiv) {
                errorDiv.textContent = `Código incorrecto. ${this.maxAttempts - this.currentAttempts} intentos restantes.`;
                errorDiv.style.display = 'block';
            }
            
            if (attemptsSpan) {
                attemptsSpan.textContent = this.maxAttempts - this.currentAttempts;
            }
            
            // Limpiar input y shake effect
            if (input) {
                input.value = '';
                input.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);
            }
        }
    }
    
    /**
     * Bloquea acceso de emergencia por seguridad
     */
    blockEmergencyAccess() {
        this.blocked = true;
        
        const overlay = document.getElementById('emergency-auth-overlay');
        if (overlay) {
            overlay.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    text-align: center;
                    max-width: 400px;
                ">
                    <h2 style="color: #f44336;">🔒 SISTEMA BLOQUEADO</h2>
                    <p>Por seguridad, el acceso de emergencia ha sido bloqueado.</p>
                    <p>Intenta nuevamente en 5 minutos o contacta soporte:</p>
                    <p style="font-size: 24px; font-weight: bold;">📞 8722-6666</p>
                </div>
            `;
        }
        
        // Desbloquear después de 5 minutos
        this.blockTimeout = setTimeout(() => {
            this.blocked = false;
            this.currentAttempts = 0;
            if (overlay) overlay.remove();
            console.log('🔓 Sistema desbloqueado');
        }, this.blockTime);
    }
    
    /**
     * Muestra notificación de éxito
     */
    showSuccessNotification() {
        if (typeof document === 'undefined') return;
        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 99999;
                max-width: 350px;
            ">
                <h4 style="margin: 0;">✅ Acceso de Emergencia Concedido</h4>
                <p style="margin: 10px 0;">
                    Mario, estás trabajando en modo emergencia.
                    Algunas funciones pueden estar limitadas.
                </p>
                <small>Esta sesión expira en 24 horas</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 10000);
    }
    
    /**
     * Notifica al sistema sobre login de emergencia
     */
    notifySystemEmergencyLogin() {
        // Dispatch evento personalizado
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('emergencyLogin', {
                detail: {
                    session: this.emergencySession,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
        }
        
        // Log para tracking
        console.log('🚨 Emergency login event dispatched');
    }
    
    /**
     * Verifica si hay sesión de emergencia activa
     */
    checkEmergencySession() {
        if (typeof sessionStorage === 'undefined') return false;
        
        try {
            const session = JSON.parse(sessionStorage.getItem('emergency_session') || '{}');
            
            if (session && session.expiresAt) {
                const now = new Date();
                const expires = new Date(session.expiresAt);
                
                if (now < expires) {
                    this.emergencySession = session;
                    this.isEmergencyMode = true;
                    return true;
                } else {
                    // Sesión expirada
                    this.clearEmergencySession();
                }
            }
        } catch (error) {
            console.error('Error checking emergency session:', error);
        }
        
        return false;
    }
    
    /**
     * Limpia sesión de emergencia
     */
    clearEmergencySession() {
        this.emergencySession = null;
        this.isEmergencyMode = false;
        
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('emergency_session');
        }
    }
    
    /**
     * Genera ID de sesión único
     */
    generateSessionId() {
        return 'emrg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * CSS para animación shake
     */
    injectStyles() {
        if (typeof document === 'undefined') return;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Exportar para uso en el sistema
export { EmergencyAuth };

// Auto-inicialización si se carga directamente
if (typeof window !== 'undefined') {
    window.emergencyAuth = new EmergencyAuth();
    window.emergencyAuth.injectStyles();
}

export default EmergencyAuth;
