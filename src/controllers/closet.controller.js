const fs = require("fs")
const uuid = require("uuid")
const path = require("path")

const Closet = require("../models/Closet")
const User = require("../models/User");

const indexCtrl = {};

indexCtrl.getAddCloset = (req, res) => {
    res.render("addCloset")
}

indexCtrl.getCloset = (req, res) => {
    res.render("closet")
}

indexCtrl.getClosetByTagName = async (req, res) => {
    const tagName = req.params.tagName
    const idUser = req.user.id

    let sendClothes = []

    const closet = await Closet.findOne({idUser})

    if (closet) {
        let clothes = closet.prendas

        clothes.forEach(element => {
            if (element.tagName == tagName) {
                sendClothes.push(element)
            }
        });

        sendClothes = sendClothes.sort((a, b) => b.time - a.time)
        if(sendClothes.length>0){
            res.json({ sendClothes })
        } 
        else{
            res.json({ msg: "No hay prendas" })
        } 
    } else {
        res.json({ msg: "No hay prendas" })
    }


}

indexCtrl.addCloset = async (req, res) => {

    const errors = []
    const idUser = req.user.id
    const tagName = req.body.tagName
    const rf = req.file
    const time = new Date()/*.toLocaleString()*/

    if (tagName == "") errors.push("Seleccione una categoria de prenda")
    if (rf == undefined) errors.push("Seleccione una imagen")

    if (errors.length <= 0) {
        const image = req.file.originalname
        const pathImage = uuid.v4() + path.extname(image).toLowerCase()
        fs.writeFileSync(path.join(__dirname, `../public/img/clothes/${pathImage}`), req.file.buffer)

        const findUser = await Closet.findOneAndUpdate({ idUser }, { $push: { prendas: { tagName, image: pathImage, time } } })
        if (!findUser) {
            const newClothe = await new Closet({ idUser, prendas: [{ tagName, image: pathImage, time }] })
            await newClothe.save()
        } else {
            await findUser.save()
        }

        res.redirect("/closet")
    } else {
        res.render("addCloset", { errors })
    }
}

indexCtrl.removeCloset = async(req, res) => {

    const myUserId = req.user.id
    const tagName= req.params.tagName
    const id= req.params.id

    console.log(tagName)
    console.log(id)

    const closet = await Closet.findOne({idUser: myUserId})
    const item = await closet.prendas.find( element => element._id == id )
    closet.prendas.pull(item)
    await closet.save()
    // closet.prendas.remove({_id: id})

    res.redirect(`/closet`)
}
module.exports = indexCtrl