let handler = async (m) => {
  // Obtener el usuario de la base de datos
  let user = global.db.data.users[m.sender];
  
  // Obtener la cantidad de fuegos del usuario
  let fuegos = user.fuegos;

  // Crear el texto con el formato deseado
  let text = `╭──────༺🔥༻──────╮\n\n` +
             `*TUS FUEGOS 🔥*\n\n` +
             `➢ ${fuegos} *FUEGOS🔥*\n\n` +
             `╰──────༺🔥༻──────╯`;

  // Enviar el mensaje al chat
  await conn.reply(m.chat, text, m);
}

// Ayuda y etiquetas para el comando
handler.help = ['fuegos'];
handler.tags = ['rpg'];
handler.command = ['fuegos']; // Comando que se activará con '.fuegos'

export default handler;
