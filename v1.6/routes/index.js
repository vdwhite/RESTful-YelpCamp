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
           console.log(err);
           return res.render("register");
       } else{
           passport.authenticate("local")(req,res,function(){
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
    successRedirect: "/grounds",
    failureRedirect: "/login"
}),function(req,res){});


//logout route
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/grounds");
});


module.exports = router;