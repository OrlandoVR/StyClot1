const fs = require("fs")
const uuid = require("uuid")
const path = require("path")

const Publication = require("../models/Publication")
const User = require("../models/User")
// const { use } = require("passport")

const indexCtrl = {};

indexCtrl.allPublication = async (req, res) => {
    const userId = req.user.id;

    const myUser = await User.findById(userId).lean();
    console.log("-----"+myUser.userName)

    const publications = await Publication.find({"user.userName": myUser.siguiendo }).sort({ createdAt: "desc" }).lean();
    res.render("home", { publications, userName: myUser.userName});
}

indexCtrl.newPublication = (req, res) => {
    res.render("newPublication")
}

indexCtrl.goChat = (req, res) => {
    res.render("chat")
}

indexCtrl.goMyProfile = async (req, res) => {
    const idUser = req.user.id
    const userName = req.user.userName
    const user = await User.findById(idUser).lean()
    const publications = await Publication.find({ "user.userName": userName }).lean();

    res.render("myProfile", { user, publications })
}

indexCtrl.postPublication = async (req, res) => {

    const user = await User.findById(req.user.id)
    const image = req.file.originalname
    const description = req.body.addDescriptionImage

    const pathImage = uuid.v4() + path.extname(image).toLowerCase()
    fs.writeFileSync(path.join(__dirname, `../public/img/post/${pathImage}`), req.file.buffer)

    const newPublication = await new Publication({ user, image: pathImage, description })
    await newPublication.save();

    res.redirect("/publications")
}

indexCtrl.goOtherProfile = async (req, res) => {
    const myUserId = req.user.id
    const otherUserId = req.params.id


    if (myUserId === otherUserId) res.redirect("/profile")
    else {
        //let seguir = false

        const user = await User.findById(otherUserId).lean()
        //const myUser = await User.findById(myUserId).lean()
        const userName = user.userName
        
        //const lista = myUser.siguiendo

        /*lista.forEach((element, i) => {
            if (element == userName) seguir = true
        });*/

        const publications = await Publication.find({ "user.userName": userName }).lean();

        res.render("otherProfile", { user, publications/*, seguir*/ })
    }
}

indexCtrl.like = async (req, res) =>{
    const myIdUser = req.user.id
    const publicationId = req.body.publicationId

    const publication = await Publication.findById(publicationId)
    const myUser = await User.findById(myIdUser)

    await publication.like.push(myUser.userName)
    await publication.save()

    res.json({rst: true})
}

indexCtrl.dislike = async (req, res)=>{

    const myIdUser = req.user.id
    const publicationId = req.body.publicationId

    const publication = await Publication.findById(publicationId)
    const myUser = await User.findById(myIdUser)

    const lista = publication.like

    const myIndex = lista.indexOf(myUser.userName)

    lista.splice(myIndex, 1)

    await publication.save()

    res.json({rst: true})
}

indexCtrl.allLikes = async (req, res) =>{

}

module.exports = indexCtrl