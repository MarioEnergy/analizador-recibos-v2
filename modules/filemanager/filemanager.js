// FileManager - Gestione File e Upload
import CONFIG from "../config/config.js";

class FileManager {
    constructor() {
        this.uploadedFiles = [];
    }

        function simulateUpload() {
            uploadedFiles = [
                { name: 'recibo_enero.pdf', type: 'application/pdf', size: 1024 * 1024 },
                { name: 'recibo_febrero.jpg', type: 'image/jpeg', size: 2 * 1024 * 1024 },
                { name: 'recibo_marzo.png', type: 'image/png', size: 1.5 * 1024 * 1024 }
            ];
            
            displayFiles();
            checkAnalysisReady();
        }

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


}

export default FileManager;
