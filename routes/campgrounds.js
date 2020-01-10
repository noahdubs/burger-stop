var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// index route - shows all campgrounds
router.get("/", (req, res)=>{
    Campground.find({},(err, campgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
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
    var newCampground = {name: name, image: image, description:description, author: author, price:price};
    // create new campground and save it to the db
    Campground.create(newCampground, (err, newlycreated)=>{
        if(err){
            console.log(err);
        } else {
            console.log(newlycreated);
            res.redirect("/campgrounds");
        }
    }); 
});

// New- show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});

// Show - shows info about one campground
router.get("/:id", (req, res)=>{
    // find provided campgorund with provided id
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            console.log("found campground");
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit campground 
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update campground
router.put("/:id", middleware.checkCampgroundOwner, (req, res)=>{
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect to show page
});

// delete campground
router.delete("/:id", middleware.checkCampgroundOwner, (req, res)=>{
    Campground.findByIdAndDelete(req.params.id, (err)=>{
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;