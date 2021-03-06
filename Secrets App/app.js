const dotenv = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

// Setup packages to use
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

// Create the port for express to run on
const port = 3000;

// Setup express session
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

// Initilize passport and set to manage sessions
app.use(passport.initialize());
app.use(passport.session());

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/secretsUserDB")

// Create mongoose schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    facebookId: String,
    secret: String
});

// Hash and salt passwords and save users
userSchema.plugin(passportLocalMongoose);
// Use mongoose findOrCreate plugin
userSchema.plugin(findOrCreate);

// Build mongoose model
const User = new mongoose.model("User", userSchema);

// Create authentication process for the user
passport.use(User.createStrategy());

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google Authentication Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
},
    (accessToken, refreshToken, profile, cb) => {
        User.findOrCreate({ googleId: profile.id }, (err, user) => {
            return cb(err, user);
        });
    }
));

// Facebook Authentication Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
},
    (accessToken, refreshToken, profile, cb) => {
        User.findOrCreate({ facebookId: profile.id }, (err, user) => {
            return cb(err, user);
        });
    }
));


// Home Page
app.get("/", (req, res) => {
    res.render("home");
});

// Autherization Route
// Google
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/secrets");
    });

// Facebook
app.get("/auth/facebook",
    passport.authenticate("facebook", { scope: "public_profile" }));

app.get("/auth/facebook/secrets",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/secrets");
    });

// Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// Register Page
app.get("/register", (req, res) => {
    res.render("register");
});

// Secrets Page
app.get("/secrets", (req, res) => {
    // Find all secrets fields in database that are not null
    User.find({ "secret": { $ne: null } }, (err, foundUsers) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUsers) {
                res.render("secrets", { usersWithSecrets: foundUsers });
            }
        }
    });
});

// Submit Page
app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

// Logout Page
app.get("/logout", (req, res) => {
    // Logout with passport
    req.logout();
    res.redirect("/");
});

// Post routes
app.post("/register", (req, res) => {
    // Register the user info with passport
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            // Authenticate with passport
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", (req, res) => {
    // Create a new user with the user input values
    const user = new User({
        username: req.body.username,
        password: req.body.passport
    });
    // Use passport to login the user
    req.login(user, (err) => {
        if (err) {
            console.log(err);
        } else {
            // Authenticate the user login
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            })
        }
    });
});

app.post("/submit", (req, res) => {
    // Create const with the submitted secret from the /submit page
    const submittedSecret = req.body.secret;

    // Find the current user to save their secret
    User.findById(req.user, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(() => {
                    res.redirect("/secrets");
                });
            }
        }
    });
});









// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, () => {
    console.log(`Server has started on port ${port || 3000}`);
});