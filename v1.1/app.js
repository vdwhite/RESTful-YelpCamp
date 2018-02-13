var mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// create yelpcamp database
mongoose.connect("mongodb://localhost/yelpcamp");


//schema setup
var campGroundsSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", campGroundsSchema);

/*
Campground.create({
        name:"greek",
        image:"https://www.visitnc.com/resimg.php/imgcrop/2/52908/image/800/448/KerrCamping.jpg",
        description:"first-campground"
    },function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log("Created campground:");
            console.log(campground);
        }
    });    
*/

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
        res.render("index",{campgrounds:allCampgrounds});
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
   res.render("new"); 
});

//SHOW ROUTE
app.get("/grounds/:id",function(req,res){
    //find campground with id and show it
    Campground.findById(req.params.id,function(err,foundCamp){
         if(err){
             console.log(err);
         }else{
             // pass camp 
            res.render("show",{campground:foundCamp}); 
         }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});