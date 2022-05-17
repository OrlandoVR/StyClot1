const Chat = require("../models/Chat")
const User = require("../models/User")


const indexCtrl = {};

indexCtrl.goChatFromProfile = async (req, res) => {

    const idUserRecep = req.params.id;
    const myIdUser = req.user.id

    if(idUserRecep != myIdUser){
        const myUser = await User.findById(myIdUser)
        const user = await User.findById(idUserRecep).lean()

        
        const validate = await Chat.findOne({
            emisor: {
                myUser,
                receptor: {
                    user
                }
            }
        })
        
        if (!validate) {
            const obj = {
                myUser,
                receptor: {
                    user
                }
            }
            
            const newChat = await new Chat({ emisor: obj })
            await newChat.save();
        }
        
        const allUser = await Chat.find({}).sort({createdAt: "desc"}).lean()
        res.render("chat", { allUser, user })
    }else{
        const allUser = await Chat.find({}).sort({createdAt: "desc"}).lean()
        res.render("chat", { allUser})
    }

}

module.exports = indexCtrl