let handlerFuegocero = async (m, { conn }) => {
    let users = global.db.data.users;

    for (let user in users) {
        users[user].fuegos = 10; // Reiniciar los fuegos a 10
    }

    conn.reply(m.chat, `¡Todos los fuegos han sido reiniciados a 10! 🔥`, m);
};

// Registro del comando
handlerFuegocero.help = ['fuegocero'];
handlerFuegocero.tags = ['admin'];
handlerFuegocero.command = ['fuegocero']; // Comando para reiniciar fuegos

export default handlerFuegocero;
