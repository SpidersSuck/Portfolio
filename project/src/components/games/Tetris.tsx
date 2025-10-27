import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Play, Pause } from "lucide-react";

type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
type Cell = { type: TetrominoType | "ghost" | null; locked: boolean };
type Grid = Cell[][];

const COLS = 10;
const ROWS = 18;
const CELL_SIZE = 24;

const TETROMINOS: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];

const COLORS: Record<TetrominoType, string> = {
  I: "#00f0f0", O: "#f0f000", T: "#a000f0",
  S: "#00f000", Z: "#f00000", J: "#0000f0", L: "#f0a000",
};

const SHAPES: Record<TetrominoType, number[][][]> = {
  I: [[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]]],
  O: [[[1,1],[1,1]]],
  T: [[[0,1,0],[1,1,1],[0,0,0]], [[0,1,0],[0,1,1],[0,1,0]], [[0,0,0],[1,1,1],[0,1,0]], [[0,1,0],[1,1,0],[0,1,0]]],
  S: [[[0,1,1],[1,1,0],[0,0,0]], [[0,1,0],[0,1,1],[0,0,1]]],
  Z: [[[1,1,0],[0,1,1],[0,0,0]], [[0,0,1],[0,1,1],[0,1,0]]],
  J: [[[1,0,0],[1,1,1],[0,0,0]], [[0,1,1],[0,1,0],[0,1,0]], [[0,0,0],[1,1,1],[0,0,1]], [[0,1,0],[0,1,0],[1,1,0]]],
  L: [[[0,0,1],[1,1,1],[0,0,0]], [[0,1,0],[0,1,0],[0,1,1]], [[0,0,0],[1,1,1],[1,0,0]], [[1,1,0],[0,1,0],[0,1,0]]],
};

export function Tetris() {
  const [grid, setGrid] = useState<Grid>(() => 
    Array(ROWS).fill(null).map(() => 
      Array(COLS).fill(null).map(() => ({ type: null, locked: false }))
    )
  );
  const [currentPiece, setCurrentPiece] = useState<{
    type: TetrominoType;
    rotation: number;
    x: number;
    y: number;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrominoType>(() => 
    TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)]
  );
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("tetrisHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const gameLoopRef = useRef<any>(null);

  const getRandomTetromino = useCallback((): TetrominoType => {
    return TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
  }, []);

  const spawnPiece = useCallback((type: TetrominoType) => {
    const shape = SHAPES[type][0];
    const startX = Math.floor((COLS - shape[0].length) / 2);
    return { type, rotation: 0, x: startX, y: 0 };
  }, []);

  const checkCollision = useCallback((
    piece: { type: TetrominoType; rotation: number; x: number; y: number },
    testGrid: Grid
  ): boolean => {
    const shape = SHAPES[piece.type][piece.rotation];
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newY = piece.y + row;
          const newX = piece.x + col;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && testGrid[newY][newX].locked) return true;
        }
      }
    }
    return false;
  }, []);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      const shape = SHAPES[currentPiece.type][currentPiece.rotation];
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const y = currentPiece.y + row;
            const x = currentPiece.x + col;
            if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
              newGrid[y][x] = { type: currentPiece.type, locked: true };
            }
          }
        }
      }
      const completedLines: number[] = [];
      for (let row = 0; row < ROWS; row++) {
        if (newGrid[row].every(cell => cell.locked)) {
          completedLines.push(row);
        }
      }
      if (completedLines.length > 0) {
        completedLines.forEach(lineIndex => {
          newGrid.splice(lineIndex, 1);
          newGrid.unshift(Array(COLS).fill(null).map(() => ({ type: null, locked: false })));
        });
        const points = [0, 100, 300, 500, 800][completedLines.length] * level;
        setScore(prev => {
          const newScore = prev + points;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("tetrisHighScore", newScore.toString());
          }
          return newScore;
        });
        setLines(prev => {
          const newLines = prev + completedLines.length;
          setLevel(Math.floor(newLines / 10) + 1);
          return newLines;
        });
      }
      return newGrid;
    });
    const newPiece = spawnPiece(nextPiece);
    setNextPiece(getRandomTetromino());
    if (checkCollision(newPiece, grid)) {
      setGameOver(true);
      setIsStarted(false);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    } else {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, nextPiece, grid, spawnPiece, getRandomTetromino, checkCollision, level, highScore]);

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;
    const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (checkCollision(newPiece, grid)) {
      lockPiece();
    } else {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, grid, checkCollision, lockPiece, isPaused, gameOver]);

  const moveHorizontal = useCallback((direction: number) => {
    if (!currentPiece || isPaused || gameOver) return;
    const newPiece = { ...currentPiece, x: currentPiece.x + direction };
    if (!checkCollision(newPiece, grid)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, grid, checkCollision, isPaused, gameOver]);

  const rotate = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;
    const rotations = SHAPES[currentPiece.type].length;
    const newRotation = (currentPiece.rotation + 1) % rotations;
    const newPiece = { ...currentPiece, rotation: newRotation };
    if (!checkCollision(newPiece, grid)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, grid, checkCollision, isPaused, gameOver]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused || gameOver) return;
    let dropDistance = 0;
    let testPiece = { ...currentPiece };
    while (!checkCollision({ ...testPiece, y: testPiece.y + 1 }, grid)) {
      dropDistance++;
      testPiece.y++;
    }
    if (dropDistance > 0) {
      setScore(prev => prev + dropDistance * 2);
      setCurrentPiece(testPiece);
      setTimeout(lockPiece, 50);
    }
  }, [currentPiece, grid, checkCollision, lockPiece, isPaused, gameOver]);

  const getGhostPieceY = useCallback(() => {
    if (!currentPiece) return 0;
    let testY = currentPiece.y;
    while (!checkCollision({ ...currentPiece, y: testY + 1 }, grid)) {
      testY++;
    }
    return testY;
  }, [currentPiece, grid, checkCollision]);

  useEffect(() => {
    if (!isStarted || isPaused || gameOver) return;
    const speed = Math.max(800 - (level - 1) * 50, 100);
    gameLoopRef.current = setInterval(moveDown, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveDown, level, isStarted, isPaused, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isStarted || gameOver) return;
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        setIsPaused(prev => !prev);
        return;
      }
      if (isPaused) return;
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          e.preventDefault();
          moveHorizontal(-1);
          break;
        case "arrowright":
        case "d":
          e.preventDefault();
          moveHorizontal(1);
          break;
        case "arrowdown":
        case "s":
          e.preventDefault();
          moveDown();
          break;
        case "arrowup":
        case "w":
          e.preventDefault();
          rotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [moveHorizontal, moveDown, rotate, hardDrop, isPaused, isStarted, gameOver]);

  const startGame = () => {
    const newGrid = Array(ROWS).fill(null).map(() => 
      Array(COLS).fill(null).map(() => ({ type: null, locked: false }))
    );
    setGrid(newGrid);
    const firstPiece = spawnPiece(nextPiece);
    setCurrentPiece(firstPiece);
    setNextPiece(getRandomTetromino());
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setIsStarted(true);
  };

  const renderGrid = () => {
    const displayGrid = grid.map(row => row.map(cell => ({ ...cell })));
    if (currentPiece) {
      const shape = SHAPES[currentPiece.type][currentPiece.rotation];
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const y = currentPiece.y + row;
            const x = currentPiece.x + col;
            if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
              displayGrid[y][x] = { type: currentPiece.type, locked: false };
            }
          }
        }
      }
      const ghostY = getGhostPieceY();
      if (ghostY !== currentPiece.y) {
        for (let row = 0; row < shape.length; row++) {
          for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
              const y = ghostY + row;
              const x = currentPiece.x + col;
              if (y >= 0 && y < ROWS && x >= 0 && x < COLS && !displayGrid[y][x].type) {
                displayGrid[y][x] = { type: "ghost" as any, locked: false };
              }
            }
          }
        }
      }
    }
    return displayGrid;
  };

  const renderNextPiece = () => {
    const shape = SHAPES[nextPiece][0];
    return (
      <div className="flex flex-col items-center justify-center">
        {shape.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="border border-slate-800"
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: cell ? COLORS[nextPiece] : "transparent",
                  boxShadow: cell ? `0 0 10px ${COLORS[nextPiece]}40` : "none",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const displayGrid = renderGrid();

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6"
      >
        <div className="flex flex-col gap-3" style={{ width: "170px" }}>
          <motion.h1 
            className="text-3xl font-black text-center bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(168, 85, 247, 0.5)",
                "0 0 30px rgba(236, 72, 153, 0.5)",
                "0 0 20px rgba(168, 85, 247, 0.5)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎮 TETRIS
          </motion.h1>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="text-purple-300 text-xs mb-1">SCORE</div>
            <div className="text-white text-xl font-bold">{score}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="text-purple-300 text-xs mb-1">HIGH SCORE</div>
            <div className="text-white text-lg font-bold">{highScore}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="text-purple-300 text-xs mb-1">LINES</div>
            <div className="text-white text-lg font-bold">{lines}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="text-purple-300 text-xs mb-1">LEVEL</div>
            <div className="text-white text-lg font-bold">{level}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="text-purple-300 text-xs mb-1">NEXT</div>
            <div className="scale-75 origin-top">
              {renderNextPiece()}
            </div>
          </div>
        </div>
        <div className="relative">
          <div 
            className="bg-slate-900/80 backdrop-blur-sm border-4 border-purple-500/30 rounded-lg overflow-hidden"
            style={{
              width: COLS * CELL_SIZE,
              height: ROWS * CELL_SIZE,
              boxShadow: "0 0 40px rgba(168, 85, 247, 0.3)",
            }}
          >
            {displayGrid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    className="border border-slate-800/50"
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: cell.type === "ghost" 
                        ? "transparent"
                        : cell.type 
                        ? COLORS[cell.type] 
                        : "rgba(15, 23, 42, 0.3)",
                      border: cell.type === "ghost" 
                        ? `2px dashed ${COLORS[currentPiece?.type || "I"]}40`
                        : undefined,
                      boxShadow: cell.type && cell.type !== "ghost"
                        ? `inset 0 0 10px rgba(255, 255, 255, 0.2), 0 0 10px ${COLORS[cell.type]}40`
                        : "none",
                    }}
                    animate={cell.locked ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
            ))}
          </div>
          <AnimatePresence>
            {(!isStarted || gameOver) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center rounded-lg"
              >
                <div className="text-center">
                  {gameOver && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-4"
                    >
                      <div className="text-4xl font-bold text-red-400 mb-2">GAME OVER!</div>
                      <div className="text-xl text-purple-300">Final Score: {score}</div>
                      {score === highScore && score > 0 && (
                        <div className="text-lg text-yellow-400 mt-2">🏆 NEW HIGH SCORE! 🏆</div>
                      )}
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-shadow flex items-center gap-2 mx-auto"
                  >
                    <Play size={20} />
                    {gameOver ? "PLAY AGAIN" : "START GAME"}
                  </motion.button>
                </div>
              </motion.div>
            )}
            {isPaused && isStarted && !gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center rounded-lg"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-4">PAUSED</div>
                  <div className="text-purple-300">Press P or ESC to resume</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-3" style={{ width: "170px" }}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
            <div className="text-purple-300 text-xs font-bold mb-2">CONTROLS</div>
            <div className="space-y-1 text-xs text-slate-300">
              <div><span className="text-purple-400">←→</span> / <span className="text-purple-400">A D</span> Move</div>
              <div><span className="text-purple-400">↑</span> / <span className="text-purple-400">W</span> Rotate</div>
              <div><span className="text-purple-400">↓</span> / <span className="text-purple-400">S</span> Soft Drop</div>
              <div><span className="text-purple-400">SPACE</span> Hard Drop</div>
              <div><span className="text-purple-400">P</span> / <span className="text-purple-400">ESC</span> Pause</div>
            </div>
          </div>
          {isStarted && !gameOver && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 rounded-lg font-bold text-sm shadow-lg hover:bg-yellow-500/30 transition-colors flex items-center justify-center gap-2"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              {isPaused ? "RESUME" : "PAUSE"}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-lg font-bold text-sm shadow-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            NEW GAME
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
