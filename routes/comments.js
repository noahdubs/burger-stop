var express = require("express");
var router = express.Router({mergeParams: true});
var Burger = require("../models/burger");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// new comment form
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    //find campground by id
    Burger.findById(req.params.id, (err, burger)=>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {burger: burger});
        }
    });
});

// post route
router.post("/", middleware.isLoggedIn, (req, res)=>{
    //lookup campground using id
    Burger.findById(req.params.id, (err, burger)=>{
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/burgers");
        } else {
            //create new comment
            Comment.create(req.body.comment, (err, comment)=>{
                if(err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to campground
                    burger.comments.push(comment);
                    burger.save();
                    req.flash("success", "your comment was created");
                    res.redirect("/burgers/" + burger._id);
                }
            });
        }
    }) ;
});

// edit route
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    }); 
});

// Update comment
router.put("/:comment_id", middleware.checkCommentOwner, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err, updatedComment)=>{
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/burgers/" + req.params.id);
        }
    });
});

// Delete comment
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "comment deleted");
            res.redirect("/burgers/" + req.params.id);
        }
    });
});

module.exports = router;