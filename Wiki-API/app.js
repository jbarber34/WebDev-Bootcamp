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



// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, () => {
    console.log(`Server has started on port ${port || 3000}`);
});