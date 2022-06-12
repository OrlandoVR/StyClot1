const multer = require("multer")

const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy})

const { Router } = require("express")

const { isAuthenticated } = require("../helpers/auth");

const router = Router()

const {getCloset, getAddCloset, addCloset, removeCloset, getClosetByTagName} = require("../controllers/closet.controller")

router.get("/addCloset", isAuthenticated, getAddCloset)

router.get("/closet", isAuthenticated, getCloset)

router.get("/closet/:tagName", isAuthenticated, getClosetByTagName)

router.put("/closet", upload.single("imageAddPost"), addCloset)

router.delete("/closet/:tagName/:id", isAuthenticated, removeCloset)

module.exports = router