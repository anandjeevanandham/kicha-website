const gameCells = document.querySelectorAll('.game-cell');
const gameStatus = document.getElementById('gameStatus');
const newGameButton = document.getElementById('newGame');

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;

function finishRound() {
  const winningLine = winningLines.find(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );

  if (winningLine) {
    gameOver = true;
    gameStatus.textContent = `${currentPlayer} wins! 🎉`;
    winningLine.forEach((index) => gameCells[index].classList.add('winner'));
    gameCells.forEach((cell) => {
      cell.disabled = true;
    });
    return true;
  }

  if (board.every(Boolean)) {
    gameOver = true;
    gameStatus.textContent = "It's a draw! Try again.";
    gameCells.forEach((cell) => {
      cell.disabled = true;
    });
    return true;
  }

  return false;
}

gameCells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const index = Number(cell.dataset.cell);
    if (gameOver || board[index]) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.dataset.mark = currentPlayer;
    cell.setAttribute('aria-label', `${cell.getAttribute('aria-label')}, ${currentPlayer}`);

    if (finishRound()) return;

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `${currentPlayer}'s turn`;
  });
});

newGameButton.addEventListener('click', () => {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  gameStatus.textContent = "X's turn";

  gameCells.forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('winner');
    delete cell.dataset.mark;
    const index = Number(cell.dataset.cell);
    cell.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}`);
  });
});
