// AnalysisEngine - Calcoli Business e Selezione Equipi
import CONFIG from "../config/config.js";
import HealthMonitor from "../monitoring/health.js";

class AnalysisEngine {
    constructor() {
        this.health = new HealthMonitor();
        this.health.initModule("AnalysisEngine");
        this.equipmentOptions = CONFIG.equipment;
    }

    selectEquipment(factura) {
        const equipos = Object.values(CONFIG.equipment);
        
        for (let equipo of equipos) {
            if (factura >= equipo.minFactura && factura <= equipo.maxFactura) {
                return equipo;
            }
        }
        
        return equipos[equipos.length - 1];
    }

    async performAnalysis(clientData, ocrData) {
        const startTime = Date.now();
        this.health.setModuleStatus("AnalysisEngine", "PROCESSING");
        
        try {
            // Simulate analysis delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const consumoPromedio = ocrData.consumo || Math.floor(Math.random() * 1500) + 800;
            const facturaPromedio = ocrData.monto || Math.floor(consumoPromedio * 0.45 * CONFIG.financial.TC_BCCR);
            
            const equipoRecomendado = this.selectEquipment(facturaPromedio);
            const ahorroMensual = Math.floor(facturaPromedio * (CONFIG.financial.ahorroMinimo + Math.random() * 0.05));
            const totalEquipo = equipoRecomendado.precio * CONFIG.financial.TC_BCCR * (1 + CONFIG.financial.IVA);
            const roiMeses = Math.ceil(totalEquipo / ahorroMensual);

            const analysis = {
                cliente: clientData,
                consumoPromedio,
                facturaPromedio,
                equipoRecomendado,
                ahorroTotal: ahorroMensual,
                totalEquipo,
                roiMeses,
                roiAnos: Math.ceil(roiMeses / 12),
                porcentajeAhorro: Math.round((ahorroMensual / facturaPromedio) * 100),
                factorPotencia: ocrData.factorPotencia || (0.85 + Math.random() * 0.1).toFixed(2),
                eficienciaActual: Math.floor(70 + Math.random() * 20) + '%',
                flujoPositivo: ahorroMensual - Math.floor(equipoRecomendado.cuotaUSD * CONFIG.financial.TC_BCCR),
                timestamp: new Date().toISOString()
            };
            
            this.health.trackOperation("AnalysisEngine", "analysis", Date.now() - startTime);
            this.health.setModuleStatus("AnalysisEngine", "READY");
            
            return analysis;
        } catch (error) {
            console.error('❌ Analysis error:', error);
            this.health.setModuleStatus("AnalysisEngine", "ERROR");
            throw error;
        }
    }
}

export default AnalysisEngine;
