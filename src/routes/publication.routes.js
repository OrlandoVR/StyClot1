const { Router } = require("express")

const publicationRouter = Router();

const { allPublication, newPublication } = require("../controllers/publication.controller")
const { isAuthenticated } = require("../helpers/auth");

publicationRouter.get("/publications", isAuthenticated, allPublication)

publicationRouter.get("/newPublications", isAuthenticated, newPublication)

module.exports = publicationRouter