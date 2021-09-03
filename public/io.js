const socket = io.connect();

let form = document.getElementById('contact-form');
let nombre = document.getElementById('nombre');
let mensaje = document.getElementById('mensaje');
var messagesList = document.getElementById('messagesList');


form.addEventListener('submit', e => {
    e.preventDefault();

    const messageToSend = {
        nombre : nombre.value,
        mensaje : mensaje.value
    }

    if (messageToSend) {
        socket.emit('newMessage', messageToSend);
    }

});

socket.on('mensajes', (mensajes)=>{

    const html = listaMensajes(JSON.parse(mensajes));

    document.getElementById('messagesList').innerHTML = html;

})

const listaMensajes = mensajes => mensajes.map( msg =>
    `
        <div>
            <b style="color:blue;">${msg.nombre}</b>
            [<span style="color:brown;">${msg.fecha}</span>] :
            <i style="color:green;">${msg.mensaje}</i>
        </div>
    `
    ).join(' ')


