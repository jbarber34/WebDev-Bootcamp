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

// Get all articles from database
app.get("/articles", (req, res) => {
    // Find all articles and send back to client
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});


// Create the post request from client
app.post("/articles", (req, res) => {
    // Create new articles in database
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    // Save the new article
    newArticle.save((err) => {
        if (!err) {
            res.send("Successfully added a new article.")
        } else {
            res.send(err);
        }
    });
});


// Delete entire database
app.delete("/articles", (req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Successfully deleted all articles.")
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