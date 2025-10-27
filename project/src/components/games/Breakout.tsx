import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Heart, Pause, Play } from 'lucide-react';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = 42;
const BRICK_HEIGHT = 18;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 25;

const BRICK_COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#06b6d4'];

export function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  const gameStateRef = useRef({
    paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 100,
    ballDX: 4,
    ballDY: -4,
    bricks: [] as { x: number; y: number; status: number; color: string }[],
    rightPressed: false,
    leftPressed: false,
  });

  const initializeBricks = useCallback(() => {
    const bricks = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          status: 1,
          color: BRICK_COLORS[r],
        });
      }
    }
    return bricks;
  }, []);

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT - 100,
      ballDX: 4,
      ballDY: -4,
      bricks: initializeBricks(),
      rightPressed: false,
      leftPressed: false,
    };
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
  }, [initializeBricks]);

  useEffect(() => {
    gameStateRef.current.bricks = initializeBricks();
  }, [initializeBricks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.rightPressed = true;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.leftPressed = true;
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        resetGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.rightPressed = false;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.leftPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

  const collisionDetection = useCallback(() => {
    const state = gameStateRef.current;
    for (let i = 0; i < state.bricks.length; i++) {
      const brick = state.bricks[i];
      if (brick.status === 1) {
        if (
          state.ballX > brick.x &&
          state.ballX < brick.x + BRICK_WIDTH &&
          state.ballY > brick.y &&
          state.ballY < brick.y + BRICK_HEIGHT
        ) {
          state.ballDY = -state.ballDY;
          brick.status = 0;
          setScore(prev => prev + 10);
          
          // Check if all bricks are destroyed
          if (state.bricks.every(b => b.status === 0)) {
            setGameWon(true);
          }
        }
      }
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    state.bricks.forEach(brick => {
      if (brick.status === 1) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        ctx.strokeStyle = 'rgba(230, 238, 246, 0.2)';
        ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
      }
    });

    // Draw ball with glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#06b6d4';
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;

    // Draw paddle with gradient
    const gradient = ctx.createLinearGradient(state.paddleX, 0, state.paddleX + PADDLE_WIDTH, 0);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.strokeStyle = 'rgba(230, 238, 246, 0.5)';
    ctx.strokeRect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
  }, []);

  const update = useCallback(() => {
    if (gameOver || gameWon || isPaused) return;

    const state = gameStateRef.current;

    // Move paddle
    if (state.rightPressed && state.paddleX < CANVAS_WIDTH - PADDLE_WIDTH) {
      state.paddleX += 7;
    } else if (state.leftPressed && state.paddleX > 0) {
      state.paddleX -= 7;
    }

    // Move ball
    state.ballX += state.ballDX;
    state.ballY += state.ballDY;

    // Wall collision (sides)
    if (state.ballX + state.ballDX > CANVAS_WIDTH - BALL_RADIUS || state.ballX + state.ballDX < BALL_RADIUS) {
      state.ballDX = -state.ballDX;
    }

    // Wall collision (top)
    if (state.ballY + state.ballDY < BALL_RADIUS) {
      state.ballDY = -state.ballDY;
    } else if (state.ballY + state.ballDY > CANVAS_HEIGHT - BALL_RADIUS - 20) {
      // Paddle collision
      if (state.ballX > state.paddleX && state.ballX < state.paddleX + PADDLE_WIDTH) {
        state.ballDY = -state.ballDY;
        // Add some spin based on where the ball hits the paddle
        const hitPos = (state.ballX - state.paddleX) / PADDLE_WIDTH;
        state.ballDX = (hitPos - 0.5) * 8;
      } else if (state.ballY + state.ballDY > CANVAS_HEIGHT - BALL_RADIUS) {
        // Ball fell off
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameOver(true);
          } else {
            // Reset ball position
            state.ballX = CANVAS_WIDTH / 2;
            state.ballY = CANVAS_HEIGHT - 100;
            state.ballDX = 4;
            state.ballDY = -4;
            state.paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
          }
          return newLives;
        });
      }
    }

    collisionDetection();
    draw();
  }, [gameOver, gameWon, isPaused, collisionDetection, draw]);

  useEffect(() => {
    const gameLoop = setInterval(update, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [update]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats Display */}
      <div className="w-full max-w-[600px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-[#ec4899] text-2xl">{score}</div>
            <div className="text-[#9fb3c8] text-sm">Score</div>
          </div>
          <div className="text-center">
            <div className="text-[#ef4444] text-2xl flex items-center justify-center gap-1">
              {Array.from({ length: lives }).map((_, i) => (
                <Heart key={i} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <div className="text-[#9fb3c8] text-sm">Lives</div>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-[#081522] rounded-xl p-4 border border-white/10">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rounded-lg bg-[#071029]"
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-4 bg-[#071029]/95 rounded-lg flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">Game Over!</div>
              <div className="text-xl text-[#ec4899]">Score: {score}</div>
              <button
                onClick={resetGame}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
              >
                Play Again
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
              className="absolute inset-4 bg-[#071029]/95 rounded-lg flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">🎉 You Won! 🎉</div>
              <div className="text-xl text-[#10b981]">Score: {score}</div>
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
          {isPaused && !gameOver && !gameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-4 bg-[#071029]/80 rounded-lg flex items-center justify-center"
            >
              <div className="text-3xl text-[#e6eef6]">Paused</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsPaused(prev => !prev)}
          disabled={gameOver || gameWon}
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
        Arrow keys or A/D to move paddle • Space to pause • R to restart
      </div>
    </div>
  );
}
