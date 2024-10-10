let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const ruletaresultado = "https://qu.ax/jckNR.jpg";

    let amount = parseInt(args[0]);
    let color = args[1]?.toLowerCase();
    if (args.length < 2 || !color) throw `Error, ingrese el monto y el color rojo o negro. ejemplo .ruleta 10 rojo `;
    
    let colores = ['rojo', 'negro'];
    let colour = colores[Math.floor(Math.random() * colores.length)];
    let user = global.db.data.users[m.sender];

    if (isNaN(amount) || amount < 10) throw `Para jugar tienes que apostar 10 fenixcoins.`;
    if (!colores.includes(color)) throw 'Debes escoger un color válido: rojo o negro';
    if (user.limit < amount) throw `¡No tienes suficientes *fenixcoins 🐦‍🔥* para apostar! Tienes ${user.limit} pero necesitas al menos ${amount} fenixcoins.`;

    // Obtener el multiplicador según el rango del usuario
    let multiplicador = 1;
    let rangoMensaje = '';
    if (user.rango) {
        switch (user.rango) {
            case 'bronce':
                multiplicador = 2;
                break;
            case 'plata':
                multiplicador = 3;
                break;
            case 'oro':
                multiplicador = 4;
                break;
            case 'diamante':
                multiplicador = 5;
                break;
            case 'maestro':
                multiplicador = 6;
                break;
            case 'leyenda':
                multiplicador = 7;
                break;
            default:
                multiplicador = 1;
        }
        rangoMensaje = `\n\n𝚃𝙸𝙴𝙽𝙴 𝚁𝙰𝙽𝙶𝙾: ${user.rango.charAt(0).toUpperCase() + user.rango.slice(1)}`;
    }

    let result = '';
    if (colour == color) {
        let amountWithMultiplier = amount * multiplicador;
        user.limit += amountWithMultiplier;
        result = `*[ 𝙿𝚁𝚄𝙴𝙱𝙰 𝚃𝚄 𝚂𝚄𝙴𝚁𝚃𝙴 ]*\n\n` +
                 `*𝙻𝙰 𝚁𝚄𝙻𝙴𝚃𝙰 𝙿𝙰𝚁𝙾 𝙴𝙽 𝙴𝙻 𝙲𝙾𝙻𝙾𝚁:* ${colour == 'rojo' ? '🔴' : '⚫'}${rangoMensaje}\n\n` +
                 `*𝚄𝚂𝚃𝙴𝙳 𝙶𝙰𝙽𝙾:* ${amountWithMultiplier} \n` +
                 `*fenixcoins 🐦‍🔥*: ${user.limit}`;
    } else {
        user.limit -= amount;
        result = `*[ 𝙿𝚁𝚄𝙴𝙱𝙰 𝚃𝚄 𝚂𝚄𝙴𝚁𝚃𝙴 ]*\n\n` +
                 `*𝙻𝙰 𝚁𝚄𝙻𝙴𝚃𝙰 𝙿𝙰𝚁𝙾 𝙴𝙽 𝙴𝙻 𝙲𝙾𝙻𝙾𝚁:* ${colour == 'rojo' ? '🔴' : '⚫'}\n\n` +
                 `*𝚄𝚂𝚃𝙴𝙳 𝙿𝙴𝚁𝙳𝙸𝙾:* ${amount} \n` +
                 `*fenixcoins 🐦‍🔥:* ${user.limit}`;
    }

    conn.sendMessage(m.chat, { image: { url: ruletaresultado }, caption: result }, { quoted: m });
};

handler.help = ['ruleta apuesta/color'];
handler.tags = ['game'];
handler.command = ['ruleta', 'rt'];

export default handler;
