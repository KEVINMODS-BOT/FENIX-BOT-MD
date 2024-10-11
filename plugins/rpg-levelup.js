let handler = async (m, { conn, command, args, mentionedJid }) => {
    let user = global.db.data.users[m.sender];

    if (!user || !user.registered) {
        conn.reply(m.chat, 'Debes estar registrado para usar este comando.', m);
        return;
    }

    if (command === 'banuser') {
        let targetJid = mentionedJid[0];
        if (!targetJid) {
            conn.reply(m.chat, 'Debes mencionar a un usuario para banear. Ejemplo: `.banuser @usuario`', m);
            return;
        }

        let targetUser = global.db.data.users[targetJid];
        if (!targetUser) {
            conn.reply(m.chat, 'El usuario mencionado no está registrado.', m);
            return;
        }

        targetUser.banned = true; // Banea al usuario
        conn.reply(m.chat, `¡El usuario ${await conn.getName(targetJid)} ha sido baneado!`, m);
    }

    if (command === 'unbanuser') {
        let targetJid = mentionedJid[0];
        if (!targetJid) {
            conn.reply(m.chat, 'Debes mencionar a un usuario para desbanear. Ejemplo: `.unbanuser @usuario`', m);
            return;
        }

        let targetUser = global.db.data.users[targetJid];
        if (!targetUser) {
            conn.reply(m.chat, 'El usuario mencionado no está registrado.', m);
            return;
        }

        targetUser.banned = false; // Desbanea al usuario
        conn.reply(m.chat, `¡El usuario ${await conn.getName(targetJid)} ha sido desbaneado!`, m);
    }
};

// Interceptor que evita que el bot responda a usuarios baneados
const messageInterceptor = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    // Si el usuario está baneado, no respondas a sus mensajes
    if (user && user.banned) {
        return; // No responde al usuario baneado
    }

    // Procesar el mensaje normalmente si no está baneado
    if (m.text.startsWith('.')) { // Esto se asegura de que solo responda a comandos
        let args = m.text.slice(1).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        // Aquí puedes llamar al handler con los argumentos
        await handler(m, { conn, command, args, mentionedJid: m.mentionedJid });
    }
};

// Comandos disponibles
handler.help = ['banuser @user', 'unbanuser @user'];
handler.tags = ['admin'];
handler.command = /^(banuser|unbanuser)$/i;
handler.admin = true; // Solo administradores pueden usar estos comandos

// Exportar el interceptor
export const before = messageInterceptor;
export default handler;
