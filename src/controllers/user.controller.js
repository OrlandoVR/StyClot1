const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const fs = require("fs")
const passport = require("passport");

const User = require("../models/User")

const indexCtrl = {};


indexCtrl.renderSigninForm = (req, res) => {
    res.render("signin")
};

indexCtrl.signin = passport.authenticate("local", { /*local = Este nombre lo ponen siempre por defecto*/
    successRedirect: "/eliminar",
    failureRedirect: "/",
    failureFlash: true
});

indexCtrl.renderSignupForm = (req, res) => {
    res.render("signup")
};

indexCtrl.signup = async (req, res) => {

    const { userName, email, password, repeatPassword } = req.body

    const errors = []
    if (userName.length == 0 || email.length == 0 || req.file == undefined) {
        errors.push({ text: "Complete all the fields" })
    }

    if (password != repeatPassword) {
        errors.push({ text: "Passwords must be the same" });
    }

    if (password.length < 6) {
        errors.push({ text: "The password must have at least 6 characters" })
    }

    if (req.file != undefined && req.file.size > 1000000) {
        errors.push({ text: "The file is very large" })
    }

    if (req.file != undefined && path.extname(req.file.originalname).toLocaleLowerCase() != ".png" && path.extname(req.file.originalname).toLocaleLowerCase() != ".jpg" && path.extname(req.file.originalname).toLocaleLowerCase() != ".jpeg") {
        errors.push({ text: "only PNG, JPG and JPEG format" })
    }

    if (errors.length > 0) {
        res.render("signup", {
            errors,
            userName,
            email
        })
    } else {

        const emailUser = await User.findOne({ email })
        const nameUser = await User.findOne({ userName })

        if (nameUser) {
            errors.push({ text: "The name is already in use" })
        }

        if (emailUser) {
            errors.push({ text: "The email is already in use" })
        }

        if (errors.length > 0) {
            res.render("signup", {
                errors,
                userName,
                email
            })
        } else {

            const image = req.file
            const processedImage = sharp(image.buffer)
            const imageBuffer = await processedImage.toBuffer()
            const pathImage = uuid.v4() + path.extname(req.file.originalname).toLocaleLowerCase()

            fs.writeFileSync(path.join(__dirname, `../public/img/${pathImage}`), imageBuffer)

            const newUser = new User({ userName, email, password, profile_image: pathImage })
            newUser.password = await newUser.encrypPassword(password)
            await newUser.save();
            res.redirect("/")
        }
    }
};

indexCtrl.logout = (req, res) => {
    res.send("Log out")
};

indexCtrl.eliminar = (req, res) => {
    res.send("Logueado")
};

module.exports = indexCtrl

