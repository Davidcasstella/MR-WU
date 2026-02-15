/**
 * session.js — Gestión de sesión y cooldowns de WhatsApp
 */

/**
 * Resetea el cooldown de un usuario específico
 * @param {string} telefono - Número de teléfono del usuario
 */
async function resetearCooldown(telefono) {
    try {
        const response = await fetch(`${API_URL}/reset-cooldown/${telefono}`, {
            method: 'POST'
        });
        const data = await response.json();

        mostrarAlerta(`Cooldown reseteado para ${telefono}`, 'success');
        agregarLog(`Cooldown reseteado: ${telefono}`);
        actualizarEstado();
    } catch (error) {
        mostrarAlerta('Error al resetear cooldown', 'error');
        agregarLog('❌ Error al resetear cooldown: ' + error.message);
    }
}

/**
 * Resetea todos los cooldowns activos
 */
async function resetearTodosCooldowns() {
    if (!confirm('¿Estás seguro de resetear TODOS los cooldowns?')) return;

    try {
        const response = await fetch(`${API_URL}/reset-all-cooldowns`, {
            method: 'POST'
        });
        const data = await response.json();

        mostrarAlerta(data.message, 'success');
        agregarLog('Todos los cooldowns reseteados');
        actualizarEstado();
    } catch (error) {
        mostrarAlerta('Error al resetear cooldowns', 'error');
        agregarLog('❌ Error: ' + error.message);
    }
}

/**
 * Fuerza una nueva conexión con WhatsApp
 */
async function forzarReconexion() {
    try {
        const statusResponse = await fetch(`${API_URL}/status`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'conectado') {
            mostrarAlerta('❌ Ya estás conectado a WhatsApp. No es necesario reconectar.', 'error');
            agregarLog('⚠️ Reconexión cancelada - Ya está conectado');
            return;
        }
    } catch (e) { }

    if (!confirm('¿Forzar una nueva conexión? Esto puede ayudar si el QR no aparece.')) return;

    try {
        mostrarAlerta('Forzando reconexión...', 'info');
        agregarLog('Solicitando reconexión al servidor...');

        const response = await fetch(`${API_URL}/force-reconnect`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.connected) {
            mostrarAlerta('❌ Ya estás conectado a WhatsApp.', 'error');
            agregarLog('⚠️ Ya conectado - No se generó nuevo QR');
            return;
        }

        mostrarAlerta('✅ Reconexión iniciada. El QR aparecerá en unos segundos.', 'success');
        agregarLog('✅ Reconexión forzada');

        document.getElementById('qrcode').innerHTML = '<div class="qr-placeholder">⏳ Generando QR...</div>';

        let contador = 0;
        const intervalo = setInterval(() => {
            obtenerQR();
            contador++;
            if (contador >= 10) clearInterval(intervalo);
        }, 1000);

    } catch (error) {
        mostrarAlerta('Error al forzar reconexión', 'error');
        agregarLog('❌ Error: ' + error.message);
    }
}

/**
 * Cierra la sesión actual de WhatsApp
 */
async function cerrarSesion() {
    if (!confirm('¿Cerrar la sesión actual de WhatsApp?')) return;

    try {
        mostrarAlerta('Cerrando sesión...', 'info');
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST'
        });
        const data = await response.json();

        mostrarAlerta('✅ Sesión cerrada. Generando nuevo QR en 2 segundos...', 'success');
        agregarLog('Sesión cerrada - Esperando nuevo QR');

        setTimeout(() => {
            obtenerQR();
            actualizarEstado();
        }, 3000);
    } catch (error) {
        mostrarAlerta('Error al cerrar sesión', 'error');
        agregarLog('❌ Error: ' + error.message);
    }
}

/**
 * Limpia la sesión y permite conectar otro WhatsApp
 */
async function limpiarSesion() {
    if (!confirm('⚠️ Esto eliminará la sesión actual y permitirá conectar otro WhatsApp. ¿Continuar?')) return;

    try {
        mostrarAlerta('Limpiando sesión...', 'info');
        agregarLog('Limpiando sesión actual...');

        const response = await fetch(`${API_URL}/clear-session`, {
            method: 'POST'
        });
        const data = await response.json();

        mostrarAlerta('✅ ' + data.message, 'success');
        agregarLog('✅ Sesión limpiada - Generando nuevo QR');

        document.getElementById('qrcode').innerHTML = '<div class="qr-placeholder">⏳ Generando nuevo QR...</div>';

        let intentos = 0;
        const intervalo = setInterval(() => {
            obtenerQR();
            actualizarEstado();
            intentos++;

            if (intentos >= 10) {
                clearInterval(intervalo);
            }
        }, 1000);

    } catch (error) {
        mostrarAlerta('Error al limpiar sesión', 'error');
        agregarLog('❌ Error: ' + error.message);
    }
}
