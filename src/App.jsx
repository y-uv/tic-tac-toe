import { useState, useEffect } from 'react'
import Game from './components/Game'
import './index.css'

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [boardSize, setBoardSize] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedGame = sessionStorage.getItem('ticTacToeGame');
    if (savedGame) {
      const { mode, size } = JSON.parse(savedGame);
      setGameMode(mode);
      setBoardSize(size);
      setGameStarted(true);
    }
  }, []);

  const startGame = (mode) => {
    setIsTransitioning(true);
    setGameMode(mode);
    sessionStorage.setItem('ticTacToeGame', JSON.stringify({
      mode,
      size: boardSize
    }));
    setTimeout(() => {
      setGameStarted(true);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSizeChange = (increment) => {
    setBoardSize(prevSize => {
      const newSize = prevSize + increment;
      return newSize >= 3 && newSize <= 6 ? newSize : prevSize;
    });
  };

  const handleGameEnd = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGameStarted(false);
      setGameMode(null);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="container">
      {!gameStarted ? (
        <div className={`menu ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <h1>Tic-Tac-Toe</h1>
          <div className="size-selector">
            <label>Board Size</label>
            <div className="size-controls">
              <button 
                onClick={() => handleSizeChange(-1)}
                className="size-button"
                disabled={boardSize <= 3}
              >
                −
              </button>
              <div className="size-display">{boardSize}</div>
              <button 
                onClick={() => handleSizeChange(1)}
                className="size-button"
                disabled={boardSize >= 6}
              >
                +
              </button>
            </div>
          </div>
          <div className="button-group">
            <button 
              onClick={() => startGame('pvp')}
              className="mode-button pvp-button"
            >
              <div className="mode-icon">👥</div>
              <div className="mode-text">
                <div className="mode-title">Player vs Player</div>
                <div className="mode-desc">Play against a friend locally</div>
              </div>
            </button>
            <button 
              onClick={() => startGame('pvc')}
              className="mode-button pvc-button"
            >
              <div className="mode-icon">🤖</div>
              <div className="mode-text">
                <div className="mode-title">Player vs NPC</div>
                <div className="mode-desc">Challenge the computer</div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className={`game-wrapper ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <Game 
            mode={gameMode}
            size={boardSize}
            onGameEnd={handleGameEnd}
          />
        </div>
      )}
    </div>
  );
}

export default App
