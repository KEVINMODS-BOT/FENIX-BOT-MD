let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const ruletaresultado = "https://qu.ax/jckNR.jpg";

    let amount = parseInt(args[0]);
    if (!amount) throw `Error, ingresa el monto para apostar. Ejemplo: ${usedPrefix}ruleta 10`;

    let user = global.db.data.users[m.sender];

    if (isNaN(amount) || amount < 10) throw `Para jugar tienes que apostar un mínimo de 10 fuegos.`;
    if (user.fuegos < amount) throw `¡No tienes suficientes *fuegos 🔥* para apostar! Tienes ${user.fuegos} pero necesitas al menos ${amount} fuegos.`;

    // Distribución de la ruleta con diferentes resultados
    const outcomes = [
        { result: "Multiplicador x2", multiplier: 2 },
        { result: "Multiplicador x5", multiplier: 5 },
        { result: "Pierde todo", multiplier: 0 },
        { result: "Premio especial", bonus: 50 },
        { result: "Premio sorpresa", bonus: 30 }
    ];

    // Girar la ruleta para obtener el resultado
    let randomIndex = Math.floor(Math.random() * outcomes.length);
    let outcome = outcomes[randomIndex];

    let resultMessage = `🎡 ¡Girando la ruleta! 🎡\n`;
    if (outcome.multiplier) {
        let wonAmount = amount * outcome.multiplier;
        user.fuegos += wonAmount - amount; // Se suma la ganancia neta
        resultMessage += `La ruleta cayó en **${outcome.result}**. ¡Ganaste ${wonAmount} fuegos! 🔥\n` +
                         `Ahora tienes ${user.fuegos} fuegos.`;
    } else if (outcome.bonus) {
        user.fuegos += outcome.bonus;
        resultMessage += `¡Felicidades! La ruleta cayó en **${outcome.result}**. Ganaste un bono de ${outcome.bonus} fuegos. 🔥\n` +
                         `Ahora tienes ${user.fuegos} fuegos.`;
    } else {
        user.fuegos -= amount;
        resultMessage += `La ruleta cayó en **Pierde todo**. Perdiste tus ${amount} fuegos. 😢\n` +
                         `Ahora tienes ${user.fuegos} fuegos.`;
    }

    conn.sendMessage(m.chat, { image: { url: ruletaresultado }, caption: resultMessage }, { quoted: m });
};

handler.help = ['suerte apuesta'];
handler.tags = ['game'];
handler.command = ['ruleta', 'ruleta'];

export default handler;
