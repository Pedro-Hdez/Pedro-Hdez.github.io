"use strict";

// This funcction displays the corresponding message according to a specific case
const displayMessage = function (message) {
  document.querySelector(".message").textContent = message;
};

// First secret number is generated and the score is set to its max value.
let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;

// Logic for "Check" button
document.querySelector(".check").addEventListener("click", function () {
  // Getting the user input number
  const usrNumber = Number(document.querySelector(".guess").value);
  // Getting the message object
  const message = document.querySelector(".message");
  // Getting the score object
  const scoreText = document.querySelector(".score");

  // if there is no number, then nothing happens but display the "No number" message
  if (!usrNumber) {
    displayMessage("No number!");
  } else if (usrNumber !== secretNumber) {
    // Case when user number is incorrect
    if (score > 1) {
      // Case when there are attempts left
      usrNumber > secretNumber
        ? displayMessage("Too high!")
        : displayMessage("Too low...");
    } else {
      // Case when there are no more attempts
      displayMessage(`Game Over. The secret number was ${secretNumber}`);
      document.querySelector(".number").textContent = secretNumber;
      document.querySelector(".check").disabled = true;
      document.querySelector(".guess").disabled = true;
    }
    scoreText.textContent = --score;
  } else {
    // Case when user number is correct
    document.querySelector(".number").textContent = secretNumber;
    displayMessage("CORRECT NUMBER!");

    // Check if highscore needs to be updated
    const highscore = document.querySelector(".highscore");
    if (score > Number(highscore.textContent)) {
      highscore.textContent = score;
    }
    score = 20;

    // Win animation and check button disablement
    document.querySelector(".check").disabled = true;
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").style.width = "30rem";
    document.querySelector(".guess").disabled = true;
  }
});

// Logic for "Try Again!" button (Reset case)
document.querySelector(".again").addEventListener("click", function () {
  score = 20;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".message").textContent = "Start guessing...";
  document.querySelector(".guess").value = "";
  document.querySelector(".guess").disabled = false;

  document.querySelector(".check").disabled = false;
  document.querySelector(".score").textContent = "20";
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector("body").style.backgroundColor = "#222";
  document.querySelector(".number").style.width = "15rem";
});
