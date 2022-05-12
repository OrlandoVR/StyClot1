const multer = require("multer")

const storageStrategy = multer.memoryStorage()
const upload = multer({ storage: storageStrategy})

const { Router } = require("express")

const publicationRouter = Router();

const { allPublication, newPublication, postPublication, goChat} = require("../controllers/publication.controller")
const { isAuthenticated } = require("../helpers/auth");

publicationRouter.get("/publications", isAuthenticated, allPublication)

publicationRouter.get("/newPublications", isAuthenticated, newPublication)

publicationRouter.get("/chat", goChat)

publicationRouter.post("/newPublications", upload.single("imageAddPost"), postPublication)

module.exports = publicationRouter