var express = require("express");
var router = express.Router();
var Campground = require("../models/ground");
var middlewareObj = require("../middleware/index.js");

console.log(middlewareObj);

                        //name want to give: data passing in
//    res.render("grounds",{campgrounds:campgrounds}); 

router.post("/", middlewareObj.checkIsLoggedIn, function(req,res){
    //get data from form db
    var name = req.body.name; // name="name" from post form
    var imgURL = req.body.image; // name= "image" from post form 
    console.log(req.body);
    var des= req.body.description; //name = "desciption"
    
    
    var author ={
        username: req.user.username,
        id: req.user._id
    }
    
    var newCamp = {
        name:name,
        image:imgURL,
        description:des,
        author: author
    };
//  create bew campground object and store into database

    Campground.create(newCamp,function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log("created: ");
            console.log(campground);
            //redirect to /gounds
            res.redirect("/grounds");
        }
    });
});

router.get("/new",middlewareObj.checkIsLoggedIn,function(req,res){
   res.render("grounds/new"); 
});

//SHOW ROUTE
router.get("/:id",function(req,res){
    //find campground with id and show it
    //find by id-> populate -> exec so now the comments id are referencing in the campgounds that found, not just id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
         if(err){
             console.log(err);
         }else{
             // pass camp 
            res.render("grounds/show",{campground:foundCamp}); 
         }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middlewareObj.checkGroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCamp){
        if(err){
            res.send(err);
        }
        else{
         console.log(foundCamp.name);
         res.render("grounds/edit",{campground:foundCamp});      
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middlewareObj.checkGroundOwnership,function(req,res){
   //find and update
   Campground.findByIdAndUpdate(req.params.id, req.body.ground, function(err,foundCamp){
       if(err){
           res.redirect("/grounds");
       }else{
           console.log(req.body);
           res.redirect("/grounds/"+req.params.id);
       }
   });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middlewareObj.checkGroundOwnership,function(req,res){
   //find and update
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/grounds/"+req.params.id);
       }else{
           res.redirect("/grounds");
       }
   });
});

module.exports = router;
