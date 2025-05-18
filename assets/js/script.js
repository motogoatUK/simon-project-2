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
/* event handlers for card clicks
 using once property to prevent same card clicking */
let cardElements = document.getElementsByClassName("card");
[...cardElements].forEach((card,i) =>  {
    card.addEventListener("click", () => {showCard(i)},{once: true});
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
    /* check cardsFlipped or just remove eventlistener when initally clicked? */

    thisCard = cardElements[num];
 //   thisCard.removeEventListener("click", () => showCard, true);
    thisCard.classList.add("revealed");
    thisCard.innerHTML = game.cards[num];
    /* add to cardsFlipped, push() returns the new length of array so we can check directly */
    if (game.cardsFlipped.push(num) > 1) {
        /* We should prevent any more cards being clicked.
        remove click handlers?
        /* 
        We also need a delay here (set timeout)? to give the user time to see the card before checking */
        /* check for match */
        setTimeout(checkMatch(), 500);
    };
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
            remove event handlers from matched cards */
        alert("match");
        /* else flip both cards back over */
        hideFlipped(); // hide anyway for now
    } else hideFlipped();

};

function hideFlipped() {
    let last = game.cardsFlipped.pop();
    let first = game.cardsFlipped.pop();
    let lastCard = cardElements[last];
    let firstCard = cardElements[first];

    setTimeout(() => {
        firstCard.innerHTML = parseInt(first) + 1;
        firstCard.classList.remove("revealed");
        lastCard.innerHTML = parseInt(last) + 1;
        lastCard.classList.remove("revealed");
    }, 1000);
}

