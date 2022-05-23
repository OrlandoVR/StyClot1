const {Schema, model} = require("mongoose");

const PublicationSchema = new Schema({
    user: {type: Object, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    like: {type: [String], required: false}
},{
    timestamps: true
});

module.exports = model("Publication", PublicationSchema)