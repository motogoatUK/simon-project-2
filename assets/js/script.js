/* MatchyMatchy
Browser matching game
By Simon Thornes 2025
*/
// Define Constants
const cardElements = document.getElementsByClassName("card");
const modals = document.getElementsByClassName("modal");
const btnClose = document.getElementsByClassName("close-button");
/* get individual modals */
const modalInstructions = document.getElementById("modal-instructions");
const modalHighscore = document.getElementById("modal-highscore");

/* create event listeners for buttons */
const btnStart = document.getElementById("btn-start");
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

/* Game code starts here */
const game = {
    cards: [],
    score: 0,
    misses: 0,
    turn: 0,
    inProgress: false,
    cardsFlipped: [],
    cardsMatched: [],
}
modalInstructions.style.display = "block";
/** Initialises card deck then starts event listeners on the deck */
function startGame() {
    initCards();
    addCardListeners() ? console.log("card listeners started") : console.log("card listener failed to start");
    game.inProgress = true;
    // the event listeners now handle the rest of game
}

function addCardListeners() {
    /* Add event handlers for card clicks
     using once property to prevent same card clicking */
    [...cardElements].forEach((card, i) => {
        card.addEventListener("click", () => showCard(i), { once: true });
    });
    return true;
}

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
function checkMatch() {
    /*There should only ever be 2 cards in cardsFlipped array. If not show an error */
    if (game.cardsFlipped.length !== 2) {
        console.error("More than 2 cards in flipped array!");
    };
    let last = game.cardsFlipped.at(-1);
    let first = game.cardsFlipped.at(0);
    if (game.cards[last] === game.cards[first]) {
        /* its a match */
        /* add score 
            move both cards to cardsMatched
            
            announce match
            (endgame score = score x remaining misses?)
         */
        game.cardsMatched = [...game.cardsFlipped];
        console.log(game.cardsMatched, game.cardsFlipped);
        notify("That's a match!");
        /* flip both cards back over */
    }; 
    hideFlipped(); // matched cards will be removed by this function.

};

function hideFlipped() {
    /* There should only ever be at most 2 cards in cardsFlipped array */
    /* As this function will run any number of flips even if only 1 card is showing
     (as sometimes in the case of a reset game), we will check and log an error if there are more than 2 */
    let numFlipped = game.cardsFlipped.length;
    if (numFlipped > 2) {
        console.error("More than 2 cards in flipped array!");
    } else {
        for (let i = 0; i < numFlipped; i++) {

            let last = game.cardsFlipped.pop(); //remove from flipped array
            let lastCard = cardElements[last]; // get the relevant HTML element 
            setTimeout(() => {
                lastCard.innerHTML = parseInt(last) + 1; // add 1 as cards are numbered 1-16 and array is 0-15
                lastCard.classList.remove("revealed"); // remove revealed class
                game.inProgress = true;
                lastCard.addEventListener("click", () => { showCard(last) }, { once: true });// add back the event listener
            }, 1000);
        };
    };
};

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
function controlButtonClicked() {
    if (btnStart.innerText === "Start") {
        btnStart.innerText = "Reset Game";
    } else {
        // go through a whole routine to re flip any flipped cards, 
        // reset score and other game variables, reset eventListeners,
        //  bring back matched cards. The simplest way is to reload the page....
        document.location = "/";
    };
    startGame();
};