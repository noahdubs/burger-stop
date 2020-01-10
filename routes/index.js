var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res)=>{
    res.render('landing')
});

// Auth routes
//=============

// show register form
router.get("/register", (req, res)=>{
    res.render("register");
});

// add user to db
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err) {
            req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", (req, res)=>{
    res.render("login");
});

// log user in, redirect them, handles login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req, res)=>{
});

// logout logic
router.get("/logout", (req, res)=>{
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});


module.exports = router;