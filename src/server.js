const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

// Initializations server
const app = express();

// Settings
app.set("port", process.env.PORT || 3005);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs"
}));

app.set("view engine", ".hbs");

// Middlewares
app.use(express.urlencoded({extended: false})); // sirve para que cuando le llegue datos del formulario a traves de cualquier tipo de metodo lo convierta en formato json

// Global Variables


// Routes
app.get("/", (req, res) =>{
    res.render("signin");
});

app.get("/signup", (req, res) =>{
    res.render("signup");
});

// Static Files
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;