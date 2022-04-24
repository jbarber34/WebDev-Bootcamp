// Create an array of the colors for the game
var buttonColors = ["red", "blue", "green", "yellow"];

// Create an empty array
var gamePattern = [];

// Create an empty array for the user click pattern
var userClickedPattern = [];

// Keep track of if game has started in order to run nextSequence()
var started = false;

// Create the level variable for tracking
var level = 0;

// Determine when key has been press and begin sequence and change started to true
$(document).keydown(function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

// Detect when a button is clicked and store that button
$(".btn").click(function() {
  // Find the id of the button that was clicked
  var userChosenColor = $(this).attr("id");
  // Add the chosen color to the pattern
  userClickedPattern.push(userChosenColor);
  // Play the sound for the button selected
  playSound(userChosenColor);
  // Animate the button that was pressed
  animatePress(userChosenColor)
  // Check to see if the user chose the correct answer
  checkAnswer(userClickedPattern.length - 1);
});

// Create a function to check the inputted user answer
function checkAnswer(currentLevel) {
  // Check if the most recent answer is the game as the game pattern
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {

// If the most recent answer was correct, begin the next round
    if (userClickedPattern.length === gamePattern.length) {
      // Call nextSequence() again after delay to start next round
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }
  } else {
    // Play sound for wrong answer
    playSound("wrong");

    // Apply and remove 'wrong' class
    $("body").addClass("game-over");
    setTimeout(function(){
      $("body").removeClass("game-over");
    }, 200);

    // Change h1 to say game over
    $("#level-title").text("Game Over, Press Any Key to Restart");

    // Start the game over
    startOver();
  }
}

// Build a function to generate a random number
function nextSequence() {
  // Reset the userClickedPattern to get ready for next level
  userClickedPattern = [];
  // Increase level each time this is run
  level++;

  // Change h1 to show the current level
  $("#level-title").text("Level " + level);

  // Generate a random number from 0-3
  var randomNumber = Math.floor(Math.random() * 4);
  // Use the random number to select a color from the array
  var randomChosenColor = buttonColors[randomNumber];
  // Add the new color to the pattern array
  gamePattern.push(randomChosenColor);

  // If this is initial turn, delay the flash and sound
  if(!started){
    setTimeout(function(){
      // Select the button with the same id as the color chosen
      $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);

      // Play sound for selected color
      playSound(randomChosenColor)
    }, 500);
  } else {
    // Select the button with the same id as the color chosen
    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);

    // Play sound for selected color
    playSound(randomChosenColor)
  }
}

// Create a function to play the sound cooresponding to the button clicked
function playSound(name) {
  // Play sound the user user clicked
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// Create a function to add animations to user clicks
function animatePress(currentColor) {
  // Add a 'pressed' class to the clicked button
  $("#" + currentColor).addClass("pressed");
  // Remove the class after 100ms
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}


// Create a startOver() function
function startOver(){
// Reset all the patterns for a new game
  level = 0;
  gamePattern = [];
  started = false;
}
