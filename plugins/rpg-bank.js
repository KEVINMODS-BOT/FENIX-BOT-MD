
// Handler para los comandos de banco
let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users[m.sender];

    // Comando .banco
    if (command === 'banco') {
        let saldoBanco = user.banco || 0;
        let depositos = user.depositos || 0;
        let retiros = user.retiros || 0;

        let mensaje = `*【 𝙱𝙰𝙽𝙲𝙾】*\n\n` +
                      `➢ *[👤] 𝚄𝚂𝚄𝙰𝚁𝙸𝙾:* @${m.sender.split('@')[0]}\n` +
                      `➢ *[💸] FENIXCOINS 🐦‍🔥* ${saldoBanco} créditos\n` +
                      `➢ *[🔰] DEPOSITOS::* ${depositos} veces\n` +
                      `➢ *[👁‍🗨] RETIROS:* ${retiros} veces`;

        // URL de la foto que quieres enviar
        let foto = 'https://qu.ax/RlCQE.jpg'; // Cambia esta URL a la foto deseada

        conn.sendFile(m.chat, foto, 'banco.jpg', mensaje, m);
    }

    // Comando .depositar
    else if (command === 'depositar') {
        if (!text || isNaN(text)) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <cantidad>`, m);
        
        let cantidad = parseInt(text);
        if (cantidad <= 0) return conn.reply(m.chat, 'La cantidad debe ser mayor que 0', m);
        
        if (user.limit < cantidad) return conn.reply(m.chat, 'No tienes suficientes créditos para depositar', m);
        
        user.limit -= cantidad;
        user.banco = (user.banco || 0) + cantidad;
        user.depositos = (user.depositos || 0) + 1;
        
        conn.reply(m.chat, `*Has depositado ${cantidad} créditos en tu banco*. Te quedan ${user.limit} créditos en tu perfil.\n\n .banco  para ver el banco `, m);
    }

    // Comando .retirar
    else if (command === 'retirar') {
        if (!text || isNaN(text)) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <cantidad>`, m);
        
        let cantidad = parseInt(text);
        if (cantidad <= 0) return conn.reply(m.chat, 'La cantidad debe ser mayor que 0', m);
        
        if ((user.banco || 0) < cantidad) return conn.reply(m.chat, 'No tienes suficientes créditos en tu banco', m);
        
        user.banco -= cantidad;
        user.limit += cantidad;
        user.retiros = (user.retiros || 0) + 1;
        
        conn.reply(m.chat, `*Has retirado ${cantidad} créditos de tu banco*. Te quedan ${user.limit} créditos en tu perfil.\n\n .banco para ver cuantos créditos tienes en el banco`, m);
    }
}

handler.help = ['banco', 'depositar', 'retirar']
handler.tags = ['econ']
handler.command = /^banco|depositar|retirar$/i
handler.group = true
handler.register = true

export default handler
