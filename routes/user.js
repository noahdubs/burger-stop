const express = require("express")
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Burger = require("../models/burger");

router.get("/:userId", (req, res) => {
    console.log("works")
    User.findById(req.params.userId, (err, foundUser)=> {
        if(err){
            console.log(err)
        } else {
            res.render("users/show", {user: foundUser});
        }
    });
});



module.exports = router 