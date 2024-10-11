
let handler = async (m) => {

  let user = global.db.data.users[m.sender]
  let creditos = user.limit 


  let text = `╭──────༺♡༻──────╮\n\n` +
             `*TUS FENIXCOINS 🐦‍🔥*\n\n` +
             `➢ ${creditos} *FEIXCOINS🐦‍🔥*\n\n` +
             `╰──────༺♡༻──────╯`

  await conn.reply(m.chat, text, m)
}

handler.help = ['fenixcoins']
handler.tags = ['rpg']
handler.command = ['coins', 'fenix']

export default handler
