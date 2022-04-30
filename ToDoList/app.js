// Require necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");
const dates = require(__dirname + '/date.js'); // Custom module
const config = require('./config.json');

// Create app constant
const app = express();

// Create the Heroku port for express to run on
const port = process.env.PORT;
// Find date by using custom function for list titles
const day = dates.getDate();

// Set app to use ejs as view engine
app.set('view engine', 'ejs');

// Set up app use functions
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

// Connect to new database in mongodb
mongoose.connect(config.MONGOOSE_CONNECT)

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

// Create new schema for custom lists
const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

// Home page
app.get("/", (req, res) => {

  // Check what we have in our db
  Item.find({}, (err, foundItems) => {
    // Check to see if the database is empty, if so, insert default items
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
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
        listTitle: day,
        newListItems: foundItems
      });
    };
  });
});


// Add about page route
app.get("/about", function (req, res) {
  res.render("about");
})



// Dynamic routing
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create a new list if it's not yet created
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);

      } else {
        // Show list if it already exists
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});


// Get information from HTML Add List Item
app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    // Redirect to root if item being added to personal list
    item.save();
    res.redirect("/");
  } else {
    // Else redirect to the custom list
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});


// Create the post request to delete items from list
app.post("/delete", (req, res) => {

  // Find which item on the list was checked.
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    // If on the root page:
    // Remove the checked item from the list after a 1-second delay
    setTimeout(() => {

      Item.findByIdAndRemove(checkedItemId, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully removed item ID " + checkedItemId + ".")
          res.redirect("/");
        }
      });

    }, 1000);
  } else {
    // If coming from custom page
    setTimeout(() => {

      List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } },
        (err, foundList) => {
          if (!err) {
            res.redirect("/" + listName);
          }
        });

    }, 1000);
  }
});


// Make the app listen on the selected port
// Using || (OR) allows the app to listen on cloud server and local 3000
app.listen(port || 3000, () => {
  console.log(`Server has started on port ${port || 3000}`);
});
