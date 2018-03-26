var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/ground");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware/index.js");


// Comments routes

// new comments
router.get("/new",middlewareObj.checkIsLoggedIn, function (req,res){
   //find camp by id, send to render
   Campground.findById(req.params.id,function(err,foundCamp){
       if(err){
           req.flash("error","Cannot find campground");
       } else{
           res.render("comments/new",{camp:foundCamp});
       }
   });
});

//comments create
router.post("/", middlewareObj.checkIsLoggedIn, function(req,res){
    //look for camp by id
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            console.log(err);
            res.redirect("/grounds");
        } else{
           //create new comment      
           Comment.create(req.body.comment, function(err,newComment){
               if(err){
                   console.log(err);
               } else{
                 newComment.author.id = req.user._id;
                 newComment.author.username = req.user.username;
                 
                 //save comment
                 newComment.save();  
                   
                 //connect new comment to the camp
                 foundCamp.comments.push(newComment);
                 
                //save and redirect
                 foundCamp.save();

                 req.flash("success","Successfully added comments");
                 res.redirect("/grounds/"+foundCamp._id);
               }
           });
        }
    });
});

//edit route for comments
router.get("/:comment_id/edit",middlewareObj.checkCommentOwnership,function(req,res){

    // find the comment by the comment id
    console.log(req.params);
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            req.flash("error","Cannot find comment");
            res.redirect("back");
        }
        else{
            // the id will be the ground id here, see app.js
            Campground.findById(req.params.id,function(err, foundCamp){
                if(err){
                    req.flash("error","Cannot find campground");
                    res.redirect("back");
                }
                else{
                    res.render("comments/edit",{camp:foundCamp, comment:foundComment});                                
                }
            });
        }
    });

});

//update route for comments
// grounds/id/comments/comment-id/edit
//find comment by id and update
router.put("/:comment_id",middlewareObj.checkCommentOwnership,function(req,res){
    // find by id and update: the id to find, the data to update, the callback
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, foundComment){
        if(err){
            req.flash("error","Cannot find comments");
            res.redirect("back");
        }else{
            // id is the ground id, see app.js
            req.flash("success","Successfully updated comments");
            res.redirect("/grounds/"+req.params.id);
        }
    });
});

//destroy route for comment
router.delete("/:comment_id",middlewareObj.checkCommentOwnership,function(req,res){
       //find and update
       Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
           req.flash("error","Cannot find comments");
           res.redirect("back");
       }else{
           req.flash("success","Successfully removed comments");
           res.redirect("/grounds/"+req.params.id);
       }
   });
});


module.exports = router;