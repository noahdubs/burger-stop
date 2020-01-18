const express = require("express")
      passport = require("passport"),
      User = require("../models/user"),
      multer = require("multer"),
      cloudinary = require("cloudinary"),
      cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET 
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "profile-pics",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

const router = express.Router();


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
router.post("/register", parser.single("image"), (req, res)=>{
    console.log("got here")
    const image = {};
    if(typeof req.file === "undefined"){
        image.url = process.env.DEFAULT_PROFILE_PIC
    } else {
        image.url = req.file.url;
        image.id = req.file.public_id;
    }
    var date = new Date()
    var currentTime = date.toDateString()
    var newUser = new User({
        username: req.body.username,
        name: req.body.name,
        picture: image,
        date: currentTime
    });
    User.register(newUser, req.body.password, (err, user)=>{
        if(err) {
            console.log(err)
            req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to Burger Stop " + user.username);
            res.redirect("/burgers");
        });
    });
});

// show login form
router.get("/login", (req, res)=>{
    res.render("login");
});

// log user in, redirect them, handles login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/burgers",
    failureRedirect: "/login"
}),(req, res)=>{
});

// logout logic
router.get("/logout", (req, res)=>{
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/login");
});


module.exports = router;