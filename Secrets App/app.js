const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

// Setup packages to use
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

// Create the port for express to run on
const port = 3000;

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/secretsUserDB")

// Create mongoose schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Build mongoose model
const User = new mongoose.model("User", userSchema);


// Home Page
app.get("/", (req, res) => {
    res.render("home");
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

// Post routes
app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        // Use md5 hash function to encrypt the incoming password
        password: md5(req.body.password)
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = md5(req.body.password)

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                } else {
                    res.send("Incorrect Username or Password")
                };
            };
        };
    });
});









// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, () => {
    console.log(`Server has started on port ${port || 3000}`);
});