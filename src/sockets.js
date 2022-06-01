// el archivo chat es 

const Chat = require("./models/Chat")
const User = require("./models/User")

module.exports = (io) => {

    let userNames = {};

    io.on("connection", socket => {
        console.log("new user connected");

        socket.on("new user", async (data) => {

            const myUser = await User.findOneAndUpdate({ userName: data.userName }, { estado: true })
            await myUser.save()

            socket.nickname = data.userName
            userNames[socket.nickname] = socket
            console.log(`${data.userName} conectado`);

            data.listaChatUsuarios.forEach(element => {
                if (userNames[element.receptor.userName]) {
                    userNames[element.receptor.userName].emit("estado", { id: myUser._id, estado: true, message: `${socket.nickname} esta conectado` })
                }
            });
        })


        socket.on("send message", async (data) => {
            const emisor = data.emisor
            const receptor = data.receptor
            const message = data.message
            const time = data.time

            const chatUpdate1 = await Chat.findOneAndUpdate({ "emisor.userName": emisor, "receptor.userName": receptor }, { $push: { messages: { who: "emisor", message, time } } })
            const chatUpdate2 = await Chat.findOneAndUpdate({ "emisor.userName": receptor, "receptor.userName": emisor }, { $push: { messages: { who: "receptor", message, time } } })

            await chatUpdate1.save()
            await chatUpdate2.save()

            if (userNames[receptor]) {
                userNames[receptor].emit("priv", { message, emisor, time })
            }
        })

        socket.on("disconnect", async (data) => {

            const myUser = await User.findOneAndUpdate({ userName: socket.nickname }, { estado: false })
            await Chat.updateMany({ "emisor.userName": myUser.userName }, { "emisor.estado": false })
            await Chat.updateMany({ "receptor.userName": myUser.userName }, { "receptor.estado": false })
            await myUser.save()

            const listaChatUsuarios = await Chat.find({ "emisor.userName": socket.nickname }).sort({ createdAt: "desc" }).lean()

            listaChatUsuarios.forEach(element => {
                if (userNames[element.receptor.userName]) {
                    userNames[element.receptor.userName].emit("estado", { id: myUser._id, estado: false, message: `${socket.nickname} esta desconectado` })
                }
            });

            delete userNames[socket.nickname]
            console.log(`${socket.nickname} desconectado`);
        })

    })
}
