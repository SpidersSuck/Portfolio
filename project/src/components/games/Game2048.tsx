import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

type Grid = number[][];

const GRID_SIZE = 4;
const CELL_SIZE = 120;

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: '#eee4da', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#f9f6f2' },
  16: { bg: '#f59563', text: '#f9f6f2' },
  32: { bg: '#f67c5f', text: '#f9f6f2' },
  64: { bg: '#f65e3b', text: '#f9f6f2' },
  128: { bg: '#edcf72', text: '#f9f6f2' },
  256: { bg: '#edcc61', text: '#f9f6f2' },
  512: { bg: '#edc850', text: '#f9f6f2' },
  1024: { bg: '#edc53f', text: '#f9f6f2' },
  2048: { bg: '#edc22e', text: '#f9f6f2' },
};

export function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moved, setMoved] = useState(false);

  function createEmptyGrid(): Grid {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  }

  const addRandomTile = useCallback((grid: Grid) => {
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) emptyCells.push([r, c]);
      }
    }

    if (emptyCells.length === 0) return grid;

    const newGrid = grid.map(row => [...row]);
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }, []);

  const initializeGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  }, [addRandomTile]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const slideRow = (row: number[]) => {
    const filtered = row.filter(cell => cell !== 0);
    const merged: number[] = [];
    let addedScore = 0;
    
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const value = filtered[i] * 2;
        merged.push(value);
        addedScore += value;
        if (value === 2048) setGameWon(true);
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < GRID_SIZE) merged.push(0);
    return { row: merged, score: addedScore };
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    let totalScore = 0;
    let hasChanged = false;

    if (direction === 'left') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const { row, score } = slideRow(newGrid[r]);
        if (JSON.stringify(row) !== JSON.stringify(newGrid[r])) hasChanged = true;
        newGrid[r] = row;
        totalScore += score;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const reversed = [...newGrid[r]].reverse();
        const { row, score } = slideRow(reversed);
        if (JSON.stringify(row.reverse()) !== JSON.stringify(newGrid[r])) hasChanged = true;
        newGrid[r] = row.reverse();
        totalScore += score;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < GRID_SIZE; c++) {
        const column = newGrid.map(row => row[c]);
        const { row, score } = slideRow(column);
        if (JSON.stringify(row) !== JSON.stringify(column)) hasChanged = true;
        for (let r = 0; r < GRID_SIZE; r++) {
          newGrid[r][c] = row[r];
        }
        totalScore += score;
      }
    } else if (direction === 'down') {
      for (let c = 0; c < GRID_SIZE; c++) {
        const column = newGrid.map(row => row[c]).reverse();
        const { row, score } = slideRow(column);
        const reversed = row.reverse();
        if (JSON.stringify(reversed) !== JSON.stringify(newGrid.map(r => r[c]))) hasChanged = true;
        for (let r = 0; r < GRID_SIZE; r++) {
          newGrid[r][c] = reversed[r];
        }
        totalScore += score;
      }
    }

    if (hasChanged) {
      newGrid = addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(prev => {
        const newScore = prev + totalScore;
        setBest(current => Math.max(current, newScore));
        return newScore;
      });
      setMoved(true);
      setTimeout(() => setMoved(false), 100);

      // Check game over
      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, gameOver, addRandomTile]);

  const canMove = (grid: Grid): boolean => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) return true;
        if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
        if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        move('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        move('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        move('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        move('right');
      } else if (e.key === 'r' || e.key === 'R') {
        initializeGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move, initializeGame]);

  const getTileFontSize = (value: number) => {
    if (value < 100) return 'text-5xl';
    if (value < 1000) return 'text-4xl';
    return 'text-3xl';
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Display */}
      <div className="w-full max-w-[480px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-[#f59e0b] text-2xl">{score}</div>
            <div className="text-[#9fb3c8] text-sm">Score</div>
          </div>
          <div className="text-center">
            <div className="text-[#10b981] text-2xl">{best}</div>
            <div className="text-[#9fb3c8] text-sm">Best</div>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative">
        <div 
          className="bg-[#bbada0] rounded-xl p-3 gap-3 grid grid-cols-4"
          style={{ width: GRID_SIZE * CELL_SIZE + 24 }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`cell-${r}-${c}`}
                className="bg-[#cdc1b4] rounded-lg"
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            ))
          )}

          {/* Tiles */}
          <div className="absolute inset-3 pointer-events-none">
            <AnimatePresence>
              {grid.map((row, r) =>
                row.map((cell, c) =>
                  cell > 0 ? (
                    <motion.div
                      key={`tile-${r}-${c}-${cell}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute rounded-lg flex items-center justify-center ${getTileFontSize(cell)}`}
                      style={{
                        left: c * (CELL_SIZE + 12),
                        top: r * (CELL_SIZE + 12),
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: TILE_COLORS[cell]?.bg || '#3c3a32',
                        color: TILE_COLORS[cell]?.text || '#f9f6f2',
                      }}
                    >
                      {cell}
                    </motion.div>
                  ) : null
                )
              )}
            </AnimatePresence>
          </div>
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
              <div className="text-xl text-[#f59e0b]">Score: {score}</div>
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
          {gameWon && !gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#071029]/95 rounded-xl flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">🎉 You Won! 🎉</div>
              <div className="text-xl text-[#10b981]">Score: {score}</div>
              <div className="flex gap-4">
                <button
                  onClick={() => setGameWon(false)}
                  className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200"
                >
                  Keep Playing
                </button>
                <button
                  onClick={initializeGame}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
                >
                  New Game
                </button>
              </div>
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
        Arrow keys to slide tiles • R to restart
      </div>
    </div>
  );
}
