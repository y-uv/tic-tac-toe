import { useState, useEffect } from 'react';
import Board from './Board';
import { calculateWinner, makeNPCMove } from '../utils/gameUtils';
import confetti from 'canvas-confetti';

const Game = ({ mode, size, onGameEnd }) => {
  const [board, setBoard] = useState(Array(size * size).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [dots, setDots] = useState('');
  const [confettiFired, setConfettiFired] = useState(false);
  const [lastNPCMove, setLastNPCMove] = useState(null);

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7, x: 0.5 }  // Center of screen
    };

    const fire = (particleRatio, opts) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    };

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    setConfettiFired(true);
  };

  useEffect(() => {
    const savedState = sessionStorage.getItem('ticTacToeState');
    if (savedState) {
      const { board: savedBoard, xIsNext: savedXIsNext, winner: savedWinner, confettiFired: savedConfettiFired } = JSON.parse(savedState);
      setBoard(savedBoard);
      setXIsNext(savedXIsNext);
      setWinner(savedWinner);
      setConfettiFired(savedConfettiFired || false);
      setLastNPCMove(null); // Reset last NPC move on load to prevent fade-in
    }
  }, []);

  useEffect(() => {
    let interval;
    if (thinking) {
      interval = setInterval(() => {
        setDots(prev => {
          if (prev === '') return '.';
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '';
        });
      }, 200);
    } else {
      setDots('');
    }
    return () => clearInterval(interval);
  }, [thinking]);

  useEffect(() => {
    if (board.some(cell => cell !== null)) {
      sessionStorage.setItem('ticTacToeState', JSON.stringify({
        board,
        xIsNext,
        winner,
        confettiFired
      }));
    }

    const result = calculateWinner(board, size);
    if (result) {
      setWinner(result);
      if (result !== 'Draw' && !confettiFired) {
        fireConfetti();
      }
      return;
    }

    if (mode === 'pvc' && !xIsNext && !winner) {
      setThinking(true);
      const npcMove = makeNPCMove(board, size);
      
      // Increased thinking time: random between 400ms and 1100ms
      const delay = Math.floor(Math.random() * 700) + 400;
      
      const timer = setTimeout(() => {
        if (npcMove !== -1) {
          handleMove(npcMove, true);
        }
        setThinking(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [board, xIsNext, mode, size, winner, confettiFired]);

  const handleMove = (index, isNPC = false) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    
    if (isNPC) {
      setLastNPCMove(index);
    } else {
      setLastNPCMove(null);
    }
  };

  const getGameStatus = () => {
    if (winner === 'Draw') {
      return "It's a Draw!";
    } else if (winner) {
      return `Winner: ${winner}`;
    } else if (mode === 'pvc' && !xIsNext && thinking) {
      return (
        <div className="thinking-status">
          <span className="thinking-text">Thinking</span>
          <span className="thinking-dots">{dots}</span>
        </div>
      );
    } else {
      return `Next Player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="game">
      <div className="game-status">
        {getGameStatus()}
      </div>
      <Board 
        squares={board}
        size={size}
        onMove={handleMove}
        disabled={mode === 'pvc' && !xIsNext || winner !== null}
        lastNPCMove={lastNPCMove}
      />
      <button 
        className="back-button"
        onClick={() => {
          sessionStorage.removeItem('ticTacToeState');
          sessionStorage.removeItem('ticTacToeGame');
          onGameEnd();
        }}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default Game;
