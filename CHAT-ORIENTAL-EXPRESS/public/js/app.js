/**
 * app.js — Inicialización y lógica principal del dashboard
 */

/**
 * Consulta el estado del bot y actualiza el DOM
 */
async function actualizarEstado() {
    try {
        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();

        const statusEl = document.getElementById('status');
        statusEl.textContent = data.status === 'conectado' ? 'Conectado ✅' : 'Desconectado ❌';
        statusEl.className = `status-badge ${data.status === 'conectado' ? 'status-conectado' : 'status-desconectado'}`;

        document.getElementById('empresa').textContent = data.empresa || '-';
        document.getElementById('cooldown').textContent = `${data.cooldownMinutos || 0} minutos`;
        document.getElementById('mensajes').textContent = data.mensajesProcesados || 0;
        document.getElementById('miNumero').textContent = data.miNumero || 'No disponible';

        actualizarListaUsuarios(data.usuariosEnCooldown || []);

        agregarLog('Estado actualizado correctamente');
    } catch (error) {
        agregarLog('❌ Error al actualizar estado: ' + error.message);
        mostrarAlerta('Error al conectar con el servidor', 'error');
    }
}

/**
 * Inicialización al cargar la página
 */
window.onload = function () {
    agregarLog('Panel de control iniciado - Outlet Tech Boyacá');
    actualizarEstado();
    obtenerQR();

    // Actualizar estado cada 5 segundos
    setInterval(actualizarEstado, 5000);

    // Polling del QR code
    let contadorQR = 0;
    setInterval(() => {
        contadorQR++;

        if (ultimoEstadoConectado === true) {
            // Si está conectado, verificar cada 15s (cada 5 ciclos)
            if (contadorQR % 5 === 0) {
                obtenerQR();
            }
        } else {
            // Si no está conectado, verificar cada 3s
            obtenerQR();
        }
    }, 3000);
};
