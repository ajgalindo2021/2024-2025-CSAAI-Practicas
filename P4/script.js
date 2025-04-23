const board = document.getElementById('board');
const sizeSelect = document.getElementById('size');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');

let size = 4;
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer = 0;
let interval = null;
let gameStarted = false;

function generateCards(size) {
  const total = size * size;
  const values = [];
  for (let i = 0; i < total / 2; i++) {
    values.push(i, i);
  }
  return values.sort(() => Math.random() - 0.5);
}

function renderBoard() {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${size}, 80px)`;
  board.style.gridTemplateRows = `repeat(${size}, 107px)`;
  const values = generateCards(size);

  values.forEach(value => {
    const card = document.createElement('div');
    card.classList.add('card');

    const inner = document.createElement('div');
    inner.classList.add('inner');
    inner.dataset.value = value;

    const front = document.createElement('div');
    front.classList.add('front');
    front.style.backgroundImage = `url('img/${value}.png')`;

    const back = document.createElement('div');
    back.classList.add('back');

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => flipCard(card, inner));
    board.appendChild(card);
  });
}

function flipCard(card, inner) {
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
    sizeSelect.disabled = true;
  }

  if (card.classList.contains('flipped') || flippedCards.length === 2) return;

  card.classList.add('flipped');
  flippedCards.push({ card, value: inner.dataset.value });

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  if (first.value === second.value) {
    matchedCount += 2;
    flippedCards = [];

    if (matchedCount === size * size) {
      clearInterval(interval);
      setTimeout(() => {
        alert(`🎉 ¡Has ganado! Movimientos: ${moves}, Tiempo: ${timer} segundos`);
      }, 200);
    }
  } else {
    setTimeout(() => {
      first.card.classList.remove('flipped');
      second.card.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function resetGame() {
  clearInterval(interval);
  moves = 0;
  timer = 0;
  matchedCount = 0;
  flippedCards = [];
  gameStarted = false;
  movesDisplay.textContent = '0';
  timerDisplay.textContent = '0';
  sizeSelect.disabled = false;
  size = parseInt(sizeSelect.value);
  renderBoard();
}

startBtn.addEventListener('click', resetGame);
resetBtn.addEventListener('click', resetGame);
window.onload = resetGame;
