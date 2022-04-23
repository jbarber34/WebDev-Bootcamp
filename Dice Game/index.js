// Set the random number variables to "roll the dice"
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;


// Set a timer to display info shortly after page is loaded
setTimeout(function(){

  // Change the image to be displayed back on the results of the random "dice roll"
  document.querySelector(".img1").setAttribute("src", "images/dice" + randomNumber1 + ".png");
  document.querySelector(".img2").setAttribute("src", "images/dice" + randomNumber2 + ".png");

  // Change the text based on the winner
  var winner = ""
  if (randomNumber1 > randomNumber2) {
    winner = "🚩 Player 1 Wins!";
  } else if (randomNumber2 > randomNumber1) {
    winner = "Player 2 Wins! 🚩";
  } else if (randomNumber1 == randomNumber2) {
    winner = "Draw!";
  }
  document.querySelector("h1").innerHTML = winner;
}, 500) // 500 ms


setTimeout(function(){
  document.querySelector("h1").innerHTML = "Play Again? Refresh Me!";
}, 3000);
