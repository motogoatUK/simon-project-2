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
    cards:[],
    score: 0,
    misses: 0,
    turn:0,
    cardsFlipped:[],
    cardsMatched:[],
} 
initCards();
let cardArray=document.getElementsByClassName("card");
for (let card in cardArray) {
cardArray[card].onclick = ()=>{showCard(card)};
};
function initCards(){
    numCards = document.getElementsByClassName("card").length;
    /* we will be adding images here, but for testing we will be using letters */
    let cardValues="A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
    console.log(numCards);
    for (let i=0; i < numCards; i++){
        /* give 2 cards the same value */
        game.cards[i]= cardValues.at(i);
        game.cards[i+1] = cardValues.at(i);
        /* extra i++ to skip 2 */
        i++;
    }
    console.log(game.cards);
}
function showCard(num){
    thisCard=cardArray[num];
thisCard.classList.add("revealed");
thisCard.innerHTML=game.cards[num];
setTimeout (() => {
    thisCard.innerHTML=parseInt(num)+1;
    thisCard.classList.remove("revealed");
},1000);
}
