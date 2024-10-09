let handler = async (m, { conn }) => {
    const chat = await conn.getChat(m.chat);
    const previousPicture = chat.picture; // Obtener la foto de perfil anterior
    const previousName = chat.name; // Obtener el nombre anterior
    const previousDesc = chat.desc; // Obtener la descripción anterior
    const groupStatus = chat.isGroup ? 'Grupo' : 'Chat privado'; // Verifica si es grupo

    // Si se ha cambiado la foto de perfil
    if (m.action === 'setProfile') {
        conn.reply(m.chat, `📸 *${m.sender}* ha cambiado la foto de perfil del grupo.`, m);
    }
    
    // Si se ha cambiado el nombre del grupo
    if (m.action === 'setGroupSubject') {
        conn.reply(m.chat, `📝 *${m.sender}* ha cambiado el nombre del grupo de *${previousName}* a *${m.subject}*.`, m);
    }

    // Si se ha cambiado la descripción del grupo
    if (m.action === 'setGroupDescription') {
        conn.reply(m.chat, `📜 *${m.sender}* ha cambiado la descripción del grupo.`, m);
    }

    // Si el grupo se ha cerrado o abierto
    if (m.action === 'groupClosed') {
        conn.reply(m.chat, `🔒 *${m.sender}* ha cerrado el grupo.`, m);
    } else if (m.action === 'groupOpen') {
        conn.reply(m.chat, `🔓 *${m.sender}* ha abierto el grupo.`, m);
    }
}

// Escuchar los cambios en el grupo
handler.command = /^(setProfile|setGroupSubject|setGroupDescription|groupClosed|groupOpen)$/i;
handler.group = true; // Solo para grupos
handler.desc = 'Notifica sobre cambios en el grupo';
handler.tags = ['group'];

export default handler;
