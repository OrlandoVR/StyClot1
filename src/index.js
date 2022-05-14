const socketio = require("socket.io");
const http = require("http");
require("dotenv").config();
require("./database")

const app = require("./server");
const server = http.createServer(app);

const io = socketio(server) // Quiero que escuches en el servidor que eh creado, ya tenemos una conexion de web socket

require("./sockets")(io)

server.listen(app.get("port"), () =>{
    console.log("Server on port", app.get("port"));
})