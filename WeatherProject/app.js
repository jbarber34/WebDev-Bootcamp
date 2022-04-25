// Require packages in the script
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const config = require('./config.json');

// Create function to represent packages
const app = express();
// Create the port for express to run on
const port = 3000;


// Use body parser app
app.use(bodyParser.urlencoded({ extended: true }));

// Home page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Post HTML file to Server
app.post("/", function (req, res) {

  // Store the API string
  const query = req.body.cityName;
  const apiKey = config.SECRET_API_KEY;
  console.log(apiKey);
  const units = "Imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      // Turn JSON into Javascript object
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      // res.write() will write things to the page so you can have more than on
      // since you can only have a single res.send()
      res.write("<p>The weather is currently: " + weatherDescription + "</p>");
      res.write("<h1>The temperature in " + query + " is " + temp + " degrees Fahrenheit.</h1>");
      res.write("<img src=" + imageURL + ">");
      // After writing, send it off
      res.send();
    })
  })
});



// Make the app listen on the selected port
// Stop listening with Ctl + C
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
