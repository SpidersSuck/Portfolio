import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Flag, Clock } from 'lucide-react';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
};

const NUMBER_COLORS = [
  '#06b6d4', // 1 - cyan
  '#10b981', // 2 - green
  '#ef4444', // 3 - red
  '#8b5cf6', // 4 - purple
  '#f59e0b', // 5 - orange
  '#ec4899', // 6 - pink
  '#06b6d4', // 7 - cyan
  '#10b981', // 8 - green
];

export function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flagsRemaining, setFlagsRemaining] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && !gameOver && !gameWon) {
      interval = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, gameWon]);

  const initializeGame = () => {
    const config = DIFFICULTIES[difficulty];
    const newGrid: Cell[][] = [];

    // Create empty grid
    for (let r = 0; r < config.rows; r++) {
      newGrid[r] = [];
      for (let c = 0; c < config.cols; c++) {
        newGrid[r][c] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < config.mines) {
      const r = Math.floor(Math.random() * config.rows);
      const c = Math.floor(Math.random() * config.cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setTime(0);
    setIsPlaying(false);
    setFlagsRemaining(config.mines);
  };

  const revealCell = (r: number, c: number) => {
    if (!isPlaying) setIsPlaying(true);
    
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged || gameOver || gameWon) return;

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    
    if (cell.isMine) {
      // Game over - reveal all mines
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[i].length; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    // Reveal cell and flood fill if empty
    const reveal = (row: number, col: number) => {
      if (row < 0 || row >= newGrid.length || col < 0 || col >= newGrid[0].length) return;
      if (newGrid[row][col].isRevealed || newGrid[row][col].isFlagged || newGrid[row][col].isMine) return;

      newGrid[row][col].isRevealed = true;

      if (newGrid[row][col].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(row + dr, col + dc);
          }
        }
      }
    };

    reveal(r, c);
    setGrid(newGrid);

    // Check if won
    const revealedCount = newGrid.flat().filter(cell => cell.isRevealed).length;
    const totalCells = newGrid.length * newGrid[0].length;
    const mineCount = DIFFICULTIES[difficulty].mines;
    if (revealedCount === totalCells - mineCount) {
      setGameWon(true);
    }
  };

  const toggleFlag = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isPlaying) setIsPlaying(true);
    
    const cell = grid[r][c];
    if (cell.isRevealed || gameOver || gameWon) return;

    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
    setFlagsRemaining(prev => newGrid[r][c].isFlagged ? prev - 1 : prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellSize = () => {
    const config = DIFFICULTIES[difficulty];
    if (config.rows <= 8) return 'w-8 h-8 text-sm';
    if (config.rows <= 12) return 'w-6 h-6 text-xs';
    return 'w-5 h-5 text-xs';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats Display */}
      <div className="w-full max-w-[600px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-[#ef4444] text-2xl flex items-center justify-center gap-1">
              <Flag className="w-5 h-5" />
              {flagsRemaining}
            </div>
            <div className="text-[#9fb3c8] text-sm">Flags Left</div>
          </div>
          <div className="text-center">
            <div className="text-[#f59e0b] text-2xl flex items-center justify-center gap-1">
              <Clock className="w-5 h-5" />
              {formatTime(time)}
            </div>
            <div className="text-[#9fb3c8] text-sm">Time</div>
          </div>
          <div className="text-center">
            <div className="text-[#06b6d4] text-2xl">{DIFFICULTIES[difficulty].mines}</div>
            <div className="text-[#9fb3c8] text-sm">Mines</div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex gap-2 justify-center">
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-1.5 rounded-lg transition-all duration-200 capitalize ${
                difficulty === diff
                  ? 'bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white'
                  : 'bg-[#071029] text-[#9fb3c8] border border-white/10 hover:border-white/30'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="inline-block">
          {grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((cell, c) => (
                <motion.button
                  key={`${r}-${c}`}
                  whileHover={{ scale: cell.isRevealed ? 1 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => revealCell(r, c)}
                  onContextMenu={(e) => toggleFlag(r, c, e)}
                  className={`${getCellSize()} border border-white/10 flex items-center justify-center transition-all duration-150 ${
                    cell.isRevealed
                      ? cell.isMine
                        ? 'bg-[#ef4444]'
                        : 'bg-[#071029]'
                      : 'bg-[#081522] hover:bg-[#081522]/80'
                  }`}
                >
                  {cell.isFlagged && !cell.isRevealed && (
                    <span className="text-lg">🚩</span>
                  )}
                  {cell.isRevealed && cell.isMine && (
                    <span className="text-lg">💣</span>
                  )}
                  {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
                    <span style={{ color: NUMBER_COLORS[cell.neighborMines - 1] }}>
                      {cell.neighborMines}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          ))}
        </div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#071029]/95 rounded-xl flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">Game Over!</div>
              <div className="text-xl text-[#ef4444]">You hit a mine! 💣</div>
              <button
                onClick={initializeGame}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Win Overlay */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#071029]/95 rounded-xl flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">🎉 You Won! 🎉</div>
              <div className="text-xl text-[#10b981]">Time: {formatTime(time)}</div>
              <button
                onClick={initializeGame}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        onClick={initializeGame}
        className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </button>

      {/* Keyboard Hints */}
      <div className="text-[#9fb3c8] text-sm text-center">
        Left click to reveal • Right click to flag/unflag
      </div>
    </div>
  );
}
