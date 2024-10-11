let handler = async (m, { conn }) => {

    let chat = await conn.groupMetadata(m.chat);
    let groupName = chat.subject;
    let groupDesc = chat.desc;
    let participants = chat.participants.length;
    let owner = chat.owner ? '@' + chat.owner.split('@')[0] : 'Desconocido';
    let groupCreation = new Date(chat.creation * 1000).toLocaleString("es-ES", { timeZone: "UTC", hour12: false }); 

    let botIsAdmin = chat.participants.find(p => p.id === conn.user.jid)?.admin;
    let groupInviteCode;
    let groupLink;

    if (botIsAdmin) {

        groupInviteCode = await conn.groupInviteCode(m.chat);
        groupLink = `https://chat.whatsapp.com/${groupInviteCode}`;
    } else {
        groupLink = 'El bot no es administrador';
    }


    let groupPic;
    try {
        groupPic = await conn.profilePictureUrl(m.chat, 'image');
    } catch (e) {
        groupPic = 'https://qu.ax/YzpzT.jpg';
    }


    let admins = chat.participants.filter(p => p.admin).map(p => '@' + p.id.split('@')[0]);
    let adminList = admins.length > 0 ? admins.join('\n') : 'Sin administradores';

  
    let info = `
*🔹 Información del Grupo 🔹*

➤ *Nombre del Grupo:* ${groupName}

➤ *Descripción:* ${groupDesc || 'Sin descripción'}

➤ *Número de Participantes:* ${participants}

➤ *Creador del Grupo:* ${owner}

➤ *Administradores del Grupo:* 
${adminList}

➤ *Fecha de Creación:* ${groupCreation}

➤ *Enlace del Grupo:* ${groupLink}
    `;

 
    conn.sendFile(m.chat, groupPic, 'group.jpg', info, m, { mentions: [chat.owner, ...admins] });
};

handler.help = ['infogrupo'];
handler.tags = ['group'];
handler.command = /^infogrupo$/i;
handler.group = true; 
handler.admin = false; 

export default handler;
