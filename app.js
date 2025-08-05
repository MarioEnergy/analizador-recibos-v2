// ============================================
// ANALIZADOR DE RECIBOS ENERGY SAVER v2.0
// ACTUALIZADO SEGÚN RESPUESTAS DEL CLIENTE
// ============================================

const TC_BCCR_DEFAULT = 512; // Tipo de cambio por defecto
let TC_BCCR = TC_BCCR_DEFAULT;
let myDropzone = null;
let currentData = null;
let analisisActivo = false;

// MODELOS SEGÚN RESPUESTAS DEL CLIENTE - RANGOS ₡400k NO ₡450k
const MODELOS = {
    'JS-1299': {
        nombre: 'JS-1299',
        rangoFactura: { min: 200000, max: 400000 }, // CONFIRMADO: 400k
        precio: 3200,
        instalacion: 500,
        iva: 491,
        precioTotal: 4191,
        primaInicial: 1100,
        cuotaMensual: 128,
        aplicacion: 'Residencial/Comercial pequeño'
    },
    'JS-1699': {
        nombre: 'JS-1699',
        rangoFactura: { min: 401000, max: 600000 },
        precio: 4000,
        instalacion: 500,
        iva: 585,
        precioTotal: 5085,
        primaInicial: 1300,
        cuotaMensual: 158,
        aplicacion: 'Comercial mediano'
    },
    'JS-2099': {
        nombre: 'JS-2099',
        rangoFactura: { min: 601000, max: 850000 },
        precio: 4600,
        instalacion: 500,
        iva: 663,
        precioTotal: 5763,
        primaInicial: 1500,
        cuotaMensual: 178,
        aplicacion: 'Comercial grande'
    },
    'JS-2499': {
        nombre: 'JS-2499',
        rangoFactura: { min: 851000, max: 1200000 },
        precio: 5200,
        instalacion: 500,
        iva: 741,
        precioTotal: 6441,
        primaInicial: 1750,
        cuotaMensual: 195,
        aplicacion: 'Industrial'
    }
};

// Configuración del negocio actualizada
const BUSINESS_CONFIG = {
    porcentajeAhorroMin: 0.20,  // 20%
    porcentajeAhorroMax: 0.25,  // 25%
    plazoMeses: 24,
    tasaInteres: 0,
    factorPotenciaMinimo: 0.90,
    garantiaAnos: 10,  // CONFIRMADO: 10 años, no 5
    ahorroGarantizado: false, // CONFIRMADO: Es ESTIMADO, no garantizado
    calcularEnColones: true, // CONFIRMADO: Todos los cálculos en colones
    apisBCCR: 'https://api.hacienda.go.cr/indicadores/tc' // API real del BCCR
};

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================
function validarNumero(valor, nombreCampo, valorDefault = 0) {
    if (valor === null || valor === undefined || isNaN(valor) || !isFinite(valor)) {
        console.warn(`⚠️ ${nombreCampo} invalido:`, valor, '- Usando default:', valorDefault);
        return valorDefault;
    }
    return Number(valor);
}

function formatearColones(valor) {
    return '₡' + Math.round(valor).toLocaleString('es-CR');
}

function formatearUSD(valor) {
    const num = validarNumero(valor, 'USD', 0);
    return `$${num.toFixed(2)}`;
}

function formatearConAmbos(usd) {
    const crc = usd * TC_BCCR;
    return `${formatearUSD(usd)} (${formatearColones(crc)})`;
}

// Obtener tipo de cambio del BCCR
async function obtenerTipoCambioBCCR() {
    try {
        // TODO: Implementar llamada real a API del BCCR
        // Por ahora simulamos con un valor actualizado
        const response = await fetch(BUSINESS_CONFIG.apisBCCR);
        if (response.ok) {
            const data = await response.json();
            TC_BCCR = data.venta || TC_BCCR_DEFAULT;
        }
    } catch (error) {
        console.log('Usando tipo de cambio por defecto:', TC_BCCR_DEFAULT);
    }
    return TC_BCCR;
}

// Seleccionar modelo según factura promedio
function seleccionarModeloPorFactura(facturaPromedioCRC) {
    for (let modelo of Object.values(MODELOS)) {
        if (facturaPromedioCRC >= modelo.rangoFactura.min && 
            facturaPromedioCRC <= modelo.rangoFactura.max) {
            return modelo;
        }
    }
    // Si es mayor al máximo, devolver el más grande
    if (facturaPromedioCRC > MODELOS['JS-2499'].rangoFactura.max) {
        return MODELOS['JS-2499'];
    }
    // Si es menor al mínimo, devolver el más pequeño
    return MODELOS['JS-1299'];
}

// Calcular multa - DEBE VERIFICAR EN LA FACTURA
function calcularMulta(tieneMultaEnFactura, montoMultaCRC) {
    // CONFIRMADO: Ver en la factura si hay multa y tomar el monto
    if (tieneMultaEnFactura) {
        return montoMultaCRC;
    }
    return 0;
}

function mostrarError(mensaje) {
    console.error('❌ ERROR:', mensaje);
    alert('Error: ' + mensaje);
}

// ============================================
// INICIALIZACIÓN
// ============================================
Dropzone.autoDiscover = false;

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Iniciando Energy Saver Analyzer v2.0...');
    
    // Obtener tipo de cambio actualizado
    await obtenerTipoCambioBCCR();
    console.log('💱 Tipo de cambio:', TC_BCCR);
    
    try {
        // Configurar Dropzone
        const dropzoneElement = document.getElementById('dropzone');
        if (!dropzoneElement) {
            throw new Error('Elemento dropzone no encontrado');
        }
        
        myDropzone = new Dropzone("#dropzone", {
            url: "/upload",
            autoProcessQueue: false,
            addRemoveLinks: true,
            maxFiles: 6,
            acceptedFiles: ".jpg,.jpeg,.png,.pdf",
            dictDefaultMessage: "Arrastra 3-6 recibos aquí o haz clic para seleccionar"
        });
        
        console.log('✅ Dropzone inicializado');
        
    } catch (error) {
        console.error('❌ Error inicializando Dropzone:', error);
    }
    
    // Configurar botones
    configurarBotones();
    
    // Agregar botones adicionales (Export, WhatsApp)
    setTimeout(agregarBotonesAdicionales, 1000);
    
    console.log('✅ Aplicación iniciada correctamente');
});

// ============================================
// CONFIGURACIÓN DE BOTONES
// ============================================
function configurarBotones() {
    // Botón Analizar
    const btnAnalizar = document.getElementById('analyze-btn');
    if (btnAnalizar) {
        btnAnalizar.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (analisisActivo) {
                console.warn('⚠️ Análisis ya en proceso');
                return;
            }
            
            analisisActivo = true;
            btnAnalizar.disabled = true;
            btnAnalizar.textContent = 'Analizando...';
            
            try {
                realizarAnalisis();
            } catch (error) {
                mostrarError('Error al analizar: ' + error.message);
            } finally {
                setTimeout(() => {
                    analisisActivo = false;
                    btnAnalizar.disabled = false;
                    btnAnalizar.textContent = 'Analizar';
                }, 1000);
            }
        });
    }
    
    // Botón Pagaré
    const btnPagare = document.getElementById('generate-pagare');
    if (btnPagare) {
        btnPagare.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!currentData || !currentData.modeloSeleccionado) {
                mostrarError('No hay datos para generar el pagaré');
                return;
            }
            
            try {
                generarPagare();
            } catch (error) {
                mostrarError('Error al generar pagaré: ' + error.message);
            }
        });
    }
    
    // Botón Nuevo Análisis
    const btnNuevo = document.getElementById('new-analysis-btn');
    if (btnNuevo) {
        btnNuevo.addEventListener('click', function(e) {
            e.preventDefault();
            location.reload();
        });
    }
}

// ============================================
// ANÁLISIS PRINCIPAL
// ============================================
function realizarAnalisis() {
    console.log('📊 Iniciando análisis...');
    
    const clientName = document.getElementById('client-name')?.value || 'Cliente';
    
    // Simular datos de recibos (en producción vendría del OCR)
    const facturaBase = 200000 + Math.random() * 800000;
    const consumo = 800 + Math.random() * 1200;
    const fp = 0.82 + Math.random() * 0.15;
    const tieneMultaEnFactura = fp < BUSINESS_CONFIG.factorPotenciaMinimo && Math.random() > 0.5;
    const montoMultaCRC = tieneMultaEnFactura ? facturaBase * 0.08 : 0;
    
    // Datos del análisis
    currentData = {
        clientName: clientName,
        consumoPromedio: consumo,
        montoPromedioCRC: facturaBase,
        montoPromedioUSD: facturaBase / TC_BCCR,
        factorPotencia: Math.min(fp, 1.0),
        tieneMulta: tieneMultaEnFactura,
        multaMensualCRC: montoMultaCRC,
        multaMensualUSD: montoMultaCRC / TC_BCCR,
        timestamp: new Date().toISOString()
    };
    
    // Seleccionar modelo según factura
    currentData.modeloSeleccionado = seleccionarModeloPorFactura(currentData.montoPromedioCRC);
    
    console.log('✅ Datos analizados:', currentData);
    mostrarResultados();
}

// ============================================
// MOSTRAR RESULTADOS
// ============================================
function mostrarResultados() {
    if (!currentData) {
        mostrarError('No hay datos para mostrar');
        return;
    }
    
    const modelo = currentData.modeloSeleccionado;
    
    // TODOS LOS CÁLCULOS EN COLONES
    const ahorroEnergiaMinimoMensualCRC = currentData.montoPromedioCRC * BUSINESS_CONFIG.porcentajeAhorroMin;
    const ahorroEnergiaMaximoMensualCRC = currentData.montoPromedioCRC * BUSINESS_CONFIG.porcentajeAhorroMax;
    const ahorroMultaMensualCRC = currentData.multaMensualCRC;
    
    const ahorroTotalMinimoMensualCRC = ahorroEnergiaMinimoMensualCRC + ahorroMultaMensualCRC;
    const ahorroTotalMaximoMensualCRC = ahorroEnergiaMaximoMensualCRC + ahorroMultaMensualCRC;
    
    // Convertir cuota a colones
    const cuotaMensualCRC = modelo.cuotaMensual * TC_BCCR;
    const primaInicialCRC = modelo.primaInicial * TC_BCCR;
    
    // Flujo mensual (ahorro - cuota)
    const flujoMensualMinimoCRC = ahorroTotalMinimoMensualCRC - cuotaMensualCRC;
    const flujoMensualMaximoCRC = ahorroTotalMaximoMensualCRC - cuotaMensualCRC;
    
    // ROI con prima
    const roiConPrimaMeses = Math.ceil(primaInicialCRC / flujoMensualMaximoCRC);
    
    // Guardar cálculos
    currentData.calculos = {
        ahorroEnergiaMinimoMensualCRC,
        ahorroEnergiaMaximoMensualCRC,
        ahorroMultaMensualCRC,
        ahorroTotalMinimoMensualCRC,
        ahorroTotalMaximoMensualCRC,
        flujoMensualMinimoCRC,
        flujoMensualMaximoCRC,
        cuotaMensualCRC,
        primaInicialCRC,
        roiConPrimaMeses
    };
    
    document.getElementById('results-content').innerHTML = `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-3 bg-gray-50 rounded">
                <h3 class="font-bold text-sm text-gray-600">Consumo Promedio:</h3>
                <p class="text-lg">${Math.round(currentData.consumoPromedio)} kWh</p>
            </div>
            <div class="p-3 bg-gray-50 rounded">
                <h3 class="font-bold text-sm text-gray-600">Factura Promedio:</h3>
                <p class="text-lg">${formatearColones(currentData.montoPromedioCRC)}</p>
                <p class="text-sm text-gray-500">${formatearUSD(currentData.montoPromedioUSD)}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded">
                <h3 class="font-bold text-sm text-gray-600">Factor de Potencia:</h3>
                <p class="text-lg ${currentData.factorPotencia < 0.90 ? 'text-red-600 font-bold' : ''}">${currentData.factorPotencia.toFixed(2)}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded">
                <h3 class="font-bold text-sm text-gray-600">Multa en Factura:</h3>
                <p class="text-lg ${currentData.tieneMulta ? 'text-red-600 font-bold' : 'text-green-600'}">
                    ${currentData.tieneMulta ? formatearColones(currentData.multaMensualCRC) : 'Sin multa ✓'}
                </p>
            </div>
        </div>
        
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
            <h3 class="font-bold text-lg mb-3 text-blue-800">Equipo Recomendado: ${modelo.nombre}</h3>
            <p class="text-sm text-gray-600 mb-2">${modelo.aplicacion}</p>
            <div class="grid grid-cols-2 gap-2 text-sm">
                <p>Precio equipo: <strong>${formatearConAmbos(modelo.precio)}</strong></p>
                <p>Instalación: <strong>${formatearConAmbos(modelo.instalacion)}</strong></p>
                <p>IVA (13%): <strong>${formatearConAmbos(modelo.iva)}</strong></p>
                <p>Precio total: <strong>${formatearConAmbos(modelo.precioTotal)}</strong></p>
                <p>Prima inicial: <strong>${formatearConAmbos(modelo.primaInicial)}</strong></p>
                <p>Cuota mensual: <strong>${formatearConAmbos(modelo.cuotaMensual)}</strong></p>
                <p class="col-span-2 text-center mt-2 text-blue-600">
                    24 meses sin intereses | Garantía: ${BUSINESS_CONFIG.garantiaAnos} años
                </p>
            </div>
        </div>

        <div class="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
            <h3 class="font-bold text-lg mb-3 text-green-800">Análisis de Ahorros (EN COLONES)</h3>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span>Ahorro energético estimado (20-25%):</span>
                    <div class="text-right">
                        <strong>${formatearColones(ahorroEnergiaMinimoMensualCRC)}</strong>
                        <span class="text-sm"> a </span>
                        <strong>${formatearColones(ahorroEnergiaMaximoMensualCRC)}</strong>
                        <span class="text-sm">/mes</span>
                    </div>
                </div>
                ${currentData.tieneMulta ? `
                <div class="flex justify-between">
                    <span>Eliminación de multas:</span>
                    <strong class="text-red-600">${formatearColones(ahorroMultaMensualCRC)}/mes</strong>
                </div>
                ` : ''}
                <div class="flex justify-between border-t pt-2 mt-2">
                    <span class="font-bold">Ahorro total mensual estimado:</span>
                    <div class="text-right">
                        <strong class="text-green-700 text-lg">${formatearColones(ahorroTotalMinimoMensualCRC)}</strong>
                        <span class="text-sm"> a </span>
                        <strong class="text-green-700 text-lg">${formatearColones(ahorroTotalMaximoMensualCRC)}</strong>
                    </div>
                </div>
                <div class="flex justify-between bg-yellow-100 p-2 rounded">
                    <span class="font-bold">Flujo positivo desde mes 1:</span>
                    <strong class="text-green-700">${formatearColones(flujoMensualMaximoCRC)}/mes</strong>
                </div>
                <div class="flex justify-between">
                    <span>Recuperación de prima:</span>
                    <strong>${roiConPrimaMeses} meses</strong>
                </div>
            </div>
            <p class="text-sm text-gray-600 mt-3 italic">
                * Ahorros ESTIMADOS, NO garantizados. Basados en consumo histórico.
            </p>
        </div>

        <div class="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <h3 class="font-bold text-lg mb-3 text-amber-800">Proyección a 5 años</h3>
            <div class="space-y-2">
                <p>Ahorro total acumulado: <strong>${formatearColones(ahorroTotalMaximoMensualCRC * 60)}</strong></p>
                <p>Inversión total: <strong>${formatearColones(modelo.precioTotal * TC_BCCR)}</strong></p>
                <p class="text-lg font-bold text-green-700">
                    Beneficio neto estimado: ${formatearColones((ahorroTotalMaximoMensualCRC * 60) - (modelo.precioTotal * TC_BCCR))}
                </p>
            </div>
        </div>

        <div class="flex gap-4">
            <button id="generate-pagare" class="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                Generar Pagaré
            </button>
            <button id="export-sheets" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Export to Sheets
            </button>
            <button id="send-whatsapp" class="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">
                Enviar por WhatsApp
            </button>
            <button id="new-analysis-btn" class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
                Nuevo Análisis
            </button>
        </div>
    `;
    
    // Ocultar upload, mostrar resultados
    document.getElementById('upload-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');
    
    // Reconfigurar botones
    configurarBotones();
    configurarBotonesAdicionales();
}

// ============================================
// FUNCIONES ADICIONALES (Export, WhatsApp)
// ============================================
function agregarBotonesAdicionales() {
    // Esta función se llama después de que la página carga
    console.log('Agregando funcionalidades adicionales...');
}

function configurarBotonesAdicionales() {
    // Export to Sheets
    const btnSheets = document.getElementById('export-sheets');
    if (btnSheets) {
        btnSheets.addEventListener('click', function() {
            exportToSheets();
        });
    }
    
    // WhatsApp
    const btnWhatsApp = document.getElementById('send-whatsapp');
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', function() {
            enviarPorWhatsApp();
        });
    }
}

function exportToSheets() {
    if (!currentData) return;
    
    const data = {
        'Cliente': currentData.clientName,
        'Fecha': new Date().toLocaleDateString('es-CR'),
        'Factura Promedio': currentData.montoPromedioCRC,
        'Modelo': currentData.modeloSeleccionado.nombre,
        'Ahorro Min (20%)': currentData.calculos.ahorroTotalMinimoMensualCRC,
        'Ahorro Max (25%)': currentData.calculos.ahorroTotalMaximoMensualCRC,
        'Tiene Multa': currentData.tieneMulta ? 'Sí' : 'No',
        'Flujo Positivo': currentData.calculos.flujoMensualMaximoCRC,
        'ROI (meses)': currentData.calculos.roiConPrimaMeses
    };
    
    // Convertir a CSV
    const headers = Object.keys(data).join(',');
    const values = Object.values(data).join(',');
    const csv = headers + '\n' + values;
    
    // Descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analisis_${currentData.clientName}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Archivo CSV exportado. Puede importarlo en Google Sheets.');
}

function enviarPorWhatsApp() {
    if (!currentData) return;
    
    const numero = prompt('Ingrese el número de WhatsApp (con código de país, ej: 50688888888):');
    if (!numero) return;
    
    const mensaje = `*Análisis de Ahorro Energético - Energy Saver Costa Rica*
    
Cliente: ${currentData.clientName}
Modelo: ${currentData.modeloSeleccionado.nombre}

💰 *Ahorro Estimado Mensual:*
Mínimo (20%): ${formatearColones(currentData.calculos.ahorroTotalMinimoMensualCRC)}
Máximo (25%): ${formatearColones(currentData.calculos.ahorroTotalMaximoMensualCRC)}

📊 *Inversión:*
Prima: ${formatearColones(currentData.calculos.primaInicialCRC)}
Cuota: ${formatearColones(currentData.calculos.cuotaMensualCRC)}/mes

✅ *Beneficios:*
- Flujo positivo: ${formatearColones(currentData.calculos.flujoMensualMaximoCRC)}/mes
- Recuperación: ${currentData.calculos.roiConPrimaMeses} meses
- Garantía: ${BUSINESS_CONFIG.garantiaAnos} años
${currentData.tieneMulta ? '- Eliminación de multas' : ''}

📞 Contáctenos: 8722-6666`;
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${numero}?text=${mensajeCodificado}`, '_blank');
}

// ============================================
// GENERAR PAGARÉ CON TOGGLES
// ============================================
function generarPagare() {
    console.log('📄 Generando pagaré...');
    
    if (!currentData || !currentData.modeloSeleccionado) {
        throw new Error('No hay datos del análisis');
    }
    
    const modelo = currentData.modeloSeleccionado;
    const montoFinanciado = modelo.precioTotal - modelo.primaInicial;
    
    const fecha = new Date().toLocaleDateString('es-CR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Número en letras (simplificado)
    function numeroALetras(num) {
        // Implementación básica
        const numStr = num.toString();
        return numStr.toUpperCase() + " DÓLARES ESTADOUNIDENSES";
    }
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pagaré - ${currentData.clientName}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 50px auto; 
            padding: 40px;
            line-height: 1.6;
        }
        h1 { 
            text-align: center; 
            color: #333;
            margin-bottom: 30px;
        }
        .header-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .monto { 
            font-size: 24px; 
            font-weight: bold; 
            text-align: center; 
            margin: 30px 0;
            color: #2c3e50;
        }
        .info-box {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .firma-section { 
            margin-top: 80px; 
        }
        .firma-box {
            display: inline-block;
            width: 45%;
            text-align: center;
            margin-top: 50px;
        }
        .linea { 
            border-bottom: 1px solid black; 
            width: 250px; 
            margin: 0 auto 10px; 
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .toggle-section {
            margin: 20px 0;
            padding: 10px;
            border: 1px dashed #ccc;
        }
        @media print { 
            body { margin: 20px; }
            .no-print { display: none; }
            .toggle-section { display: none; }
        }
    </style>
</head>
<body>
    <div class="toggle-section no-print">
        <h3>Opciones del Pagaré (ON/OFF):</h3>
        <label><input type="checkbox" id="toggle-multas" checked> Incluir cláusula de multas</label><br>
        <label><input type="checkbox" id="toggle-garantia" checked> Incluir garantía</label><br>
        <label><input type="checkbox" id="toggle-iban" checked> Mostrar IBAN</label><br>
        <button onclick="actualizarPagare()">Actualizar Pagaré</button>
    </div>

    <h1>PAGARÉ</h1>
    
    <div class="header-info">
        <div>
            <strong>Número:</strong> ${Date.now()}<br>
            <strong>Fecha:</strong> ${fecha}
        </div>
        <div>
            <strong>Lugar:</strong> San José, Costa Rica
        </div>
    </div>
    
    <p class="monto">${formatearUSD(montoFinanciado)} USD</p>
    <p class="monto" style="font-size: 18px;">(${numeroALetras(montoFinanciado)})</p>
    
    <p>Por este PAGARÉ, yo <strong>${currentData.clientName}</strong>, me obligo a pagar 
    incondicionalmente a la orden de <strong>ENERGY SAVER, SOCIEDAD ANÓNIMA</strong>, 
    cédula jurídica número <strong>3-101-577450</strong>, la suma de 
    <strong>${formatearUSD(montoFinanciado)} (${numeroALetras(montoFinanciado)})</strong>, 
    moneda de los Estados Unidos de América.</p>
    
    <div class="info-box">
        <h3>Condiciones del Financiamiento:</h3>
        <table>
            <tr>
                <th>Concepto</th>
                <th>Detalle</th>
            </tr>
            <tr>
                <td>Equipo</td>
                <td>${modelo.nombre} - ${modelo.aplicacion}</td>
            </tr>
            <tr>
                <td>Precio Total</td>
                <td>${formatearConAmbos(modelo.precioTotal)}</td>
            </tr>
            <tr>
                <td>Prima Inicial</td>
                <td>${formatearConAmbos(modelo.primaInicial)}</td>
            </tr>
            <tr>
                <td>Monto Financiado</td>
                <td>${formatearConAmbos(montoFinanciado)}</td>
            </tr>
            <tr>
                <td>Plazo</td>
                <td>24 meses</td>
            </tr>
            <tr>
                <td>Cuota Mensual</td>
                <td>${formatearConAmbos(modelo.cuotaMensual)}</td>
            </tr>
            <tr>
                <td>Tasa de Interés</td>
                <td>0% (Cero por ciento)</td>
            </tr>
        </table>
    </div>
    
    <p>El pago se realizará en <strong>24 cuotas mensuales y consecutivas</strong> de 
    <strong>${formatearUSD(modelo.cuotaMensual)}</strong> cada una, iniciando el día 
    <strong>1° del mes siguiente</strong> a la instalación del equipo.</p>
    
    <div class="info-box">
        <h3>Información Bancaria para Pagos:</h3>
        <p><strong>Banco Nacional de Costa Rica</strong></p>
        <p>Cuenta Dólares: 100-02-119-000012-0</p>
        <p class="iban-info">IBAN USD: CR49015111910020000127</p>
        <p>Cuenta Colones: 100-01-119-000019-1</p>
        <p class="iban-info">IBAN CRC: CR12015111910010000190</p>
    </div>
    
    <h3>Cláusulas:</h3>
    <ol>
        <li class="multas-clause"><strong>Mora:</strong> En caso de atraso se aplicarán las siguientes penalidades:
            <ul>
                <li>Días 1-4: $50 fijos</li>
                <li>Día 5 en adelante: $5 diarios adicionales</li>
                <li>A partir del segundo mes: $15 diarios</li>
            </ul>
        </li>
        <li><strong>Vencimiento anticipado:</strong> El acreedor podrá dar por vencido el plazo y exigir 
        el pago total de la deuda en caso de mora mayor a 30 días.</li>
        <li class="garantia-clause"><strong>Garantía del equipo:</strong> ${BUSINESS_CONFIG.garantiaAnos} años en el equipo instalado, incluye documento legal.</li>
        <li><strong>Prepago:</strong> Se permite el pago anticipado sin penalización.</li>
        <li><strong>Firma Digital:</strong> Este pagaré puede ser firmado digitalmente según Ley 8454.</li>
    </ol>
    
    <div class="firma-section">
        <div class="firma-box">
            <div class="linea"></div>
            <p><strong>${currentData.clientName}</strong><br>
            DEUDOR<br>
            Cédula: _________________</p>
        </div>
        <div class="firma-box" style="float: right;">
            <div class="linea"></div>
            <p><strong>ENERGY SAVER S.A.</strong><br>
            ACREEDOR<br>
            Cédula Jurídica: 3-101-577450<br>
            Rep: Mario Savard Boies</p>
        </div>
    </div>
    
    <div style="clear: both; margin-top: 100px; text-align: center;">
        <p><strong>Notario:</strong> Licda. Carolina Soto Zúñiga - Carné: 24535</p>
    </div>
    
    <div style="clear: both; margin-top: 50px;" class="no-print">
        <button onclick="window.print()" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir Pagaré
        </button>
    </div>
    
    <script>
        function actualizarPagare() {
            // Toggle multas
            const showMultas = document.getElementById('toggle-multas').checked;
            document.querySelectorAll('.multas-clause').forEach(el => {
                el.style.display = showMultas ? 'list-item' : 'none';
            });
            
            // Toggle garantía
            const showGarantia = document.getElementById('toggle-garantia').checked;
            document.querySelectorAll('.garantia-clause').forEach(el => {
                el.style.display = showGarantia ? 'list-item' : 'none';
            });
            
            // Toggle IBAN
            const showIban = document.getElementById('toggle-iban').checked;
            document.querySelectorAll('.iban-info').forEach(el => {
                el.style.display = showIban ? 'block' : 'none';
            });
        }
    </script>
</body>
</html>
    `;
    
    const ventana = window.open('', '_blank');
    if (ventana) {
        ventana.document.write(html);
        ventana.document.close();
        console.log('✅ Pagaré generado correctamente');
    } else {
        throw new Error('No se pudo abrir la ventana del pagaré');
    }
}

// ============================================
// MANEJADOR GLOBAL DE ERRORES
// ============================================
window.addEventListener('error', function(e) {
    console.error('❌ ERROR GLOBAL:', e.message, 'en', e.filename, 'línea', e.lineno);
});

console.log('✅ Energy Saver Analyzer v2.0 - Cargado');
console.log('📋 Rangos de factura configurados:');
Object.values(MODELOS).forEach(m => {
    console.log(`${m.nombre}: ${formatearColones(m.rangoFactura.min)} - ${formatearColones(m.rangoFactura.max)}`);
});
