var mongoose = require("mongoose");
var Campground = require("./models/ground.js");
var Comment = require("./models/comment.js");
var initialData = [
    {
        name:"Salmon",
        image:"http://www.fondulacpark.com/wp-content/uploads/2015/01/campground-pic-1.jpg",
        description: "aaaa"
    },
    {
        name:"Sea",
        image:"http://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/10/main/hoodview-campground-0510.jpg?itok=B8Eb65Uf",
        description: "aaaa"
    },    
    {
        name:"Sake",
        image:"https://www.reserveamerica.com/webphotos/NRSO/pid75386/0/540x360.jpg",
        description: "aaaa"
    }
    ];

//remove campgrounds
function seedDB(){
    Campground.remove({},function(err,info){
        if(err){
            console.log(err);
        } else{
            console.log("removed success");
                // add a few campgrounds
            initialData.forEach(function(seed){
            //loop through and add to db
            Campground.create(seed,function(err,camp){
            if(err){
                console.log(err);
            } else{
                console.log("campground added");
                //add comments
                Comment.create(
                    {
                        text:"Wow",
                        author: "Alex"
                },function(err,comment){
                    if(err){
                        console.log(err);
                    } else{
                        // push to coment array for the camp
                        camp.comments.push(comment);
                        // save the camp
                        camp.save();
                        console.log("new comment created");
                    }
                });
            }
            });
        });
    }
});
    

    
    //add comments
}

//send seedDB out
module.exports = seedDB();
