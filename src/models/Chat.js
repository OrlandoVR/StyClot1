const {Schema, model} = require("mongoose");

const ChatSchema = new Schema({
    emisor: {type: Object, required: true},
    receptor: {type: Object, required: true},
    messages: {type: [Object], required:false}
},{
    timestamps: true
});

module.exports = model("Chat", ChatSchema)