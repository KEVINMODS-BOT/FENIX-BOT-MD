
let handler = async (m) => {
  // Obtener la cantidad de créditos del usuario
  let user = global.db.data.users[m.sender]
  let creditos = user.limit // Suponiendo que 'limit' almacena los créditos

  // Formato del mensaje
  let text = `╭──────༺♡༻──────╮\n\n` +
             `*TUS FENIXCOINS 🐦‍🔥*\n\n` +
             `➢ ${creditos} *FEIXCOINS🐦‍🔥*\n\n` +
             `╰──────༺♡༻──────╯`

  // Enviar el mensaje
  await conn.reply(m.chat, text, m)
}

handler.help = ['fenixcoins']
handler.tags = ['rpg']
handler.command = ['coins', 'fenix']

export default handler
