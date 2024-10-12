import Starlights from "@StarlightsTeam/Scraper";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene al menos 1 fuego
    if (!user.fuegos || user.fuegos < 1) {
        return m.reply('*`No tienes suficientes fuegos para usar este comando.`*\n\n *`Necesitas al menos 1 fuego.`*', m);
    }

    if (!text) {
        return m.reply('🚩 Ingresa el nombre de la imagen que estás buscando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* Fenix Icons`);
    }

    const prohibited = [
        'caca', 'polla', 'porno', 'porn', 'gore', 'cum', 'semen', 'puta', 'puto', 'culo', 
        'putita', 'putito', 'pussy', 'hentai', 'pene', 'coño', 'asesinato', 'zoofilia', 
        'mia khalifa', 'desnudo', 'desnuda', 'cuca', 'chocha', 'muertos', 'pornhub', 
        'xnxx', 'xvideos', 'teta', 'vagina', 'marsha may', 'misha cross', 'sexmex', 
        'furry', 'furro', 'furra', 'xxx', 'rule34', 'panocha', 'pedofilia', 'necrofilia', 
        'pinga', 'horny', 'ass', 'nude', 'popo', 'nsfw', 'femdom', 'futanari', 'erofeet', 
        'sexo', 'sex', 'yuri', 'ero', 'ecchi', 'blowjob', 'anal', 'ahegao', 'pija', 
        'verga', 'trasero', 'violation', 'violacion', 'bdsm', 'cachonda', '+18', 'cp', 
        'mia marin', 'lana rhoades', 'cogiendo', 'cepesito', 'hot', 'buceta', 'xxx', 
        'rule', 'r u l e'
    ];
    
    // Verificar si la búsqueda contiene palabras prohibidas
    if (prohibited.some(word => text.toLowerCase().includes(word))) {
        return m.reply('Deja de buscar eso, puto enfermo de mierda, que por eso no tienes novia.').then(_ => m.react('✖️'));
    }

    await m.react('🕓');
    try {
        // Obtener la imagen de Google
        let { dl_url } = await Starlights.GoogleImage(text);
        
        // Enviar la imagen encontrada
        await conn.sendFile(m.chat, dl_url, 'thumbnail.jpg', `*» Resultado* : ${text}`, m, null);
        
        // Descontar 1 fuego al usuario
        user.fuegos -= 1;

        await m.react('✅');
    } catch {
        await m.react('✖️');
    }
};

handler.help = ['imagen *<búsqueda>*'];
handler.tags = ['img'];
handler.command = ['image', 'gimage', 'imagen'];
handler.register = true;

export default handler;
