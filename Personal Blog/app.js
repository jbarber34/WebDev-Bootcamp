const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// Setup packages to use
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Connect to Mongoose db
mongoose.connect("mongodb://localhost:27017/blogDB");

// Create mongoose schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

const defaultPost = [homeStartingContent];

// Home page
app.get("/", (req, res) => {

  // Check what we have in our db
  Post.find({}, (err, posts) => {
    // Render the home.ejs file from views folder
    res.render("home", {
      homeContent: homeStartingContent,
      posts: posts
    });
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
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  // Save each new post to the database from above
  post.save((err) => {
    if (!err) {
      // Redirect the response to the home page after post saved
      res.redirect("/");
    }
  });
});


// Dynamic routing
app.get("/posts/:postId", (req, res) => {
  // Turn all titles and posts to lower case and remove any other dash/underscores
  // using lodash package
  const requestedPostId = req.params.postId;
  // Find the post with the matching Id
  Post.findOne({ _id: requestedPostId }, (err, post) => {
    res.render("post", {
      postTitle: post.title,
      postContent: post.content,
      postId: post._id
    })
  });
});


// Delete unecessary posts
app.post("/delete", function (req, res) {

  const idDelete = req.body.button;

  Post.findByIdAndRemove(idDelete, function (err) {
    if (!err) {
      console.log("Successfully deleted post id: " + idDelete);
    }

    res.redirect("/");

  });
});





app.listen(3000, function () {
  console.log("Server started on port 3000");
});
