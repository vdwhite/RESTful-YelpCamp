var express = require("express");
var router = express.Router();
var Campground = require("../models/ground");


                        //name want to give: data passing in
//    res.render("grounds",{campgrounds:campgrounds}); 

router.post("/", function(req,res){
    //get data from form db
    var name = req.body.name; // name="name" from post form
    var imgURL = req.body.image; // name= "image" from post form 
    console.log(req.body);
    var des= req.body.description; //name = "desciption"
    
    
    var newCamp = {
        name:name,
        image:imgURL,
        description:des
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

router.get("/new",function(req,res){
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