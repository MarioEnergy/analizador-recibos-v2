// Script para integrar OCR real en performAnalysis
// Buscar línea: const ocrText = "Factor de Potencia: 0.88...
// Reemplazar con:

// Procesar imagen con OCR
let ocrData = { textoCompleto: '', consumo: 1200, monto: 85000, factorPotencia: 0.92, tieneMulta: false };

if (uploadedFiles.length > 0) {
    const imageFile = uploadedFiles[0];
    console.log('🔍 Procesando imagen con OCR:', imageFile.name);
    
    try {
        // Crear instancia de OCR
        const ocr = new OCRProcessor();
        ocrData = await ocr.extractTextFromImage(imageFile);
        console.log('✅ OCR completado:', ocrData);
    } catch (error) {
        console.error('❌ Error en OCR, usando datos simulados:', error);
    }
}

const ocrText = ocrData.textoCompleto || "Factor de Potencia: 0.88 Multa por bajo factor de potencia: ₡5,000";
const consumoPromedio = ocrData.consumo;
const facturaPromedio = ocrData.monto;
