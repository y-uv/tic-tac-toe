// Check for a winner
export const calculateWinner = (squares, size) => {
  // Check rows
  for (let i = 0; i < size * size; i += size) {
    const row = squares.slice(i, i + size);
    if (row.every(cell => cell === 'X')) return 'X';
    if (row.every(cell => cell === 'O')) return 'O';
  }

  // Check columns
  for (let i = 0; i < size; i++) {
    const column = Array(size).fill(null).map((_, j) => squares[i + j * size]);
    if (column.every(cell => cell === 'X')) return 'X';
    if (column.every(cell => cell === 'O')) return 'O';
  }

  // Check diagonals
  const diagonal1 = Array(size).fill(null).map((_, i) => squares[i * (size + 1)]);
  const diagonal2 = Array(size).fill(null).map((_, i) => squares[(i + 1) * (size - 1)]);

  if (diagonal1.every(cell => cell === 'X')) return 'X';
  if (diagonal1.every(cell => cell === 'O')) return 'O';
  if (diagonal2.every(cell => cell === 'X')) return 'X';
  if (diagonal2.every(cell => cell === 'O')) return 'O';

  // Check for draw
  if (!squares.includes(null)) return 'Draw';

  return null;
};

// Simple strategy for larger boards
const findBestMoveSimple = (squares, size) => {
  // Try to win
  const winMove = findWinningMove(squares, size, 'O');
  if (winMove !== -1) return winMove;

  // Block opponent from winning
  const blockMove = findWinningMove(squares, size, 'X');
  if (blockMove !== -1) return blockMove;

  // Try to play near the opponent's moves
  const nearOpponentMove = findNearOpponentMove(squares, size);
  if (nearOpponentMove !== -1) return nearOpponentMove;

  // Play in the center region if available
  const centerMove = findCenterMove(squares, size);
  if (centerMove !== -1) return centerMove;

  // Play random available move
  const emptySquares = squares.reduce((acc, cell, idx) => 
    !cell ? [...acc, idx] : acc, []);
  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
};

const findWinningMove = (squares, size, player) => {
  // Check each empty square
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      const testBoard = [...squares];
      testBoard[i] = player;
      if (calculateWinner(testBoard, size) === player) {
        return i;
      }
    }
  }
  return -1;
};

const findNearOpponentMove = (squares, size) => {
  const moves = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === 'X') {
      const row = Math.floor(i / size);
      const col = i % size;

      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const newIndex = newRow * size + newCol;

        if (
          newRow >= 0 && newRow < size &&
          newCol >= 0 && newCol < size &&
          !squares[newIndex]
        ) {
          moves.push(newIndex);
        }
      }
    }
  }

  return moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)] : -1;
};

const findCenterMove = (squares, size) => {
  const centerStart = Math.floor(size / 3);
  const centerEnd = Math.ceil(size * 2 / 3);
  const centerMoves = [];

  for (let row = centerStart; row < centerEnd; row++) {
    for (let col = centerStart; col < centerEnd; col++) {
      const index = row * size + col;
      if (!squares[index]) {
        centerMoves.push(index);
      }
    }
  }

  return centerMoves.length > 0 ? 
    centerMoves[Math.floor(Math.random() * centerMoves.length)] : -1;
};

// Minimax for 3x3 boards
const minimax = (squares, depth, isMax, alpha, beta) => {
  const winner = calculateWinner(squares, 3);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (winner === 'Draw') return 0;

  if (isMax) {
    let best = -1000;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'O';
        best = Math.max(best, minimax(squares, depth + 1, !isMax, alpha, beta));
        squares[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = 1000;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        squares[i] = 'X';
        best = Math.min(best, minimax(squares, depth + 1, !isMax, alpha, beta));
        squares[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
};

// Find best move using minimax for 3x3 boards
const findBestMoveMinimax = (squares) => {
  let bestVal = -1000;
  let bestMove = -1;

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      squares[i] = 'O';
      const moveVal = minimax(squares, 0, false, -1000, 1000);
      squares[i] = null;

      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }

  return bestMove;
};

// Main NPC move function
export const makeNPCMove = (squares, size) => {
  // Use minimax only for 3x3 boards
  if (size === 3) {
    return findBestMoveMinimax(squares);
  }
  
  // Use simpler strategy for larger boards
  return findBestMoveSimple(squares, size);
};
