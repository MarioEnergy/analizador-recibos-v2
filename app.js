// Configuración simple
const TC_BCCR = 508.81;
let myDropzone;
let currentData = null;

// Inicializar Dropzone
Dropzone.autoDiscover = false;

document.addEventListener('DOMContentLoaded', function() {
    // Configurar Dropzone
    myDropzone = new Dropzone("#dropzone", {
        url: "/upload",
        autoProcessQueue: false,
        addRemoveLinks: true,
        maxFiles: 6
    });

    // Botón analizar
    document.getElementById('analyze-btn').addEventListener('click', function() {
        const clientName = document.getElementById('client-name').value || 'Cliente';
        
        // Datos de ejemplo
        currentData = {
            clientName: clientName,
            consumoPromedio: 850,
            montoPromedio: 75000, // colones
            montoPromedioUSD: 75000 / TC_BCCR,
            factorPotencia: 0.85,
            tieneMulta: true,
            multaMensual: 6000 / TC_BCCR
        };

        mostrarResultados();
    });

    // Botón pagaré
    document.getElementById('generate-pagare').addEventListener('click', generarPagare);
});

function mostrarResultados() {
    const modelo = {
        nombre: 'JS-1299',
        precio: 1299,
        prima: 389.70,
        financiado: 909.30,
        cuotaMensual: 37.89
    };

    const ahorroEnergia = currentData.montoPromedioUSD * 0.15;
    const ahorroMulta = currentData.tieneMulta ? currentData.multaMensual : 0;
    const ahorroTotal = ahorroEnergia + ahorroMulta;

    document.getElementById('results-content').innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div>
                <h3 class="font-bold">Consumo Promedio:</h3>
                <p>${currentData.consumoPromedio} kWh</p>
            </div>
            <div>
                <h3 class="font-bold">Monto Promedio:</h3>
                <p>$${currentData.montoPromedioUSD.toFixed(2)} (₡${Math.round(currentData.montoPromedio).toLocaleString()})</p>
            </div>
            <div>
                <h3 class="font-bold">Factor de Potencia:</h3>
                <p class="${currentData.factorPotencia < 0.90 ? 'text-red-600' : ''}">${currentData.factorPotencia.toFixed(2)}</p>
            </div>
            <div>
                <h3 class="font-bold">Multa Mensual:</h3>
                <p class="text-red-600">${currentData.tieneMulta ? `$${currentData.multaMensual.toFixed(2)}` : 'Sin multa'}</p>
            </div>
        </div>
        
        <div class="mt-6 p-4 bg-blue-50 rounded">
            <h3 class="font-bold text-lg">Equipo Recomendado: ${modelo.nombre}</h3>
            <p>Precio: $${modelo.precio}</p>
            <p>Prima (30%): $${modelo.prima}</p>
            <p>Financiado: $${modelo.financiado}</p>
            <p>Cuota mensual: $${modelo.cuotaMensual} (24 meses)</p>
        </div>

        <div class="mt-6 p-4 bg-green-50 rounded">
            <h3 class="font-bold text-lg">Ahorros Estimados</h3>
            <p>Ahorro energético: $${ahorroEnergia.toFixed(2)}/mes</p>
            <p>Eliminación multas: $${ahorroMulta.toFixed(2)}/mes</p>
            <p class="font-bold text-lg text-green-600">Ahorro total: $${ahorroTotal.toFixed(2)}/mes</p>
            <p>ROI: ${Math.ceil(modelo.financiado / ahorroTotal)} meses</p>
        </div>
    `;

    document.getElementById('upload-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');
}

function generarPagare() {
    if (!currentData) return;
    
    const html = `
        <h1>PAGARÉ</h1>
        <p>Cliente: ${currentData.clientName}</p>
        <p>Monto: $909.30</p>
        <p>Cuotas: 24 x $37.89</p>
    `;
    
    const ventana = window.open('', '_blank');
    ventana.document.write(html);
}

console.log('App iniciada correctamente');
