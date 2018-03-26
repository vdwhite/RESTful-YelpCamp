var express = require("express");
var router = express.Router();
var Campground = require("../models/ground");
var passport = require("passport");
var User = require("../models/user");

//index route
router.get("/",function(req,res){
    res.render("landing");
});


router.get("/grounds",function(req,res){
  
  var user = req.user;
  //get all campgrounds from DB
  Campground.find({},function(err,allCampgrounds){
      if(err){
          console.log(err);
      }else{
        // do render
        res.render("grounds/index",{campgrounds:allCampgrounds,currentUser:user});
     }
  });
});
  

//auth routes
router.get("/reg",function(req,res){
   res.render("register"); 
});

//handle sign up
router.post("/reg",function(req,res){
   User.register(new User({username: req.body.username}),req.body.password,function(err,newUser){
       if(err){
           return res.render("register",{error: err.message});
       } else{
           passport.authenticate("local")(req,res,function(){
               // get the username from the database
               req.flash("success","Welcome, "+newUser.username);
               res.redirect("/grounds"); 
           });
       }
   });
});


// login routes
router.get("/login",function(req,res){
    res.render("login"); 
});

//handling login logic /middle ware
router.post("/login", passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: "Invalid user name or password combination",
}),function(req,res){
    
    req.flash("success", "Welcome back, "+req.body.username);
    res.redirect("/grounds");
});


//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","You logged out!");
    res.redirect("/grounds");
});


module.exports = router;