var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
//var db = require("./models")

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeDb";
// Connect to Mongo  DB
//mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
//var results = [];

// Start Routes

app.get("/", function(req, res){
    /*db.Article.find({saved: false}, function(err, result){
        // Show any errors
    if (error) {
        console.log(error);
      }
      else {*/
        // Otherwise, send the response to the client (for axios success function)
        res.render("index");
     // }
   // })

});
// Scrape data from one site and place it into the mongodb db
/*app.get("/scrape", function(req, res){
    // Make a request via axios for the news section of foxnews
 axios.get("https://www.foxnews.com/").then(function(respnse){
     var $ = cheerio.load(response.data);
 })

})*/

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });