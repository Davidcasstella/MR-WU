/**
 * ui.js — Funciones de renderizado de la interfaz
 */

/**
 * Actualiza la lista visual de usuarios en cooldown
 * @param {Array} usuarios - Lista de usuarios con cooldown activo
 */
function actualizarListaUsuarios(usuarios) {
    const usersList = document.getElementById('usersList');

    if (usuarios.length === 0) {
        usersList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No hay usuarios en cooldown</p>';
        return;
    }

    usersList.innerHTML = '';
    usuarios.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';

        const puedeResponder = user.minutosRestantes === 0;

        userItem.innerHTML = `
            <div class="user-info">
                <div class="user-phone">📱 ${user.telefono}</div>
                <div class="user-time">Última respuesta: ${user.ultimaRespuesta}</div>
                <div class="user-estado">Estado: ${user.estado || 'inicial'}</div>
            </div>
            ${!puedeResponder ? `<span class="cooldown-badge">⏳ ${user.minutosRestantes} min</span>` : ''}
            <button class="btn btn-warning btn-small" onclick="resetearCooldown('${user.telefono}')">
                🔄 Resetear
            </button>
        `;

        usersList.appendChild(userItem);
    });
}

/**
 * Limpia el contenedor de logs
 */
function limpiarLogs() {
    document.getElementById('logs').innerHTML = '<div class="log-entry">Logs limpiados...</div>';
}
