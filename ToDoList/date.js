// Functions for getting Date and Day values

// Export Date Modules
module.exports = {
  getDate,
  getDay
};

// Create getDate() function for full date
function getDate() {
  // Get todays date
  const today = new Date;

  // Create options for formating the Date
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  // Find what day of the week it is
  return today.toLocaleDateString("en-US", options);

}


// Create getDay() function for only Weekday value
function getDay() {
  // Get todays date
  const today = new Date;

  // Create options for formating the Date
  const options = {
    weekday: "long"
  };

  // Find what day of the week it is
  return today.toLocaleDateString("en-US", options);

}
