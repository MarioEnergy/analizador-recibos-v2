// AuthModule - Sistema de Autenticación
import CONFIG from "../config/config.js";
import HealthMonitor from "../monitoring/health.js";

class AuthModule {
    constructor() {
        this.health = new HealthMonitor();
        this.health.initModule("AuthModule");
        this.currentUser = null;
    }

    handleLogin() {
            const startTime = Date.now();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            
            console.log('🔐 Login attempt:', email);
            
            if (!email || !password) {
                showLoginError('Email y password requeridos');
                return;
            }
            
            if (email === CONFIG.auth.adminEmail && password === CONFIG.auth.adminPassword) {
                currentUser = {
                    id: 1,
                    name: CONFIG.auth.adminName,
                    email: email,
                    role: 'admin',
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('energySaverUser', JSON.stringify(currentUser));
                hideLoginError();
                showDashboard();
            this.health.trackOperation("AuthModule", "login", Date.now() - startTime);
            this.health.setModuleStatus("AuthModule", "AUTHENTICATED");
            } else {
                showLoginError('Credenciales incorrectas');
            }
        }

        function handleLogout() {
            this.health.setModuleStatus("AuthModule", "LOGGED_OUT");
            currentUser = null;
            localStorage.removeItem('energySaverUser');
            showLogin();
        }

        function checkAuthStatus() {
            const stored = localStorage.getItem('energySaverUser');
            if (stored) {
                currentUser = JSON.parse(stored);
                showDashboard();
            this.health.trackOperation("AuthModule", "login", Date.now() - startTime);
            this.health.setModuleStatus("AuthModule", "AUTHENTICATED");
            } else {
                showLogin();
            }
        }


}

export default AuthModule;
