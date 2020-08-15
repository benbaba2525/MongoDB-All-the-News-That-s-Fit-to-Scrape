var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models")

var port = process.env.PORT || 4000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set('index', __dirname + '/views');

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrapeDB";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
var results = [];

// Start routes here...
app.get("/", function (req, res) {
    db.Article.find({ saved: false }, function (err, result) {
        if (err) throw err;
        res.render("index", { result })
    })

});
app.get("/newscrape", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
        var $ = cheerio.load(response.data)
        $("h2 span").each(function (i, element) {
            var headline = $(element).text();
            var link = "https://www.nytimes.com";
            link = link + $(element).parents("a").attr("href");
            var summaryOne = $(element).parent().parent().siblings().children("li:first-child").text();
            var summaryTwo = $(element).parent().parent().siblings().children("li:last-child").text();

            if (headline && summaryOne && link) {
                results.push({
                    headline: headline,
                    summaryOne: summaryOne,
                    summaryTwo: summaryTwo,
                    link: link
                })
            }
        });
        db.Article.create(results)
            .then(function (dbArticle) {
                res.render("index", { dbArticle });
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            })
        app.get("/", function (req, res) {
            res.render("index")
        })
    })
});

app.put("/update/:id", function (req, res) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!")
    db.Article.updateOne({ _id: req.params.id }, { $set: { saved: true } }, function (err, result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
});
app.delete("/delete/:id", function(req, res) {
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    console.log(req.body)
    db.Article.findOneAndDelete({ _id: req.params.id }, { $set: { saved: false }}, function(err, result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            res.status(200).end();
        }
    })
});

app.put("/newnote/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
  .then(function(dbNote) {
    // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});




app.get("/saved", function (req, res) {
    var savedArticles = [];
    db.Article.find({ saved: true }, function (err, saved) {
        if (err) throw err;
        savedArticles.push(saved)
        res.render("saved", { saved })
    })
})


app.listen(port, function () {
    console.log("Server listening on: http://localhost:" + port);
})
