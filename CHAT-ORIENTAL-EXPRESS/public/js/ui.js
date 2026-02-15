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
 * Renderiza la lista de números bloqueados de forma permanente
 */
function actualizarListaBloqueados(numeros) {
    const lista = document.getElementById('listaBloqueados');
    if (!lista) return;

    if (!numeros || numeros.length === 0) {
        lista.innerHTML = '<div class="empty-state" style="padding: 20px; text-align: center; color: rgba(255,255,255,0.5);">No hay números bloqueados</div>';
        return;
    }

    lista.innerHTML = '';
    numeros.forEach(num => {
        const item = document.createElement('div');
        item.className = 'user-item-blocked';
        item.innerHTML = `
            <span>🚫 ${num}</span>
            <button class="btn-text" style="color: #ef4444;" onclick="eliminarBloqueado('${num}')">Desbloquear</button>
        `;
        lista.appendChild(item);
    });
}

/**
 * Cambia entre pestañas de la tarjeta de usuarios
 */
function cambiarTab(tab) {
    // Botones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${tab}`).classList.add('active');

    // Contenido
    document.getElementById('tab-blocked').style.display = tab === 'blocked' ? 'block' : 'none';
    document.getElementById('tab-cooldown').style.display = tab === 'cooldown' ? 'block' : 'none';
}

/**
 * Limpia el contenedor de logs
 */
function limpiarLogs() {
    document.getElementById('logs').innerHTML = '<div class="log-entry">Logs limpiados...</div>';
}
