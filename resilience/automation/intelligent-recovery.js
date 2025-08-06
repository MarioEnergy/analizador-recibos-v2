/**
 * 🤖 INTELLIGENT RECOVERY MODULE - Energy Saver Costa Rica V4.0
 * Sistema central de recuperación automática inteligente
 * Coordina todos los módulos de resiliencia y activa backups automáticamente
 */

import { ConfigBackupManager } from '../backup/backup-config.js';
import { EmergencyAuth } from '../security/emergency-auth.js';
import { ManualEntrySystem } from '../recovery/manual-entry.js';
import { SimpleCalculator } from '../backup/simple-calculator.js';
import { BasicDocuments } from '../recovery/basic-documents.js';

/**
 * Sistema de Recuperación Inteligente
 */
class IntelligentRecoverySystem {
    constructor() {
        this.modules = {
            config: { name: 'CONFIG', status: 'UNKNOWN', backup: null },
            auth: { name: 'AUTH', status: 'UNKNOWN', backup: null },
            filemanager: { name: 'FILEMANAGER', status: 'UNKNOWN', backup: null },
            ocr: { name: 'OCR', status: 'UNKNOWN', backup: null },
            analysis: { name: 'ANALYSIS', status: 'UNKNOWN', backup: null },
            documents: { name: 'DOCUMENTS', status: 'UNKNOWN', backup: null }
        };
        
        this.backupModules = {
            config: null,
            auth: null,
            manual: null,
            calculator: null,
            documents: null
        };
        
        this.checkInterval = 30000; // 30 segundos
        this.checkTimer = null;
        this.isMonitoring = false;
        this.recoveryAttempts = {};
        this.maxRecoveryAttempts = 3;
        
        // Inicializar módulos backup
        this.initializeBackupModules();
    }
    
    /**
     * Inicializa todos los módulos de backup
     */
    async initializeBackupModules() {
        try {
            console.log('🤖 Inicializando sistema de recuperación inteligente...');
            
            // Inicializar cada módulo backup
            this.backupModules.config = new ConfigBackupManager();
            this.backupModules.auth = new EmergencyAuth();
            this.backupModules.manual = new ManualEntrySystem();
            this.backupModules.calculator = new SimpleCalculator();
            this.backupModules.documents = new BasicDocuments();
            
            console.log('✅ Módulos de backup inicializados');
            
            // Verificar si hay sesión de emergencia activa
            if (this.backupModules.auth.checkEmergencySession()) {
                console.log('🔐 Sesión de emergencia activa detectada');
            }
            
            // Iniciar monitoreo
            this.startMonitoring();
            
        } catch (error) {
            console.error('❌ Error inicializando módulos backup:', error);
        }
    }
    
    /**
     * Inicia el monitoreo automático del sistema
     */
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        console.log('👁️ Monitoreo automático iniciado');
        
        // Verificación inicial
        this.performSystemCheck();
        
        // Verificaciones periódicas
        this.checkTimer = setInterval(() => {
            this.performSystemCheck();
        }, this.checkInterval);
        
        // Notificar inicio
        this.showMonitoringStatus();
    }
    
    /**
     * Detiene el monitoreo
     */
    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        this.isMonitoring = false;
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
        
        console.log('⏹️ Monitoreo detenido');
    }
    
    /**
     * Realiza verificación completa del sistema
     */
    async performSystemCheck() {
        console.log('🔍 Ejecutando verificación del sistema...');
        
        const results = {
            timestamp: new Date().toISOString(),
            healthy: 0,
            failed: 0,
            recovered: 0
        };
        
        // Verificar cada módulo
        for (const [moduleName, moduleInfo] of Object.entries(this.modules)) {
            const status = await this.checkModuleHealth(moduleName);
            
            if (status === 'HEALTHY') {
                results.healthy++;
                moduleInfo.status = 'HEALTHY';
            } else {
                results.failed++;
                moduleInfo.status = 'FAILED';
                
                // Intentar recuperación automática
                const recovered = await this.attemptModuleRecovery(moduleName);
                if (recovered) {
                    results.recovered++;
                }
            }
        }
        
        // Actualizar dashboard
        this.updateSystemDashboard(results);
        
        // Si hay fallas críticas, activar modo emergencia
        if (results.failed > 0 && results.recovered < results.failed) {
            this.activateEmergencyMode();
        }
        
        return results;
    }
    
    /**
     * Verifica salud de un módulo específico
     */
    async checkModuleHealth(moduleName) {
        try {
            switch (moduleName) {
                case 'config':
                    // Verificar si config principal está disponible
                    const configTest = await import('../../config/config.js');
                    return configTest.default ? 'HEALTHY' : 'FAILED';
                    
                case 'auth':
                    // Verificar módulo auth
                    const authTest = await import('../../modules/auth/auth.js');
                    return authTest.default ? 'HEALTHY' : 'FAILED';
                    
                case 'filemanager':
                    // Verificar file manager
                    const fileTest = await import('../../modules/filemanager/filemanager.js');
                    return fileTest.default ? 'HEALTHY' : 'FAILED';
                    
                case 'ocr':
                    // Verificar OCR
                    const ocrTest = await import('../../modules/ocr/ocr.js');
                    return ocrTest.default ? 'HEALTHY' : 'FAILED';
                    
                case 'analysis':
                    // Verificar analysis
                    const analysisTest = await import('../../modules/analysis/analysis.js');
                    return analysisTest.default ? 'HEALTHY' : 'FAILED';
                    
                case 'documents':
                    // Verificar documents
                    const docsTest = await import('../../modules/documents/documents.js');
                    return docsTest.default ? 'HEALTHY' : 'FAILED';
                    
                default:
                    return 'UNKNOWN';
            }
        } catch (error) {
            console.warn(`⚠️ Módulo ${moduleName} no responde:`, error.message);
            return 'FAILED';
        }
    }
    
    /**
     * Intenta recuperar un módulo fallido
     */
    async attemptModuleRecovery(moduleName) {
        console.log(`🔧 Intentando recuperar módulo ${moduleName}...`);
        
        // Incrementar contador de intentos
        this.recoveryAttempts[moduleName] = (this.recoveryAttempts[moduleName] || 0) + 1;
        
        // Si excede máximo de intentos, activar backup permanente
        if (this.recoveryAttempts[moduleName] > this.maxRecoveryAttempts) {
            console.warn(`❌ Máximo de intentos alcanzado para ${moduleName}`);
            return this.activateBackupModule(moduleName);
        }
        
        // Intentar recuperación según el módulo
        try {
            switch (moduleName) {
                case 'config':
                    // Activar backup config
                    const backupConfig = await this.backupModules.config.loadConfiguration();
                    if (backupConfig) {
                        this.modules.config.backup = this.backupModules.config;
                        console.log('✅ Config backup activado');
                        return true;
                    }
                    break;
                    
                case 'auth':
                    // Activar auth emergencia
                    const emergencyAuth = await this.backupModules.auth.activateEmergencyMode();
                    if (emergencyAuth.success) {
                        this.modules.auth.backup = this.backupModules.auth;
                        console.log('✅ Auth emergencia activado');
                        return true;
                    }
                    break;
                    
                case 'filemanager':
                case 'ocr':
                    // Activar entrada manual
                    const manualMode = this.backupModules.manual.activateManualMode();
                    if (manualMode) {
                        this.modules[moduleName].backup = this.backupModules.manual;
                        console.log('✅ Entrada manual activada');
                        return true;
                    }
                    break;
                    
                case 'analysis':
                    // Activar calculadora simple
                    const simpleCalc = this.backupModules.calculator.activateBackupMode();
                    if (simpleCalc) {
                        this.modules.analysis.backup = this.backupModules.calculator;
                        console.log('✅ Calculadora simple activada');
                        return true;
                    }
                    break;
                    
                case 'documents':
                    // Activar documentos básicos
                    const basicDocs = this.backupModules.documents.activateBackupMode();
                    if (basicDocs) {
                        this.modules.documents.backup = this.backupModules.documents;
                        console.log('✅ Documentos básicos activados');
                        return true;
                    }
                    break;
            }
            
            return false;
            
        } catch (error) {
            console.error(`❌ Error recuperando ${moduleName}:`, error);
            return false;
        }
    }
    
    /**
     * Activa módulo backup permanentemente
     */
    activateBackupModule(moduleName) {
        console.log(`🛡️ Activando backup permanente para ${moduleName}`);
        
        // Resetear contador de intentos
        this.recoveryAttempts[moduleName] = 0;
        
        // Marcar como backup permanente
        this.modules[moduleName].status = 'BACKUP_PERMANENT';
        
        // Notificar a Mario
        this.notifyBackupActivation(moduleName);
        
        return true;
    }
    
    /**
     * Activa modo emergencia general
     */
    activateEmergencyMode() {
        console.warn('🚨 MODO EMERGENCIA GENERAL ACTIVADO');
        
        // Activar todos los backups disponibles
        for (const moduleName of Object.keys(this.modules)) {
            if (this.modules[moduleName].status === 'FAILED' && !this.modules[moduleName].backup) {
                this.activateBackupModule(moduleName);
            }
        }
        
        // Notificación especial para Mario
        this.showEmergencyNotification();
    }
    
    /**
     * Muestra estado del monitoreo
     */
    showMonitoringStatus() {
        if (typeof document === 'undefined') return;
        
        const status = document.createElement('div');
        status.id = 'recovery-monitoring-status';
        status.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 99998;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <div style="
                    width: 10px;
                    height: 10px;
                    background: white;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                "></div>
                <span>Sistema de Recuperación Activo</span>
            </div>
            
            <style>
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(status);
    }
    
    /**
     * Actualiza dashboard del sistema
     */
    updateSystemDashboard(results) {
        if (typeof document === 'undefined') return;
        
        // Buscar o crear dashboard
        let dashboard = document.getElementById('recovery-dashboard');
        if (!dashboard) {
            dashboard = document.createElement('div');
            dashboard.id = 'recovery-dashboard';
            document.body.appendChild(dashboard);
        }
        
        const healthPercentage = Math.round((results.healthy / Object.keys(this.modules).length) * 100);
        const statusColor = healthPercentage >= 80 ? '#4CAF50' : healthPercentage >= 50 ? '#FF9800' : '#F44336';
        
        dashboard.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 20px;
                background: white;
                border: 2px solid ${statusColor};
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 99997;
                min-width: 300px;
            ">
                <h4 style="margin: 0 0 15px 0; color: #333;">
                    🛡️ Estado Sistema Resiliencia
                </h4>
                
                <div style="
                    background: #f5f5f5;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    ">
                        <span>Salud Sistema:</span>
                        <strong style="color: ${statusColor};">${healthPercentage}%</strong>
                    </div>
                    <div style="
                        width: 100%;
                        height: 10px;
                        background: #ddd;
                        border-radius: 5px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${healthPercentage}%;
                            height: 100%;
                            background: ${statusColor};
                            transition: width 0.3s;
                        "></div>
                    </div>
                </div>
                
                <div style="font-size: 14px;">
                    <div>✅ Módulos OK: ${results.healthy}</div>
                    <div>❌ Módulos Fallidos: ${results.failed}</div>
                    <div>🔧 Recuperados: ${results.recovered}</div>
                </div>
                
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
                
                <div style="font-size: 12px; color: #666;">
                    Última verificación: ${new Date(results.timestamp).toLocaleTimeString('es-CR')}
                </div>
            </div>
        `;
    }
    
    /**
     * Notifica activación de backup
     */
    notifyBackupActivation(moduleName) {
        if (typeof document === 'undefined') return;
        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: #FF9800;
                color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 99999;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            ">
                <h4 style="margin: 0 0 10px 0;">
                    🛡️ Backup Activado
                </h4>
                <p style="margin: 0;">
                    El módulo <strong>${moduleName}</strong> está usando respaldo automático.
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">
                    ✅ Puedes seguir trabajando normalmente
                </p>
            </div>
            
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%) translateY(-50%); }
                    to { transform: translateX(0) translateY(-50%); }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 10000);
    }
    
    /**
     * Muestra notificación de emergencia
     */
    showEmergencyNotification() {
        if (typeof document === 'undefined') return;
        
        const emergency = document.createElement('div');
        emergency.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: #F44336;
                color: white;
                padding: 20px;
                text-align: center;
                z-index: 100001;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
                <h3 style="margin: 0 0 10px 0;">
                    🚨 MODO EMERGENCIA ACTIVADO
                </h3>
                <p style="margin: 0;">
                    El sistema está funcionando con módulos de respaldo. 
                    Algunas funciones pueden estar limitadas.
                </p>
                <p style="margin: 10px 0 0 0;">
                    <strong>Mario, puedes seguir trabajando. Si necesitas ayuda: 📞 8722-6666</strong>
                </p>
                <button onclick="this.parentElement.remove()"
                        style="
                            margin-top: 15px;
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
        
        document.body.appendChild(emergency);
    }
    
    /**
     * Obtiene estado completo del sistema
     */
    getSystemStatus() {
        const status = {
            monitoring: this.isMonitoring,
            modules: {},
            backupsActive: 0,
            healthPercentage: 0,
            lastCheck: null
        };
        
        let healthyCount = 0;
        
        for (const [name, module] of Object.entries(this.modules)) {
            status.modules[name] = {
                status: module.status,
                hasBackup: !!module.backup,
                backupType: module.backup ? module.backup.constructor.name : null
            };
            
            if (module.status === 'HEALTHY') healthyCount++;
            if (module.backup) status.backupsActive++;
        }
        
        status.healthPercentage = Math.round((healthyCount / Object.keys(this.modules).length) * 100);
        
        return status;
    }
    
    /**
     * Reinicia el sistema de recuperación
     */
    reset() {
        console.log('🔄 Reiniciando sistema de recuperación...');
        
        // Detener monitoreo
        this.stopMonitoring();
        
        // Resetear estados
        for (const module of Object.values(this.modules)) {
            module.status = 'UNKNOWN';
            module.backup = null;
        }
        
        // Resetear contadores
        this.recoveryAttempts = {};
        
        // Reiniciar
        this.initializeBackupModules();
    }
}

// Exportar para uso en el sistema
export { IntelligentRecoverySystem };

// Auto-inicialización si se carga directamente
if (typeof window !== 'undefined') {
    window.intelligentRecovery = new IntelligentRecoverySystem();
}

export default IntelligentRecoverySystem;
