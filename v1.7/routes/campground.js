var express = require("express");
var router = express.Router();
var Campground = require("../models/ground");


                        //name want to give: data passing in
//    res.render("grounds",{campgrounds:campgrounds}); 

router.post("/", isLoggedIn, function(req,res){
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

router.get("/new",isLoggedIn,function(req,res){
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


module.exports = router;

//middle ware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}
