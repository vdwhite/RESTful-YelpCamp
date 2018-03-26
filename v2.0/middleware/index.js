// middleware js file

var Campground = require("../models/ground.js");
var Comment = require("../models/comment.js");
var middlewareObj={};

middlewareObj.checkGroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        // find the campground, check if the user owns the campground
        Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
           req.flash("error","Cannot find campground");
           res.redirect("back");
        }
        if(!foundCamp){
            req.flash("error","Something is wrong");
            return res.redirect("/grounds");
        }
        else{
           // since mongoose object is not a strin
           if(foundCamp.author.id.equals(req.user.id)){
             //move on after confirm having the ownership
             next();
           }
           else{
             req.flash("error","You don't have the permission to do this");
             res.redirect("back");
           }
         }
      });
    }
    else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        // find the campground, check if the user owns the campground
        Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
           req.flash("error","Cannot find campground");
           res.redirect("back");
        }
        if(!foundComment){
            req.flash("error","Something is wrong");
            return res.redirect("back");
        }
        else{
           // since mongoose object is not a string
           if(foundComment.author.id.equals(req.user._id)){
             //move on after confirm having the ownership
             next();
           }
           else{
             req.flash("error","You don't have the permission to do this");
             res.redirect("back");
           }
         }
      });
    }
    else{
        res.redirect("back");
    }
}


middlewareObj.checkIsLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash("error","You need to login first");
        res.redirect("/login");
    }
}


module.exports = middlewareObj;