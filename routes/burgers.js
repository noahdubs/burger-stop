var express = require("express");
var router = express.Router();
var Burger = require("../models/burger");
var middleware = require("../middleware");

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
    var newBurger = {name: name, image: image, description:description, author: author, price:price};
    // create new campground and save it to the db
    Burger.create(newBurger, (err, newlycreated)=>{
        if(err){
            console.log(err);
        } else {
            console.log(newlycreated);
            res.redirect("/burgers");
        }
    }); 
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
    // find and update correct campground
    Burger.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedBurger)=>{
        if(err) {
            res.redirect("/burgers");
        } else {
            res.redirect("/burgers/" + req.params.id);
        }
    });
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