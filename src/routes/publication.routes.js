const multer = require("multer")

const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy})

const { Router } = require("express")

const publicationRouter = Router();

const { allPublication, newPublication, postPublication, goChat, goMyProfile, goOtherProfile, like, dislike, allLikes} = require("../controllers/publication.controller")
const { isAuthenticated } = require("../helpers/auth");

publicationRouter.get("/publications", isAuthenticated, allPublication)

publicationRouter.get("/newPublications", isAuthenticated, newPublication)

publicationRouter.get("/chat",isAuthenticated, goChat)

publicationRouter.get("/profile",isAuthenticated, goMyProfile)

publicationRouter.get("/otherProfile/:id",isAuthenticated, goOtherProfile)

publicationRouter.post("/newPublications", upload.single("imageAddPost"), postPublication)

publicationRouter.post("/like",isAuthenticated, like)

publicationRouter.post("/dislike",isAuthenticated, dislike)

publicationRouter.post("allLikes",isAuthenticated, allLikes)

module.exports = publicationRouter