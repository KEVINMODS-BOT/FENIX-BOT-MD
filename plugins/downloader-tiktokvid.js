import Starlights from '@StarlightsTeam/Scraper'

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
  let user = global.db.data.users[m.sender];

  // Verificar si el usuario tiene al menos 2 fuegos
  if (user.fuegos < 2) {
    return conn.reply(m.chat, '*`No tienes suficientes fuegos 🔥 para usar este comando.`*\n\n *`Necesitas 2 fuegos.`*', m);
  }

  if (!text) return conn.reply(m.chat, '🚩 Ingresa un texto junto al comando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* Ai Hoshino Edit`, m, rcanal);
  
  await m.react('🕓');

  try {
    let { title, author, duration, views, likes, comments_count, share_count, download_count, published, dl_url } = await Starlights.tiktokvid(text);

    let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
    txt += `*➢ Título* : ${title}\n`;
    txt += `*➢ Autor* : ${author}\n`;
    txt += `*➢ Duración* : ${duration} segundos\n`;
    txt += `*➢ Vistas* : ${views}\n`;
    txt += `*➢ Likes* : ${likes}\n`;
    txt += `*➢ Comentarios* : ${comments_count}\n\n`;
    txt += `> *Haz gastado 2 fuegos 🔥*`;

    // Descontar 2 fuegos al usuario
    user.fuegos -= 2;

    await conn.sendFile(m.chat, dl_url, `thumbnail.mp4`, txt, m);
    await m.react('✅');

  } catch {
    await m.react('✖️');
  }
}

handler.help = ['tiktokvid *<búsqueda>*'];
handler.tags = ['downloader'];
handler.command = ['ttvid', 'tiktokvid'];
handler.register = true;

export default handler;
