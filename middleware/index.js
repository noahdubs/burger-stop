// all middleware goes here
var middlewareObj = {};
var Burger = require("../models/burger");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwner = (req, res, next)=>{
    if(req.isAuthenticated()){
        Burger.findById(req.params.id, (err, foundBurger)=>{
            if(err) {
                req.flash("error", "something went wrong");
                res.redirect("back");
            } else {
                if(foundBurger.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                } 
            }
        }); 
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = (req, res, next)=>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err) {
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                } 
            }
        }); 
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;