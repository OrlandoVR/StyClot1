const { Schema, model } = require("mongoose");

const PublicationSchema = new Schema({
    user: { type: Object, required: true },
    image: { type: String, required: true },
    description: { type: String, required: false },
    like: { type: [String], required: false },
    comments: [{
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        text: String,
        time: String,
    }]
}, {
    timestamps: true
});

module.exports = model("Publication", PublicationSchema)