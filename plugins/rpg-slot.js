let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let user = global.db.data.users[m.sender];
        const cooldown = 60 * 1000; // 1 minuto en milisegundos
        const ahora = new Date().getTime();

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Verificar si ha pasado suficiente tiempo desde el último uso del comando
        if (user.lastSlot && (ahora - user.lastSlot) < cooldown) {
            let tiempoRestante = Math.ceil((cooldown - (ahora - user.lastSlot)) / 1000); // Tiempo restante en segundos
            conn.reply(m.chat, `*SPAM: ESPERA ${tiempoRestante} SEGUNDOS PARA USAR ESTE COMANDO DE NUEVO*`, m);
            return;
        }

        // Actualizar el último uso del comando
        user.lastSlot = ahora;

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
        let probabilidadDePremioMayor = Math.random(); // Probabilidad del premio mayor
        let probabilidadGeneral = Math.random(); // Probabilidad de ganar o perder

        if (probabilidadDePremioMayor < 0.25 && resultado[1][0] === '🐦‍🔥' && resultado[1][1] === '🐦‍🔥' && resultado[1][2] === '🐦‍🔥') {
            // 25% de probabilidad y tres 🐦‍🔥 en la fila del medio: Premio mayor
            premio = 30;
            user.limit += premio;
            mensajeResultado += `\n\n🎉 ¡FELICIDADES! Has conseguido tres 🐦‍🔥 en línea y ganas ${premio} Fenixcoins. 🎉`;
        } else if (probabilidadGeneral < 0.5) {
            // 50% de probabilidad de ganar, premio entre 1 y 6 Fenixcoins
            premio = Math.floor(Math.random() * 6) + 1;
            user.limit += premio;
            mensajeResultado += `\n\n🎉 ¡Ganaste ${premio} Fenixcoins con tres ${resultado[1][0]} en línea! 🎉`;
        } else {
            // 50% de probabilidad de perder, pérdida entre 5 y 10 Fenixcoins
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
