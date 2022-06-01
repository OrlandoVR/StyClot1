const Chat = require("../models/Chat")
const User = require("../models/User")


const indexCtrl = {};

indexCtrl.goChatFromProfile = async (req, res) => {

    const idUserRecep = req.params.id;
    const myIdUser = req.user.id
    
    const myUser = await User.findById(myIdUser)
    const user = await User.findById(idUserRecep).lean()
    
    if (idUserRecep != myIdUser) {

        const validate1 = await Chat.findOne({
            "emisor.userName": myUser.userName,
            "receptor.userName": user.userName
        })

        const validate2 = await Chat.findOne({
            "emisor.userName": user.userName,
            "receptor.userName": myUser.userName
        })

        if (!validate1 && !validate2) {

            const newChat1 = await new Chat({
                emisor: myUser,
                receptor: user
            })

            const newChat2 = await new Chat({
                emisor: user,
                receptor: myUser
            })

            await newChat1.save();
            await newChat2.save();
        }

        const allMessage = await Chat.findOne({ "emisor.userName": myUser.userName, "receptor.userName": user.userName }, { messages: 1, _id: 0}).lean()

        const allUser = await Chat.find({ "emisor.userName": myUser.userName }).sort({ createdAt: "desc" }).lean()
        res.render("chat", { allUser, user, allMessage })
    } else {

        const allUser = await Chat.find({ "emisor.userName": myUser.userName }).sort({ createdAt: "desc" }).lean()
        res.render("chat", { allUser })
    }

}

module.exports = indexCtrl