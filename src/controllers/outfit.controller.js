const fs = require("fs")
const uuid = require("uuid")
const path = require("path")

const Closet = require("../models/Closet")
const Outfit = require("../models/Outfit")

const indexCtrl = {};

indexCtrl.getAddOutfit = (req, res) => {
    res.render("addOutfit")
}

indexCtrl.getOutfit = async (req, res) => {

    const idUser = req.user.id

    let sendOutfits = []

    const outfit = await Outfit.findOne({idUser}).lean()

    if (outfit) {
        let outfits = outfit.outfits

        outfits.forEach(element => {
            sendOutfits.push(element)
        });

        sendOutfits = sendOutfits.sort((a, b) => b.time - a.time)

        if(sendOutfits.length>0){
            res.render("outfit", {sendOutfits})
        } 
        else{
            res.render("outfit")
        } 
    } else {
        res.render("outfit")
    }
}

indexCtrl.getClotheByTagName = async (req, res) => {
    console.log("servidor outfit")

    const myIdUser = req.user.id
    const tagName = req.params.tagName

    const closet = await Closet.findOne({ idUser: myIdUser })
    const clothesByTagName = closet.prendas.filter(element => element.tagName == tagName)
    res.json({ clothesByTagName })
}

indexCtrl.addOutfit = async (req, res) => {

    var imageBase64 = req.body.base64URL

    // var base64Data = imageBase64.replace(/^data:image\/png;base64,/, "");

    // const pathImage = uuid.v4() + ".jpg"
    // fs.writeFileSync(path.join(__dirname, `../public/img/outfits/${pathImage}`), base64Data, 'base64', function(err){
    //     console.log(err)
    // })

    const idUser = req.user.id
    const time = new Date()/*.toLocaleString()*/

    console.log("punto de corte")
    
    const findUser = await Outfit.findOneAndUpdate({ idUser }, { $push: { outfits: { image: imageBase64, time } } })
    if (!findUser) {
        const newOutfit = await new Outfit({ idUser, outfits: [{ image: imageBase64, time }] })
        await newOutfit.save()
    } else {
        await findUser.save()
    }

    res.json({rst: true})
}

indexCtrl.removeOutfit =async (req, res) => {
    const myUserId = req.user.id
    const id= req.params.id

    console.log(id)

    const outfit = await Outfit.findOne({idUser: myUserId})
    const item = await outfit.outfits.find( element => element._id == id )
    outfit.outfits.pull(item)
    await outfit.save()
    // closet.prendas.remove({_id: id})

    res.redirect(`/outfit`)
}

module.exports = indexCtrl