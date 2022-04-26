// Require packages in the script
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const config = require('./config.json');

// Create function to represent packages
const app = express();
// Need function for static css file
app.use(express.static("public"));
// Use body parser app
app.use(bodyParser.urlencoded({
  extended: true
}));

// Create the port for express to run on
// In order to connect to Heroku, use process.env.PORT
// The port is now defined by Heroku
const port = process.env.PORT;

// Home page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// Post HTML file to Server
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // Mailchimp section
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  // Turn our members data object into JSON format
  const jsonData = JSON.stringify(data);

  // Create url for Mailchimp servers - last section is the User List ID
  const url = config.MAILCHIMP_URL;

  // Create options
  // auth is a string, any values followed by ':', followed by your mailchimp auth code
  const options = {
    method: "POST",
    auth: config.MAILCHIP_AUTH
  };

  // Set request from HTTPS
  const request = https.request(url, options, function (response) {

    // Get the statusCode in order to redirect the client
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  })

  request.write(jsonData);
  request.end();

});

// Redirect the user back to the home page if the request fails
app.post("/failure", function (req, res) {
  res.redirect("/")
})


// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, function () {
  console.log(`Server is running on port ${port || 3000}`);
});


// API Key
// 154138efa386a500ef265dfe54f3d10a-us14

// List ID
// eedb477f58
