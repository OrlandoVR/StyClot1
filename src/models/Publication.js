const {Schema, model} = require("mongoose");

const PublicationSchema = new Schema({
    userId: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: false}
},{
    timestamps: true
});

module.exports = model("Publication", PublicationSchema)