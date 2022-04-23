// Set up a listener so the function is called only when the button is clicked
// Make sure to leave the "()" off the function or it will be called right away
// document.querySelector("button").addEventListener("click", handleClick);
//
// function handleClick(){
//   alert("I got clicked!");
// }

// More popular way to complete this task, although the same output as above
for (var i = 0; i < document.querySelectorAll(".drum").length; i++) {
  // Detecting Button Press
  // Can also use an "anonymous" function - this is the same output as above.
  document.querySelectorAll(".drum")[i].addEventListener("click", function() {

    var buttonInnerHTML = this.innerHTML;
    playSounds(buttonInnerHTML);
    buttonAnimation(buttonInnerHTML);

  });
}
// Detecting Keyboard Press
document.addEventListener("keydown", function(event){

  var keyPress = event.key;
  playSounds(keyPress);
  buttonAnimation(keyPress);
});

// This function plays a sound based on the key that is clicked/pressed
function playSounds(key){
  switch (key) {
    case "w":
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;

    case "a":
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;

    case "s":
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play();
      break;

    case "d":
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;

    case "j":
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;

    case "k":
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;

    case "l":
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;

    default: console.log(this.innerHTML)

  }
}

function buttonAnimation(currentKey){
  // grab the key that is being pressed
  var activeButton = document.querySelector("." + currentKey);
  // add class to give CSS effects to highlight button when pushed
  activeButton.classList.add("pressed");

  // remove the class to "reset" to normal so it's good to be pressed again
  setTimeout(function(){
    activeButton.classList.remove("pressed");
  }, 100);
}
