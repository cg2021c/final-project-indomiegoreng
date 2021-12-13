const scoreElem = document.querySelector('#score');

export default function updateScore(score) {
  scoreElem.textContent = 'SCORE: ' + score;
}
