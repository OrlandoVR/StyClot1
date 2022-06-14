const { Schema, model } = require("mongoose");

const OutfitSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    outfits: [{
        image: { type: String, required: true },
        time: { type: Date, required: true }
    }]
})

module.exports = model("Outfit", OutfitSchema)