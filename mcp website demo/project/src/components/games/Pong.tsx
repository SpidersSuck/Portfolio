import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw } from 'lucide-react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const WINNING_SCORE = 7;

type Difficulty = 'easy' | 'medium' | 'hard';

export function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameWon, setGameWon] = useState<'player' | 'ai' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const gameStateRef = useRef({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballDX: 5,
    ballDY: 5,
    upPressed: false,
    downPressed: false,
  });

  const resetBall = useCallback((serveToAI = false) => {
    const state = gameStateRef.current;
    state.ballX = CANVAS_WIDTH / 2;
    state.ballY = CANVAS_HEIGHT / 2;
    state.ballDX = (serveToAI ? -5 : 5) * (Math.random() > 0.5 ? 1 : -1);
    state.ballDY = (Math.random() - 0.5) * 8;
  }, []);

  const resetGame = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setGameWon(null);
    setGameStarted(true);
    resetBall();
  }, [resetBall]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        gameStateRef.current.upPressed = true;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        gameStateRef.current.downPressed = true;
      } else if (e.key === 'r' || e.key === 'R') {
        resetGame();
      } else if (e.key === ' ' && !gameStarted) {
        e.preventDefault();
        setGameStarted(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        gameStateRef.current.upPressed = false;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        gameStateRef.current.downPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame, gameStarted]);

  const update = useCallback(() => {
    if (!gameStarted || gameWon) return;

    const state = gameStateRef.current;

    // Move player paddle
    if (state.upPressed && state.playerY > 0) {
      state.playerY -= 8;
    }
    if (state.downPressed && state.playerY < CANVAS_HEIGHT - PADDLE_HEIGHT) {
      state.playerY += 8;
    }

    // AI movement
    const aiSpeed = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    const targetY = state.ballY - PADDLE_HEIGHT / 2;
    if (state.aiY < targetY - 10) {
      state.aiY += aiSpeed;
    } else if (state.aiY > targetY + 10) {
      state.aiY -= aiSpeed;
    }
    state.aiY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.aiY));

    // Move ball
    state.ballX += state.ballDX;
    state.ballY += state.ballDY;

    // Ball collision with top/bottom
    if (state.ballY <= BALL_SIZE / 2 || state.ballY >= CANVAS_HEIGHT - BALL_SIZE / 2) {
      state.ballDY = -state.ballDY;
    }

    // Ball collision with player paddle
    if (
      state.ballX - BALL_SIZE / 2 <= PADDLE_WIDTH &&
      state.ballY >= state.playerY &&
      state.ballY <= state.playerY + PADDLE_HEIGHT
    ) {
      state.ballDX = Math.abs(state.ballDX);
      state.ballDY += (state.ballY - (state.playerY + PADDLE_HEIGHT / 2)) * 0.1;
      state.ballDX *= 1.05; // Increase speed slightly
    }

    // Ball collision with AI paddle
    if (
      state.ballX + BALL_SIZE / 2 >= CANVAS_WIDTH - PADDLE_WIDTH &&
      state.ballY >= state.aiY &&
      state.ballY <= state.aiY + PADDLE_HEIGHT
    ) {
      state.ballDX = -Math.abs(state.ballDX);
      state.ballDY += (state.ballY - (state.aiY + PADDLE_HEIGHT / 2)) * 0.1;
      state.ballDX *= 1.05;
    }

    // Ball out of bounds
    if (state.ballX <= 0) {
      setAiScore(prev => {
        const newScore = prev + 1;
        if (newScore >= WINNING_SCORE) setGameWon('ai');
        return newScore;
      });
      resetBall(false);
    } else if (state.ballX >= CANVAS_WIDTH) {
      setPlayerScore(prev => {
        const newScore = prev + 1;
        if (newScore >= WINNING_SCORE) setGameWon('player');
        return newScore;
      });
      resetBall(true);
    }
  }, [gameStarted, gameWon, difficulty, resetBall]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw player paddle (cyan glow)
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#06b6d4';
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw AI paddle (purple glow)
    ctx.shadowColor = '#8b5cf6';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      update();
      draw();
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [update, draw]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Display */}
      <div className="w-full max-w-[800px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-[#06b6d4] text-3xl">{playerScore}</div>
            <div className="text-[#9fb3c8] text-sm">You</div>
          </div>
          <div className="text-center">
            <div className="text-[#9fb3c8]">First to {WINNING_SCORE}</div>
          </div>
          <div className="text-center">
            <div className="text-[#8b5cf6] text-3xl">{aiScore}</div>
            <div className="text-[#9fb3c8] text-sm">AI</div>
          </div>
        </div>
      </div>

      {/* Difficulty Selector */}
      {!gameStarted && (
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-6 py-2 rounded-lg capitalize transition-all duration-200 ${
                difficulty === diff
                  ? 'bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white'
                  : 'bg-[#081522] text-[#9fb3c8] border border-white/10 hover:border-white/30'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      )}

      {/* Game Canvas */}
      <div className="relative bg-[#081522] rounded-xl p-4 border border-white/10">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rounded-lg"
        />

        {/* Start Overlay */}
        <AnimatePresence>
          {!gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-4 bg-black/80 rounded-lg flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-3xl text-[#e6eef6] mb-4">Press Space to Start</div>
                <div className="text-[#9fb3c8]">Use Arrow Keys or W/S to move</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-4 bg-black/95 rounded-lg flex flex-col items-center justify-center gap-4"
            >
              <div className="text-4xl text-[#e6eef6]">
                {gameWon === 'player' ? '🎉 You Won!' : 'AI Wins!'}
              </div>
              <div className="text-xl text-[#9fb3c8]">
                {playerScore} - {aiScore}
              </div>
              <button
                onClick={resetGame}
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
        onClick={resetGame}
        className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Restart
      </button>

      {/* Keyboard Hints */}
      <div className="text-[#9fb3c8] text-sm text-center">
        Arrow keys or W/S to move paddle • Space to start • R to restart
      </div>
    </div>
  );
}
