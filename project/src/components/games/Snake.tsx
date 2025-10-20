import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Pause, Play } from 'lucide-react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_SPEED = 150;

export function Snake() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number>();

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (directionRef.current) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 10);
        setSpeed(prev => Math.max(50, prev - 5));
        generateFood();
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [gameOver, isPaused, food, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        resetGame();
        return;
      }

      const newDirection = 
        e.key === 'ArrowUp' ? 'UP' :
        e.key === 'ArrowDown' ? 'DOWN' :
        e.key === 'ArrowLeft' ? 'LEFT' :
        e.key === 'ArrowRight' ? 'RIGHT' : null;

      if (newDirection) {
        e.preventDefault();
        // Prevent 180-degree turns
        const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
        if (opposites[newDirection] !== directionRef.current) {
          setDirection(newDirection);
          directionRef.current = newDirection;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Display */}
      <div className="w-full max-w-[440px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-[#10b981] text-2xl">{score}</div>
            <div className="text-[#9fb3c8] text-sm">Score</div>
          </div>
          <div className="text-center">
            <div className="text-[#f59e0b] text-2xl">{highScore}</div>
            <div className="text-[#9fb3c8] text-sm">High Score</div>
          </div>
          <div className="text-center">
            <div className="text-[#06b6d4] text-2xl">{snake.length}</div>
            <div className="text-[#9fb3c8] text-sm">Length</div>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-[#081522] rounded-xl p-4 border border-white/10">
        <div 
          className="relative bg-[#071029]/50 rounded-lg"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE 
          }}
        >
          {/* Grid */}
          <div className="absolute inset-0 grid" style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="border border-white/5" />
            ))}
          </div>

          {/* Snake */}
          {snake.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute rounded-sm"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                background: index === 0 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                opacity: index === 0 ? 1 : 0.8 - (index / snake.length) * 0.3,
                margin: 1,
              }}
            />
          ))}

          {/* Food */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute rounded-full shadow-lg shadow-red-500/50"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              background: 'radial-gradient(circle, #ef4444 0%, #dc2626 100%)',
              margin: 1,
            }}
          />

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-[#071029]/95 rounded-lg flex flex-col items-center justify-center gap-4"
              >
                <div className="text-3xl text-[#e6eef6]">Game Over!</div>
                <div className="text-xl text-[#10b981]">Score: {score}</div>
                {score === highScore && score > 0 && (
                  <div className="text-[#f59e0b]">New High Score! 🎉</div>
                )}
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
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#071029]/80 rounded-lg flex items-center justify-center"
              >
                <div className="text-3xl text-[#e6eef6]">Paused</div>
              </motion.div>
            )}
          </AnimatePresence>
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
        Arrow keys to move • Space to pause • R to restart
      </div>
    </div>
  );
}
