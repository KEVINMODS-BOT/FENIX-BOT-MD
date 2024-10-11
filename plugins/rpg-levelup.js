let handler = async (m, { conn, command, args, mentionedJid }) => {
    let user = global.db.data.users[m.sender];
    
    // Verifica que el usuario esté registrado
    if (!user || !user.registered) {
        conn.reply(m.chat, 'Debes estar registrado para usar este comando.', m);
        return;
    }

    let targetJid = mentionedJid[0]; // JID del usuario mencionado

    // Comando .banuser
    if (command === 'banuser') {
        if (!targetJid) {
            conn.reply(m.chat, 'Debes mencionar a un usuario para banear. Ejemplo: `.banuser @usuario`', m);
            return;
        }

        let targetUser = global.db.data.users[targetJid];
        if (!targetUser) {
            conn.reply(m.chat, 'El usuario mencionado no está registrado.', m);
            return;
        }

        // Marca al usuario como baneado
        targetUser.banned = true;

        conn.reply(m.chat, `¡El usuario ${await conn.getName(targetJid)} ha sido baneado!`, m);
    }

    // Comando .unbanuser
    if (command === 'unbanuser') {
        if (!targetJid) {
            conn.reply(m.chat, 'Debes mencionar a un usuario para desbanear. Ejemplo: `.unbanuser @usuario`', m);
            return;
        }

        let targetUser = global.db.data.users[targetJid];
        if (!targetUser) {
            conn.reply(m.chat, 'El usuario mencionado no está registrado.', m);
            return;
        }

        // Desmarca al usuario como baneado
        targetUser.banned = false;

        conn.reply(m.chat, `¡El usuario ${await conn.getName(targetJid)} ha sido desbaneado!`, m);
    }
};

// Intercepta todos los mensajes y verifica si el usuario está baneado
const messageInterceptor = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    // Si el usuario está baneado, el bot no le responde
    if (user && user.banned) {
        return; // No responde al usuario baneado
    }

    // El bot responde normalmente si no está baneado
    // Aquí puedes continuar con el procesamiento normal de mensajes...
};

handler.help = ['banuser @user', 'unbanuser @user'];
handler.tags = ['admin'];
handler.command = /^(banuser|unbanuser)$/i;
handler.admin = true;

export default handler;

// Registrar el interceptor
export const before = messageInterceptor;
