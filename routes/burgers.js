var express = require("express"),
    Burger = require("../models/burger"),
    middleware = require("../middleware"),
    NodeGeocoder = require("node-geocoder"),
    multer = require('multer'),
    cloudinary = require("cloudinary"),
    cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET 
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "burgers",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });
    
const router = express.Router();
    
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.MAPS_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

// index route - shows all campgrounds
router.get("/", (req, res)=>{
    Burger.find({},(err, burgers)=>{
        if(err){
            console.log(err);
        } else {
            res.render("burgers/index", {burgers: burgers});
        }
    });
});

// create- add new campground to db
router.post("/", parser.single("image"), middleware.isLoggedIn, (req, res)=>{
    const image = {};
    if(typeof req.file === "undefined"){
        image.url = process.env.DEFAULT_PIC
    } else {
        image.url = req.file.url;
        image.id = req.file.public_id;
    }
    //get data from form
    var stars = req.body.stars
    var name = req.body.name
    var restaurant = req.body.restaurant
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var date = new Date()
    var currentTime = date.toDateString()
    var price = req.body.price;
    geocoder.geocode(req.body.location, (err, data)=> {
        if(err || !data.length){
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newBurger = {
            name: name, image: image,
            description:description, author: author,
            price:price, picture: image,
            location:location,
            lat: lat, lng: lng,
            stars: stars, restaurant: restaurant,
            date: {posted: currentTime}
        };
        // create new campground and save it to the db
        Burger.create(newBurger, (err, newlycreated)=>{
            if(err){
                req.flash("error", err.message)
                console.log(err);
            } else {
                req.user.burgers.push(newlycreated)
                req.user.save();
                req.flash("success", "New burger created!")
                res.redirect("/burgers");
            }
        }); 

    })

    
});

// New- show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("burgers/new");
});

// Show - shows info about one campground
router.get("/:id", (req, res)=>{
    // find provided campgorund with provided id
    Burger.findById(req.params.id).populate("comments").exec((err, foundBurger)=>{
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("burgers/show", {burger: foundBurger, key: process.env.MAPS_API_KEY});
        }
    });
});

// Edit campground 
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res)=>{
    Burger.findById(req.params.id, (err, foundBurger)=>{
        if(err){
            console.log(err)
        } else {
            res.render("burgers/edit", {burger: foundBurger});
        }
    });
});

// Update campground
router.put("/:id", middleware.checkCampgroundOwner, (req, res)=>{
    geocoder.geocode(req.body.location, (err, data)=>{
        if(err || !data.length){
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.burger.lat = data[0].latitude;
        req.body.burger.lng = data[0].longitude;
        req.body.burger.location = data[0].formattedAddress;
        const date = new Date()
        const currentTime = date.toDateString()
        req.body.burger.date = {edited: currentTime}
        // find and update correct campground
        Burger.findByIdAndUpdate(req.params.id, req.body.burger, (err, updatedBurger)=>{
            if(err) {
                req.flash("error", err.message);
                res.redirect('back')
            } else {
                req.flash("success", "Burger succesfully updated!")
                res.redirect("/burgers/" + req.params.id);
            }
        });

    })
    
    // redirect to show page
});

// delete campground
router.delete("/:id", middleware.checkCampgroundOwner, (req, res)=>{
    Burger.findByIdAndDelete(req.params.id, (err)=>{
        if(err) {
            req.flash("error", err.message);
            res.redirect("/burgers");
        } else {
            req.flash("success", "Burger succesfully deleted!")
            res.redirect("/burgers");
        }
    });
});

module.exports = router;