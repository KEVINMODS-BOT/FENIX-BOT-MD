let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Lista global de animales en venta (la que veremos en la tienda)
        global.animalesEnVenta = global.animalesEnVenta || [];

        // Comando para cazar animales mitológicos
        if (command === 'magicaventur') {
            let animalesMitologicos = [
                { nombre: "Dragón", imagen: "https://qu.ax/xXObC.jpg" },
                { nombre: "Fénix", imagen: "https://qu.ax/wTAHK.jpg" },
                { nombre: "Grifo", imagen: "https://qu.ax/ppmYX.jpg" },
                { nombre: "Unicornio", imagen: "https://qu.ax/TQcok.jpg" },
                { nombre: "Minotauro", imagen: "https://qu.ax/dZRLq.jpg" },
                { nombre: "Hidra", imagen: "https://qu.ax/ejQbH.jpg" },
                { nombre: "Cíclope", imagen: "https://qu.ax/WLjAz.jpg" },
                { nombre: "Quimera", imagen: "https://qu.ax/tKzKn.jpg" },
                { nombre: "Sirena", imagen: "https://qu.ax/HQjBt.jpg" },
                { nombre: "Pegaso", imagen: "https://qu.ax/ovonj.jpg" },
                { nombre: "Basilisco", imagen: "https://qu.ax/TkBRb.jpg" },
                { nombre: "Leviatán", imagen: "https://qu.ax/mieQx.jpg" },
                { nombre: "Kraken", imagen: "https://qu.ax/HHXFY.jpg" },
            ];

            // Determinar si el usuario caza un animal (probabilidad ajustada de éxito)
            let cazaExitosa = Math.random() < 0.1; // Ahora hay un 10% de probabilidad de cazar un animal

            if (!cazaExitosa) {
                conn.reply(m.chat, 'No has tenido suerte esta vez, intenta de nuevo más tarde.', m);
                return;
            }

            // Filtrar animales que el usuario ya posee
            let animalesDisponibles = animalesMitologicos.filter(animal => !user.animalesMitologicos?.some(a => a.nombre === animal.nombre));

            if (animalesDisponibles.length === 0) {
                conn.reply(m.chat, '¡Ya has cazado todos los animales mitológicos disponibles!', m);
                return;
            }

            // Selección aleatoria de un animal mitológico no repetido
            let animal = animalesDisponibles[Math.floor(Math.random() * animalesDisponibles.length)];

            user.animalesMitologicos = user.animalesMitologicos || [];
            user.animalesMitologicos.push(animal);

            conn.sendFile(m.chat, animal.imagen, 'animal.jpg', `¡HAZ CAZADO UN ANIMAL MITOLÓGICO! ☛ ${animal.nombre} ☚ \n\nUsa .tienda para ver los seres mitológicos a la venta.`, m);
        }

        // Comando para mostrar los animales a la venta y los del usuario
        if (command === 'tienda') {
            let ventaList = global.animalesEnVenta.map((animal, i) => `${i + 1}. ${animal.nombre} - ${animal.precio} Fenixcoins`).join('\n');
            let animalesUsuario = user.animalesMitologicos && user.animalesMitologicos.length > 0
                ? user.animalesMitologicos.map((animal, i) => `${i + 1}. ${animal.nombre}`).join('\n')
                : 'No tienes animales. Caza uno con `.magicaventur`.';

            let mensaje = `
*ANIMALES A LA VENTA:*
${ventaList.length > 0 ? ventaList : 'No hay animales a la venta en este momento.'}

Usa \`.comprar[número]\` para comprar un animal.

*TUS ANIMALES:*
${animalesUsuario}

Usa \`.vender[número]\` para vender uno de tus animales.
            `;

            // Imagen de la tienda (puedes usar cualquier URL de imagen)
            let imagenTienda = 'https://qu.ax/rvElh.jpg'; // Cambia la URL a la imagen que prefieras
            conn.sendFile(m.chat, imagenTienda, 'tienda.jpg', mensaje, m);
        }

        // Comando para comprar un animal de la tienda
        if (command.startsWith('comprar') && command.length > 7) {
            let compraIndex = parseInt(command.slice(7)) - 1;

            if (compraIndex < 0 || compraIndex >= global.animalesEnVenta.length) {
                conn.reply(m.chat, 'Elige un animal válido para comprar.', m);
                return;
            }

            let animalComprado = global.animalesEnVenta[compraIndex];

            // Verificar si el usuario tiene suficientes Fenixcoins para comprar el animal
            if (user.limit < animalComprado.precio) {
                conn.reply(m.chat, `No tienes suficientes Fenixcoins para comprar un ${animalComprado.nombre}. Necesitas ${animalComprado.precio} Fenixcoins.`, m);
                return;
            }

            user.limit -= animalComprado.precio;
            user.animalesMitologicos.push({ nombre: animalComprado.nombre, imagen: animalComprado.imagen });
            global.animalesEnVenta.splice(compraIndex, 1); // Eliminar el animal de la lista de venta

            conn.reply(m.chat, `¡Has comprado un ${animalComprado.nombre} por ${animalComprado.precio} Fenixcoins!`, m);
        }

        // Comando para vender un animal del usuario
        if (command.startsWith('vender') && command.length > 6) {
            let ventaIndex = parseInt(command.slice(6)) - 1;

            if (!user.animalesMitologicos || user.animalesMitologicos.length === 0) {
                conn.reply(m.chat, 'No tienes animales para vender.', m);
                return;
            }

            if (ventaIndex < 0 || ventaIndex >= user.animalesMitologicos.length) {
                conn.reply(m.chat, 'Elige un animal válido para vender.', m);
                return;
            }

            let animalVendido = user.animalesMitologicos.splice(ventaIndex, 1)[0];

            // Verificar si el animal ya está en venta
            if (global.animalesEnVenta.some(a => a.nombre === animalVendido.nombre)) {
                conn.reply(m.chat, `Ya hay un ${animalVendido.nombre} a la venta, no puedes venderlo de nuevo.`, m);
                return;
            }

            let precioVenta = obtenerPrecioAnimal(); // Precio aleatorio de venta
            global.animalesEnVenta.push({ nombre: animalVendido.nombre, imagen: animalVendido.imagen, precio: precioVenta });

            user.limit += precioVenta;
            conn.reply(m.chat, `¡Has vendido el ${animalVendido.nombre} por ${precioVenta} Fenixcoins! Ahora está disponible en la tienda.`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

// Función para obtener un precio aleatorio para vender los animales mitológicos
function obtenerPrecioAnimal() {
    const precios = [150, 200, 250, 300];
    return precios[Math.floor(Math.random() * precios.length)];
}

handler.help = ['magicaventur', 'tienda', 'comprar[número]', 'vender[número]'];
handler.tags = ['adventure', 'econ'];
handler.command = /^(magicaventur|tienda|comprar\d+|vender\d+)$/i;
handler.register = true;

export default handler;
