const indexCtrl = {};

indexCtrl.getAddCloset = (req, res) => {
    res.render("addCloset")
}

indexCtrl.getCloset = (req, res) =>{
    res.render("closet")
}

indexCtrl.addCloset = (req, res) => {

}

indexCtrl.removeCloset = (req, res) => {

}

module.exports = indexCtrl