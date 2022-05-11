const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

    // Encrypt password with salting and hashing
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            // Use the hash from the bcrypt.hash() function
            password: hash
        });

        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if (result === true) {
                        res.render("secrets");
                    } else {
                        res.send("Incorrect username or password.")
                    }
                });
            };
        };
    });
});









// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, () => {
    console.log(`Server has started on port ${port || 3000}`);
});