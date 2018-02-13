var mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Campground = require("./models/ground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var LocalStrategy = require("passport-local");
var passport = require("passport"); 
var User = require("./models/user");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campground");
var indexRoutes = require("./routes/index");
    
// create yelpcamp database
mongoose.connect("mongodb://localhost/yelpcamp3");

app.use(require("express-session")({
    secret:"RAON LEE IS THE BEST",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

// tell express to use the directory "public"
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");


app.use("/grounds",campgroundRoutes);
app.use("/grounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});