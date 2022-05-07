const path = require("path")
const multer = require("multer")

const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy})

const { Router } = require('express')

const router = Router();

const { renderSigninForm, signin, renderSignupForm, signup, logout, addImageUserName } = require("../controllers/user.controller")

router.get("/", renderSigninForm)

router.post("/signin", signin)

router.get("/user/signup", renderSignupForm)

router.post("/signup", upload.single("image") ,signup)

router.get("/logout", logout)

//router.post("/signup/imageUserName", addImageUserName)

module.exports = router