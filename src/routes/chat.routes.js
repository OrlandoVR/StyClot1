const { Router } = require("express")

const chatRouter = Router();

const { goChatFromProfile } = require("../controllers/chat.controller");
const { isAuthenticated } = require("../helpers/auth");

chatRouter.get("/chat/:id", goChatFromProfile)

module.exports = chatRouter