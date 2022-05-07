const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User")

passport.use(new LocalStrategy({
    usernameField: "email", // Coge el name de mi formulario
    passwordField: "password" // Coge el name de mi formulario
}, async (email, password, done) =>{

    //Buscamos en la base de datos el email que escribe el usuario
    const user = await User.findOne({email})

    if(!user){ // Si no existe el usuario creamos un mensaje de error y lo mandamos a la pagina para que se muestre
        return done(null, false, {
            message: "Not User found"
        })
    }else{ // Si el usuario si existe en la base de datos
        const match = await user.matchPassword(password) // comprueba si la contraseña coincide

        if(match){
            return done(null, user) // Se almacena la sesion en passport
        }else{
            return done(null, false, { // Si no se coincide la contraseña envia un mensaje de error
                message: "Incorrect Password"
            })
        }
    }
}));
 //Este metodo guarda la sesion en nuestro servidor
passport.serializeUser((user, done)=>{
     done(null, user.id)
})

//Cuando el usuario esta registrado y empieza a navegar el metodo empieza a verificar si es cierto
passport.deserializeUser((id, done) => { //Pendiente
    User.findById(id, (err, user) =>{
        done(err, user);
    })
})