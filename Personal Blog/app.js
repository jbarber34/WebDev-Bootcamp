//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// Create empty arrays to be added to later
let posts = [];

// Setup packages to use
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Connect to Mongoose db
mongoose.connect("mongodb://localhost:27017/personalblogDB");

// Create mongoose schema and model
const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postsSchema);

// Create new item for database
const defPost = new Post({
  title: "Home",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const defaultPost = [defPost];

// Home page
app.get("/", function (req, res) {

  // Check what we have in our db
  Post.find({}, (err, foundPosts) => {
    // Check to see if the database is empty, if so, insert default post
    if (foundPosts.length === 0) {
      Post.insertOne(defaultPost, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved default items to DB.")
        }
      });

      // Redirect to the root so added items appear
      res.redirect("/");

    } else if (err) {
      console.log(err);
    } else {
      console.log(foundPosts.title)

      // Render home.ejs file from view folder
      res.render("home", {
        homeContent: foundPosts.title,
        posts: foundPosts.content
      })
    }
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  });
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  });
});

// Compose page
app.get("/compose", (req, res) => {
  res.render("compose");
});

// Post results of Compose page
app.post("/compose", (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  // Push each new post to the empty array from above
  posts.push(post);
  // Redirect the response to the home page after submission
  res.redirect("/");
});


// Dynamic routing
app.get("/posts/:blogPost", (req, res) => {
  // Turn all titles and posts to lower case and remove any other dash/underscores
  // using lodash package
  const requestedTitle = _.lowerCase(req.params.blogPost);
  // Compare requested title vs all titles in posts array
  posts.forEach((post) => {
    const storedTitle = _.lowerCase(post.title);
    if (storedTitle === requestedTitle) {
      res.render("post", {
        postTitle: post.title,
        postContent: post.content
      });
    };
  });
});







app.listen(3000, function () {
  console.log("Server started on port 3000");
});
