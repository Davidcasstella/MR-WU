/**
 * qr.js — Lógica del código QR de WhatsApp
 */

let ultimoQR = null;
let ultimoEstadoConectado = null;

/**
 * Obtiene el código QR del servidor y lo renderizaa
 */
async function obtenerQR() {
    try {
        const response = await fetch(`${API_URL}/qr`);
        const data = await response.json();

        const qrContainer = document.getElementById('qrcode');

        if (data.connected) {
            ultimoQR = null;
            if (ultimoEstadoConectado !== true) {
                qrContainer.innerHTML = '<div class="qr-placeholder" style="color: #10b981;">✅ WhatsApp Conectado</div>';
                ultimoEstadoConectado = true;
            }
        } else if (data.qr && data.qr !== ultimoQR) {
            ultimoQR = data.qr;
            ultimoEstadoConectado = false;
            qrContainer.innerHTML = '';

            new QRCode(qrContainer, {
                text: data.qr,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            agregarLog('✅ Código QR generado - Escanéalo con WhatsApp');
            mostrarAlerta('✅ Nuevo código QR disponible. Escanéalo con tu WhatsApp.', 'success');
        } else if (!data.qr && !data.connected && ultimoEstadoConectado !== false) {
            ultimoEstadoConectado = false;
            qrContainer.innerHTML = '<div class="qr-placeholder">⏳ Esperando código QR...</div>';
        }
    } catch (error) {
        console.log('Esperando servidor...');
    }
}
