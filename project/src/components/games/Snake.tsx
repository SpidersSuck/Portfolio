import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Pause, Play, Trophy, Zap } from 'lucide-react';

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 90;

export function Snake() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<number | undefined>(undefined);

  const generateFood = useCallback(() => {
    let newPos: Position;
    do {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newPos.x && segment.y === newPos.y));
    setFood(newPos);
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setDirection(nextDirection);
    setSnake(prevSnake => {
      const head = prevSnake[0];
      let newHead: Position = { x: head.x, y: head.y };

      if (nextDirection === 'UP') newHead.y -= 1;
      else if (nextDirection === 'DOWN') newHead.y += 1;
      else if (nextDirection === 'LEFT') newHead.x -= 1;
      else if (nextDirection === 'RIGHT') newHead.x += 1;

      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      if (newHead.y >= GRID_SIZE) newHead.y = 0;

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 10);
        setSpeed(prev => Math.max(50, prev - 3));
        generateFood();
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [gameOver, isPaused, food, score, highScore, generateFood, nextDirection]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!gameOver) setIsPaused(prev => !prev);
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        resetGame();
        return;
      }

      const newDir = 
        (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') ? 'UP' :
        (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') ? 'DOWN' :
        (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') ? 'LEFT' :
        (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') ? 'RIGHT' : null;

      if (newDir) {
        e.preventDefault();
        const opposites: Record<Direction, Direction> = { 
          UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' 
        };
        if (opposites[newDir] !== direction) {
          setNextDirection(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed, gameOver, isPaused]);

  return (
    <div className='fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden'>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotateX: -90 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotateX: 0,
        }}
        transition={{ 
          type: 'spring',
          stiffness: 150,
          damping: 12,
          duration: 0.8
        }}
        className='mb-8 relative'
      >
        {/* Glowing background effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className='absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 blur-[60px] scale-150'
        />
        
        {/* Main title with animated gradient */}
        <motion.h1 
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            backgroundPosition: {
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }
          }}
          className='relative text-8xl font-black tracking-widest text-emerald-400'
          style={{
            textShadow: '0 0 30px rgba(16, 185, 129, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.5)',
            filter: 'drop-shadow(0 4px 15px rgba(16, 185, 129, 0.5))',
          }}
        >
          🐍 SNAKE 🐍
        </motion.h1>

        {/* Animated underline */}
        <motion.div
          animate={{
            scaleX: [0.8, 1, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full'
        />

        {/* Decorative floating orbs */}
        <motion.div
          animate={{
            x: [-15, 15, -15],
            y: [-5, 5, -5],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className='absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-500 blur-md'
        />
        <motion.div
          animate={{
            x: [15, -15, 15],
            y: [5, -5, 5],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5
          }}
          className='absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500 blur-md'
        />

        {/* Corner sparkles */}
        <motion.div
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className='absolute -top-4 -left-4 w-4 h-4 bg-teal-400 rounded-full blur-sm'
        />
        <motion.div
          animate={{
            scale: [0, 1, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className='absolute -top-4 -right-4 w-4 h-4 bg-emerald-400 rounded-full blur-sm'
        />
      </motion.div>

      <div className='flex flex-row items-center justify-center gap-4'>
        {/* Left Panel - Score & Controls */}
        <div className='flex flex-col gap-3'>
          {/* Score Display */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='w-[280px] bg-gradient-to-br from-emerald-950/60 via-slate-900/60 to-teal-950/60 rounded-lg p-3 border-2 border-emerald-500/30 shadow-2xl backdrop-blur-sm'
          >
            <div className='grid grid-cols-3 gap-2'>
              <div className='text-center'>
                <motion.div 
                  className='text-emerald-400 text-2xl font-bold drop-shadow-lg'
                  key={score}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {score}
                </motion.div>
                <div className='text-slate-400 text-xs mt-0.5 font-medium'>Score</div>
              </div>
              <div className='text-center'>
                <div className='text-amber-400 text-2xl font-bold flex items-center justify-center gap-1 drop-shadow-lg'>
                  <Trophy className='w-5 h-5' />
                  {highScore}
                </div>
                <div className='text-slate-400 text-xs mt-0.5 font-medium'>Best</div>
              </div>
              <div className='text-center'>
                <div className='text-cyan-400 text-2xl font-bold drop-shadow-lg'>{snake.length}</div>
                <div className='text-slate-400 text-xs mt-0.5 font-medium'>Length</div>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='w-[280px] bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-lg p-3 border-2 border-slate-700/50 shadow-xl backdrop-blur-sm'
          >
            <h3 className='text-slate-200 font-semibold text-sm mb-2'>Controls</h3>
            <div className='space-y-1.5 text-xs text-slate-300'>
              <div className='flex items-center justify-between bg-slate-800/50 rounded px-2 py-1.5'>
                <span>Move</span>
                <span className='text-emerald-400 font-mono'>WASD / ↑↓←→</span>
              </div>
              <div className='flex items-center justify-between bg-slate-800/50 rounded px-2 py-1.5'>
                <span>Pause</span>
                <span className='text-emerald-400 font-mono'>Space</span>
              </div>
              <div className='flex items-center justify-between bg-slate-800/50 rounded px-2 py-1.5'>
                <span>Restart</span>
                <span className='text-emerald-400 font-mono'>R</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='flex flex-col gap-2'
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsPaused(prev => !prev)}
              disabled={gameOver}
              className='w-full px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm border-2 border-emerald-400/30 hover:border-emerald-400/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            >
              {isPaused ? <Play className='w-4 h-4' /> : <Pause className='w-4 h-4' />}
              {isPaused ? 'Resume' : 'Pause'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetGame}
              className='w-full px-4 py-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 font-semibold text-sm border-2 border-slate-500/50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-lg'
            >
              <RotateCcw className='w-4 h-4' />
              New Game
            </motion.button>
          </motion.div>
        </div>

        {/* Game Canvas */}
        {/* Game Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg p-3 border-2 border-slate-700/50 shadow-2xl'
        >
        <div 
          className='relative rounded-lg overflow-hidden'
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE,
            background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
          }}
        >
          {snake.map((segment, index) => {
            const isHead = index === 0;
            const segmentOpacity = 1 - (index / snake.length) * 0.5;
            
            return (
              <motion.div
                key={index}
                className='absolute'
                initial={false}
                animate={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  borderRadius: isHead ? '6px' : '4px',
                  background: isHead 
                    ? 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #059669 100%)'
                    : `linear-gradient(135deg, rgba(16,185,129,${segmentOpacity}) 0%, rgba(5,150,105,${segmentOpacity}) 100%)`,
                  boxShadow: isHead 
                    ? '0 0 20px rgba(16, 185, 129, 0.8), inset 0 2px 4px rgba(255,255,255,0.3)' 
                    : `0 0 5px rgba(16, 185, 129, ${segmentOpacity * 0.3})`,
                  border: isHead ? '2px solid rgba(255,255,255,0.4)' : 'none',
                }}
              />
            );
          })}

          <motion.div
            key={`food-${food.x}-${food.y}`}
            className='absolute'
            initial={false}
            animate={{ 
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              scale: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
              left: { type: 'spring', stiffness: 300, damping: 30 },
              top: { type: 'spring', stiffness: 300, damping: 30 },
            }}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #fca5a5 0%, #ef4444 40%, #dc2626 100%)',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.7), inset 0 2px 4px rgba(255,255,255,0.4)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          />

          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4'
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className='text-4xl font-bold text-red-400'
                >
                  Game Over!
                </motion.div>
                <div className='text-2xl text-emerald-400 font-semibold'>Score: {score}</div>
                {score === highScore && score > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-amber-400 font-semibold flex items-center gap-2'
                  >
                    <Trophy className='w-5 h-5' />
                    New High Score!
                  </motion.div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className='mt-4 px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg'
                >
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isPaused && !gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center'
              >
                <div className='text-4xl text-slate-200 font-bold'>PAUSED</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
