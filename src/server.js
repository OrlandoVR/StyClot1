const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const multer = require("multer");
const uuid = require("uuid");
const flash = require("connect-flash");
const session = require("express-session");

/*const storage = multer.diskStorage({ // Esto es una configuracion de multer
    destination: path.join(__dirname, "public/img"), // Destino donde se almacenaran las imagenes
    filename: (req, file, cb) =>{
        cb(null, uuid.v4() + path.extname(file.originalname).toLocaleLowerCase()) // Nombre del archivo con el que se va a guardar, en este caso con un id aleatorio
    }
});*/

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
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));


/*app.use(multer({
    storage, // Usamos la configuracion de arriba
    dest: path.join(__dirname, "public/img"), // Destino de donde se almacenara la imagen
    limits: {fileSize: 1000000},
    fileFilter: (req, file, cb) =>{
        const filetypes = /jpeg|jpg|png/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))
        
        if(mimetype && extname){
            console.log(file)
            console.log(req.body)
            return cb(null, true) // Validamos que la imagen sea una extension de imagen
        }else{
            cb("Error: El archivo debe ser una imagen valida");
        } 
    }
}).single("image")) // Indica que se va a subir solo una imagen*/

app.use(flash())

// Global Variables

app.use((req, res, next) => {
    res.locals.error_msg = req.flash("error_msg");
    next();
});

// Routes
app.use(require('./routes/user.routes'));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;