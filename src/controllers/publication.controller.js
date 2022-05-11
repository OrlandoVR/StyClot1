const Publication = require("../models/Publication")

const indexCtrl = {};

indexCtrl.allPublication = (req, res) => {
    res.render("home")
}

indexCtrl.newPublication = (req, res) => {
    res.render("newPublication")
}

module.exports = indexCtrl