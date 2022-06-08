const { Router } = require("express")

const { isAuthenticated } = require("../helpers/auth");

const router = Router()

const {getCloset ,getAddCloset, addCloset, removeCloset} = require("../controllers/closet.controller")

router.get("/addCloset", isAuthenticated, getAddCloset)

router.get("/closet", isAuthenticated, getCloset)

router.put("/closet", isAuthenticated, addCloset)

router.delete("/closet/:id", isAuthenticated, removeCloset)

module.exports = router