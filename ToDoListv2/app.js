// Require necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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

// Connect to new database in mongodb
mongoose.connect('mongodb://localhost:27017/todolistDB')

// Create mongoose schema and model
const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

// Create new item for database
const item1 = new Item({
  name: "Welcome to your To-Do List!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

// Set the port for the server
const port = 3000;

// Home page
app.get("/", function (req, res) {

  // Check what we have in our db
  Item.find({}, function (err, foundItems) {
    // Check to see if the database is empty, if so, insert default items
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.")
        }
      });

      // Redirect back to the root so added items appear
      res.redirect("/");

    } else if (err) {
      console.log(err);
    } else {

      // Render the list.ejs file from views folder
      // Pass in JS object that has a key value pair
      res.render("list", {
        date: "Today",
        listTitle: "Personal",
        newListItems: foundItems
      });
    };
  });
});

// Get information from HTML Add List Item
app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");

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
