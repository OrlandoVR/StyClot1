const fs = require("fs")
const uuid = require("uuid")
const path = require("path")

const Publication = require("../models/Publication")
const User = require("../models/User")

const indexCtrl = {};

indexCtrl.allPublication = async (req, res) => {
    const userId = req.user.id;
    const publications =await Publication.find({userId}).sort({createdAt: "desc"}).lean();
    console.log(publications)
    
    res.render("home", { publications });
}

indexCtrl.newPublication = (req, res) => {
    res.render("newPublication")
}

indexCtrl.goChat = (req, res) => {
    res.render("chat")
}

indexCtrl.postPublication = async (req, res) => {

    const user = await User.findById(req.user.id)
    const image = req.file.originalname
    const description = req.body.addDescriptionImage

    const pathImage = uuid.v4() + path.extname(image).toLowerCase()
    fs.writeFileSync(path.join(__dirname, `../public/img/post/${pathImage}`), req.file.buffer)

    const newPublication = await new Publication({ user , image: pathImage, description})
    await newPublication.save();

    res.redirect("/publications")
}

module.exports = indexCtrl