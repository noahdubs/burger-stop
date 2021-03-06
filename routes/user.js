const express = require("express")
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Burger = require("../models/burger");

router.get("/:userId", (req, res) => {
    User.findById(req.params.userId).populate("burgers").exec((err, foundUser)=> {
        if(err){
            console.log(err)
        } else {
            const burgers = foundUser.burgers.length
            res.render("users/show", {user: foundUser, numBurgers: burgers});
        }
    });
});

router.get("/:userId/edit", (req, res)=> {
    User.findById(req.params.userId, (err, user)=> {
        if(err){
            console.log(err)
        } else {
            res.render("users/edit", {user:user})
        }
    });
});

router.put("/:userId", (req, res)=> {
    User.findByIdAndUpdate(req.params.userId, req.body, (err, updatedUser)=> {
        if(err){
            req.flash("error", err.message)
            console.log(err)
        }else {
            req.flash("success", "Your account was successfully updated")
            res.redirect(`/users/${updatedUser._id}`)
        }
    });
});

router.delete("/:userId", (req, res)=>{
    User.findByIdAndDelete(req.params.userId, (err)=> {
        if(err){
            req.flash("error", err.message)
            console.log(err)
        }else {
            req.flash("success", "Your account was successfully deleted")
            res.redirect("/")
        }
    });
})



module.exports = router 