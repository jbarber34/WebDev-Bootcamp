const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

// Setup packages to use
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

// Create the Heroku port for express to run on
const port = 3000; // process.env.PORT; Save for later

// Connect to Mongoose db
mongoose.connect("mongodb://localhost:27017/wikiDB");

// Create mongoose schema and model
const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", wikiSchema);

////////////////////////////// Requests Targeting ALL Articles //////////////////////////////
// Route all requests through the /articles path for changing all collections
app.route("/articles")
    // Get all articles from database
    .get((req, res) => {
        // Find all articles and send back to client
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })


    // Create the post request from client
    .post((req, res) => {
        // Create new articles in database
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        // Save the new article
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })


    // Delete entire database
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            };
        });
    });


////////////////////////////// Requests Targeting SPECIFIC Articles //////////////////////////////

// Route requests through the /articles/targeted path for changing single collections
app.route("/articles/:articleTitle")
    // Get specific articles from database
    .get((req, res) => {
        // Find all articles and send back to client
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title were found.");
            }
        });
    })

    // Update an entire article
    .put((req, res) => {
        // Update a single article
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            {
                title: req.body.title,
                content: req.body.content
            },
            { overwrite: true }, (err) => {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err)
                }
            });
    })

    // Update only certain portion of an article
    .patch((req, res) => {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("Successfully updated selected portion(s) of article.");
                } else {
                    res.send(err)
                }
            });
    })

    // Delete a specific articl
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Successfully deleted selected article.");
            } else {
                res.send(err);
            };
        });
    });





// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, () => {
    console.log(`Server has started on port ${port || 3000}`);
});