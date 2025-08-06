/**
 * 📝 MANUAL ENTRY MODULE - Energy Saver Costa Rica V4.0
 * Sistema de entrada manual de datos cuando fallan los módulos automáticos
 * Permite a Mario continuar trabajando ingresando datos manualmente
 */

import { CONFIG_BACKUP } from '../backup/backup-config.js';

/**
 * Sistema de Entrada Manual de Datos
 */
class ManualEntrySystem {
    constructor() {
        this.isManualMode = false;
        this.currentData = null;
        this.supportedCompanies = ['CNFL', 'ICE', 'ESPH', 'COOPEGUANACASTE'];
        this.formVisible = false;
    }
    
    /**
     * Activa el modo de entrada manual
     */
    activateManualMode(reason = 'Sistema automático no disponible') {
        this.isManualMode = true;
        console.warn('📝 Modo manual activado:', reason);
        
        // Mostrar notificación a Mario
        this.showManualModeNotification(reason);
        
        // Mostrar formulario manual
        this.showManualEntryForm();
        
        return {
            mode: 'MANUAL',
            reason: reason,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Muestra notificación de modo manual
     */
    showManualModeNotification(reason) {
        if (typeof document === 'undefined') return;
        
        const notification = document.createElement('div');
        notification.id = 'manual-mode-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #2196F3;
                color: white;
                padding: 20px 30px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 99999;
                max-width: 500px;
                text-align: center;
            ">
                <h4 style="margin: 0 0 10px 0;">📝 MODO MANUAL ACTIVADO</h4>
                <p style="margin: 0 0 10px 0;">${reason}</p>
                <p style="margin: 0; font-weight: bold;">
                    Mario, puedes ingresar los datos manualmente
                </p>
                <button onclick="this.parentElement.parentElement.remove()"
                        style="
                            margin-top: 10px;
                            padding: 5px 15px;
                            background: white;
                            color: #2196F3;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        ">
                    ENTENDIDO
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            const elem = document.getElementById('manual-mode-notification');
            if (elem) elem.remove();
        }, 10000);
    }
    
    /**
     * Muestra formulario de entrada manual
     */
    showManualEntryForm() {
        if (typeof document === 'undefined' || this.formVisible) return;
        
        this.formVisible = true;
        
        const formContainer = document.createElement('div');
        formContainer.id = 'manual-entry-form';
        formContainer.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 100000;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <h2 style="
                    color: #333;
                    margin: 0 0 20px 0;
                    text-align: center;
                ">
                    📝 ENTRADA MANUAL DE DATOS
                </h2>
                
                <p style="
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                ">
                    Mario, ingresa los datos del recibo eléctrico manualmente
                </p>
                
                <!-- Guía visual -->
                <div style="
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                ">
                    <h4 style="margin: 0 0 10px 0;">📋 Guía Rápida:</h4>
                    <ol style="margin: 0; padding-left: 20px;">
                        <li>Busca en el recibo: "Consumo kWh" o "Consumo del mes"</li>
                        <li>Busca: "Total a pagar" o "Monto total"</li>
                        <li>Identifica la compañía (logo en la parte superior)</li>
                    </ol>
                </div>
                
                <!-- Campos del formulario -->
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">
                        🏢 Compañía Eléctrica:
                    </label>
                    <select id="manual-company" style="
                        width: 100%;
                        padding: 10px;
                        border: 2px solid #ddd;
                        border-radius: 5px;
                        font-size: 16px;
                        background: white;
                    ">
                        <option value="">Seleccionar compañía...</option>
                        ${this.supportedCompanies.map(company => 
                            `<option value="${company}">${company}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">
                        ⚡ Consumo Mensual (kWh):
                    </label>
                    <input type="number" 
                           id="manual-consumption" 
                           placeholder="Ejemplo: 450"
                           min="0"
                           step="1"
                           style="
                               width: 100%;
                               padding: 10px;
                               border: 2px solid #ddd;
                               border-radius: 5px;
                               font-size: 16px;
                               box-sizing: border-box;
                           ">
                    <small style="color: #666;">Busca "kWh" en el recibo</small>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">
                        💰 Monto Total Factura (₡):
                    </label>
                    <input type="number" 
                           id="manual-amount" 
                           placeholder="Ejemplo: 45000"
                           min="0"
                           step="100"
                           style="
                               width: 100%;
                               padding: 10px;
                               border: 2px solid #ddd;
                               border-radius: 5px;
                               font-size: 16px;
                               box-sizing: border-box;
                           ">
                    <small style="color: #666;">Total a pagar en colones</small>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #333;
                    ">
                        📅 Mes del Recibo (opcional):
                    </label>
                    <input type="month" 
                           id="manual-period"
                           value="${new Date().toISOString().slice(0, 7)}"
                           style="
                               width: 100%;
                               padding: 10px;
                               border: 2px solid #ddd;
                               border-radius: 5px;
                               font-size: 16px;
                               box-sizing: border-box;
                           ">
                </div>
                
                <!-- Botones -->
                <div style="
                    display: flex;
                    gap: 10px;
                    justify-content: space-between;
                ">
                    <button onclick="window.manualEntry.cancelManualEntry()"
                            style="
                                flex: 1;
                                padding: 15px;
                                background: #f44336;
                                color: white;
                                border: none;
                                border-radius: 5px;
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                            ">
                        CANCELAR
                    </button>
                    
                    <button onclick="window.manualEntry.processManualData()"
                            style="
                                flex: 2;
                                padding: 15px;
                                background: #4CAF50;
                                color: white;
                                border: none;
                                border-radius: 5px;
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                            ">
                        CONTINUAR ANÁLISIS
                    </button>
                </div>
                
                <!-- Ayuda -->
                <div style="
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    text-align: center;
                    color: #666;
                ">
                    <p style="margin: 0;">
                        ¿Necesitas ayuda?<br>
                        📞 Llama al: <strong>8722-6666</strong>
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(formContainer);
        
        // Focus en primer campo
        setTimeout(() => {
            const select = document.getElementById('manual-company');
            if (select) select.focus();
        }, 100);
    }
    
    /**
     * Procesa datos ingresados manualmente
     */
    processManualData() {
        // Obtener valores
        const company = document.getElementById('manual-company')?.value;
        const consumption = document.getElementById('manual-consumption')?.value;
        const amount = document.getElementById('manual-amount')?.value;
        const period = document.getElementById('manual-period')?.value;
        
        // Validar campos requeridos
        const errors = [];
        if (!company) errors.push('Selecciona la compañía eléctrica');
        if (!consumption || consumption <= 0) errors.push('Ingresa el consumo en kWh');
        if (!amount || amount <= 0) errors.push('Ingresa el monto de la factura');
        
        if (errors.length > 0) {
            this.showValidationErrors(errors);
            return;
        }
        
        // Crear objeto de datos
        this.currentData = {
            source: 'MANUAL_ENTRY',
            timestamp: new Date().toISOString(),
            company: company,
            consumption: parseInt(consumption),
            amount: parseInt(amount),
            period: period || new Date().toISOString().slice(0, 7),
            enteredBy: 'MARIO',
            confidence: 1.0 // 100% confianza en datos manuales
        };
        
        console.log('📝 Datos manuales procesados:', this.currentData);
        
        // Cerrar formulario
        this.closeManualForm();
        
        // Mostrar confirmación
        this.showSuccessConfirmation();
        
        // Notificar al sistema
        this.notifyDataReady();
        
        return this.currentData;
    }
    
    /**
     * Muestra errores de validación
     */
    showValidationErrors(errors) {
        alert('⚠️ Por favor corrige los siguientes errores:\n\n' + errors.join('\n'));
    }
    
    /**
     * Cancela entrada manual
     */
    cancelManualEntry() {
        if (confirm('¿Estás seguro de cancelar la entrada manual?')) {
            this.closeManualForm();
            this.isManualMode = false;
        }
    }
    
    /**
     * Cierra formulario manual
     */
    closeManualForm() {
        const form = document.getElementById('manual-entry-form');
        if (form) {
            form.remove();
            this.formVisible = false;
        }
    }
    
    /**
     * Muestra confirmación de éxito
     */
    showSuccessConfirmation() {
        if (typeof document === 'undefined') return;
        
        const confirmation = document.createElement('div');
        confirmation.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #4CAF50;
                color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 100001;
                text-align: center;
                min-width: 300px;
            ">
                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                <h3 style="margin: 0 0 10px 0;">¡Datos Recibidos!</h3>
                <p style="margin: 0;">
                    Procesando análisis con los datos ingresados...
                </p>
            </div>
        `;
        
        document.body.appendChild(confirmation);
        
        // Remover después de 3 segundos
        setTimeout(() => confirmation.remove(), 3000);
    }
    
    /**
     * Notifica al sistema que los datos están listos
     */
    notifyDataReady() {
        if (typeof window !== 'undefined' && this.currentData) {
            const event = new CustomEvent('manualDataReady', {
                detail: {
                    data: this.currentData,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
            console.log('📢 Manual data event dispatched');
        }
    }
    
    /**
     * Obtiene los datos actuales
     */
    getCurrentData() {
        return this.currentData;
    }
    
    /**
     * Limpia datos actuales
     */
    clearData() {
        this.currentData = null;
    }
    
    /**
     * Proporciona valores por defecto si no hay datos
     */
    getDefaultData() {
        return {
            source: 'DEFAULT_VALUES',
            timestamp: new Date().toISOString(),
            company: 'CNFL',
            consumption: 400, // Consumo promedio CR
            amount: 40000,    // Factura promedio CR
            period: new Date().toISOString().slice(0, 7),
            enteredBy: 'SYSTEM_DEFAULT',
            confidence: 0.5
        };
    }
    
    /**
     * Guía visual para Mario
     */
    showVisualGuide() {
        if (typeof document === 'undefined') return;
        
        const guide = document.createElement('div');
        guide.id = 'visual-guide';
        guide.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #fff;
                border: 2px solid #2196F3;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 99998;
                max-width: 300px;
            ">
                <h4 style="margin: 0 0 10px 0; color: #2196F3;">
                    💡 Guía Visual Rápida
                </h4>
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect x='10' y='10' width='280' height='180' fill='%23f0f0f0' stroke='%23333' stroke-width='2'/%3E%3Ctext x='150' y='30' text-anchor='middle' font-size='16' font-weight='bold'%3ERECIBO ELÉCTRICO%3C/text%3E%3Ctext x='30' y='60' font-size='12'%3EConsumo: 450 kWh ← Busca esto%3C/text%3E%3Ctext x='30' y='120' font-size='12'%3ETotal: ₡45,000 ← Y esto%3C/text%3E%3Ccircle cx='250' cy='55' r='20' fill='%23ff9800' opacity='0.5'/%3E%3Ccircle cx='250' cy='115' r='20' fill='%23ff9800' opacity='0.5'/%3E%3C/svg%3E" 
                     style="width: 100%; height: auto; margin: 10px 0;">
                <button onclick="this.parentElement.parentElement.remove()"
                        style="
                            width: 100%;
                            padding: 10px;
                            background: #2196F3;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                        ">
                    ENTENDIDO
                </button>
            </div>
        `;
        
        document.body.appendChild(guide);
    }
}

// Exportar para uso en el sistema
export { ManualEntrySystem };

// Auto-inicialización si se carga directamente
if (typeof window !== 'undefined') {
    window.manualEntry = new ManualEntrySystem();
}

export default ManualEntrySystem;
