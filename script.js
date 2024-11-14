let balance = 1000;
let multiplier = 1;
let betAmount = 0;
let betColor = "";
let redCount = 5;
let blueCount = 5;
let yellowCount = 5;
let totalBalls = 15;
let wincash = 0;
let remainingBalls = totalBalls;
let baseMultiplier = 0.9; // Base multiplier to adjust probabilities

const balanceDisplay = document.getElementById("balance");
const multiplierDisplay = document.getElementById("multiplier");
const potentialEarningsDisplay = document.getElementById("potentialEarnings");
const messageDisplay = document.getElementById("message");
const ballColorDisplay = document.getElementById("ballColor"); // New element for ball color
const startGameButton = document.getElementById("startGame");
const continueGameButton = document.getElementById("continueGame");
const cashOutButton = document.getElementById("cashOut");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
loseSound.playbackRate=2;

// Initial balance display
balanceDisplay.innerText = balance.toFixed(2);

// Event listeners for button actions
startGameButton.addEventListener("click", startGame);
continueGameButton.addEventListener("click", continueGame);
cashOutButton.addEventListener("click", cashOut);

function startGame() {
  betAmount = parseFloat(document.getElementById("betAmount").value);
  betColor = document.getElementById("betColor").value;
  redCount = parseInt(document.getElementById("redCount").value);
  blueCount = parseInt(document.getElementById("blueCount").value);
  yellowCount = parseInt(document.getElementById("yellowCount").value);

  // Check if the total number of balls is 15
  if (redCount + blueCount + yellowCount !== totalBalls) {
    messageDisplay.innerText = "Total number of balls must be 15!";
    return;
  }

  // Check if the player has enough balance
  if (balance < betAmount) {
    messageDisplay.innerText = "Insufficient balance!";
    return;
  }

  // Subtract the bet amount from the balance
  balance -= betAmount;
  balanceDisplay.innerText = balance.toFixed(2);

  // Disable input elements after starting the game
  document.getElementById("redCount").disabled = true;
  document.getElementById("blueCount").disabled = true;
  document.getElementById("yellowCount").disabled = true;
  document.getElementById("betAmount").disabled = true;
  document.getElementById("betColor").disabled = true;
  startGameButton.disabled = true;


  // Calculate the multiplier based on the number of selected balls and probability
  calculateMultiplier();

  // Start the game with the selected bet color
  let ball = getRandomBall();

  wincash = betAmount;

  // Check if the selected color matches the drawn ball
  setTimeout(() => {
    wincash = betAmount;
    // Check if the selected color matches the drawn ball
    if (ball === betColor) {
        winSound.play();  // Play win sound
        messageDisplay.innerText = `You win! You got a ${ball} ball.`;
        ballColorDisplay.innerText = `Ball Color: ${ball.charAt(0).toUpperCase() + ball.slice(1)}`;
        wincash = betAmount * multiplier;
        multiplier *= 1.03; // Increase multiplier after winning
        remainingBalls -= 1;
        if (betColor === "red") redCount -= 1;
        else if (betColor === "blue") blueCount -= 1;
        else if (betColor === "yellow") yellowCount -= 1;
        calculateMultiplier();
        updateUI();
        showContinueAndCashOut();
    } else {
        loseSound.play();  // Play lose sound
        messageDisplay.innerText = `You lose. You got a ${ball} ball.`;
        ballColorDisplay.innerText = `Ball Color: ${ball.charAt(0).toUpperCase() + ball.slice(1)}`;
        wincash = 0;
        multiplier = 1;
        updateUI();
        resetGameControls(); // Reset controls if player loses
    }
},150);  // 2-second delay
}

function continueGame() {
  let ball = getRandomBall();
  if (ball === betColor) {
      winSound.play();  // Play win sound
      messageDisplay.innerText = `You win! You got a ${ball} ball.`;
      ballColorDisplay.innerText = `Ball Color: ${ball.charAt(0).toUpperCase() + ball.slice(1)}`;
      wincash = betAmount * multiplier;
      multiplier *= 1.03; // Increase multiplier after winning
      remainingBalls -= 1;
      if (betColor === "red") redCount -= 1;
      else if (betColor === "blue") blueCount -= 1;
      else if (betColor === "yellow") yellowCount -= 1;
      updateUI();
  } else {
      loseSound.play();  // Play lose sound
      messageDisplay.innerText = `You lose. You got a ${ball} ball.`;
      ballColorDisplay.innerText = `Ball Color: ${ball.charAt(0).toUpperCase() + ball.slice(1)}`;
      balance -= betAmount;
      remainingBalls -= 1;
      wincash = 0;
      multiplier = 1;
      updateUI();
      messageDisplay.innerText += ` | Remaining Balls: ${remainingBalls}`;
      resetGameControls(); // Reset controls if player loses
  }
}

function cashOut() {
  messageDisplay.innerText = `You cashed out. You earned $${(betAmount * multiplier).toFixed(2)}!`;
  balance += wincash;
  updateUI();
  resetGameControls(); // Reset controls after cashing out
}

function getRandomBall() {
  // Generate a random ball from the available balls
  const balls = Array(redCount).fill("red")
    .concat(Array(blueCount).fill("blue"))
    .concat(Array(yellowCount).fill("yellow"));

  const randomIndex = Math.floor(Math.random() * balls.length);
  return balls[randomIndex];
}

function calculateMultiplier() {
  // Calculate multiplier based on the probability of winning
  let selectedBallsCount = 0;

  if (betColor === "red") selectedBallsCount = redCount;
  else if (betColor === "blue") selectedBallsCount = blueCount;
  else if (betColor === "yellow") selectedBallsCount = yellowCount;

  let probability =  remainingBalls/selectedBallsCount;
    multiplier =  probability * baseMultiplier;
  
  if (multiplier > 10) multiplier = 10;
}

function updateUI() {
  balanceDisplay.innerText = balance.toFixed(2);
  multiplierDisplay.innerText = multiplier.toFixed(2);
  potentialEarningsDisplay.innerText = (wincash).toFixed(2);
}

function resetGameControls() {
  // Reset the game controls and state
  messageDisplay.innerText = "Game Over. You lost!";
  
  // Enable the controls for the next game
  startGameButton.disabled = false;
  document.getElementById("redCount").disabled = false;
  document.getElementById("blueCount").disabled = false;
  document.getElementById("yellowCount").disabled = false;
  document.getElementById("betAmount").disabled = false;
  document.getElementById("betColor").disabled = false;
  
  // Reset the multiplier and remaining balls for the next game
  multiplier = 1;
  remainingBalls = totalBalls;
  
  // Hide the continue and cash-out buttons
  continueGameButton.style.display = "none";
  cashOutButton.style.display = "none";
}

function showContinueAndCashOut() {
  // Show the buttons to continue or cash out
  continueGameButton.style.display = "inline-block";
  cashOutButton.style.display = "inline-block";
}
