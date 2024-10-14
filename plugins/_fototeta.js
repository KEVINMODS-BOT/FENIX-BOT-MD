import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const ruletaresultado = "https://qu.ax/jckNR.jpg";

    let amount = parseInt(args[0]);
    let color = args[1]?.toLowerCase();
    if (!amount || !color) throw `Error, ingresa el monto y el color para apostar. Ejemplo: ${usedPrefix}ruletaf 10 negro`;

    let user = global.db.data.users[m.sender];

    if (isNaN(amount) || amount < 10) throw `Para jugar tienes que apostar un mínimo de 10 fuegos.`;
    if (user.fuegos < amount) throw `¡No tienes suficientes *fuegos 🔥* para apostar! Tienes ${user.fuegos} pero necesitas al menos ${amount} fuegos.`;

    // Colores disponibles
    const colors = ['negro', 'rojo'];
    if (!colors.includes(color)) throw `Error, elige un color válido: negro o rojo.`;

    // Simular la ruleta
    const ruletaColor = colors[Math.floor(Math.random() * colors.length)];

    let resultMessage = `*🎡 ¡Girando la ruleta! 🎡*\n`;
    if (color === ruletaColor) {
        let wonAmount = amount; // El usuario gana lo mismo que apostó
        user.fuegos += wonAmount; // Gana la cantidad apostada
        resultMessage += `*¡La ruleta cayó en ${ruletaColor} y apostaste a ${color}!* \n\n *¡Ganaste ${wonAmount} fuegos! 🔥*\n\n` +
                         `*Ahora tienes ${user.fuegos} fuegos.*`;
    } else {
        user.fuegos -= amount;
        resultMessage += `*La ruleta cayó en ${ruletaColor} y apostaste a ${color}.* \n\n *Perdiste ${amount} fuegos. 😢*\n\n` +
                         `*Ahora tienes ${user.fuegos} fuegos.*`;
    }

    conn.sendMessage(m.chat, { image: { url: ruletaresultado }, caption: resultMessage }, { quoted: m });
};

handler.help = ['ruletafuego apuesta'];
handler.tags = ['game'];
handler.command = ['ruletafuego'];

export default handler;
