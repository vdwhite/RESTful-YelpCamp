var mongoose = require("mongoose");


//schema setup
var campGroundsSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   //comments should be in an array with comment ids
   comments:[
       {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment" 
       }
      ]
});

module.exports = mongoose.model("Campground", campGroundsSchema);