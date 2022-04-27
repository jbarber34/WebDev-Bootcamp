// Require necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const dates = require(__dirname + '/date.js'); // Custom module

// Create app constant
const app = express();

// Set app to use ejs as view engine
app.set('view engine', 'ejs');

// Set up app use functions
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

// Create empty arrays for item to be used later
// const works here because we're only adding/removing from array, not reassigning
const items = [];
const workItems = [];

// Set the port for the server
const port = 3000;

// Find date by using custom function for list titles
const day = dates.getDate();

// Home page
app.get("/", function (req, res) {
  // Render the list.ejs file from views folder
  // Pass in JS object that has a key value pair
  res.render("list", {
    date: day,
    listTitle: "Personal",
    newListItems: items
  })

});

// Get information from HTML Add List Item
app.post("/", function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    // If item matches clear, clear the entire list
    if (item === 'clear') {
      item = [];
      // If item matches remove and a number, remove that list item
    } else if (item == item.match(/remove [0-9]/)) {
      // Grab the number only to select the item to remove
      let number = parseInt(item.match(/\d+/)[0], 10);
      // Remove the desired item from the array
      workItems == workItems.splice(number - 1, 1);
    } else {
      // If not a clear or remove, add the item to the list
      workItems.push(item);
    }
    // Push the response back to the work page to be added to list
    res.redirect("/work");
  } else {
    // If item matches clear, clear the entire list
    if (item === 'clear') {
      items = [];
      // If item matches remove and a number, remove that list item
    } else if (item == item.match(/remove [0-9]/)) {
      // Grab the number only to select the item to remove
      let number = parseInt(item.match(/\d+/)[0], 10);
      // Remove the desired item from the array
      items == items.splice(number - 1, 1);
    } else {
      // If not a clear or remove, add the item to the list
      items.push(item);
    }
    // Push the response back to the root to be added to list
    res.redirect("/");
  }
});

// Add another route to work page
app.get("/work", function (req, res) {
  res.render("list", {
    date: day,
    listTitle: "Work",
    newListItems: workItems
  })
})

// Add about page route
app.get("/about", function (req, res) {
  res.render("about");
})


// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, function () {
  console.log(`Server is running on port ${port || 3000}`);
});
