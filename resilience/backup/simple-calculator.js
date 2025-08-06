/**
 * 🧮 SIMPLE CALCULATOR MODULE - Energy Saver Costa Rica V4.0
 * Calculadora de backup cuando falla el módulo de análisis complejo
 * Usa fórmulas simples que siempre funcionan para dar resultados básicos
 */

import { CONFIG_BACKUP } from './backup-config.js';

/**
 * Calculadora Simple de Backup
 */
class SimpleCalculator {
    constructor() {
        this.config = CONFIG_BACKUP;
        this.defaultSavingsRate = 0.30; // 30% ahorro estándar
        this.defaultPaybackMonths = 48;  // 4 años recuperación
        this.defaultROI = 25; // 25% ROI anual
        this.isBackupMode = false;
    }
    
    /**
     * Activa modo calculadora simple
     */
    activateBackupMode(reason = 'Análisis complejo no disponible') {
        this.isBackupMode = true;
        console.warn('🧮 Calculadora simple activada:', reason);
        
        this.notifyBackupMode(reason);
        
        return {
            mode: 'SIMPLE_CALCULATOR',
            reason: reason,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Notifica activación modo backup
     */
    notifyBackupMode(reason) {
        if (typeof document === 'undefined') return;
        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #FF9800;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 99999;
                max-width: 350px;
            ">
                <h4 style="margin: 0 0 5px 0;">🧮 Cálculos Simplificados</h4>
                <p style="margin: 0; font-size: 14px;">
                    ${reason}. Usando fórmulas básicas de ahorro.
                </p>
                <small style="opacity: 0.9;">Los resultados son estimados conservadores</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 8000);
    }
    
    /**
     * Calcula análisis simple basado en consumo y factura
     */
    calculateSimpleAnalysis(consumo, facturaActual, company = 'CNFL') {
        console.log('🧮 Iniciando cálculo simple:', { consumo, facturaActual, company });
        
        try {
            // Validar entrada
            if (!this.validateInput(consumo, facturaActual)) {
                return this.getErrorResult('Datos de entrada inválidos');
            }
            
            // Cálculos básicos
            const tarifa = facturaActual / consumo; // Colones por kWh
            const equipoRecomendado = this.selectEquipment(consumo);
            const precioEquipo = this.getEquipmentPrice(equipoRecomendado);
            
            // Cálculo de ahorros (fórmula simple: 30% de la factura)
            const ahorroMensual = Math.round(facturaActual * this.defaultSavingsRate);
            const ahorroAnual = ahorroMensual * 12;
            
            // Inversión total (precio equipo + IVA + instalación estimada)
            const subtotal = precioEquipo * (this.config.financial.TC_BCCR || 500);
            const iva = subtotal * (this.config.financial.IVA || 0.13);
            const instalacion = subtotal * 0.15; // 15% instalación estimada
            const inversionTotal = Math.round(subtotal + iva + instalacion);
            
            // Periodo recuperación simple
            const periodoRecuperacionMeses = Math.ceil(inversionTotal / ahorroMensual);
            
            // ROI simple
            const roiAnual = Math.round((ahorroAnual / inversionTotal) * 100);
            
            // Proyección a 25 años
            const ahorroTotalProyectado = ahorroAnual * 25;
            const beneficioNeto = ahorroTotalProyectado - inversionTotal;
            
            // Crear resultado
            const resultado = {
                // Metadatos
                calculationType: 'SIMPLE',
                confidence: 0.75, // 75% confianza en cálculos simples
                timestamp: new Date().toISOString(),
                
                // Datos entrada
                datosEntrada: {
                    consumoKwh: consumo,
                    facturaActual: facturaActual,
                    tarifaCalculada: Math.round(tarifa),
                    company: company
                },
                
                // Recomendación equipo
                equipoRecomendado: {
                    modelo: equipoRecomendado,
                    nombre: this.getEquipmentName(equipoRecomendado),
                    potencia: this.getEquipmentPower(equipoRecomendado),
                    precioUSD: precioEquipo,
                    precioColones: precioEquipo * (this.config.financial.TC_BCCR || 500)
                },
                
                // Inversión
                inversion: {
                    subtotal: subtotal,
                    iva: iva,
                    instalacion: instalacion,
                    total: inversionTotal,
                    tipoCambio: this.config.financial.TC_BCCR || 500
                },
                
                // Ahorros
                ahorros: {
                    mensual: ahorroMensual,
                    anual: ahorroAnual,
                    porcentajeAhorro: this.defaultSavingsRate * 100,
                    proyeccion25Anos: ahorroTotalProyectado
                },
                
                // Retorno inversión
                retorno: {
                    periodoRecuperacionMeses: periodoRecuperacionMeses,
                    periodoRecuperacionAnos: (periodoRecuperacionMeses / 12).toFixed(1),
                    roiAnual: roiAnual,
                    beneficioNeto25Anos: beneficioNeto
                },
                
                // Mensaje para Mario
                mensaje: this.generateSimpleMessage(equipoRecomendado, ahorroMensual, periodoRecuperacionMeses),
                
                // Advertencia modo backup
                advertencia: 'Cálculos realizados con fórmulas simplificadas. Para análisis detallado, contactar soporte técnico.'
            };
            
            console.log('✅ Cálculo simple completado:', resultado);
            return resultado;
            
        } catch (error) {
            console.error('❌ Error en cálculo simple:', error);
            return this.getErrorResult('Error en cálculo: ' + error.message);
        }
    }
    
    /**
     * Valida datos de entrada
     */
    validateInput(consumo, factura) {
        if (!consumo || consumo <= 0) {
            console.error('❌ Consumo inválido:', consumo);
            return false;
        }
        
        if (!factura || factura <= 0) {
            console.error('❌ Factura inválida:', factura);
            return false;
        }
        
        // Validación de coherencia (tarifa entre 20-200 colones/kWh)
        const tarifa = factura / consumo;
        if (tarifa < 20 || tarifa > 200) {
            console.warn('⚠️ Tarifa fuera de rango normal:', tarifa);
            // No bloquear, solo advertir
        }
        
        return true;
    }
    
    /**
     * Selecciona equipo basado en consumo
     */
    selectEquipment(consumo) {
        // Reglas simples de selección
        if (consumo < 200) {
            return 'JS-1299'; // Sistema muy pequeño
        } else if (consumo < 400) {
            return 'JS-1699'; // Sistema pequeño
        } else if (consumo < 600) {
            return 'JS-2099'; // Sistema mediano
        } else {
            return 'JS-2499'; // Sistema grande
        }
    }
    
    /**
     * Obtiene precio del equipo
     */
    getEquipmentPrice(modelo) {
        const precios = {
            'JS-1299': 1299,
            'JS-1699': 1699,
            'JS-2099': 2099,
            'JS-2499': 2499
        };
        
        return precios[modelo] || 1500; // Precio default si no encuentra
    }
    
    /**
     * Obtiene nombre descriptivo del equipo
     */
    getEquipmentName(modelo) {
        const nombres = {
            'JS-1299': 'Sistema Solar Básico 3kW',
            'JS-1699': 'Sistema Solar Residencial 5kW',
            'JS-2099': 'Sistema Solar Avanzado 8kW',
            'JS-2499': 'Sistema Solar Premium 10kW'
        };
        
        return nombres[modelo] || 'Sistema Solar Estándar';
    }
    
    /**
     * Obtiene potencia del equipo
     */
    getEquipmentPower(modelo) {
        const potencias = {
            'JS-1299': '3kW',
            'JS-1699': '5kW',
            'JS-2099': '8kW',
            'JS-2499': '10kW'
        };
        
        return potencias[modelo] || '5kW';
    }
    
    /**
     * Genera mensaje simple para Mario
     */
    generateSimpleMessage(equipo, ahorroMensual, mesesRecuperacion) {
        const anos = (mesesRecuperacion / 12).toFixed(1);
        
        return `Mario, con el ${this.getEquipmentName(equipo)} tu cliente ahorrará aproximadamente ₡${ahorroMensual.toLocaleString()} por mes. La inversión se recupera en ${anos} años. ¡Excelente oportunidad de ahorro!`;
    }
    
    /**
     * Retorna resultado de error
     */
    getErrorResult(mensaje) {
        return {
            calculationType: 'ERROR',
            error: true,
            mensaje: mensaje,
            timestamp: new Date().toISOString(),
            sugerencia: 'Por favor verifica los datos ingresados o usa el modo manual.'
        };
    }
    
    /**
     * Cálculo rápido para cotización inmediata
     */
    quickQuote(consumo) {
        // Cotización ultra rápida basada solo en consumo
        const facturaEstimada = consumo * 90; // 90 colones/kWh promedio
        return this.calculateSimpleAnalysis(consumo, facturaEstimada);
    }
    
    /**
     * Genera tabla de comparación simple
     */
    generateComparisonTable(consumo, facturaActual) {
        const modelos = ['JS-1299', 'JS-1699', 'JS-2099', 'JS-2499'];
        const comparaciones = [];
        
        for (const modelo of modelos) {
            const precioUSD = this.getEquipmentPrice(modelo);
            const inversionTotal = precioUSD * this.config.financial.TC_BCCR * 1.28; // +IVA+instalación
            const ahorroMensual = facturaActual * this.defaultSavingsRate;
            const mesesRecuperacion = Math.ceil(inversionTotal / ahorroMensual);
            
            comparaciones.push({
                modelo: modelo,
                nombre: this.getEquipmentName(modelo),
                potencia: this.getEquipmentPower(modelo),
                inversionTotal: Math.round(inversionTotal),
                ahorroMensual: Math.round(ahorroMensual),
                recuperacionMeses: mesesRecuperacion,
                recuperacionAnos: (mesesRecuperacion / 12).toFixed(1)
            });
        }
        
        return comparaciones;
    }
    
    /**
     * Muestra resultados en formato visual
     */
    displaySimpleResults(resultado) {
        if (typeof document === 'undefined' || !resultado) return;
        
        const display = document.createElement('div');
        display.id = 'simple-results-display';
        display.innerHTML = `
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
            ">
                <h2 style="color: #333; margin: 0 0 20px 0; text-align: center;">
                    📊 Análisis Simplificado
                </h2>
                
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #4CAF50;">
                        ${resultado.equipoRecomendado.nombre}
                    </h3>
                    <p style="margin: 5px 0;">
                        <strong>Inversión:</strong> ₡${resultado.inversion.total.toLocaleString()}
                    </p>
                    <p style="margin: 5px 0;">
                        <strong>Ahorro mensual:</strong> ₡${resultado.ahorros.mensual.toLocaleString()}
                    </p>
                    <p style="margin: 5px 0;">
                        <strong>Recuperación:</strong> ${resultado.retorno.periodoRecuperacionAnos} años
                    </p>
                </div>
                
                <p style="text-align: center; color: #666; font-style: italic;">
                    ${resultado.mensaje}
                </p>
                
                <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 20px 0;">
                    <small style="color: #856404;">
                        ⚠️ ${resultado.advertencia}
                    </small>
                </div>
                
                <button onclick="document.getElementById('simple-results-display').remove()"
                        style="
                            width: 100%;
                            padding: 15px;
                            background: #2196F3;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            font-size: 16px;
                            font-weight: bold;
                            cursor: pointer;
                        ">
                    CONTINUAR
                </button>
            </div>
        `;
        
        document.body.appendChild(display);
    }
    
    /**
     * Estado de la calculadora
     */
    getStatus() {
        return {
            mode: this.isBackupMode ? 'BACKUP' : 'STANDBY',
            defaultSavingsRate: this.defaultSavingsRate * 100 + '%',
            defaultPayback: this.defaultPaybackMonths + ' meses',
            status: 'READY'
        };
    }
}

// Exportar para uso en el sistema
export { SimpleCalculator };

// Auto-inicialización si se carga directamente
if (typeof window !== 'undefined') {
    window.simpleCalculator = new SimpleCalculator();
}

export default SimpleCalculator;
