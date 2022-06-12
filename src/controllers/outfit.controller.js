const indexCtrl = {};

indexCtrl.getAddOutfit = (req, res) => {
    res.render("addOutfit")
}

indexCtrl.getOutfit = (req, res) =>{
    res.render("outfit")
}

indexCtrl.addOutfit = (req, res) => {

}

indexCtrl.removeOutfit = (req, res) => {

}

module.exports = indexCtrl