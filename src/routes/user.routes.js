const path = require("path")
const multer = require("multer")

const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy})

const { Router } = require('express')
const { isAuthenticated } = require("../helpers/auth");

const router = Router();

const { renderSigninForm, signin, renderSignupForm, signup, logout, addImageUserName, recoveryPass, verificarEmail, checkSamePassword, allUsers,eliminar, getIdUser, getMyUserName, seguir, dejarSeguir, lesigue, allUsersByLetter, online} = require("../controllers/user.controller")

router.get("/", renderSigninForm)

router.post("/signin", signin)

router.get("/user/signup", renderSignupForm)

router.post("/signup", upload.single("image") ,signup)

router.get("/logout",isAuthenticated, logout)

router.post("/recoveryPass", recoveryPass)

router.post("/verificarEmail", verificarEmail)

router.post("/checkSamePassword", checkSamePassword)

router.post("/allUsers",isAuthenticated, allUsers)

router.post("/allUsersByLetter",isAuthenticated, allUsersByLetter)

router.get("/eliminar",isAuthenticated, eliminar)

router.post("/getIdUser",isAuthenticated, getIdUser)

router.get("/getMyUserName",isAuthenticated, getMyUserName)

router.post("/seguir",isAuthenticated, seguir)

router.post("/dejarSeguir",isAuthenticated, dejarSeguir)

router.post("/lesigue",isAuthenticated, lesigue)

router.get("/online",isAuthenticated, online)

//router.post("/signup/imageUserName", addImageUserName)

module.exports = router