// Require packages in the script
const express = require('express');
const bodyParser = require('body-parser');
// Create function to represent packages
const app = express();
// bodyParser.urlencoded() parses data that comes from HTML form
app.use(bodyParser.urlencoded({extended: true}));
// Create the port for express to run on
const port = 3000;

// Home page
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

// Build the process for a user to post
// Need to install 'npm install body-parser' to parse the inputs
app.post("/", function(req, res){
  // Use 'Number()' to turn the text input to numeric
  // 'req.body.num1' is what pulls the inputs from the HTML portion
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);
  var result = num1 + num2;
  res.send("The result of the calculation is " + result);
});

// Add link to BMI Calculator
app.get("/bmicalculator", function(req, res){
  res.sendFile(__dirname + "/bmiCalculator.html");
});

// Post BMI Calculator results
app.post("/bmicalculator", function(req, res){
  // Parse the value to a float rather than a whole number
  var height = parseFloat(req.body.height);
  var weight = parseFloat(req.body.weight);
  var bmi_calc = Math.round(weight / Math.pow(height, 2) * 703);
  res.send("<h1>BMI Result</h1> Your BMI is " + bmi_calc);
})

// Make the app listen on the selected port
// Stop listening with Ctl + C
app.listen(port, function() {
  console.log(`Calculator app listening on port ${port}`);
});
