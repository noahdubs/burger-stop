var mongoose = require('mongoose');

var burgerSchema = new mongoose.Schema({
    name: String,
    price: String,
    picture: {
        id: String,
        url: String
    },
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    stars: Number,
    restaurant: String, 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Burger", burgerSchema);