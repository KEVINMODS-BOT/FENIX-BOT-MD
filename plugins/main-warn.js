let handler = async (m, { conn, usedPrefix, command, text, isAdmin, isBotAdmin }) => {
  if (!isBotAdmin) {
    return conn.reply(m.chat, '❌ El bot necesita ser administrador para usar este comando.', m);
  }

  if (!isAdmin) {
    return conn.reply(m.chat, '❌ Solo los administradores del grupo pueden usar este comando.', m);
  }

  // Asegúrate de que haya un usuario mencionado
  let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
  if (!mentionedJid) {
    return conn.reply(m.chat, `*[⚠️]* Usa el comando correctamente: *${usedPrefix}warn @usuario*`, m);
  }

  // Si el usuario no está registrado en la base de datos, agregarlo
  let user = global.db.data.users[mentionedJid];
  if (!user) {
    global.db.data.users[mentionedJid] = { warnings: 0 }; // Inicializar el usuario si no existe
  }

  // Incrementar advertencias del usuario
  user.warnings = (user.warnings || 0) + 1;

  // Si tiene 3 advertencias, eliminarlo del grupo
  if (user.warnings >= 3) {
    await conn.reply(m.chat, `⚠️ El usuario @${mentionedJid.split('@')[0]} ha recibido 3 advertencias y será eliminado del grupo.`, m, {
      mentions: [mentionedJid]
    });
    await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove');
    user.warnings = 0; // Restablecer advertencias después de ser expulsado
  } else {
    await conn.reply(m.chat, `⚠️ El usuario @${mentionedJid.split('@')[0]} ha sido advertido. Advertencias actuales: ${user.warnings}/3`, m, {
      mentions: [mentionedJid]
    });
  }
}

handler.help = ['warn @usuario'];
handler.tags = ['admin'];
handler.command = /^warn$/i;
handler.group = true; // Solo funciona en grupos
handler.admin = true; // Solo los administradores pueden usar este comando

export default handler;
