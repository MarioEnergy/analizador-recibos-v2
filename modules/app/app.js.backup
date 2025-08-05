// EnergySaverApp - Orchestrazione e UI Management
import CONFIG from "../config/config.js";
import AuthModule from "./auth/auth.js";
import FileManager from "./filemanager/filemanager.js";
import OCRProcessor from "./ocr/ocr.js";
import AnalysisEngine from "./analysis/analysis.js";
import DocumentGenerator from "./documents/documents.js";

class EnergySaverApp {
    constructor() {
        this.auth = new AuthModule();
        this.fileManager = new FileManager();
        this.ocrProcessor = new OCRProcessor();
        this.analysisEngine = new AnalysisEngine();
        this.documentGenerator = new DocumentGenerator();
        this.currentAnalysis = null;
    }

        // UI FUNCTIONS
        function hideLoading() {
            document.getElementById('loading-screen').classList.add('hidden');
        }

        function showLogin() {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
        }

        function showDashboard() {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            
            if (currentUser) {
                document.getElementById('user-name').textContent = currentUser.name;
                document.getElementById('user-role').textContent = currentUser.role.toUpperCase();
            }
        }

        function showLoginError(message) {
            const errorEl = document.getElementById('login-error');
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }

        function hideLoginError() {
            document.getElementById('login-error').classList.add('hidden');
        }

        function showResults(analysis) {
            const content = document.getElementById('results-content');
            
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div class="bg-blue-50 p-6 rounded-xl text-center">
                        <div class="text-2xl font-bold text-blue-600">${analysis.cliente.nombre}</div>
                        <div class="text-sm text-gray-600">Cliente</div>
                    </div>
                    <div class="bg-green-50 p-6 rounded-xl text-center">
                        <div class="text-2xl font-bold text-green-600">${analysis.equipoRecomendado.name}</div>
                        <div class="text-sm text-gray-600">Equipo</div>
                    </div>
                    <div class="bg-purple-50 p-6 rounded-xl text-center">
                        <div class="text-2xl font-bold text-purple-600">₡${analysis.ahorroTotal.toLocaleString()}</div>
                        <div class="text-sm text-gray-600">Ahorro/mes</div>
                    </div>
                    <div class="bg-yellow-50 p-6 rounded-xl text-center">
                        <div class="text-2xl font-bold text-yellow-600">${analysis.roiMeses}</div>
                        <div class="text-sm text-gray-600">ROI meses</div>
                    </div>
                </div>
                
                <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                    <h4 class="text-lg font-bold text-gray-900 mb-4">📊 Resumen Detallado</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Consumo:</strong> ${analysis.consumoPromedio} kWh/mes</div>
                        <div><strong>Factura:</strong> ₡${analysis.facturaPromedio.toLocaleString()}/mes</div>
                        <div><strong>Factor potencia:</strong> ${analysis.factorPotencia}</div>
                        <div><strong>Eficiencia:</strong> ${analysis.eficienciaActual}</div>
                        <div><strong>% ahorro:</strong> ${analysis.porcentajeAhorro}%</div>
                        <div><strong>Flujo positivo:</strong> ₡${analysis.flujoPositivo.toLocaleString()}/mes</div>
                    </div>
                </div>
            `;
            
            document.getElementById('results-section').classList.remove('hidden');
        }

        function shareWhatsApp() {
            if (!currentAnalysis) return;
            
            const message = `🔋 *ENERGY SAVER COSTA RICA*
📊 *ANÁLISIS ENERGÉTICO*

👤 Cliente: ${currentAnalysis.cliente.nombre}
🔧 Equipo: ${currentAnalysis.equipoRecomendado.name}
💰 Ahorro: ₡${currentAnalysis.ahorroTotal.toLocaleString()}/mes
⏱️ ROI: ${currentAnalysis.roiMeses} meses

¡Solicita tu análisis gratuito!
📞 ${CONFIG.company.telefono}`;

            const url = `https://wa.me/506${CONFIG.company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }

        function newAnalysis() {
            currentAnalysis = null;
            uploadedFiles = [];
            
            document.getElementById('client-name').value = '';
            document.getElementById('client-phone').value = '';
            document.getElementById('files-status').innerHTML = '';
            document.getElementById('results-section').classList.add('hidden');
            
            checkAnalysisReady();
        }


}

export default EnergySaverApp;
