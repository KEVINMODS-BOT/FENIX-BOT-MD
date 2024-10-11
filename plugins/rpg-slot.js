let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let user = global.db.data.users[m.sender];

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Animales para el juego de slots
        const animales = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐦‍🔥'];

        // Realizar el giro del slot (tres filas de tres animales cada uno)
        let resultado = [
            [animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)]],
            [animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)]],
            [animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)]]
        ];

        // Mostrar mensaje de bienvenida al juego y el resultado
        let mensajeResultado = `.bienvenido *@${m.sender.split('@')[0]}* al juego de slot\n\nAquí el resultado:\n\n` +
            `${resultado[0].join(' | ')}\n${resultado[1].join(' | ')}\n${resultado[2].join(' | ')}`;

        // Evaluar si el jugador ha ganado o perdido
        let premio;
        let probabilidadDeGanar = Math.random(); // Probabilidad aleatoria de ganar o perder

        if (resultado[1][0] === '🐦‍🔥' && resultado[1][1] === '🐦‍🔥' && resultado[1][2] === '🐦‍🔥') {
            // Tres 🐦‍🔥 en la fila del medio: Premio mayor
            premio = 30;
            user.limit += premio;
            mensajeResultado += `\n\n🎉 ¡FELICIDADES! Has conseguido tres 🐦‍🔥 en línea y ganas ${premio} Fenixcoins. 🎉`;
        } else if (probabilidadDeGanar < 0.5) {
            // Probabilidad de ganar (50% de las veces), premio entre 1 y 6 Fenixcoins
            premio = Math.floor(Math.random() * 6) + 1;
            user.limit += premio;
            mensajeResultado += `\n\n🎉 ¡Ganaste ${premio} Fenixcoins con tres ${resultado[1][0]} en línea! 🎉`;
        } else {
            // Pérdida de Fenixcoins: entre 5 y 10 Fenixcoins
            premio = -(Math.floor(Math.random() * 6) + 5);
            user.limit += premio;
            mensajeResultado += `\n\n😢 Has perdido ${-premio} Fenixcoins. Mejor suerte la próxima vez.`;
        }

        // Enviar el mensaje con el resultado
        conn.reply(m.chat, mensajeResultado, m);

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

handler.help = ['slot'];
handler.tags = ['game', 'slot'];
handler.command = /^(slot)$/i;
handler.register = true;

export default handler;
