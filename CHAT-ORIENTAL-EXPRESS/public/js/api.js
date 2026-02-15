/**
 * api.js — Configuración de API y helpers globales
 */

const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : `http://${window.location.hostname}:3000`;

/**
 * Muestra una alerta temporal en el contenedor de alertas
 * @param {string} mensaje - Texto de la alerta
 * @param {string} tipo - Tipo: 'success', 'error', 'info'
 */
function mostrarAlerta(mensaje, tipo = 'success') {
    const container = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo}`;
    alert.textContent = mensaje;
    alert.style.display = 'block';
    container.appendChild(alert);

    setTimeout(() => {
        alert.style.display = 'none';
        alert.remove();
    }, 5000);
}

/**
 * Agrega una entrada al log del sistema
 * @param {string} mensaje - Texto del log
 */
function agregarLog(mensaje) {
    const logs = document.getElementById('logs');
    const timestamp = new Date().toLocaleTimeString('es-CO');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${timestamp}] ${mensaje}`;
    logs.insertBefore(entry, logs.firstChild);

    // Mantener máximo 50 entradas
    while (logs.children.length > 50) {
        logs.removeChild(logs.lastChild);
    }
}
