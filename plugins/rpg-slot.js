let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let user = global.db.data.users[m.sender];
        const cooldown = 60 * 1000; 
        const ahora = new Date().getTime();

     
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

      
        if (user.lastSlot && (ahora - user.lastSlot) < cooldown) {
            let tiempoRestante = Math.ceil((cooldown - (ahora - user.lastSlot)) / 1000);
            conn.reply(m.chat, `*SPAM: ESPERA ${tiempoRestante} SEGUNDOS PARA USAR ESTE COMANDO DE NUEVO*`, m);
            return;
        }

    
        user.lastSlot = ahora;

        
        const animales = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐦‍🔥'];

      
        let resultado = [
            [animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)]],
            [animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)]],
            [animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)], animales[Math.floor(Math.random() * animales.length)]]
        ];

      
        let mensajeResultado = `.bienvenido *@${m.sender.split('@')[0]}* al juego de slot\n\nAquí el resultado:\n\n` +
            `${resultado[0].join(' | ')}\n${resultado[1].join(' | ')}\n${resultado[2].join(' | ')}`;

       
        let premio;
        let probabilidadDePremioMayor = Math.random(); 
        let probabilidadGeneral = Math.random(); 

        if (probabilidadDePremioMayor < 0.25 && resultado[1][0] === '🐦‍🔥' && resultado[1][1] === '🐦‍🔥' && resultado[1][2] === '🐦‍🔥') {
         
            premio = 30;
            user.limit += premio;
            mensajeResultado += `\n\n🎉 ¡FELICIDADES! Has conseguido tres 🐦‍🔥 en línea y ganas ${premio} Fenixcoins. 🎉`;
        } else if (probabilidadGeneral < 0.5) {
            
            premio = Math.floor(Math.random() * 6) + 1;
            user.limit += premio;
            mensajeResultado += `\n\n🎉 ¡Ganaste ${premio} Fenixcoins con tres ${resultado[1][0]} en línea! 🎉`;
        } else {
         
            premio = -(Math.floor(Math.random() * 6) + 5);
            user.limit += premio;
            mensajeResultado += `\n\n😢 Has perdido ${-premio} Fenixcoins. Mejor suerte la próxima vez.`;
        }

      
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
