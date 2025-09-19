// EnergySaverApp - Orchestrazione e UI Management
import CONFIG from "../config/config.js";
import AuthModule from "../auth/auth.js";
import FileManager from "../filemanager/filemanager.js";
import OCRProcessor from "../ocr/ocr.js";
import AnalysisEngine from "../analysis/analysis.js";
import DocumentGenerator from "../documents/documents.js";
import HealthMonitor from "../monitoring/health.js";

class EnergySaverApp {
    constructor() {
        this.auth = new AuthModule();
        this.fileManager = new FileManager();
        this.ocrProcessor = new OCRProcessor();
        this.analysisEngine = new AnalysisEngine();
        this.healthMonitor = new HealthMonitor();
        this.healthMonitor.initModule("EnergySaverApp");
        this.documentGenerator = new DocumentGenerator();
        this.currentAnalysis = null;
        this.uploadedFiles = [];
        this.currentUser = null;
    }

    init() {
        this.initializeModuleMonitoring();
        this.setupGlobalFunctions();
        this.auth.checkAuthStatus();
        console.log("✅ EnergySaverApp initialized");
    }

    setupGlobalFunctions() {
        // Expose functions globally for HTML onclick handlers
        window.performAnalysis = () => this.performAnalysis();
        window.handleFileSelect = (event) => this.handleFileSelect(event);
        window.checkAnalysisReady = () => this.checkAnalysisReady();
        window.generatePagare = () => this.generatePagare();
        window.shareWhatsApp = () => this.shareWhatsApp();
        window.newAnalysis = () => this.newAnalysis();
        window.handleLogout = () => this.auth.handleLogout();
    }

    // UI FUNCTIONS
    hideLoading() {
        document.getElementById('loading-screen').classList.add('hidden');
    }

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        if (this.currentUser) {
            const userNameEl = document.getElementById('user-name');
            const userRoleEl = document.getElementById('user-role');
            if (userNameEl) userNameEl.textContent = this.currentUser.name;
            if (userRoleEl) userRoleEl.textContent = this.currentUser.role.toUpperCase();
        }
    }

    async performAnalysis() {
        const startTime = Date.now();
        this.healthMonitor.setModuleStatus("EnergySaverApp", "PROCESSING");
        
        // Get client data
        const clientData = {
            nombre: document.getElementById('client-name').value.trim(),
            telefono: document.getElementById('client-phone').value.trim(),
            email: 'cliente@test.com'
        };

        console.log('📊 Starting analysis...');
        
        const btn = document.getElementById('analyze-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Analizando...';
        btn.disabled = true;
        
        try {
            // Simulate OCR processing
            let ocrData = await this.ocrProcessor.getSimulatedData();
            console.log('✅ Datos OCR:', ocrData);
            
            // Simulate analysis delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const consumoPromedio = ocrData.consumo || Math.floor(Math.random() * 1500) + 800;
            const facturaPromedio = ocrData.monto || Math.floor(consumoPromedio * 0.45 * CONFIG.financial.TC_BCCR);
            
            const equipoRecomendado = this.analysisEngine.selectEquipment(facturaPromedio);
            
            // Calculate analysis
            const analysis = {
                cliente: clientData,
                consumoPromedio,
                facturaPromedio,
                factorPotencia: ocrData.factorPotencia || 0.92,
                equipoRecomendado,
                ahorroTotal: Math.floor(facturaPromedio * CONFIG.financial.ahorroMinimo),
                roiMeses: Math.ceil(equipoRecomendado.precio / (facturaPromedio * CONFIG.financial.ahorroMinimo / CONFIG.financial.TC_BCCR)),
                roiAnos: Math.ceil(equipoRecomendado.precio / (facturaPromedio * CONFIG.financial.ahorroMinimo / CONFIG.financial.TC_BCCR) / 12),
                porcentajeAhorro: Math.floor(CONFIG.financial.ahorroMinimo * 100),
                eficienciaActual: "Media",
                flujoPositivo: Math.floor(facturaPromedio * CONFIG.financial.ahorroMinimo),
                totalEquipo: equipoRecomendado.precio * CONFIG.financial.TC_BCCR
            };
            
            this.currentAnalysis = analysis;
            this.showResults(analysis);
            
            this.healthMonitor.trackOperation("EnergySaverApp", "analysis", Date.now() - startTime);
            this.healthMonitor.setModuleStatus("EnergySaverApp", "READY");
            
        } catch (error) {
            console.error('❌ Error en análisis:', error);
            alert('Error en el análisis. Intenta nuevamente.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.uploadedFiles = files;
        
        const statusDiv = document.getElementById('files-status');
        if (files.length > 0) {
            statusDiv.innerHTML = files.map(file => `
                <div class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <div class="text-green-600">📄</div>
                        <div>
                            <div class="font-medium text-green-800">${file.name}</div>
                            <span class="text-sm text-gray-500">(${(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        this.checkAnalysisReady();
    }

    checkAnalysisReady() {
        const name = document.getElementById('client-name').value.trim();
        const phone = document.getElementById('client-phone').value.trim();
        const hasFiles = this.uploadedFiles.length > 0;
        
        document.getElementById('analyze-btn').disabled = !(name && phone && hasFiles);
    }

    showResults(analysis) {
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
                    <div class="text-2xl font-bold text-yellow-600">${analysis.roiAnos} años</div>
                    <div class="text-sm text-gray-600">Retorno Inversión</div>
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

    generatePagare() {
        if (!this.currentAnalysis) return;
        this.documentGenerator.generatePagare();
    }

    shareWhatsApp() {
        if (!this.currentAnalysis) return;
        
        const message = `🔋 *ENERGY SAVER COSTA RICA*
📊 *ANÁLISIS ENERGÉTICO*

👤 Cliente: ${this.currentAnalysis.cliente.nombre}
🔧 Equipo: ${this.currentAnalysis.equipoRecomendado.name}
💰 Ahorro: ₡${this.currentAnalysis.ahorroTotal.toLocaleString()}/mes
⏱️ ROI: ${this.currentAnalysis.roiMeses} meses

¡Solicita tu análisis gratuito!
📞 ${CONFIG.company.telefono}`;

        const url = `https://wa.me/506${CONFIG.company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    newAnalysis() {
        this.currentAnalysis = null;
        this.uploadedFiles = [];
        
        document.getElementById('client-name').value = '';
        document.getElementById('client-phone').value = '';
        document.getElementById('files-status').innerHTML = '';
        document.getElementById('results-section').classList.add('hidden');
        
        this.checkAnalysisReady();
    }


    // Initialize monitoring for all modules
    initializeModuleMonitoring() {
        // Set all modules as ready
        setTimeout(() => {
            this.healthMonitor.setModuleStatus("AuthModule", "READY");
            this.healthMonitor.setModuleStatus("FileManager", "READY");
            this.healthMonitor.setModuleStatus("OCRProcessor", "READY");
            this.healthMonitor.setModuleStatus("AnalysisEngine", "READY");
            this.healthMonitor.setModuleStatus("DocumentGenerator", "READY");
            this.healthMonitor.setModuleStatus("EnergySaverApp", "HEALTHY");
            
            console.log("🎯 [SYSTEM] All modules initialized and monitored");
            this.displaySystemHealth();
        }, 1000);
    }

    // Display system health in console
    displaySystemHealth() {
        const healthReport = this.healthMonitor.generateHealthReport();
        console.log("📊 [DASHBOARD] System Health:", healthReport.system);
        
        // Show module status
        for (const [module, stats] of Object.entries(healthReport.modules)) {
            const status = stats.status === 'HEALTHY' || stats.status === 'READY' ? '✅' : '⚠️';
            console.log(`${status} ${module}: ${stats.status} (${stats.operations} ops, ${stats.errors} errors)`);
        }
    }

    // Get system health for external access
    getSystemHealth() {
        return this.healthMonitor.generateHealthReport();
    }
}

export default EnergySaverApp;
