# Tic-Tac-Toe

A modern implementation of the classic Tic-Tac-Toe game built with React. Features include variable board sizes (3x3 to 6x6), player versus player mode, and player versus NPC mode with intelligent(ish) move calculation.

https://tic-tac-toe-yuval.netlify.app/

## Features

- Variable board sizes (3x3 to 6x6)
- Two game modes:
  - Player vs Player (local multiplayer)
  - Player vs NPC (single player)
- Responsive design
- Game state persistence
- Smooth animations and transitions
- Modern, minimalist UI

## Technical Implementation

### Core Components

- **App**: Main component handling game setup and mode selection
- **Game**: Manages game state, turn handling, and win detection
- **Board**: Pure component for rendering the game board
- **gameUtils**: Contains game logic and NPC move calculation

### NPC Strategy

The NPC implementation uses different strategies based on board size:

- For 3x3 boards: Uses minimax algorithm with alpha-beta pruning for optimal play
- For larger boards: Uses a priority-based strategy:
  1. Win if possible
  2. Block opponent from winning
  3. Play near opponent's moves
  4. Control center region
  5. Random available move

### State Management

- Uses React hooks for state management
- Implements sessionStorage for game state persistence
- Handles board size validation and game mode switching

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- React
- Vite
- TailwindCSS
- Session Storage API

## Code Structure

```
src/
├── components/
│   ├── Board.jsx    # Game board rendering
│   └── Game.jsx     # Game logic and state
├── utils/
│   └── gameUtils.js # Game calculations and NPC logic
├── App.jsx          # Main component
├── index.css        # Styles
└── main.jsx         # Entry point
```

## Design Decisions

- **Modular Architecture**: Components are separated by concern for maintainability
- **Pure Components**: Board component is pure for optimal rendering
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Clear visual feedback and user-friendly controls
- **Performance**: Optimized NPC algorithm for larger board sizes, very easy difficulty

## Future Improvements

Potential areas for enhancement:
- Online multiplayer support with authentication
- Additional board sizes
- Game history tracking
- Difficulty levels for NPC
