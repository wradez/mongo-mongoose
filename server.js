var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/", function(req, res) {
    console.log("/ route hit");
    db.Article.find({})
      .then(function(dbArticle) {
          console.log(".find test");
        console.log(dbArticle);
        res.render('page', {article: dbArticle});
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    var newComment = req.body;
    db.Comment.create(newComment)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbComment._id } }, { new: true });
      })
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        console.log(err);

        res.json(err);
      });
  });
  

app.get("/scrape", function(req, res) {
  axios.get("https://oldschool.runescape.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    $("section article div").each(function(i, element) {
      var result = {};

      result.headline = $(element).children("h3").text(); //showing it can be done with element
      result.URL = $(element).children("h3").children("a").attr("href"); //showing it can be done with this
      result.summary = $(element).children("p").text(); //showing it can be done with this

      db.Article.create(result)
        .then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    db.Article.find({})
      .then(function(dbArticle) {
        res.render('page', {article: dbArticle});
      })
      .catch(function(err) {
        res.json(err);
      });

  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
