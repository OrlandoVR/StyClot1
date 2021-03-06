const fs = require("fs")
const uuid = require("uuid")
const path = require("path")

const Publication = require("../models/Publication")
const User = require("../models/User")

const indexCtrl = {};

indexCtrl.allPublication = async (req, res) => {
    const userId = req.user.id;

    const myUser = await User.findById(userId).lean();

    const publications = await Publication.find({ "user.userName": myUser.siguiendo }).sort({ createdAt: "desc" }).lean();
    res.render("home", { publications, userName: myUser.userName });
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

    const description = req.body.addDescriptionImage
    const stringTags = req.body.tags
    const tags = JSON.parse(stringTags)
    const rf = req.file
    
    const errors = []
    
    if(rf == undefined){
        errors.push("seleccione una imagen")
    }
    
    if(errors.length>0){
        console.log("hay error")
    }else{
        console.log("no hay error")
        const image = req.file.originalname
        const user = await User.findById(req.user.id)
        
        const pathImage = uuid.v4() + path.extname(image).toLowerCase()
        fs.writeFileSync(path.join(__dirname, `../public/img/post/${pathImage}`), req.file.buffer)
    
        const newPublication = await new Publication({ user, image: pathImage, description })
    
        console.log(tags)

        for (const key in tags) {
            newPublication.tags.push(tags[key])
        }

        await newPublication.save();
    }
    res.json({errors})
}

indexCtrl.goOtherProfile = async (req, res) => {
    const myUserId = req.user.id
    const otherUserId = req.params.id


    if (myUserId === otherUserId) res.redirect("/profile")
    else {
        const user = await User.findById(otherUserId).lean()
        const userName = user.userName

        const publications = await Publication.find({ "user.userName": userName }).lean();

        res.render("otherProfile", { user, publications})
    }
}

indexCtrl.like = async (req, res) => {
    const myIdUser = req.user.id
    const publicationId = req.body.publicationId

    const publication = await Publication.findById(publicationId)
    const myUser = await User.findById(myIdUser)

    await publication.like.push(myUser.userName)
    await publication.save()

    res.json({ rst: true })
}

indexCtrl.dislike = async (req, res) => {

    const myIdUser = req.user.id
    const publicationId = req.body.publicationId

    const publication = await Publication.findById(publicationId)
    const myUser = await User.findById(myIdUser)

    const lista = publication.like

    const myIndex = lista.indexOf(myUser.userName)

    lista.splice(myIndex, 1)

    await publication.save()

    res.json({ rst: true })
}

indexCtrl.allLikes = async (req, res) => {

}

indexCtrl.comment = async (req, res) => {
    const myIdUser = req.user.id
    const idPublication = req.body.idPublication
    const commentText = req.body.commentText

    const time = new Date().toLocaleString()

    const myUser = await User.findById(myIdUser)

    await Publication.findOneAndUpdate({ "_id": idPublication }, { $push: { comments: { idUser: myIdUser, text: commentText, time } } })

    res.json({ myUser, time })
}

indexCtrl.commentByidPublication = async (req, res) => {

    const idPublication = req.body.idPublication

    const publications = await Publication.findById(idPublication).populate("comments.idUser")

    res.json({ publications })
}

module.exports = indexCtrl