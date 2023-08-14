const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log(err);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title, req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Success new article added");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Success delete all article");
      } else {
        res.send(err);
      }
    });
  });

//get article by title
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("No article found");
            }
        });
    })

    //Update the article using PUT
    //Here is needed a object with all fields filled 
    //or they will be nulled after the update
    .put(function (req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function (err) {
                if(!err){
                    res.send("Article update sucess");
                } else {
                    res.send(err);
                }
            }
        );
    })

    //Update the article using PATCH
    //If the request comes with just one field
    //This make the update without making null the others fields
    .patch(function (req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function (err) {
                if(!err){
                    res.send("Article update sucess");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete(function (req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if(!err){
                res.send("Article deleted");
            } else {
                res.send("error deleting - No article found" + err);
            }
        });
    });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
