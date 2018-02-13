var express = require("express");
var app = express();
var bodyParser = require("body-parser");

    var campgrounds =
    [
        {name:"Salmon",
         image:"http://cdn.grindtv.com/uploads/2015/02/shutterstock_242371765.jpg" },
         
        {name:"Greek",
         image:"https://www.visitnc.com/resimg.php/imgcrop/2/52908/image/800/448/KerrCamping.jpg"}
    ];

app.use(bodyParser.urlencoded({extended:true}));

// tell express to use the directory "public"
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/",function(req,res){
    res.render("landing");
});


app.get("/grounds",function(req,res){
                        //name want to give: data passing in
    res.render("index",{campgrounds:campgrounds}); 
});

app.post("/grounds", function(req,res){
    //get data from form
    var name = req.body.name; // name="name" from post form
    var imgURL = req.body.image; // name= "image" from post form 
    
    //add to campground array
    var newCamp = {
        name:name,
        image:imgURL
    };
    campgrounds.push(newCamp);
    
    //redirect to /gounds
    res.redirect("index");
});

app.get("/grounds/new",function(req,res){
   res.render("new"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});