import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Pause, Play } from 'lucide-react';

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type Cell = TetrominoType | null;

const COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

const SHAPES: Record<TetrominoType, number[][][]> = {
  I: [[[1,1,1,1]], [[1],[1],[1],[1]]],
  O: [[[1,1],[1,1]]],
  T: [[[0,1,0],[1,1,1]], [[1,0],[1,1],[1,0]], [[1,1,1],[0,1,0]], [[0,1],[1,1],[0,1]]],
  S: [[[0,1,1],[1,1,0]], [[1,0],[1,1],[0,1]]],
  Z: [[[1,1,0],[0,1,1]], [[0,1],[1,1],[1,0]]],
  J: [[[1,0,0],[1,1,1]], [[1,1],[1,0],[1,0]], [[1,1,1],[0,0,1]], [[0,1],[0,1],[1,1]]],
  L: [[[0,0,1],[1,1,1]], [[1,0],[1,0],[1,1]], [[1,1,1],[1,0,0]], [[1,1],[0,1],[0,1]]],
};

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 30;

export function Tetris() {
  const [grid, setGrid] = useState<Cell[][]>(() => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    type: TetrominoType;
    shape: number[][];
    x: number;
    y: number;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType>('T');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<number>();

  const getRandomPiece = (): TetrominoType => {
    const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return pieces[Math.floor(Math.random() * pieces.length)];
  };

  const createNewPiece = useCallback((type: TetrominoType) => {
    return {
      type,
      shape: SHAPES[type][0],
      x: Math.floor(COLS / 2) - 1,
      y: 0,
    };
  }, []);

  const checkCollision = useCallback((piece: typeof currentPiece, grid: Cell[][], offsetX = 0, offsetY = 0) => {
    if (!piece) return true;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;
          
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && grid[newY][newX]) return true;
        }
      }
    }
    return false;
  }, []);

  const mergePiece = useCallback(() => {
    if (!currentPiece) return grid;
    
    const newGrid = grid.map(row => [...row]);
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const gridY = currentPiece.y + y;
          const gridX = currentPiece.x + x;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            newGrid[gridY][gridX] = currentPiece.type;
          }
        }
      }
    }
    return newGrid;
  }, [currentPiece, grid]);

  const clearLines = useCallback((grid: Cell[][], currentLevel: number, currentLines: number) => {
    let linesCleared = 0;
    const newGrid = grid.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newGrid.length < ROWS) {
      newGrid.unshift(Array(COLS).fill(null));
    }

    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + (linesCleared * 100 * currentLevel));
      setLevel(Math.floor((currentLines + linesCleared) / 10) + 1);
    }

    return newGrid;
  }, []);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;

    const shapes = SHAPES[currentPiece.type];
    const currentIndex = shapes.findIndex(s => JSON.stringify(s) === JSON.stringify(currentPiece.shape));
    const nextIndex = (currentIndex + 1) % shapes.length;
    const rotated = { ...currentPiece, shape: shapes[nextIndex] };

    if (!checkCollision(rotated, grid)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, grid, checkCollision, isPaused, gameOver]);

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;

    if (!checkCollision(currentPiece, grid, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      const merged = mergePiece();
      const cleared = clearLines(merged, level, lines);
      setGrid(cleared);
      
      const next = createNewPiece(nextPiece);
      if (checkCollision(next, cleared)) {
        setGameOver(true);
      } else {
        setCurrentPiece(next);
        setNextPiece(getRandomPiece());
      }
    }
  }, [currentPiece, grid, checkCollision, mergePiece, clearLines, nextPiece, createNewPiece, isPaused, gameOver, level, lines]);

  const moveHorizontal = useCallback((direction: number) => {
    if (!currentPiece || isPaused || gameOver) return;

    if (!checkCollision(currentPiece, grid, direction, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + direction } : null);
    }
  }, [currentPiece, grid, checkCollision, isPaused, gameOver]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;

    let dropDistance = 0;
    while (!checkCollision(currentPiece, grid, 0, dropDistance + 1)) {
      dropDistance++;
    }

    setCurrentPiece(prev => prev ? { ...prev, y: prev.y + dropDistance } : null);
    setTimeout(moveDown, 50);
  }, [currentPiece, grid, checkCollision, moveDown, isPaused, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        resetGame();
      } else if (!isPaused) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          moveHorizontal(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          moveHorizontal(1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          moveDown();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          rotatePiece();
        } else if (e.key === ' ') {
          e.preventDefault();
          hardDrop();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveHorizontal, moveDown, rotatePiece, hardDrop, isPaused, gameOver]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      const piece = createNewPiece(nextPiece);
      setCurrentPiece(piece);
      setNextPiece(getRandomPiece());
    }
  }, [currentPiece, nextPiece, createNewPiece, gameOver]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      const speed = Math.max(100, 800 - (level - 1) * 50);
      gameLoopRef.current = window.setInterval(moveDown, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveDown, level, isPaused, gameOver]);

  const resetGame = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPiece(null);
    setNextPiece(getRandomPiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const getGhostY = () => {
    if (!currentPiece) return 0;
    let ghostY = currentPiece.y;
    while (!checkCollision({ ...currentPiece, y: ghostY + 1 }, grid)) {
      ghostY++;
    }
    return ghostY;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Display */}
      <div className="w-full max-w-[600px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-[#06b6d4] text-2xl">{score}</div>
            <div className="text-[#9fb3c8] text-sm">Score</div>
          </div>
          <div className="text-center">
            <div className="text-[#8b5cf6] text-2xl">{level}</div>
            <div className="text-[#9fb3c8] text-sm">Level</div>
          </div>
          <div className="text-center">
            <div className="text-[#10b981] text-2xl">{lines}</div>
            <div className="text-[#9fb3c8] text-sm">Lines</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex gap-6">
        {/* Main Grid */}
        <div className="relative bg-[#081522] rounded-xl p-4 border border-white/10">
          <div 
            className="relative bg-[#071029] rounded-lg"
            style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}
          >
            {/* Grid */}
            {grid.map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="border border-white/5"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: cell ? COLORS[cell] : 'transparent',
                    }}
                  />
                ))}
              </div>
            ))}

            {/* Ghost Piece */}
            {currentPiece && !gameOver && !isPaused && (
              <div className="absolute top-0 left-0 pointer-events-none">
                {currentPiece.shape.map((row, y) =>
                  row.map((cell, x) =>
                    cell ? (
                      <div
                        key={`ghost-${y}-${x}`}
                        className="absolute border-2"
                        style={{
                          left: (currentPiece.x + x) * CELL_SIZE,
                          top: (getGhostY() + y) * CELL_SIZE,
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          borderColor: COLORS[currentPiece.type],
                          opacity: 0.3,
                        }}
                      />
                    ) : null
                  )
                )}
              </div>
            )}

            {/* Current Piece */}
            {currentPiece && !gameOver && (
              <div className="absolute top-0 left-0 pointer-events-none">
                {currentPiece.shape.map((row, y) =>
                  row.map((cell, x) =>
                    cell ? (
                      <motion.div
                        key={`piece-${y}-${x}`}
                        className="absolute"
                        style={{
                          left: (currentPiece.x + x) * CELL_SIZE,
                          top: (currentPiece.y + y) * CELL_SIZE,
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          backgroundColor: COLORS[currentPiece.type],
                        }}
                      />
                    ) : null
                  )
                )}
              </div>
            )}

            {/* Game Over Overlay */}
            <AnimatePresence>
              {gameOver && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-[#071029]/95 rounded-lg flex flex-col items-center justify-center gap-4"
                >
                  <div className="text-3xl text-[#e6eef6]">Game Over!</div>
                  <div className="text-xl text-[#06b6d4]">Score: {score}</div>
                  <div className="text-lg text-[#8b5cf6]">Level: {level}</div>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Paused Overlay */}
            <AnimatePresence>
              {isPaused && !gameOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#071029]/80 rounded-lg flex items-center justify-center"
                >
                  <div className="text-3xl text-[#e6eef6]">Paused</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Next Piece Preview */}
        <div className="bg-[#081522] rounded-xl p-4 border border-white/10">
          <div className="text-[#e6eef6] mb-4 text-center">Next</div>
          <div 
            className="bg-[#071029] rounded-lg flex items-center justify-center"
            style={{ width: 120, height: 120 }}
          >
            {SHAPES[nextPiece][0].map((row, y) =>
              row.map((cell, x) =>
                cell ? (
                  <div
                    key={`next-${y}-${x}`}
                    className="absolute"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: COLORS[nextPiece],
                      left: 30 + x * CELL_SIZE,
                      top: 30 + y * CELL_SIZE,
                    }}
                  />
                ) : null
              )
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsPaused(prev => !prev)}
          disabled={gameOver}
          className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={resetGame}
          className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restart
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="text-[#9fb3c8] text-sm text-center">
        Arrows to move • Up to rotate • Space to hard drop • Space to pause • R to restart
      </div>
    </div>
  );
}
