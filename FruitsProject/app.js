
// Load in packages
const mongoose = require('mongoose');

//  Connect to mongoose
mongoose.connect("mongodb://localhost:27017/fruitsDB");

// Create new Schema
const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must supply a Fruit name!']
    },
    rating: {
        type: Number,
        min: 1,
        max: [10, 'Please Rate 1-10']
    },
    review: String
});

// Create Mongoose model
const Fruit = mongoose.model("Fruit", fruitSchema);

// Create Fruit document
const fruit = new Fruit({
    name: "Strawberry",
    rating: 10,
    review: "Strawberries are the best!"
});

// Save document into the Fruits collection inside the fruitDB
// fruit.save();

// Create second Schema
const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    // Embed the fruitSchema inside persons schema
    favoriteFruit: fruitSchema
});

// Second Mongoose model
const Person = mongoose.model("Person", personSchema);

// Create new fruit inside person schema
const pineapple = new Fruit({
    name: "Pineapple",
    score: 9,
    review: "Great Fruit!"
})

// pineapple.save();

const grapes = new Fruit({
    name: "Grapes",
    score: 5,
    review: "Alright fruit."
})

// grapes.save();

// Create person document
const person = new Person({
    name: "Amy",
    age: 12,
    favoriteFruit: pineapple
});

// Save document into the Person collection inside the fruitDB
// person.save();



// Check what we have in our db
Fruit.find(function (err, fruits) {
    if (err) {
        console.log(err);
    } else {
        // Close database connection
        // mongoose.connection.close();

        // Loop through and display each fruit name in db
        fruits.forEach(fruits => {
            console.log(fruits.name);
        });
    }
});

// // Update a document
// Fruit.updateOne(
//     {
//         _id: "625c47a8cfb8cadf7064aded"
//     },
//     {
//         name: 'Peach',
//         review: 'Peaches are amazing!'
//     }, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Successfully updated the document.");
//         }
//     });

// // Delete a document
// Fruit.deleteOne(
//     {
//         _id: "625b5375baa0e80ca1776c43"
//     }, function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Successfully deleted the document.")
//         }
//     }
// );