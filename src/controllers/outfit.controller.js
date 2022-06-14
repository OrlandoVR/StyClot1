const Closet = require("../models/Closet")
const Outfit = require("../models/Outfit")

const indexCtrl = {};

indexCtrl.getAddOutfit = (req, res) => {
    res.render("addOutfit")
}

indexCtrl.getOutfit = (req, res) =>{
    res.render("outfit")
}

indexCtrl.getClotheByTagName = async(req, res)=>{
    console.log("servidor outfit")

    const myIdUser = req.user.id
    const tagName = req.params.tagName

    const closet = await Closet.findOne({idUser: myIdUser})
    const clothesByTagName = closet.prendas.filter(element => element.tagName == tagName)
    res.json({clothesByTagName})
}

indexCtrl.addOutfit = (req, res) => {
    
}

indexCtrl.removeOutfit = (req, res) => {

}

module.exports = indexCtrl