var express = require("express");
var router = express.Router();
var Burger = require("../models/burger");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");

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
router.post("/", middleware.isLoggedIn, (req, res)=>{
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
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
            price:price, location:location,
            lat: lat, lng: lng 
        };
        // create new campground and save it to the db
        Burger.create(newBurger, (err, newlycreated)=>{
            if(err){
                console.log(err);
            } else {
                console.log(newlycreated);
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
            res.render("burgers/show", {burger: foundBurger});
        }
    });
});

// Edit campground 
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res)=>{
    Burger.findById(req.params.id, (err, foundBurger)=>{
        if(err){
            console.log(err)
        } else {
            res.render("burgers/edit", {campground: foundBurger});
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
        // find and update correct campground
        Burger.findByIdAndUpdate(req.params.id, req.body.burger, (err, updatedBurger)=>{
            if(err) {
                req.flash("error", err.message);
                res.redirect('back')
            } else {
                req.flash("success", "Successfully updated!")
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
            res.redirect("/burgers");
        } else {
            res.redirect("/burgers");
        }
    });
});

module.exports = router;