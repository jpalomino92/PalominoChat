const express = require('express')
const emoji = require('node-emoji')
const router = express.Router()
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 8080

const Contenedor = require('./src/contenedor');
const contenedorMensajes = new Contenedor('./src/mensajes.json')

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static(__dirname));

app.use('/api/productos',router)

server.listen(port , ()=>{
    console.log(`Server activo en http://localhost:${port}`)
})

app.get('/', (req,res) =>{
    res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', async (socket) => {

    console.log(emoji.get('fire'), 'Bienvenidos al chat')

    const messages = await contenedorMensajes.getAll();

    socket.emit('mensajes', messages);

    socket.on('disconnect', () => {
        console.log(emoji.get('raised_hand_with_fingers_splayed'), ' user disconnected');
        
    });

  socket.on('newMessage', async msg => {


    msg.fecha = new Date().toLocaleString();



    await contenedorMensajes.saveNewProduct(msg);

    // Re-emitir mensajes al cliente:

    io.emit('mensajes', messages);
  })

})





router.get('/', async (req,res)=>{

    const all = await contenedor.getAll();

    res.send(all)
})


