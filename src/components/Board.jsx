import React from 'react';

const Board = ({ squares, size, onMove, disabled, lastNPCMove }) => {
  const renderSquare = (i) => (
    <button
      key={i}
      className="square"
      onClick={() => onMove(i)}
      disabled={disabled || squares[i]}
    >
      <span className={`square-content ${i === lastNPCMove ? 'fade-in' : ''}`}>
        {squares[i]}
      </span>
    </button>
  );

  const renderRow = (row) => (
    <div key={row} className="board-row">
      {Array(size).fill(null).map((_, col) => renderSquare(row * size + col))}
    </div>
  );

  return (
    <div className="board">
      {Array(size).fill(null).map((_, row) => renderRow(row))}
    </div>
  );
};

export default Board;
