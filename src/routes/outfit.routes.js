const { Router } = require("express")

const { isAuthenticated } = require("../helpers/auth");

const router = Router()

const {getAddOutfit, getOutfit, addOutfit, removeOutfit, getClotheByTagName} = require("../controllers/outfit.controller")

router.get("/addOutfit", isAuthenticated, getAddOutfit)

router.get("/outfit", isAuthenticated, getOutfit)

router.post("/outfit/:tagName", isAuthenticated, getClotheByTagName)

router.put("/outfit", isAuthenticated, addOutfit)

router.delete("/outfit/:id", isAuthenticated, removeOutfit)

module.exports = router