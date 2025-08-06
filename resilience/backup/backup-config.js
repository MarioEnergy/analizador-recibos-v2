/**
 * 🛡️ BACKUP CONFIG MODULE - Energy Saver Costa Rica V4.0
 * Sistema de respaldo automático de configuración
 * Si config principal falla, este backup mantiene sistema operativo
 */

// Configuración de emergencia hardcoded
const CONFIG_BACKUP = {
    // 🏢 Información empresa básica
    company: {
        name: 'ENERGY SAVER COSTA RICA',
        shortName: 'ENERGY SAVER CR',
        cedula: '3-101-577450',
        representante: 'MARIO SAVARD BOIES',
        telefono: '8722-6666',
        whatsapp: '8722-6666',
        email: 'energysavercr@gmail.com'
    },
    
    // 🔐 Auth emergencia
    auth: {
        adminEmail: 'mariosavardenergysaver@gmail.com',
        adminPassword: 'mario123',
        emergencyCode: 'MARIO2025',
        sessionTimeout: 24
    },
    
    // 🔧 Equipos básicos (versión simplificada)
    equipment: {
        'JS-BASICO': {
            nombre: 'Sistema Solar Básico',
            precio: 1500,
            potencia: '5kW',
            tipo: 'residencial',
            ahorroEstimado: 0.30
        },
        'JS-ESTANDAR': {
            nombre: 'Sistema Solar Estándar', 
            precio: 2000,
            potencia: '8kW',
            tipo: 'comercial',
            ahorroEstimado: 0.35
        }
    },
    
    // 💰 Parámetros financieros backup
    financial: {
        TC_BCCR: 500,      // Tipo cambio fijo emergencia
        IVA: 0.13,         // 13%
        tarifaEléctrica: 0.45,  // Promedio CR
        ahorroMinimo: 0.20,     // 25% mínimo
        periodoAnalisis: 25     // años
    },
    
    // 📁 File manager básico
    fileManager: {
        maxFileSize: 10485760,  // 10MB
        allowedFormats: ['jpg', 'png', 'pdf'],
        maxFiles: 3  // Reducido para emergencia
    },
    
    // 🏦 Información bancaria
    banking: {
        banco: 'Banco Nacional de Costa Rica',
        cuenta: '100-01-000-123456',
        sinpe: '8722-6666'
    }
};

/**
 * 🔄 Sistema de Auto-Recovery de Configuración
 */
class ConfigBackupManager {
    constructor() {
        this.mainConfigLoaded = false;
        this.backupActive = false;
        this.notificationShown = false;
    }
    
    /**
     * Intenta cargar configuración principal, si falla usa backup
     */
    async loadConfiguration() {
        try {
            // Intenta importar config principal
            const mainConfig = await import('../../config/config.js');
            this.mainConfigLoaded = true;
            console.log('✅ Configuración principal cargada correctamente');
            return mainConfig.default;
            
        } catch (error) {
            console.warn('⚠️ Error cargando configuración principal:', error.message);
            return this.activateBackup();
        }
    }
    
    /**
     * Activa configuración de backup
     */
    activateBackup() {
        this.backupActive = true;
        console.warn('🛡️ MODO BACKUP ACTIVADO - Usando configuración de emergencia');
        
        // Notificar a Mario si es posible
        if (!this.notificationShown) {
            this.showBackupNotification();
            this.notificationShown = true;
        }
        
        // Log evento para debugging
        this.logBackupActivation();
        
        return CONFIG_BACKUP;
    }
    
    /**
     * Muestra notificación visual a Mario
     */
    showBackupNotification() {
        // Solo si DOM está disponible
        if (typeof document !== 'undefined') {
            const notification = document.createElement('div');
            notification.id = 'backup-notification';
            notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ff9800;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    z-index: 99999;
                    max-width: 350px;
                    font-family: Arial, sans-serif;
                ">
                    <h4 style="margin: 0 0 10px 0;">🛡️ Sistema en Modo Backup</h4>
                    <p style="margin: 0 0 10px 0;">
                        La configuración principal no está disponible. 
                        El sistema está usando valores de respaldo.
                    </p>
                    <p style="margin: 0; font-weight: bold;">
                        ✅ Puedes seguir trabajando normalmente
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="
                                margin-top: 10px;
                                padding: 5px 15px;
                                background: white;
                                color: #ff9800;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                            ">
                        Entendido
                    </button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remover después de 30 segundos
            setTimeout(() => {
                const elem = document.getElementById('backup-notification');
                if (elem) elem.remove();
            }, 30000);
        }
    }
    
    /**
     * Registra activación de backup
     */
    logBackupActivation() {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: 'BACKUP_CONFIG_ACTIVATED',
            reason: 'Main config failed to load',
            backupVersion: 'V4.0',
            systemStatus: 'OPERATIONAL_WITH_BACKUP'
        };
        
        console.log('📋 Log Entry:', logEntry);
        
        // Guardar en localStorage si está disponible
        if (typeof localStorage !== 'undefined') {
            const logs = JSON.parse(localStorage.getItem('backup_logs') || '[]');
            logs.push(logEntry);
            // Mantener solo últimos 50 logs
            if (logs.length > 50) logs.shift();
            localStorage.setItem('backup_logs', JSON.stringify(logs));
        }
    }
    
    /**
     * Verifica salud de la configuración
     */
    getConfigHealth() {
        return {
            mainConfigStatus: this.mainConfigLoaded ? 'HEALTHY' : 'FAILED',
            backupStatus: this.backupActive ? 'ACTIVE' : 'STANDBY',
            configSource: this.backupActive ? 'BACKUP' : 'MAIN',
            lastCheck: new Date().toISOString()
        };
    }
    
    /**
     * Intenta restaurar configuración principal
     */
    async attemptMainConfigRestore() {
        if (!this.backupActive) return true;
        
        console.log('🔄 Intentando restaurar configuración principal...');
        
        try {
            const mainConfig = await import('../../config/config.js');
            this.mainConfigLoaded = true;
            this.backupActive = false;
            console.log('✅ Configuración principal restaurada exitosamente');
            this.showRestoredNotification();
            return true;
        } catch (error) {
            console.log('❌ No se pudo restaurar configuración principal');
            return false;
        }
    }
    
    /**
     * Notifica restauración exitosa
     */
    showRestoredNotification() {
        if (typeof document !== 'undefined') {
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
                    <h4 style="margin: 0;">✅ Sistema Restaurado</h4>
                    <p style="margin: 10px 0 0 0;">
                        La configuración principal ha sido restaurada.
                        Todo funcionando normalmente.
                    </p>
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
        }
    }
}

// Exportar para uso en el sistema
export { CONFIG_BACKUP, ConfigBackupManager };

// Auto-inicialización si se carga directamente
if (typeof window !== 'undefined') {
    window.ConfigBackupManager = ConfigBackupManager;
    window.CONFIG_BACKUP = CONFIG_BACKUP;
}

export default ConfigBackupManager;
