var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/ground");
var Comment = require("../models/comment");

// Comments routes

// new comments
router.get("/new",isLoggedIn, function (req,res){
   //find camp by id, send to render
   Campground.findById(req.params.id,function(err,foundCamp){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new",{camp:foundCamp});
       }
   });
});

//comments create
router.post("/", isLoggedIn, function(req,res){
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
                 
                 console.log(newComment);
                 res.redirect("/grounds/"+foundCamp._id);
               }
           });
        }
    });
});

//middle ware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

module.exports = router;