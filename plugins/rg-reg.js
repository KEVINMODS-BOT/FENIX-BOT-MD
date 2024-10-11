import { createHash } from 'crypto';
import fs from 'fs';
import fetch from 'node-fetch';

// RegEx para el registro
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

// Base de datos de países y prefijos
const countries = {
    '54': { name: 'Argentina', emoji: '🇦🇷' },
    '591': { name: 'Bolivia', emoji: '🇧🇴' },
    '55': { name: 'Brasil', emoji: '🇧🇷' },
    '56': { name: 'Chile', emoji: '🇨🇱' },
    '57': { name: 'Colombia', emoji: '🇨🇴' },
    '506': { name: 'Costa Rica', emoji: '🇨🇷' },
    '53': { name: 'Cuba', emoji: '🇨🇺' },
    '593': { name: 'Ecuador', emoji: '🇪🇨' },
    '503': { name: 'El Salvador', emoji: '🇸🇻' },
    '502': { name: 'Guatemala', emoji: '🇬🇹' },
    '504': { name: 'Honduras', emoji: '🇭🇳' },
    '52': { name: 'México', emoji: '🇲🇽' },
    '505': { name: 'Nicaragua', emoji: '🇳🇮' },
    '507': { name: 'Panamá', emoji: '🇵🇦' },
    '595': { name: 'Paraguay', emoji: '🇵🇾' },
    '51': { name: 'Perú', emoji: '🇵🇪' },
    '1': { name: 'Puerto Rico', emoji: '🇵🇷' },
    '598': { name: 'Uruguay', emoji: '🇺🇾' },
    '58': { name: 'Venezuela', emoji: '🇻🇪' },
    '1': { name: 'República Dominicana', emoji: '🇩🇴' },
    '1': { name: 'Haití', emoji: '🇭🇹' },
    '501': { name: 'Belice', emoji: '🇧🇿' },
    '592': { name: 'Guyana', emoji: '🇬🇾' },
    '597': { name: 'Surinam', emoji: '🇸🇷' },
    '1': { name: 'Jamaica', emoji: '🇯🇲' },
    '1': { name: 'Barbados', emoji: '🇧🇧' },
    '1': { name: 'Bahamas', emoji: '🇧🇸' },
    '1': { name: 'Trinidad y Tobago', emoji: '🇹🇹' },
    '1': { name: 'San Cristóbal y Nieves', emoji: '🇰🇳' },
    '1': { name: 'Santa Lucía', emoji: '🇱🇨' },
    '1': { name: 'San Vicente y las Granadinas', emoji: '🇻🇨' },
    '1': { name: 'Granada', emoji: '🇬🇩' },
    '1': { name: 'Antigua y Barbuda', emoji: '🇦🇬' },
    '1': { name: 'Dominica', emoji: '🇩🇲' },
    '1': { name: 'Anguila', emoji: '🇦🇮' },
    '1': { name: 'Islas Caimán', emoji: '🇰🇾' },
    '1': { name: 'Islas Vírgenes Británicas', emoji: '🇻🇬' },
    '1': { name: 'Montserrat', emoji: '🇲🇸' },
};

let handler = async function (m, { conn, text, usedPrefix, command }) {
    let user = global.db.data.users[m.sender];
    let name2 = conn.getName(m.sender);

    // Obtener el prefijo del número (los primeros 2-3 dígitos)
    let phoneNumber = m.sender.split('@')[0];  // Número del usuario sin el dominio
    let prefix = phoneNumber.slice(0, phoneNumber.length > 10 ? 2 : 1); // Detectar prefijo por longitud

    // Buscar el país por prefijo
    let countryInfo = countries[prefix] || { name: 'Desconocido', emoji: '🌍' };

    // Si se usa el comando de registro
    if (command === 'register' || command === 'reg' || command === 'verify') {
        // Verificar si el usuario ya está registrado
        if (user.registered === true) return m.reply(`🚩 Ya estás registrado.\n\n*¿Quiere volver a registrarse?*\n\nUse este comando para eliminar su registro.\n*${usedPrefix}unreg* <Número de serie>`);

        // Validar el formato de entrada
        if (!Reg.test(text)) return m.reply(`🚩 Formato incorrecto.\n\nUso del comando: *${usedPrefix + command} nombre.edad*\nEjemplo : *${usedPrefix + command} ${name2}.16*`);

        let [_, name, splitter, age] = text.match(Reg);

        // Validaciones
        if (!name) return m.reply('🚩 El nombre no puede estar vacío.');
        if (!age) return m.reply('🚩 La edad no puede estar vacía.');
        if (name.length >= 100) return m.reply('🚩 El nombre es demasiado largo.');
        
        age = parseInt(age);
        if (age > 100) return m.reply('👴🏻 Wow el abuelo quiere jugar al bot.');
        if (age < 5) return m.reply('🚼  hay un abuelo bebé jsjsj.');

        // Registro del usuario
        user.name = name.trim();
        user.age = age;
        user.regTime = +new Date();
        user.registered = true;

        // Generar número de serie
        // Generar número de serie
let sn = createHash('md5').update(m.sender).digest('hex');
let image = await (await fetch(`https://qu.ax/YzpzT.jpg`)).buffer(); // Cambia por la URL de tu imagen

// Mensaje de registro
let txt = '*`R E G I S T R O - F E N I X`* \n\n';
txt += `*REGISTRO DE @${name}*\n\n`;
txt += `*[🐦‍🔥] ➢ NOMBRE:*  ${name}\n\n`;
txt += `*[🐦‍🔥] ➢ EDAD:*  ${age} años\n\n`;
txt += `*[🐦‍🔥] ➢ PAÍS:*  ${countryInfo.name} ${countryInfo.emoji}\n\n`;
txt += `*[🐦‍🔥] ➢ NUMERO DE SERIE:*\n`;
txt += `${sn}\n\n\n`;
txt += `> *YA SE ENCUENTRA REGISTRADO EN MI BASE DE DATOS*`;

// Enviar la imagen junto con el texto
await conn.sendMessage(m.chat, { image: image, caption: txt });
await m.react('✅');
    }

    // Si se usa el comando de mostrar usuarios
    else if (command === 'usuarios') {
        try {
            // Contar usuarios registrados
            let totalRegistered = Object.values(global.db.data.users).filter(user => user.registered).length;

            // Información de los usuarios
            let info = `
╔══════════════════════════╗
║   𝕌𝕤𝕦𝕒𝕣𝕚𝕠𝕤 ℝ𝕖𝕘𝕚𝕤𝕥𝕣𝕒𝕕𝕠𝕤  ║
╠══════════════════════════╣
║      𝕌𝕤𝕦𝕒𝕣𝕚𝕠𝕤 🟢 : ${totalRegistered}      ║
╚══════════════════════════╝
            `;

            // Enviar mensaje con el número de usuarios registrados
            await conn.sendMessage(m.chat, { text: info });
        } catch (err) {
            console.error('Error al mostrar usuarios registrados:', err);
            conn.reply(m.chat, 'Hubo un error al mostrar los usuarios registrados.', m);
        }
    }
}

// Comandos de manejo
handler.help = ['reg'].map(v => v + ' *<nombre.edad>*');
handler.tags = ['rg'];
handler.command = ['verify', 'reg', 'register', 'registrar', 'usuarios']; // Aquí se incluye el comando 'usuarios'

export default handler;
