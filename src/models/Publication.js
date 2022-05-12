const {Schema, model} = require("mongoose");

const PublicationSchema = new Schema({
    user: {type: Object, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true}
},{
    timestamps: true
});

module.exports = model("Publication", PublicationSchema)