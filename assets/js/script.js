/* MatchyMatchy
Browser matching game
By Simon Thornes 2025
*/
// Define Constants
const cardElements = document.getElementsByClassName("card");
const modals = document.getElementsByClassName("modal");
const btnClose = document.getElementsByClassName("close-button");
const btnStart = document.getElementById("btn-start");

/* get individual modals */
const modalInstructions = document.getElementById("modal-instructions");
const modalHighscore = document.getElementById("modal-highscore");

/* check for local storage */
let gameStorage = false;
if (typeof (Storage) !== "undefined") {
    gameStorage = true;
};

/* Game code starts here */
addButtonListeners(); /* create event listeners for buttons */
const game = {
    cards: [],
    score: 0,
    highScore: 0,
    misses: 6,
    turn: "",
    inProgress: false,
    cardsFlipped: [],
    cardsMatched: [],
    seenCards: [],
}
/* get highScore from storage if available */
if (gameStorage) {
    let highScore = localStorage.getItem("highscore");
    if (highScore !== null) { game.highScore = parseInt(highScore); };
};
modalHighscore.getElementsByTagName("p")[0].innerText = game.highScore; // set highScore in modal
modalInstructions.style.display = "block"; // show Instructions
/* Set initial opacity on tabletop and display initial message */
document.getElementById("table-top").style.opacity = 0.4;
document.getElementById("notification").style.display = "block";

/** *Initialises card deck then starts event listeners on the deck */
function startGame() {
    initCards();
    addCardListeners() ? game.inProgress = true : console.error("card listener failed to start");
    document.getElementById("score").style.display = "block";
    document.getElementById("table-top").style.opacity = 1;
    document.getElementById("notification").style.removeProperty("display");
    // the event listeners now handle the rest of game.
};
/** Adds event listeners for the apps buttons */
function addButtonListeners() {
    btnStart.addEventListener("click", controlButtonClicked);
    document.getElementById("btn-instructions").addEventListener("click", () => {
        modalInstructions.style.display = "block";
    });
    document.getElementById("btn-highscore").addEventListener("click", () => {
        modalHighscore.style.display = "block";
    });
    /* As there is a close button span inside each individual modal we need to use parentNode.parentNode to target the .modal element */
    /* Credit to w3schools.com for information on array spread [...] */
    [...btnClose].forEach(element => {
        element.addEventListener("click", (e) => { e.target.parentNode.parentNode.style.display = 'none'; });
    });
    /* Also close modal if user clicks outside of content box */
    window.addEventListener("click", (e) => {
        [...modals].forEach((modal) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
};

/** Add event handlers for card clicks using once property to prevent same card clicking */
function addCardListeners() {
    try {
        [...cardElements].forEach((card, i) => {
            card.addEventListener("click", () => showCard(i), { once: true });
        });
        return true;
    } catch (err) {
        console.log(err.message);
        return false;
    };
};

/**
 * Initcards - Initialises the card array
 */
function initCards() {
    numCards = document.getElementsByClassName("card").length;
    /* we will be adding images here, but for testing we will be using letters */
    let cardValues = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
    console.log(numCards);
    for (let i = 0; i < numCards; i++) {
        /* give 2 cards the same value */
        game.cards[i] = cardValues.at(i);
        game.cards[i + 1] = cardValues.at(i);
        /* extra i++ to skip 2 */
        i++;
    };
    console.log(game.cards);
};

function showCard(num) {
    /* check if game is ready for selection - if not then ignore the last click and re add eventlistener for it */
    if (game.inProgress) {

        thisCard = cardElements[num];
        thisCard.classList.add("revealed");
        thisCard.innerHTML = game.cards[num];
        /* add to cardsFlipped, push() returns the new length of array so we can check directly */
        if (game.cardsFlipped.push(num) > 1) {
            /* We should prevent any more cards being selected.*/
            game.inProgress = false; //no card clicks accepted until all cards shown have been flipped back or removed from the board
            /* check for match
            We need a delay here (set timeout) to give the user time to see the card before checking */
            setTimeout(() => checkMatch(), 400);
        };
    } else {
        notify("stop trying to cheat me");
        setTimeout(cardElements[num].addEventListener("click", () => { showCard(num) }, { once: true }), 200);

    };
};
/** Checks for matched pair and increases score then checks for endgame else it 
 * checks for misses then hands over to hideFlipped function
 */
function checkMatch() {
    /*There should only ever be 2 cards in cardsFlipped array. If not show an error */
    if (game.cardsFlipped.length !== 2) {
        console.error("More than 2 cards in flipped array!");
    };
    let last = game.cardsFlipped.at(1);
    let first = game.cardsFlipped.at(0);
    if (game.cards[last] === game.cards[first]) {
        /* its a match! Add to score */
        addScore(1);
        /* (endgame score = score x remaining misses?)
         or addScore by remaining misses?*/
        // move both cards to cardsMatched array and announce match
        game.cardsMatched.push(last);
        game.cardsMatched.push(first);
        game.turn = "match"; // used in hideFlipped function to denote cards to be removed from play
        // console.log(game.cardsMatched, game.cardsFlipped);
        notify("That's a match!");
    } else {
        checkMissed(first, last);
    };
    // Check for endgame, if not then hide the flipped cards
    game.cardsMatched.length === game.cards.length ? endGame(true) : hideFlipped(); // matched cards will also be removed by hideFlipped function.
};
function checkMissed(card0, card1) {
    let seenCards = game.seenCards;
    // .includes() is ES7 .find() is ES6
    if (seenCards.includes(card0) || seenCards.includes(card1)) {
        game.misses--;
        let msg = String(game.misses);
        if (game.misses < 2){ msg = "only " + msg;}
        notify(`Match missed! ${msg} left`);
        if (game.misses === 0) {
            endGame();
        }
    }
    // add both cards to seenCards array
    game.seenCards.push(card0);
    game.seenCards.push(card1);
};
/** Flips cards back over or hides them depending on if they are matched or not */
function hideFlipped() {
    /* There should only ever be at most 2 cards in cardsFlipped array */
    /* As this function will run any number of flips, we will check and log an error if there are more than 2 */
    let numFlipped = game.cardsFlipped.length;
    if (numFlipped > 2) {
        console.error("More than 2 cards in flipped array!");
    } else {
        for (let i = 0; i < numFlipped; i++) {

            let last = game.cardsFlipped.pop(); //remove from flipped array
            let lastCard = cardElements[last]; // get the relevant HTML element
            if (game.turn === "match") {
                hideMatched(lastCard, last);
            } else {
                setTimeout(() => {
                    lastCard.innerHTML = parseInt(last) + 1; // add 1 as cards are numbered 1-16 and array is 0-15
                    lastCard.classList.remove("revealed"); // remove revealed class
                    lastCard.addEventListener("click", () => { showCard(last) }, { once: true });// add back the event listener
                }, 1000);
            };
        };
        //once loop has finished allow next selection
        setTimeout(() => {
            game.inProgress = true;
            game.turn = "";
        }, 1000);
    };
};
function hideMatched(element, num) {
    // remove the matched card from the game board.
    // display = "none" will remove the element from the page layout
    // opacity:0 will keep the layout and make it invisible but not to screen readers
    // visibility:hidden will hide the element and still keep it in the layout
    element.style.visibility = "hidden";
};
/** displays a large message in the middle of the gameboard for a short period */
function notify(message) {
    const element = document.getElementById("notification");
    const tableTop = document.getElementById("table-top");
    element.innerHTML = message;
    element.style.display = "block";
    tableTop.style.opacity = "0.4";
    setTimeout(() => {
        element.style.removeProperty("display");
        tableTop.style.removeProperty("opacity");
    }, 1000);
};
/** Handles the response to the clicking of the start/reset button */
function controlButtonClicked() {
    if (btnStart.innerText === "Start") {
        btnStart.innerText = "Reset Game";
    } else {
        // go through a whole routine to re flip any flipped cards, 
        // reset score and other game variables, reset eventListeners,
        //  bring back matched cards. The simplest way is to reload the page....
        document.location.reload();
    };
    startGame();
};
/** Adds num to score and updates display */
function addScore(num) {
    game.score += num;
    document.querySelector("#score span").innerText = game.score;
};
function endGame(w) {
    w ? notify("Well done!") : notify("Game Over!");
    document.getElementById("score").firstChild.nodeValue = "Final Score:";
    //Check score against high score
    if (game.score === game.highScore) {
        notify("Equal Highscore!");
    }
    if (game.score > game.highScore) {
        notify("New High Score!");
        if (gameStorage) { localStorage.setItem("highscore", game.score.toString()) }
    }
    /* delay setting opacity on gameboard to allow for notify messages to show
    as the notify function clears the opacity style */
    setTimeout(() => {
        document.getElementById("table-top").style.opacity = "0.4";
        document.getElementById("notification").style.display = "block"; // show last message until reset
    }, 1200);
};