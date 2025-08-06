// Google Sheets Integration for Energy Saver Costa Rica
// Este archivo contiene las funciones para guardar datos en Google Sheets

// Configuración de Google Sheets
const SHEETS_CONFIG = {
    spreadsheetId: '', // Se llenará con el ID de la hoja
    apiKey: '', // Se configurará con la API Key
    clientId: '', // Se configurará con el Client ID
    sheetName: 'Análisis_Clientes'
};

// Función principal para guardar en Google Sheets
async function saveToGoogleSheets(analysisData) {
    try {
        console.log('📊 Guardando análisis en Google Sheets...');
        
        // Preparar datos para guardar
        const rowData = [
            new Date().toLocaleString('es-CR'), // Fecha/Hora
            analysisData.cliente.nombre,
            analysisData.cliente.telefono,
            analysisData.cliente.email || '',
            analysisData.consumoPromedio,
            analysisData.facturaPromedio,
            analysisData.factorPotencia,
            analysisData.tieneMulta ? 'SI' : 'NO',
            analysisData.equipoRecomendado.name,
            analysisData.totalEquipo,
            analysisData.ahorroTotal,
            analysisData.roiAnos,
            'Nuevo', // Estado inicial
            '' // Notas vacías
        ];
        
        // TODO: Implementar llamada a API de Google Sheets
        console.log('Datos preparados:', rowData);
        
        // Por ahora, guardamos en localStorage como backup
        saveToLocalStorage(analysisData);
        
        return true;
    } catch (error) {
        console.error('Error guardando en Sheets:', error);
        // Guardar en localStorage como fallback
        saveToLocalStorage(analysisData);
        return false;
    }
}

// Función para guardar en localStorage como backup
function saveToLocalStorage(analysisData) {
    try {
        // Obtener análisis existentes
        const existingData = JSON.parse(localStorage.getItem('energySaverAnalysis') || '[]');
        
        // Agregar nuevo análisis con timestamp
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...analysisData
        };
        
        existingData.push(newEntry);
        
        // Guardar actualizado
        localStorage.setItem('energySaverAnalysis', JSON.stringify(existingData));
        
        console.log('✅ Análisis guardado en localStorage');
        return true;
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        return false;
    }
}

// Función para obtener todos los análisis guardados
function getAllAnalysis() {
    try {
        const data = localStorage.getItem('energySaverAnalysis');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error obteniendo análisis:', error);
        return [];
    }
}

// Exportar funciones
window.GoogleSheetsIntegration = {
    saveToGoogleSheets,
    saveToLocalStorage,
    getAllAnalysis,
    SHEETS_CONFIG
};
