const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const fs = require("fs")
const passport = require("passport");

const User = require("../models/User");
const Publication = require("../models/Publication");

const indexCtrl = {};


indexCtrl.renderSigninForm = (req, res) => {
    res.render("signin")
};

indexCtrl.signin = passport.authenticate("local", { /*local = Este nombre lo ponen siempre por defecto*/
    successRedirect: "/publications",
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

            fs.writeFileSync(path.join(__dirname, `../public/img/user/${pathImage}`), imageBuffer)

            const newUser = new User({ userName, email, password, profile_image: pathImage })
            newUser.password = await newUser.encrypPassword(password)
            await newUser.save();
            res.redirect("/")
        }
    }
};

indexCtrl.recoveryPass = (req, res) =>{
    console.log(req.body)
};

indexCtrl.verificarEmail = async (req, res) => {
    const email = req.body.recoveryEmail

    const findEmail = await User.findOne({email})
    if (findEmail) res.json({ rst:  true })
    else res.json({ rst:  false })
}

indexCtrl.checkSamePassword = async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email})
    user.password = await user.encrypPassword(password)
    user.save()
    // const updatePass = await User.update({
    //     email: email    
    // },
    // {
    //     $set: {
    //         password: await User.password.encrypPassword(password)
    //     }
    // })

    if(user.password) res.json({ rst: true })
    else res.json({ rst: false })
}

indexCtrl.allUsers = async (req, res) => {
    const allUsers = await User.find({})
    res.json({ allUsers })
};

indexCtrl.getIdUser = (req, res) =>{
    res.json({ rst:req.user.id })
}

indexCtrl.getMyUserName = (req, res) =>{
    const userName = req.user.userName
    res.json({userName})
}
indexCtrl.logout = (req, res) => {
    req.logout();
    res.redirect("/")
};

indexCtrl.eliminar = (req, res) => {
    res.render("eliminar")
}

indexCtrl.seguir = async (req, res) => {
    const myIdUser = req.user.id
    const hiddenUserName = req.body.otherUserName
    console.log(hiddenUserName)

    const user = await User.findById(myIdUser)

    await user.siguiendo.push(hiddenUserName)
    await user.save()

    res.json({rst: true})
}

indexCtrl.dejarSeguir = async (req, res) => {

    const myIdUser = req.user.id
    const hiddenUserName = req.body.otherUserName

    const user = await User.findById(myIdUser)
    const lista = user.siguiendo

    lista.forEach((element, i) => {
        if(element == hiddenUserName) lista.splice(i,1)
    });

    user.siguiendo = lista
    await user.save()

    res.json({rst: true})
}

indexCtrl.lesigue = async (req, res) =>{
    const myIdUser = req.user.id
    const hiddenUserName = req.body.otherUserName

    const user = await User.findById(myIdUser)
    const lista = user.siguiendo

    //console.log(hiddenUserName)
    //console.log(lista)

    // const element = lista.find( e => {
    //     e == hiddenUserName
    // })

    // console.log(element)

    if( lista.indexOf(hiddenUserName) > -1) res.json({rst: true})
    else res.json({rst: false})
}

indexCtrl.allUsersByLetter = async(req, res) =>{

    const inputText = req.body.inputText;

    const reg = new RegExp('^'+inputText)

    const allUsers = await User.find({ userName: reg })

    res.json({ allUsers })
}

module.exports = indexCtrl

