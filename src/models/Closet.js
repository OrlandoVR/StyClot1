const {Schema, model} = require("mongoose");

const ClosetSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    prendas: [{
        _id: {type: ObjectId, required: true},
        image: {type: String, required: true},
        time: {type: String, required: true}
    }]
})

module.exports = model("Closet", ClosetSchema)