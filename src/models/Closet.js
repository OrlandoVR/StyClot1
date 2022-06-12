const { Schema, model } = require("mongoose");

const ClosetSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    prendas: [{
        tagName: { type: String, required: true },
        image: { type: String, required: true },
        time: { type: Date, required: true }
    }]
})

module.exports = model("Closet", ClosetSchema)