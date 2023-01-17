"use-strict";

let diceContainer = document.querySelector(".dice-container"),
    rollDiceBtn = document.querySelector("button.roll-dice"),
    holdScoresBtn = document.querySelector("button.hold-score"),
    newGameBtn = document.querySelector("button.new-game"),
    winnerAudio = new Audio("./sounds/winner-sound.mp3"),
    failAudio = new Audio("./sounds/fail-sound.mp3"),
    rollDiceAudio = new Audio("./sounds/dice-roll.mp3"),
    currentScores,
    activePlayer,
    isPlayerWon,
    highScore = 10;

function resetGame() {
    // reset variables
    (currentScores = [0, 0]), (activePlayer = 0), (isPlayerWon = false);

    // reset html scores values
    document.querySelectorAll(".current-score").forEach((player) => (player.textContent = 0));
    document.querySelectorAll(".total-score").forEach((player) => (player.textContent = 0));

    // enable buttons
    rollDiceBtn.disabled = false;
    holdScoresBtn.disabled = false;

    // change dice img to default
    diceContainer.style = "--background-src-img: url(./imgs/dice-6.svg)";

    // remove winner class from players
    document.querySelectorAll(".player").forEach((player) => player.classList.remove("winner"));

    // remove winner text from players
    document.querySelectorAll(".player-name").forEach((player) => (player.textContent = player.textContent.replace(" 🏆", "")));

    // change active player
    document.querySelector(".player-1").classList.add("active");
    document.querySelector(".player-2").classList.remove("active");

    // stop any playing audio
    winnerAudio.pause();
    failAudio.pause();
    rollDiceAudio.pause();
}

resetGame();

// a function to simulate rolling dice
function rollDice() {
    // add rolling class to dice container to animate rolling
    diceContainer.classList.add("rolling");

    // play rolling dice audio
    rollDiceAudio.play();

    // get random dice value
    let diceRandVal = Math.floor(Math.random() * 6) + 1;

    // remove the rolling animation after 1 second
    setTimeout(() => {
        diceContainer.classList.remove("rolling");
        // change the dice image variable to the random value
        diceContainer.style = `--background-src-img: url(./imgs/dice-${diceRandVal}.svg)`;

        // stop dice playing audio
        rollDiceAudio.stop();
    }, Math.floor(1000));

    // return the value of the dice
    return diceRandVal;
}

// function to switch current player
let switchPlayer = () => {
    // remove the active class from the current player
    document.querySelector(`.game-container .player.player-${activePlayer + 1}`).classList.remove("active");

    // reset the current score of the current active player
    currentScores[activePlayer] = 0;
    document.querySelector(`.player-${activePlayer + 1} .current-score`).textContent = 0;
    // change active player value
    activePlayer = activePlayer === 0 ? 1 : 0;

    // add the active class to the new active player
    document.querySelector(`.game-container .player.player-${activePlayer + 1}`).classList.add("active");
};

// when roll dice button clicked
rollDiceBtn.addEventListener("click", function () {
    // call the rollDice function and store the dice value into variable
    let diceValue = rollDice();

    // check if the rolling animation is still active every 100ms
    let rollingStatus = setInterval(() => {
        // if the animation finished
        if (!diceContainer.classList.contains("rolling")) {
            // check if the dice value is 1
            if (diceValue === 1) {
                switchPlayer();
            } else {
                currentScores[activePlayer] += diceValue;
                document.querySelector(`.player-${activePlayer + 1} .current-score`).textContent = currentScores[activePlayer];

                let playerTotalScore = +document.querySelector(`.player-${activePlayer + 1} .total-score`).textContent;

                // if player score reaches the high score
                if (currentScores[activePlayer] + playerTotalScore >= highScore) {
                    isPlayerWon = true;
                    winnerAudio.play();
                    document.querySelector(`.player-${activePlayer + 1}`).classList.add("winner");
                    document.querySelector(`.player-${activePlayer + 1} .player-name`).textContent += " 🏆";
                    document.querySelector(`.player-${activePlayer + 1} .total-score`).textContent =
                        +document.querySelector(`.player-${activePlayer + 1} .total-score`).textContent + currentScores[activePlayer];
                    rollDiceBtn.disabled = true;
                    holdScoresBtn.disabled = true;
                }
            }
            // stop the interval
            clearInterval(rollingStatus);
        }
    }, 100);
});

// when user click on hold score button
holdScoresBtn.addEventListener("click", () => {
    if (currentScores[activePlayer] !== 0) {
        // get the current active player score element
        let currentPlayer = document.querySelector(`.player-${activePlayer + 1} .total-score`);

        // add the current active player score to the total score
        currentPlayer.textContent = +currentPlayer.textContent + currentScores[activePlayer];
    }

    switchPlayer();
});

newGameBtn.addEventListener("click", function () {
    resetGame();
});
