    <script>
        // CONFIGURAZIONE ENERGY SAVER
        const CONFIG = {
            company: {
                name: 'ENERGY SAVER, SOCIEDAD ANÓNIMA',
                cedula: '3-101-577450',
                representante: 'MARIO SAVARD BOIES',
                telefono: '8722-6666',
                whatsapp: '8722-6666'
            },
            auth: {
                adminEmail: 'mariosavardenergysaver@gmail.com',
                adminPassword: 'mario123',
                adminName: 'Mario Savard Boies'
            },
            equipment: {
                'JS-1299': { name: 'JS-1299', precio: 3200, prima: 1100, cuotaUSD: 128, minFactura: 200000, maxFactura: 400000 },
                'JS-1699': { name: 'JS-1699', precio: 4000, prima: 1300, cuotaUSD: 158, minFactura: 401000, maxFactura: 600000 },
                'JS-2099': { name: 'JS-2099', precio: 4600, prima: 1500, cuotaUSD: 178, minFactura: 601000, maxFactura: 850000 },
                'JS-2499': { name: 'JS-2499', precio: 5200, prima: 1750, cuotaUSD: 195, minFactura: 851000, maxFactura: 1200000 }
            },
            financial: {
                TC_BCCR: 512,
                IVA: 0.13,
                ahorroMinimo: 0.20,
                ahorroMaximo: 0.25,
                plazoCuotas: 24
            },
            banking: {
                banco: 'BANCO NACIONAL DE COSTA RICA',
                cuentaUSD: '100-02-119-000012-0',
                ibanUSD: 'CR49015111910020000127',
                cuentaCRC: '100-01-119-000019-1',
                ibanCRC: 'CR12015111910010000190'
            }
        };

        // GLOBAL VARIABLES
        let currentUser = null;
        let uploadedFiles = [];
        let currentAnalysis = null;

        // INITIALIZE APP
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 Energy Saver initializing...');
            
            setTimeout(() => {
                hideLoading();
                checkAuthStatus();
            }, 1500);
        });

        // AUTH FUNCTIONS
        function handleLogin() {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            
            console.log('🔐 Login attempt:', email);
            
            if (!email || !password) {
                showLoginError('Email y password requeridos');
                return;
            }
            
            if (email === CONFIG.auth.adminEmail && password === CONFIG.auth.adminPassword) {
                currentUser = {
                    id: 1,
                    name: CONFIG.auth.adminName,
                    email: email,
                    role: 'admin',
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('energySaverUser', JSON.stringify(currentUser));
                hideLoginError();
                showDashboard();
            } else {
                showLoginError('Credenciales incorrectas');
            }
        }

        function handleLogout() {
            currentUser = null;
            localStorage.removeItem('energySaverUser');
            showLogin();
        }

        function checkAuthStatus() {
            const stored = localStorage.getItem('energySaverUser');
            if (stored) {
                currentUser = JSON.parse(stored);
                showDashboard();
            } else {
                showLogin();
            }
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

        // ANALYSIS FUNCTIONS
        function simulateUpload() {
            uploadedFiles = [
                { name: 'recibo_enero.pdf', type: 'application/pdf', size: 1024 * 1024 },
                { name: 'recibo_febrero.jpg', type: 'image/jpeg', size: 2 * 1024 * 1024 },
                { name: 'recibo_marzo.png', type: 'image/png', size: 1.5 * 1024 * 1024 }
            ];
            
            displayFiles();
            checkAnalysisReady();
        }

        // Handle real file selection
        function handleFileSelect(event) {
            const files = event.target.files;
            uploadedFiles = Array.from(files);
            
            const filesList = document.getElementById("files-status");
            filesList.innerHTML = "<h4 class="font-semibold mb-2">Archivos seleccionados:</h4>";
            
            uploadedFiles.forEach((file, index) => {
                filesList.innerHTML += `
                    <div class="bg-gray-100 p-2 rounded mb-2">
                        <span class="text-sm">${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                `;
            });
            
            checkFormComplete();
        }
        window.handleFileSelect = handleFileSelect;
        function displayFiles() {
            const statusEl = document.getElementById('files-status');
            statusEl.innerHTML = uploadedFiles.map(file => `
                <div class="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg mt-2">
                    <div class="flex items-center space-x-3">
                        <span class="text-green-600">✅</span>
                        <span class="font-medium">${file.name}</span>
                        <span class="text-sm text-gray-500">(${(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                </div>
            `).join('');
        }

        function checkAnalysisReady() {
            const name = document.getElementById('client-name').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const hasFiles = uploadedFiles.length > 0;
            
            document.getElementById('analyze-btn').disabled = !(name && phone && hasFiles);
        }

// OCR.space API inline
const OCR_API_KEY = 'K82938472988957';
const OCR_API_URL = 'https://api.ocr.space/parse/image';

async function processImageWithOCR(imageFile) {
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('apikey', OCR_API_KEY);
        formData.append('language', 'spa');
        formData.append('OCREngine', '2');

        const response = await fetch(OCR_API_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.OCRExitCode === 1) {
            const text = result.ParsedResults[0].ParsedText;
            return parseReceiptData(text);
        }
    } catch (error) {
        console.error('OCR Error:', error);
    }
    
    return getSimulatedData();
}

function parseReceiptData(ocrText) {
    return {
        consumo: extractNumber(ocrText, /(\d+)\s*kwh/i) || 1200,
        monto: extractNumber(ocrText, /total.*?(\d+)/i) || 85000,
        factorPotencia: extractNumber(ocrText, /factor.*?(\d+\.\d+)/i) || 0.92,
        tieneMulta: /multa|penalizaci/i.test(ocrText),
        textoCompleto: ocrText
    };
}

function extractNumber(text, regex) {
    const match = text.match(regex);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
}

function getSimulatedData() {
    return {
        consumo: Math.floor(Math.random() * 1500) + 800,
        monto: Math.floor(Math.random() * 100000) + 50000,
        factorPotencia: 0.88 + Math.random() * 0.1,
        tieneMulta: Math.random() > 0.7,
        textoCompleto: 'Datos simulados'
    };
}
        consumo: extractNumber(ocrText, /(\d+)\s*kwh/i) || 1200,
        monto: extractNumber(ocrText, /total.*?(\d+)/i) || 85000,
        factorPotencia: extractNumber(ocrText, /factor.*?(\d+\.\d+)/i) || 0.92,
        tieneMulta: /multa|penalizaci/i.test(ocrText),
        textoCompleto: ocrText
    };
}

function extractNumber(text, regex) {
    const match = text.match(regex);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
}

function getSimulatedData() {
    return {
        consumo: Math.floor(Math.random() * 1500) + 800,
        monto: Math.floor(Math.random() * 100000) + 50000,
        factorPotencia: 0.88 + Math.random() * 0.1,
        tieneMulta: Math.random() > 0.7,
        textoCompleto: 'Datos simulados'
    };
}
        async function performAnalysis() {
            // Procesar con OCR real
            let ocrData = await getSimulatedData(); // Por defecto datos simulados
            let ocrText = "Factor de Potencia: 0.88 Multa por bajo factor de potencia: ₡5,000";
            
            if (uploadedFiles.length > 0) {
                console.log('🔍 Procesando imagen con OCR...');
                ocrData = await processImageWithOCR(uploadedFiles[0]);
                ocrText = ocrData.textoCompleto || ocrText;
                console.log('✅ Datos OCR:', ocrData);
            }
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
                // Simulate analysis
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const consumoPromedio = ocrData.consumo || Math.floor(Math.random() * 1500) + 800;
                const facturaPromedio = ocrData.monto || Math.floor(consumoPromedio * 0.45 * CONFIG.financial.TC_BCCR);
                
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
                    roiAnos: (roiMeses / 12).toFixed(1),
                    proyeccion2Anos: ahorroMensual * 24,
                    proyeccion3Anos: ahorroMensual * 36,
                    porcentajeAhorro: Math.round((ahorroMensual / facturaPromedio) * 100),
                    factorPotencia: detectPowerFactor(ocrText) || "0.92",
                    tienePenalidad: detectPowerFactorPenalty(ocrText),
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
                        <div class="text-2xl font-bold text-yellow-600">${analysis.roiAnos} años</div>
                        <div class="text-sm text-gray-600">Retorno Inversión</div>
                    </div>
                </div>
                
                <!-- Proyecciones de Ahorro -->
                <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mt-6">
                    <h4 class="text-lg font-bold text-gray-800 mb-4">💰 Proyección de Ahorros</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">₡${analysis.proyeccion2Anos.toLocaleString()}</div>
                            <div class="text-sm text-gray-600">Ahorro en 2 años</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">₡${analysis.proyeccion3Anos.toLocaleString()}</div>
                            <div class="text-sm text-gray-600">Ahorro en 3 años</div>
                        </div>
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
            showReferralButton();
            saveToGoogleSheets(currentAnalysis);
            
            // Guardar referido si existe código
            const referralCode = document.getElementById("referral-code-input").value.trim();
            if (referralCode) {
                saveReferralIfExists(referralCode);
            }
        }

        function generatePagare() {
            if (!currentAnalysis) return;
            
            const content = `PAGARÉ - ENERGY SAVER COSTA RICA

Cliente: ${currentAnalysis.cliente.nombre}
Teléfono: ${currentAnalysis.cliente.telefono}
Fecha: ${new Date().toLocaleDateString('es-CR')}

EQUIPO: ${currentAnalysis.equipoRecomendado.name}
MONTO TOTAL: $${Math.floor(currentAnalysis.totalEquipo / CONFIG.financial.TC_BCCR)} USD
(₡${currentAnalysis.totalEquipo.toLocaleString()} colones)

FINANCIAMIENTO:
Prima: $${currentAnalysis.equipoRecomendado.prima}
24 Cuotas: $${currentAnalysis.equipoRecomendado.cuotaUSD} c/u
Tasa interés: 0%

EMPRESA:
${CONFIG.company.name}
Cédula: ${CONFIG.company.cedula}
Representante: ${CONFIG.company.representante}
Teléfono: ${CONFIG.company.telefono}

INFORMACIÓN BANCARIA:
${CONFIG.banking.banco}
Cuenta USD: ${CONFIG.banking.cuentaUSD}
IBAN USD: ${CONFIG.banking.ibanUSD}
Cuenta CRC: ${CONFIG.banking.cuentaCRC}
IBAN CRC: ${CONFIG.banking.ibanCRC}`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PAGARE_${currentAnalysis.cliente.nombre.replace(/\s+/g, '_')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert('✅ PAGARÉ generado y descargado');
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

        // EVENT LISTENERS
        document.addEventListener('DOMContentLoaded', function() {
            const nameInput = document.getElementById('client-name');
            const phoneInput = document.getElementById('client-phone');
            
            if (nameInput) nameInput.addEventListener('input', checkAnalysisReady);
            if (phoneInput) phoneInput.addEventListener('input', checkAnalysisReady);
        });

        console.log('✅ Energy Saver Complete System loaded!');
    </script>
        window.performAnalysis = performAnalysis;

        // Detección de Factor de Potencia Real
        function detectPowerFactor(ocrText) {
            if (!ocrText) return null;
            
            const patterns = [
                /factor\s*de?\s*potencia[:.\s]*([0-9]\.[0-9]{2})/i,
                /FP[:.\s]*([0-9]\.[0-9]{2})/i,
                /cos\s*φ[:.\s]*([0-9]\.[0-9]{2})/i
            ];
            
            for (const pattern of patterns) {
                const match = ocrText.match(pattern);
                if (match) return parseFloat(match[1]);
            }
            return null;
        }
        
        // Detectar multas por bajo FP
        function detectPowerFactorPenalty(ocrText) {
            if (!ocrText) return false;
            
            const penaltyPatterns = [
                /multa.*factor.*potencia/i,
                /penalizaci[óo]n.*FP/i,
                /cargo.*bajo.*factor/i
            ];
            
            return penaltyPatterns.some(pattern => ocrText.match(pattern));
        }
        window.detectPowerFactor = detectPowerFactor;
        window.detectPowerFactorPenalty = detectPowerFactorPenalty;

        // WhatsApp OTP Functions
        function requestOTP() {
            const phone = document.getElementById('phone-number').value.trim();
            if (!phone || phone.length < 8) {
                showOTPError('Ingresa un número válido');
                return;
            }
            
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const message = `Cliente ${phone} solicita OTP: ${otp}`;
            const adminWhatsApp = '50687226666';
            
            // Guardar OTP
            sessionStorage.setItem(`otp_${phone}`, JSON.stringify({
                otp: otp,
                expiry: Date.now() + 600000 // 10 minutos
            }));
            
            // Abrir WhatsApp
            window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
            
            // Mostrar paso 2
            document.getElementById('otp-step-1').classList.add('hidden');
            document.getElementById('otp-step-2').classList.remove('hidden');
        }
        
        function verifyOTP() {
            const phone = document.getElementById('phone-number').value.trim();
            const inputOTP = document.getElementById('otp-code').value.trim();
            
            const stored = sessionStorage.getItem(`otp_${phone}`);
            if (!stored) {
                showOTPError('Código expirado. Solicita uno nuevo.');
                return;
            }
            
            const { otp, expiry } = JSON.parse(stored);
            if (Date.now() > expiry || otp !== inputOTP) {
                showOTPError('Código inválido o expirado');
                return;
            }
            
            // Login exitoso
            sessionStorage.removeItem(`otp_${phone}`);
            document.getElementById('otp-screen').classList.add('hidden');
            showDashboard();
        }
        
        function showOTPError(message) {
            const errorEl = document.getElementById('otp-error');
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
        
        // Exponer funciones
        window.requestOTP = requestOTP;
        window.verifyOTP = verifyOTP;
// PARTE 1: Funciones básicas de referidos
function showReferralButton() {
    const content = document.getElementById('results-content');
    if (!content) return;
    
    const btn = document.createElement('button');
    btn.className = 'mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700';
    btn.innerHTML = '🎁 Ver Programa de Referidos';
    btn.onclick = showReferralModal;
    content.appendChild(btn);
}

function generateReferralCode() {
    if (!currentAnalysis) return;
    const name = currentAnalysis.cliente.nombre;
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return prefix + '-' + random;
}
// PARTE 2: Modal de referidos
function showReferralModal() {
    if (!currentAnalysis) return;
    
    const code = currentAnalysis.referralCode || generateReferralCode();
    currentAnalysis.referralCode = code;
    
    const modal = document.createElement('div');
    modal.id = 'referral-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    const content = '<div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">' +
        '<h2 class="text-2xl font-bold text-gray-800 mb-4">🎁 Programa de Referidos</h2>' +
        '<div class="bg-green-100 p-4 rounded-lg mb-4">' +
        '<p class="text-sm text-gray-600 mb-2">Tu código de referido:</p>' +
        '<p class="text-2xl font-bold text-green-600">' + code + '</p>' +
        '</div>' +
        '<div class="mb-6">' +
        '<h3 class="font-bold text-gray-800 mb-2">¿Cómo funciona?</h3>' +
        '<ul class="text-sm text-gray-600 space-y-2">' +
        '<li>✅ Comparte tu código con amigos</li>' +
        '<li>✅ Por cada referido: ₡50,000 de bono</li>' +
        '<li>✅ Tu referido recibe: 5% descuento</li>' +
        '<li>✅ Sin límite de referidos</li>' +
        '</ul></div>' +
        '<div class="flex gap-3">' +
        '<button onclick="shareReferralWhatsApp(\'' + code + '\')" class="flex-1 bg-green-600 text-white py-3 rounded-lg">📱 Compartir</button>' +
        '<button onclick="closeReferralModal()" class="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg">Cerrar</button>' +
        '</div></div>';
    
    modal.innerHTML = content;
    document.body.appendChild(modal);
}
// PARTE 3: Funciones de compartir y cerrar
function closeReferralModal() {
    const modal = document.getElementById('referral-modal');
    if (modal) modal.remove();
}

function shareReferralWhatsApp(code) {
    const text = '¡Hola! 👋\n\n' +
        'Te comparto mi código de referido de Energy Saver: *' + code + '*\n\n' +
        '✅ Ahorra hasta 25% en tu factura eléctrica\n' +
        '✅ Obtén 5% de descuento con mi código\n' +
        '✅ Financiamiento sin intereses\n\n' +
        '¿Te interesa? Contacta al 8722-6666';
    
    const url = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
}

// Guardar referido si hay código
function saveReferralIfExists(referralCode) {
    const referralInput = document.getElementById('referral-code-input');
    if (referralInput && referralCode) {
        const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
        referrals.push({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            referralCode: referralCode,
            referredName: currentAnalysis.cliente.nombre,
            referredPhone: currentAnalysis.cliente.telefono
        });
        localStorage.setItem('referrals', JSON.stringify(referrals));
    }
}

        // Google Sheets Integration
        async function saveToGoogleSheets(analysisData) {
            try {
                console.log("💾 Guardando análisis en base de datos...");
                
                // Preparar datos para Google Sheets
                const sheetData = {
                    fecha: new Date().toLocaleString("es-CR"),
                    nombre: analysisData.cliente.nombre,
                    telefono: analysisData.cliente.telefono,
                    email: analysisData.cliente.email || "No proporcionado",
                    consumoKwh: analysisData.consumoPromedio,
                    gastoMensual: analysisData.facturaPromedio,
                    factorPotencia: analysisData.factorPotencia,
                    tieneMulta: analysisData.tieneMulta ? "SI" : "NO",
                    equipoRecomendado: analysisData.equipoRecomendado.name,
                    inversionTotal: analysisData.totalEquipo,
                    ahorroMensual: analysisData.ahorroTotal,
                    roiAnos: analysisData.roiAnos,
                    estado: "Nuevo",
                    notas: "",
                    referralCode: analysisData.referralCode || ""
                };
                
                // Por ahora guardamos en localStorage como base de datos temporal
                const analyses = JSON.parse(localStorage.getItem("energySaverAnalyses") || "[]");
                analyses.push({
                    id: Date.now(),
                    ...sheetData
                });
                localStorage.setItem("energySaverAnalyses", JSON.stringify(analyses));
                
                console.log("✅ Análisis guardado exitosamente");
                
                return true;
            } catch (error) {
                console.error("Error guardando análisis:", error);
                return false;
            }
        }
