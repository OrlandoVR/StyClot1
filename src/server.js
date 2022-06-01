const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const multer = require("multer");
const uuid = require("uuid");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const equal = ("equal", (lista, myUserName) =>{
    for( i in lista){
        if(lista[i] == myUserName){
            return "likePress"
        }
    }
})

// Initializations server
const app = express();
require("./config/passport")

// Settings
app.set("port", process.env.PORT || 3005);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
        equal: equal
    }
}));

app.set("view engine", ".hbs");

// Middlewares
app.use(express.urlencoded({extended: false})); // sirve para que cuando le llegue datos del formulario a traves de cualquier tipo de metodo lo convierta en formato json
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize()); // Esta primera configuracion necesita passport para que funcione 
app.use(passport.session())// Esta segunda configuracion necesita passport para que funcione 
app.use(flash());

// Global Variables

app.use((req, res, next) => {
    res.locals.error = req.flash("error"); // Passport lo agrega con el nombre de "error"
    next();
});

// Routes
app.use(require("./routes/user.routes"));
app.use(require("./routes/publication.routes"));
app.use(require("./routes/chat.routes"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;