var mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/ground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");


// create yelpcamp database
mongoose.connect("mongodb://localhost/yelpcamp3");


app.use(bodyParser.urlencoded({extended:true}));

// tell express to use the directory "public"
app.use(express.static("public"));
app.set("view engine", "ejs");

//index route
app.get("/",function(req,res){
    res.render("landing");
});


app.get("/grounds",function(req,res){
  //get all campgrounds from DB
  Campground.find({},function(err,allCampgrounds){
      if(err){
          console.log(err);
      }else{
        // do render
        res.render("grounds/index",{campgrounds:allCampgrounds});
     }
  })
});
  
                        //name want to give: data passing in
//    res.render("grounds",{campgrounds:campgrounds}); 


app.post("/grounds", function(req,res){
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
    })
});

app.get("/grounds/new",function(req,res){
   res.render("grounds/new"); 
});

//SHOW ROUTE
app.get("/grounds/:id",function(req,res){
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


// Comments routes

app.get("/grounds/:id/comments/new",function(req,res){
   //find camp by id, send to render
   Campground.findById(req.params.id,function(err,foundCamp){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new",{camp:foundCamp});
       }
   });
});

app.post("/grounds/:id/comments", function(req,res){
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
                 //connect new comment to the camp
                 foundCamp.comments.push(newComment);
                 
                     //save and redirect
                 foundCamp.save();
                 res.redirect("/grounds/"+foundCamp._id);
               }
           })
        }
    });

});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});