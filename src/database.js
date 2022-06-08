
const mongoose = require("mongoose");

const { MONGODB_LOCAL } = process.env;

mongoose.connect( MONGODB_LOCAL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(db => console.log("Database is connect"))
    .catch(err => console.log(err))