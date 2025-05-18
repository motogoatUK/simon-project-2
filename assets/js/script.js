/* MatchyMatchy
Browser matching game
By Simon Thornes 2025
*/
const modals = document.getElementsByClassName("modal");
const btnClose = document.getElementsByClassName("close-button");
/* get individual modals */
const modalInstructions = document.getElementById("modal-instructions");
const modalHighscore = document.getElementById("modal-highscore");

/* create event listeners for buttons */
const btnInstructions = document.getElementById("btn-instructions");
btnInstructions.addEventListener("click", () => {
    modalInstructions.style.display = "block";
});
const btnHighscore = document.getElementById("btn-highscore");
btnHighscore.addEventListener("click", () => {
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
let game = {
    cards: [],
    score: 0,
    misses: 0,
    turn: 0,
    cardsFlipped: [],
    cardsMatched: [],
}
initCards();
/* Add event handlers for card clicks
 using once property to prevent same card clicking */
let cardElements = document.getElementsByClassName("card");
[...cardElements].forEach((card, i) => {
    card.addEventListener("click", () => { showCard(i) }, { once: true });
});
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
    }
    console.log(game.cards);
}

function showCard(num) {
    // check card id not already flipped
    /* not required as eventlistener will only fire once when card is initally clicked on */
    /* check that less than two cards are already flipped if not then ignore the last click and re add eventlistener for it */
    if (game.cardsFlipped.length < 2) {
        thisCard = cardElements[num];
        thisCard.classList.add("revealed");
        thisCard.innerHTML = game.cards[num];
        /* add to cardsFlipped, push() returns the new length of array so we can check directly */
        if (game.cardsFlipped.push(num) > 1) {
            /* We should prevent any more cards being clicked.
            remove click handlers?
            /* 
            
            We also need a delay here (set timeout)? to give the user time to see the card before checking */
            /* check for match */
            setTimeout(() => checkMatch(), 400);
        };
    } else {
        notify("stop trying to cheat me");
        setTimeout(cardElements[num].addEventListener("click", () => { showCard(num) }, { once: true }),200);

    }
}
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
         */
        notify("That's a match!");
        /* else flip both cards back over */
        hideFlipped(); // hide anyway for now
    } else hideFlipped();

};

function hideFlipped() {
    /*This routine should only ever run if there at least 2 cards in cardsFlipped array.*/
    if (game.cardsFlipped.length < 2) {
        console.error("Less than 2 cards in flipped array!");
    } else {
        let last = game.cardsFlipped.pop(); //remove from flipped array
        let first = game.cardsFlipped.pop();
        let lastCard = cardElements[last]; // get the relevant HTML elements 
        let firstCard = cardElements[first];

        setTimeout(() => {
            firstCard.innerHTML = parseInt(first) + 1; // add 1 as cards are numbered 1-16 and array is 0-15
            firstCard.classList.remove("revealed"); // remove revealed class
            firstCard.addEventListener("click", () => { showCard(first) }, { once: true }); // add back the event listener
            lastCard.innerHTML = parseInt(last) + 1;
            lastCard.classList.remove("revealed");
            lastCard.addEventListener("click", () => { showCard(last) }, { once: true });
        }, 1000);
    }
}

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
}

