const {Schema, model} = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profile_image: {type: Number, required: false},
    login_google: {type: Boolean, required: false}
}, {
    timestamps: true // Sirve para cuando crear un schema o lo actualizes, te manda el timestamp y de ahi lo conviertes a fecha
});

UserSchema.methods.encrypPassword = async password =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

UserSchema.methods.matchPassword = function(password){
    return await bcrypt.compare(password, this.password)
}

module.exports = model("User", UserSchema)