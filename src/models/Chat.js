const {Schema, model} = require("mongoose");

const ChatSchema = new Schema({
    emisor: {type: Object, required: true}
},{
    timestamps: true
});

module.exports = model("Chat", ChatSchema)