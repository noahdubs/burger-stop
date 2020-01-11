var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: String,
    pic: String,
    burgers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Burger"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);