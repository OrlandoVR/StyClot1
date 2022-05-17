const multer = require("multer")

const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy})

const { Router } = require("express")

const publicationRouter = Router();

const { allPublication, newPublication, postPublication, goChat, goMyProfile, goOtherProfile} = require("../controllers/publication.controller")
const { isAuthenticated } = require("../helpers/auth");

publicationRouter.get("/publications", isAuthenticated, allPublication)

publicationRouter.get("/newPublications", isAuthenticated, newPublication)

publicationRouter.get("/chat", goChat)

publicationRouter.get("/profile", goMyProfile)

publicationRouter.get("/otherProfile/:id", goOtherProfile)

publicationRouter.post("/newPublications", upload.single("imageAddPost"), postPublication)

module.exports = publicationRouter