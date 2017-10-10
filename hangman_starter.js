const readlineSync = require('readline-sync');

// this array holds all the possible words that can be the answer

let words = [
    'hey',
    'person',
    'you',
    'think',
    'youre',
    'better',
    'than',
    'me'
];

let answer;
let nWrong;
let pastGuesses = [];
let pastGames = [];
let cont = true;
let won = false;
let gameStats = {};

/*
PART 1

Pseudocode that represents game logic.

Step 1: Set up default values for start of game
Step 2: Choose a random word
Step 3: Print Hangman
Step 4: Let user make a guess
Step 5: check if it is already guessed
        if yes : ask for another guess
        else : add it to the list of past guesses
            : Check if the guess is correct
                : if yes : Print Game state
                    : check if the guessed letters match the answer and user has won
                    if yes: User has Won and Game is over
                : else : Incremet the wrong guesses counter
                    : check if wrong guesses are greater than 6
                    if yes: User has lost and game is over
                    else: go to Step 3
*/


/**
 * @summary Constructor function to create game object
 */
function Games(attempts, result, guesses) {
    this.attempts = attempts;
    this.result = result;
    this.guesses = guesses;
}


/**
 * @summary starts the game.
 */
function startGame() {
    setUpGame();
    while (!checkGameOver()) {
        printGameState();
        const guess = readlineSync.question("please enter a guess: ");
        console.log('guess is', guess);
        /*
            PART 2

            Checks to see whether or not the guess the user entered is valid here.
                1: check if guess already exist in pastGuesses array.
                2: If not, add it to pastGuesses
                3: if the guessed letter does not match with the answer,
                    increment the wrong guesses counter.
            
        */
        let match = false;
        //check if it is in pastguesses else add to it
        if (pastGuesses.indexOf(guess) !== -1) {
            console.log('The letter is already guessed ', guess);
            match = true;
        }

        if (!match) {
            pastGuesses.push(guess);
            let found;

            if (answer.indexOf(guess) !== -1) {
                found = true;
                console.log("You found a relevant number");
            }

            if (!found) {
                console.log("Oops! Incorrect Choice. Please try again");
                nWrong++;
            }
        }
    }
    printGameState();
}


/**
 * @summary Checks if the game is over
 */
function checkGameOver() {
    checkInputStatus();
    gameStats = {
        'attempts': answer.length + nWrong,
        'guessedLetters': pastGuesses
    }
    if (won) {
        gameStats.result = 'Won';
    } else {
        gameStats.result = 'Lost';
    }

    if ((nWrong >= 6) || (won)) {
        outputResults();
        return true;
    }

    return false;
}


/**
 * @summary Display the Results after game is over.
 */
function outputResults() {
    pastGames.push(new Games(gameStats.attempts, gameStats.result, gameStats.guessedLetters));
    if (won) {
        console.log("Well Played! You have Won");
    } else {
        console.log("You Lost!");
    }
    console.log('Your Game statistics: ' + JSON.stringify(gameStats));
    console.log('Your Past Games: ' + JSON.stringify(pastGames));
}


/**
 * @summary Prints the state of game after every guess.
 */
function printGameState() {
    //Add a console.log here to print the previous guesses.
    console.log('\n');
    let str = checkInputStatus();
    console.log(str);

    console.log('\n');
    printHangMan(nWrong);
    console.log('\n\n');
}


/**
 * @summary Checks if the guessed letter is correct and if the collection of letters input by user matches the answer.
 */
function checkInputStatus() {
    let str = "";
    let counter = 0;
    // for each letter in the target word
    for (let i = 0; i < answer.length; i++) {
        let found = false;
        // loop through the pastGuesses
        for (let j = 0; j < pastGuesses.length; j++) {
            // and check each element of past guesses to see if it matches the
            if (answer[i] === pastGuesses[j]) {
                found = true;
            }
        }
        if (found) {
            str += answer[i];
            str += "\t";
            counter++;
        } else {
            str += "_\t";
        }
    }
    if (counter === answer.length) {
        won = true;

    }
    return str;
}

/* 
 =========================================================================================
     Below are functions that may help with your logic, but do not need any modification
 =========================================================================================
*/


/**
 * @summary Choose random word from array of words.
 */
function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}


/**
 * @summary Prints the hangman.
 */
function printHangMan(nWrong) {
    //Don't worry about the syntax you see here.  The ? operator is a succinct way to write an
    //if statement that has two results. Think of it as:
    // statement_that_is_true_or_false ? happens_if_true : (OR) happens_if_false 
    const headSpot = (nWrong > 0) ? "O" : " ";
    const bodySpot = (nWrong > 1) ? "|" : " ";
    const leftArm = (nWrong > 2) ? "/" : " ";
    const rightArm = (nWrong > 3) ? "\\" : " ";
    const leftLeg = (nWrong > 4) ? "/" : " ";
    const rightLeg = (nWrong > 5) ? "\\" : " ";

    let str = "";
    console.log(" ___ ");
    console.log(" |  | ");
    console.log(" |  " + headSpot + " ");
    console.log(" | " + leftArm + bodySpot + rightArm);
    console.log(" | " + leftLeg + " " + rightLeg);
    return;
}


/**
 * @summary Sets defaults for the start of new game.
 */
function setUpGame() {
    // choose a new word
    answer = getRandomWord().split('');
    // reset the total of wrong guesses
    nWrong = 0;
    won = false;
    // empty our array of previously guessed letters
    pastGuesses = [];
}

startGame()

while (cont) {
    let answer = readlineSync.question('Would you like to play again? y/n')
    if (answer.toLowerCase() === 'y') {
        startGame();
    } else if (answer.toLowerCase() === 'n') {
        cont = false;
        console.log('Good game!')
    } else {
        console.log('Please enter either y (yes) or n (no).')
    }
}