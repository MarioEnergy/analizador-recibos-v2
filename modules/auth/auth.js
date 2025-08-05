// AuthModule - Sistema de Autenticación
import CONFIG from "../config/config.js";

class AuthModule {
    constructor() {
        this.currentUser = null;
    }

        function handleLogin() {
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
            } else {
                showLoginError('Credenciales incorrectas');
            }
        }

        function handleLogout() {
            currentUser = null;
            localStorage.removeItem('energySaverUser');
            showLogin();
        }

        function checkAuthStatus() {
            const stored = localStorage.getItem('energySaverUser');
            if (stored) {
                currentUser = JSON.parse(stored);
                showDashboard();
            } else {
                showLogin();
            }
        }


}

export default AuthModule;
