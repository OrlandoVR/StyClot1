// el archivo chat es 

module.exports = (io) => {

    let userNames = {};

    io.on("connection", socket => {
        console.log("new user connected");

        socket.on("new user", data => {
            socket.nickname = data
            userNames[socket.nickname] = socket
            console.log(`${data} conectado`);
        })


        socket.on("send message", data => {
            const receptor = data.receptor
            const message = data.message

            userNames[receptor].emit("priv", message)
        })

        socket.on("disconnect", data => {
            delete userNames[socket.nickname]
            console.log(`${socket.nickname} desconectado`);
        })

    })
}
