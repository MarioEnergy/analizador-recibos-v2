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
            this.showLoginError('Email y password requeridos');
            return;
        }
        
        if (email === CONFIG.auth.adminEmail && password === CONFIG.auth.adminPassword) {
            this.currentUser = {
                id: 1,
                name: CONFIG.auth.adminName,
                email: email,
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('energySaverUser', JSON.stringify(this.currentUser));
            this.hideLoginError();
            this.showDashboard();
            this.health.trackOperation("AuthModule", "login", Date.now() - startTime);
            this.health.setModuleStatus("AuthModule", "AUTHENTICATED");
        } else {
            this.showLoginError('Credenciales incorrectas');
        }
    }

    handleLogout() {
        this.health.setModuleStatus("AuthModule", "LOGGED_OUT");
        this.currentUser = null;
        localStorage.removeItem('energySaverUser');
        this.showLogin();
    }

    checkAuthStatus() {
        const stored = localStorage.getItem('energySaverUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
            this.showDashboard();
            this.health.setModuleStatus("AuthModule", "AUTHENTICATED");
        } else {
            this.showLogin();
        }
    }

    showLoginError(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    hideLoginError() {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    showLogin() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('otp-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('otp-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Update user info
        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        if (userNameElement && this.currentUser) {
            userNameElement.textContent = this.currentUser.name;
        }
        if (userRoleElement && this.currentUser) {
            userRoleElement.textContent = this.currentUser.role;
        }
    }


}

export default AuthModule;
