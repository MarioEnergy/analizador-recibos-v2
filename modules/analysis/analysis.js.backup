// AnalysisEngine - Calcoli Business e Selezione Equipi
import CONFIG from "../config/config.js";

class AnalysisEngine {
    constructor() {
        this.equipmentOptions = CONFIG.equipment;
    }

                // Simulate analysis
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const consumoPromedio = Math.floor(Math.random() * 1500) + 800;
                const facturaPromedio = Math.floor(consumoPromedio * 0.45 * CONFIG.financial.TC_BCCR);
                
                const equipoRecomendado = selectEquipment(facturaPromedio);
                const ahorroMensual = Math.floor(facturaPromedio * (CONFIG.financial.ahorroMinimo + Math.random() * 0.05));
                const totalEquipo = equipoRecomendado.precio * CONFIG.financial.TC_BCCR * (1 + CONFIG.financial.IVA);
                const roiMeses = Math.ceil(totalEquipo / ahorroMensual);

                currentAnalysis = {
                    cliente: clientData,
                    consumoPromedio,
                    facturaPromedio,
                    equipoRecomendado,
                    ahorroTotal: ahorroMensual,
                    totalEquipo,
                    roiMeses,
                    porcentajeAhorro: Math.round((ahorroMensual / facturaPromedio) * 100),
                    factorPotencia: (0.85 + Math.random() * 0.1).toFixed(2),
                    eficienciaActual: Math.floor(70 + Math.random() * 20) + '%',
                    flujoPositivo: ahorroMensual - Math.floor(equipoRecomendado.cuotaUSD * CONFIG.financial.TC_BCCR),
                    timestamp: new Date().toISOString()
                };
                
                showResults(currentAnalysis);
            } catch (error) {
                console.error('❌ Analysis error:', error);
                alert('Error durante el análisis: ' + error.message);
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }

        function selectEquipment(factura) {
            const equipos = Object.values(CONFIG.equipment);
            
            for (let equipo of equipos) {
                if (factura >= equipo.minFactura && factura <= equipo.maxFactura) {
                    return equipo;
                }
            }
            
            return equipos[equipos.length - 1];
        }


}

export default AnalysisEngine;
