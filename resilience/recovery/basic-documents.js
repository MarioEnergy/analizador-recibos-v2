/**
 * 📄 BASIC DOCUMENTS MODULE - Energy Saver Costa Rica V4.0
 * Generador de documentos básicos cuando falla el módulo principal
 * Crea propuestas y pagarés en formato texto simple pero válido
 */

import { CONFIG_BACKUP } from '../backup/backup-config.js';

/**
 * Generador de Documentos Básicos
 */
class BasicDocuments {
    constructor() {
        this.config = CONFIG_BACKUP;
        this.isBackupMode = false;
        this.documentCount = 0;
    }
    
    /**
     * Activa modo documentos básicos
     */
    activateBackupMode(reason = 'Generador principal no disponible') {
        this.isBackupMode = true;
        console.warn('📄 Documentos básicos activados:', reason);
        
        this.notifyBackupMode(reason);
        
        return {
            mode: 'BASIC_DOCUMENTS',
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
                top: 80px;
                right: 20px;
                background: #607D8B;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 99999;
                max-width: 350px;
            ">
                <h4 style="margin: 0 0 5px 0;">📄 Documentos Simplificados</h4>
                <p style="margin: 0; font-size: 14px;">
                    ${reason}. Generando documentos en formato básico.
                </p>
                <small style="opacity: 0.9;">Los documentos son legalmente válidos</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 8000);
    }
    
    /**
     * Genera propuesta comercial básica
     */
    generateBasicProposal(cliente, analisis) {
        this.documentCount++;
        const fecha = new Date().toLocaleDateString('es-CR');
        const hora = new Date().toLocaleTimeString('es-CR');
        
        const propuesta = `
================================================================================
                        PROPUESTA COMERCIAL
                     ENERGY SAVER COSTA RICA
================================================================================

FECHA: ${fecha}
HORA: ${hora}
PROPUESTA #: ESC-${new Date().getFullYear()}-${String(this.documentCount).padStart(4, '0')}

--------------------------------------------------------------------------------
DATOS DEL CLIENTE
--------------------------------------------------------------------------------
Nombre: ${cliente.nombre || 'No especificado'}
Cédula: ${cliente.cedula || 'No especificado'}
Teléfono: ${cliente.telefono || 'No especificado'}
Email: ${cliente.email || 'No especificado'}
Dirección: ${cliente.direccion || 'No especificado'}

--------------------------------------------------------------------------------
ANÁLISIS ENERGÉTICO
--------------------------------------------------------------------------------
Compañía Eléctrica: ${analisis.datosEntrada?.company || 'CNFL'}
Consumo Mensual: ${analisis.datosEntrada?.consumoKwh || 0} kWh
Factura Mensual Actual: ₡${(analisis.datosEntrada?.facturaActual || 0).toLocaleString()}
Tarifa Calculada: ₡${(analisis.datosEntrada?.tarifaCalculada || 0)}/kWh

--------------------------------------------------------------------------------
SOLUCIÓN RECOMENDADA
--------------------------------------------------------------------------------
Sistema: ${analisis.equipoRecomendado?.nombre || 'Sistema Solar'}
Modelo: ${analisis.equipoRecomendado?.modelo || 'JS-STANDARD'}
Potencia: ${analisis.equipoRecomendado?.potencia || '5kW'}
Precio USD: $${(analisis.equipoRecomendado?.precioUSD || 0).toLocaleString()}
Precio Colones: ₡${(analisis.equipoRecomendado?.precioColones || 0).toLocaleString()}

--------------------------------------------------------------------------------
INVERSIÓN DETALLADA
--------------------------------------------------------------------------------
Subtotal Equipo:     ₡${(analisis.inversion?.subtotal || 0).toLocaleString()}
IVA (13%):           ₡${(analisis.inversion?.iva || 0).toLocaleString()}
Instalación (15%):   ₡${(analisis.inversion?.instalacion || 0).toLocaleString()}
--------------------------------------------------------------------------------
TOTAL INVERSIÓN:     ₡${(analisis.inversion?.total || 0).toLocaleString()}

--------------------------------------------------------------------------------
PROYECCIÓN DE AHORROS
--------------------------------------------------------------------------------
Ahorro Mensual Estimado:    ₡${(analisis.ahorros?.mensual || 0).toLocaleString()}
Ahorro Anual Estimado:      ₡${(analisis.ahorros?.anual || 0).toLocaleString()}
Porcentaje de Ahorro:       ${analisis.ahorros?.porcentajeAhorro || 30}%
Ahorro Total a 25 años:     ₡${(analisis.ahorros?.proyeccion25Anos || 0).toLocaleString()}

--------------------------------------------------------------------------------
RETORNO DE INVERSIÓN
--------------------------------------------------------------------------------
Período de Recuperación: ${analisis.retorno?.periodoRecuperacionMeses || 0} meses (${analisis.retorno?.periodoRecuperacionAnos || 0} años)
ROI Anual: ${analisis.retorno?.roiAnual || 0}%
Beneficio Neto a 25 años: ₡${(analisis.retorno?.beneficioNeto25Anos || 0).toLocaleString()}

--------------------------------------------------------------------------------
TÉRMINOS Y CONDICIONES
--------------------------------------------------------------------------------
1. Esta propuesta tiene validez de 30 días a partir de la fecha de emisión.
2. Los precios están sujetos al tipo de cambio del día de la compra.
3. El tiempo de instalación es de 3-5 días hábiles.
4. Incluye garantía de 10 años en paneles y 5 años en inversor.
5. Mantenimiento preventivo gratuito el primer año.

--------------------------------------------------------------------------------
FORMAS DE PAGO
--------------------------------------------------------------------------------
[ ] Contado - 5% descuento adicional
[ ] Financiamiento propio - Hasta 60 meses
[ ] Tarjeta de crédito - 3, 6 o 12 meses sin intereses
[ ] Pagaré - Condiciones especiales

--------------------------------------------------------------------------------
INFORMACIÓN DE CONTACTO
--------------------------------------------------------------------------------
${this.config.company.name}
Cédula Jurídica: ${this.config.company.cedula}
Representante: ${this.config.company.representante}
Teléfono: ${this.config.company.telefono}
WhatsApp: ${this.config.company.whatsapp}
Email: ${this.config.company.email}

--------------------------------------------------------------------------------
ACEPTACIÓN DE PROPUESTA
--------------------------------------------------------------------------------

Acepto los términos y condiciones de esta propuesta:


_______________________________          _______________________________
Firma del Cliente                        ${this.config.company.representante}
${cliente.nombre || 'Cliente'}           Energy Saver Costa Rica
Fecha: _____/_____/_____                 Fecha: ${fecha}

================================================================================
        "¡Gracias por elegir Energy Saver Costa Rica!"
         "Juntos construimos un futuro más sostenible"
================================================================================
`;

        console.log('✅ Propuesta básica generada');
        return {
            tipo: 'PROPUESTA',
            contenido: propuesta,
            formato: 'texto',
            nombreArchivo: `Propuesta_${cliente.nombre?.replace(/\s+/g, '_') || 'Cliente'}_${fecha.replace(/\//g, '-')}.txt`
        };
    }
    
    /**
     * Genera pagaré básico
     */
    generateBasicPagare(cliente, monto, plazo = 48) {
        this.documentCount++;
        const fecha = new Date().toLocaleDateString('es-CR');
        const fechaVencimiento = new Date();
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + plazo);
        
        const montoPalabras = this.numeroALetras(monto);
        const cuotaMensual = Math.round(monto / plazo);
        
        const pagare = `
================================================================================
                                PAGARÉ
================================================================================

PAGARÉ N°: ESC-PG-${new Date().getFullYear()}-${String(this.documentCount).padStart(4, '0')}
FECHA: ${fecha}
LUGAR: San José, Costa Rica

POR: ₡${monto.toLocaleString()} (${montoPalabras})

--------------------------------------------------------------------------------
                              DECLARACIÓN
--------------------------------------------------------------------------------

Por medio del presente PAGARÉ, yo ${cliente.nombre || '[NOMBRE DEL CLIENTE]'}, 
cédula de identidad número ${cliente.cedula || '[CÉDULA]'}, me obligo a pagar 
incondicionalmente a la orden de:

${this.config.company.name}
Cédula Jurídica: ${this.config.company.cedula}

La suma de ₡${monto.toLocaleString()} (${montoPalabras}), 
por concepto de: SISTEMA DE ENERGÍA SOLAR FOTOVOLTAICA

--------------------------------------------------------------------------------
                         CONDICIONES DE PAGO
--------------------------------------------------------------------------------

Plazo: ${plazo} meses
Cuota Mensual: ₡${cuotaMensual.toLocaleString()}
Fecha Primer Pago: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('es-CR')}
Fecha Vencimiento Final: ${fechaVencimiento.toLocaleDateString('es-CR')}

Forma de Pago:
[ ] Depósito Bancario
[ ] Transferencia SINPE
[ ] Efectivo en oficina
[ ] Otro: _________________

Cuenta Bancaria para Pagos:
Banco: ${this.config.banking.banco}
Cuenta: ${this.config.banking.cuenta}
SINPE Móvil: ${this.config.banking.sinpe}

--------------------------------------------------------------------------------
                              CLÁUSULAS
--------------------------------------------------------------------------------

1. INTERESES: En caso de mora, se aplicará un interés del 3% mensual sobre 
   el saldo pendiente.

2. VENCIMIENTO ANTICIPADO: El incumplimiento de DOS (2) cuotas consecutivas 
   dará derecho al acreedor a dar por vencido anticipadamente el plazo y 
   exigir el pago total de la deuda.

3. GASTOS: Todos los gastos de cobro judicial o extrajudicial serán por 
   cuenta del deudor.

4. JURISDICCIÓN: Para todos los efectos legales, las partes se someten a la 
   jurisdicción de los tribunales de San José, Costa Rica.

5. AVAL: Este pagaré podrá ser avalado por terceros, quienes responderán 
   solidariamente por el cumplimiento de las obligaciones.

--------------------------------------------------------------------------------
                         INFORMACIÓN DEL DEUDOR
--------------------------------------------------------------------------------

Nombre Completo: ${cliente.nombre || '[NOMBRE COMPLETO]'}
Cédula: ${cliente.cedula || '[CÉDULA]'}
Teléfono: ${cliente.telefono || '[TELÉFONO]'}
Email: ${cliente.email || '[EMAIL]'}
Dirección: ${cliente.direccion || '[DIRECCIÓN COMPLETA]'}

--------------------------------------------------------------------------------
                              FIRMAS
--------------------------------------------------------------------------------


_______________________________          _______________________________
Firma del Deudor                         Firma del Acreedor
${cliente.nombre || '[NOMBRE]'}          ${this.config.company.representante}
Cédula: ${cliente.cedula || '[CÉD]'}     Energy Saver Costa Rica


_______________________________          _______________________________
Firma del Aval (Opcional)                Cédula del Aval
Nombre: _______________________          _______________________

================================================================================
               PARA USO EXCLUSIVO DE ENERGY SAVER COSTA RICA
================================================================================
Recibido por: _________________ Fecha: _________ Hora: _________
Verificado por: _______________ Aprobado: [ ] SI  [ ] NO
Observaciones: _________________________________________________
_______________________________________________________________
================================================================================
`;

        console.log('✅ Pagaré básico generado');
        return {
            tipo: 'PAGARE',
            contenido: pagare,
            formato: 'texto',
            nombreArchivo: `Pagare_${cliente.nombre?.replace(/\s+/g, '_') || 'Cliente'}_${fecha.replace(/\//g, '-')}.txt`
        };
    }
    
    /**
     * Genera mensaje WhatsApp básico
     */
    generateWhatsAppMessage(cliente, analisis) {
        const mensaje = `¡Hola ${cliente.nombre || 'estimado cliente'}! 👋

Soy ${this.config.company.representante} de *Energy Saver Costa Rica* 🌞

He preparado tu análisis de ahorro energético:

📊 *RESUMEN DE TU ANÁLISIS*
- Consumo actual: ${analisis.datosEntrada?.consumoKwh || 0} kWh/mes
- Factura actual: ₡${(analisis.datosEntrada?.facturaActual || 0).toLocaleString()}
- Sistema recomendado: ${analisis.equipoRecomendado?.nombre || 'Sistema Solar'}

💰 *AHORRO PROYECTADO*
- Ahorro mensual: ₡${(analisis.ahorros?.mensual || 0).toLocaleString()}
- Ahorro anual: ₡${(analisis.ahorros?.anual || 0).toLocaleString()}
- Recuperación inversión: ${analisis.retorno?.periodoRecuperacionAnos || 0} años

💡 *INVERSIÓN TOTAL*
₡${(analisis.inversion?.total || 0).toLocaleString()} (IVA incluido)

✅ *INCLUYE:*
- Paneles solares de alta eficiencia
- Inversor con WiFi
- Instalación profesional
- Garantía 10 años paneles
- Mantenimiento 1er año GRATIS

📱 *¿Te gustaría agendar una visita sin compromiso?*

Escríbeme al ${this.config.company.whatsapp} o llámame para aclarar cualquier duda.

¡Comienza a ahorrar desde el primer día! 🚀

*Energy Saver Costa Rica*
_"Tu futuro energético comienza hoy"_ 🌱`;

        console.log('✅ Mensaje WhatsApp generado');
        return {
            tipo: 'WHATSAPP',
            contenido: mensaje,
            formato: 'texto',
            url: `https://wa.me/506${this.config.company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`
        };
    }
    
    /**
     * Convierte número a letras
     */
    numeroALetras(numero) {
        const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
        const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
        const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];
        
        if (numero === 0) return 'CERO COLONES';
        
        // Simplificación para números grandes
        if (numero >= 1000000) {
            const millones = Math.floor(numero / 1000000);
            const resto = numero % 1000000;
            return `${millones} ${millones === 1 ? 'MILLÓN' : 'MILLONES'} ${resto > 0 ? numeroALetras(resto) : 'DE COLONES'}`;
        }
        
        // Para este caso básico, retornar formato simple
        return numero.toLocaleString() + ' COLONES';
    }
    
    /**
     * Muestra documento en pantalla
     */
    displayDocument(documento) {
        if (typeof document === 'undefined' || !documento) return;
        
        const display = document.createElement('div');
        display.id = 'document-display';
        display.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 100000;
                overflow: auto;
                padding: 20px;
            ">
                <div style="
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    ">
                        <h3 style="margin: 0;">📄 ${documento.tipo}</h3>
                        <button onclick="document.getElementById('document-display').remove()"
                                style="
                                    background: #f44336;
                                    color: white;
                                    border: none;
                                    padding: 10px 20px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                ">
                            CERRAR
                        </button>
                    </div>
                    
                    <pre style="
                        white-space: pre-wrap;
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        line-height: 1.5;
                        background: #f5f5f5;
                        padding: 20px;
                        border-radius: 5px;
                        overflow-x: auto;
                    ">${documento.contenido}</pre>
                    
                    <div style="
                        margin-top: 20px;
                        display: flex;
                        gap: 10px;
                    ">
                        <button onclick="window.basicDocuments.downloadDocument('${documento.tipo}')"
                                style="
                                    flex: 1;
                                    padding: 15px;
                                    background: #4CAF50;
                                    color: white;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-weight: bold;
                                ">
                            📥 DESCARGAR
                        </button>
                        
                        <button onclick="window.basicDocuments.printDocument('${documento.tipo}')"
                                style="
                                    flex: 1;
                                    padding: 15px;
                                    background: #2196F3;
                                    color: white;
                                    border: none;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    font-weight: bold;
                                ">
                            🖨️ IMPRIMIR
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(display);
    }
    
    /**
     * Descarga documento
     */
    downloadDocument(tipo) {
        // Implementación simplificada
        console.log('📥 Descargando documento:', tipo);
        alert('Función de descarga activada. En producción, esto descargará el archivo.');
    }
    
    /**
     * Imprime documento
     */
    printDocument(tipo) {
        if (typeof window !== 'undefined') {
            window.print();
        }
    }
    
    /**
     * Estado del generador
     */
    getStatus() {
        return {
            mode: this.isBackupMode ? 'BACKUP' : 'STANDBY',
            documentsGenerated: this.documentCount,
            status: 'READY'
        };
    }
}

// Exportar para uso en el sistema
export { BasicDocuments };

// Auto-inicialización si se carga directamente
if (typeof window !== 'undefined') {
    window.basicDocuments = new BasicDocuments();
}

export default BasicDocuments;
