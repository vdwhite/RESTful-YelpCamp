var mongoose = require("mongoose");
var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var Campground = require("./models/ground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var LocalStrategy = require("passport-local");
var passport = require("passport"); 
var User = require("./models/user");
var Flash = require("connect-flash");
var app = express();


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
app.use(methodOverride("_method"));
app.use(Flash());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    
    // pass to every routes
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

// tell express to use the directory "public"
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");


// no need to type /grounds for the campgroundRoutes
app.use("/grounds",campgroundRoutes);
app.use("/grounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});