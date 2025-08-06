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

        async function performAnalysis() {
