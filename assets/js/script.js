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
