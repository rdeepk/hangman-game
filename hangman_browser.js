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
let guess;
let wonCount = 0, lostCount = 0;
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


/**
 * @summary Constructor function to create game object
 */
function Games(attempts, result, guesses, won) {
    this.attempts = attempts;
    this.result = result;
    this.guesses = guesses;
}

/**
 * @summary Events to trigger when document is ready.
 */
$(function () {
    setUpGame();
    printGameState();
    let values = '';
    for (let i = 0; i < letters.length; i++) {
        switch(letters[i]) {
            case "N":
            values += "<div><span class='" + letters[i] + "'><a href='#' onclick='letterClickHandler(\"" + letters[i] + "\"); event.preventDefault()';>" + letters[i] + "</a> </span>";
            break;

            case "Z":
            values += "<span class='" + letters[i] + "'><a href='#' onclick='letterClickHandler(\"" + letters[i] + "\"); event.preventDefault()';>" + letters[i] + "</a> </span></div>";
            break;

            default:
            console.log("default");
            values += "<span class='" + letters[i] + "'><a href='#' onclick='letterClickHandler(\"" + letters[i] + "\"); event.preventDefault()';>" + letters[i] + "</a> </span>";
        }
        $('.letters').html(values);
    }
})


/**
 * @summary Handler after user choose a letter.
 */
function letterClickHandler(id) {
    guess = id.toLowerCase();
    $('.letters .' + id + ' a').css({
        "pointer-events": "none",
        "color": "red"
    });

    let match = false;
    //check if it is in pastguesses else add to it
    if (pastGuesses.indexOf(guess) !== -1) {
        console.log('The letter is already guessed ', guess);
        match = true;
    }

    if (!match) {
        pastGuesses[pastGuesses.length] = guess;
        console.log(pastGuesses);
        let found;

        if (answer.indexOf(guess) !== -1) {
            found = true;
            console.log("You found a relevant number");
        }

        if (!found) {
            console.log("Oops! Incorrect Choice. Please try again");
            nWrong++;
        }
        printGameState();
        checkGameOver();
    }
}


/**
 * @summary Prints the hangman.
 */
function printHangMan(nWrong) {
    const headSpot = (nWrong > 0) ? "O" : " ";
    const bodySpot = (nWrong > 1) ? "|" : " ";
    const leftArm = (nWrong > 2) ? "/" : " ";
    const rightArm = (nWrong > 3) ? "\\" : " ";
    const leftLeg = (nWrong > 4) ? "/" : " ";
    const rightLeg = (nWrong > 5) ? "\\" : " ";

    let str = "";

    basic = " ___ " + "<br>" + " |&nbsp;&nbsp;| " + "<br>" + " |  " + headSpot + " " + "<br>" + " | " + leftArm + bodySpot + rightArm + "<br>" + " | " + leftLeg + " " + rightLeg;
    $(".hangman").html(basic);
    return;
}


/**
 * @summary Sets defaults for the start of new game.
 */
function setUpGame() {
    // choose a new word
    answer = getRandomWord().split('');
    console.log(answer);
    // reset the total of wrong guesses
    nWrong = 0;
    won = false;
    // empty our array of previously guessed letters
    pastGuesses = [];
    printHangMan();
    printGameState();
    $('.letters a').css({
        "pointer-events": "auto",
        "color": "#007bff"
    });
    $('.message').html("");
    $('.guesses').css({
        "display": "none"
    });
}


/**
 * @summary Choose random word from array of words.
 */
function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}


/**
 * @summary Prints the state of game after every guess.
 */
function printGameState() {
    //Add a console.log here to print the previous guesses.
    //console.log('\n');
    let str = checkInputStatus();
    console.log(str);
    $('.answer-string').html(str);
    printHangMan(nWrong);
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
            str += "__\t";
        }
    }
    if (counter === answer.length) {
        won = true;

    }
    return str;
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
    console.log("Checking...")
    console.log("tries: " + nWrong);
    if ((nWrong >= 6) || (won)) {
        $('.letters a').css({
            "pointer-events": "none"
        });
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
        $('.message').html("Well played! You have won");
        $('.message').css({
            "color": "green"
        });
        wonCount++;
    } else {
        $('.message').html("Sorry, you have been hanged! The answer was<br>" + answer.join("").toUpperCase());
        $('.message').css({
            "color": "red"
        });
        lostCount++;
    }
    console.log('Your Game statistics: ' + JSON.stringify(gameStats));
    console.log('Your Past Games: ' + JSON.stringify(pastGames));
    $('.pipe').css({
        "display": "inline"
    });
    $('.guesses').css({
        "display": "block"
    });
    $('.played').html("Played: " + pastGames.length);
    $('.won').html("Won: " + wonCount);
    $('.lost').html("Lost: " + lostCount);
    $('.guesses').html("Letters Guessed: " + pastGuesses);
}