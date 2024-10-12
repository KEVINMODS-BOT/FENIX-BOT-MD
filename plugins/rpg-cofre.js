let handler = async (m, { conn }) => {
    // Verifica si el usuario tiene un tiempo de espera activo
    let user = global.db.data.users[m.sender];
    let tiempoActual = new Date().getTime();
    let tiempoRestante = user.lastCofre ? (user.lastCofre + 2 * 60 * 60 * 1000) - tiempoActual : 0; // 2 horas en milisegundos

    if (tiempoRestante > 0) {
        let segundosRestantes = Math.floor(tiempoRestante / 1000);
        let minutosRestantes = Math.floor(segundosRestantes / 60);
        let horasRestantes = Math.floor(minutosRestantes / 60);
        segundosRestantes = segundosRestantes % 60;
        minutosRestantes = minutosRestantes % 60;

        return conn.reply(m.chat, `Debes esperar ${horasRestantes}h ${minutosRestantes}m ${segundosRestantes}s antes de abrir otro cofre.`, m);
    }

    // Generar una cantidad aleatoria de fenixcoins y fuegos
    let fenixcoins = Math.floor(Math.random() * 11) + 10; // Entre 10 y 20 fenixcoins
    let fuegos = Math.floor(Math.random() * 16) + 15; // Entre 15 y 30 fuegos

    // Actualizar las monedas del usuario
    user.limit += fenixcoins;  // Fenixcoins
    user.fuegos = (user.fuegos || 0) + fuegos;  // Fuegos

    // Formatear el tiempo de espera para el mensaje
    let siguienteCofre = new Date(tiempoActual + 2 * 60 * 60 * 1000);
    let hora = siguienteCofre.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Crear el mensaje de respuesta
    let mensaje = `*COFRE RECLAMADO*\n\n*➥ [🐦‍🔥] Fenixcoins:* ${fenixcoins}\n\n*➥ [🔥] Fuegos:* ${fuegos}\n\n> Vuelve a las ${hora} para reclamar otro cofre`;

    // Enviar el mensaje con la imagen
    await conn.sendFile(m.chat, 'https://qu.ax/yesav.jpg', 'cofre.jpg', mensaje, m);

    // Actualizar el tiempo de la última apertura del cofre
    user.lastCofre = tiempoActual;
}

handler.help = ['cofre'];
handler.tags = ['game'];
handler.command = /^cofre$/i;
handler.register = true;

export default handler;
