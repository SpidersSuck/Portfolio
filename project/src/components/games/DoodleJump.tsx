import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Pause, Play, Trophy, Volume2, VolumeX, ArrowUpCircle } from 'lucide-react';

interface Platform {
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'moving' | 'breakable' | 'spring';
  velocity?: number;
  broken?: boolean;
}

const WIDTH = 400;
const HEIGHT = 600;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 60;
const GRAVITY = 0.4;
const JUMP_VELOCITY = -12;
const MOVE_SPEED = 5;
const SPRING_BOOST = -18;
const SCROLL_THRESHOLD = HEIGHT / 3;
const PLATFORM_WIDTH = 70;
const PLATFORM_HEIGHT = 15;

export function DoodleJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('doodleHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game state in refs for real-time access
  const player = useRef({
    x: WIDTH / 2 - PLAYER_WIDTH / 2,
    y: HEIGHT - 150,
    vx: 0,
    vy: 0,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  });

  const platforms = useRef<Platform[]>([]);
  const keys = useRef<{ [key: string]: boolean }>({});
  const cameraY = useRef(0);
  const maxHeight = useRef(0);
  const animationFrameId = useRef<number | undefined>(undefined);

  // Audio context
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Sound effects
  const playSound = (frequency: number, duration: number) => {
    if (!soundEnabled || !audioContext.current) return;
    try {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
      oscillator.start();
      oscillator.stop(audioContext.current.currentTime + duration);
    } catch (e) {
      console.log('Sound error:', e);
    }
  };

  const playJump = () => playSound(400, 0.1);
  const playSpring = () => playSound(600, 0.15);
  const playBreak = () => playSound(200, 0.1);
  const playGameOver = () => {
    playSound(300, 0.2);
    setTimeout(() => playSound(200, 0.3), 100);
  };

  // Initialize platforms
  const initPlatforms = () => {
    const newPlatforms: Platform[] = [];
    
    // Starting platform
    newPlatforms.push({
      x: WIDTH / 2 - PLATFORM_WIDTH / 2,
      y: HEIGHT - 100,
      width: PLATFORM_WIDTH,
      type: 'normal'
    });

    // Generate platforms
    for (let i = 0; i < 15; i++) {
      const y = HEIGHT - 200 - i * 80;
      const x = Math.random() * (WIDTH - PLATFORM_WIDTH);
      
      // Platform type distribution
      const rand = Math.random();
      let type: Platform['type'] = 'normal';
      
      if (rand > 0.9) type = 'spring';
      else if (rand > 0.8) type = 'breakable';
      else if (rand > 0.7) type = 'moving';

      newPlatforms.push({
        x,
        y,
        width: PLATFORM_WIDTH,
        type,
        velocity: type === 'moving' ? (Math.random() > 0.5 ? 2 : -2) : 0,
        broken: false
      });
    }

    platforms.current = newPlatforms;
  };

  // Generate new platform above viewport
  const generatePlatform = (y: number) => {
    const x = Math.random() * (WIDTH - PLATFORM_WIDTH);
    const rand = Math.random();
    let type: Platform['type'] = 'normal';
    
    if (rand > 0.92) type = 'spring';
    else if (rand > 0.85) type = 'breakable';
    else if (rand > 0.75) type = 'moving';

    platforms.current.push({
      x,
      y,
      width: PLATFORM_WIDTH,
      type,
      velocity: type === 'moving' ? (Math.random() > 0.5 ? 2 : -2) : 0,
      broken: false
    });
  };

  // Reset game
  const resetGame = () => {
    player.current = {
      x: WIDTH / 2 - PLAYER_WIDTH / 2,
      y: HEIGHT - 150,
      vx: 0,
      vy: 0,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };
    platforms.current = [];
    keys.current = {};
    cameraY.current = 0;
    maxHeight.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    initPlatforms();
  };

  // Start game
  const startGame = () => {
    resetGame();
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        startGame();
        return;
      }

      if (gameOver && e.key === 'Enter') {
        e.preventDefault();
        resetGame();
        return;
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameStarted && !gameOver) {
          setIsPaused(prev => !prev);
        }
        return;
      }

      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, soundEnabled]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = () => {
      const p = player.current;
      const k = keys.current;

      // Horizontal movement
      if (k['a'] || k['arrowleft']) {
        p.vx = -MOVE_SPEED;
      } else if (k['d'] || k['arrowright']) {
        p.vx = MOVE_SPEED;
      } else {
        p.vx = 0;
      }

      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around horizontally
      if (p.x < -p.width) p.x = WIDTH;
      if (p.x > WIDTH) p.x = -p.width;

      // Apply gravity
      p.vy += GRAVITY;

      // Check platform collisions (only when falling)
      if (p.vy > 0) {
        platforms.current.forEach(platform => {
          if (platform.broken) return;

          const relativeY = platform.y - cameraY.current;
          
          if (
            p.y + p.height >= relativeY &&
            p.y + p.height <= relativeY + PLATFORM_HEIGHT + Math.abs(p.vy) &&
            p.x + p.width > platform.x &&
            p.x < platform.x + platform.width
          ) {
            if (platform.type === 'breakable') {
              platform.broken = true;
              playBreak();
            } else if (platform.type === 'spring') {
              p.vy = SPRING_BOOST;
              playSpring();
            } else {
              p.vy = JUMP_VELOCITY;
              playJump();
            }
          }
        });
      }

      // Update moving platforms
      platforms.current.forEach(platform => {
        if (platform.type === 'moving' && platform.velocity) {
          platform.x += platform.velocity;
          if (platform.x <= 0 || platform.x + platform.width >= WIDTH) {
            platform.velocity *= -1;
          }
        }
      });

      // Camera follows player when going up
      if (p.y < SCROLL_THRESHOLD) {
        const offset = SCROLL_THRESHOLD - p.y;
        cameraY.current += offset;
        p.y = SCROLL_THRESHOLD;

        // Update max height and score
        if (cameraY.current > maxHeight.current) {
          maxHeight.current = cameraY.current;
          setScore(Math.floor(maxHeight.current / 10));
        }

        // Remove platforms that are below viewport
        platforms.current = platforms.current.filter(
          platform => platform.y - cameraY.current < HEIGHT + 100
        );

        // Generate new platforms above
        const highestPlatform = platforms.current.reduce(
          (max, p) => Math.min(max, p.y),
          Infinity
        );

        if (highestPlatform - cameraY.current > -200) {
          generatePlatform(highestPlatform - 80);
        }
      }

      // Game over if fell below screen
      if (p.y - cameraY.current > HEIGHT) {
        setGameOver(true);
        playGameOver();
        setScore(currentScore => {
          if (currentScore > highScore) {
            setHighScore(currentScore);
            localStorage.setItem('doodleHighScore', currentScore.toString());
          }
          return currentScore;
        });
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, highScore]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear
      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw background grid
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      for (let i = 0; i < WIDTH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < HEIGHT; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(WIDTH, i);
        ctx.stroke();
      }

      if (!gameStarted || gameOver) {
        requestAnimationFrame(render);
        return;
      }

      // Draw platforms
      platforms.current.forEach(platform => {
        const y = platform.y - cameraY.current;
        
        if (y < -50 || y > HEIGHT + 50) return;

        if (platform.broken) {
          ctx.globalAlpha = 0.3;
        }

        // Platform colors by type
        if (platform.type === 'spring') {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(platform.x, y, platform.width, PLATFORM_HEIGHT);
          // Spring coil
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(platform.x + 10, y + PLATFORM_HEIGHT);
          ctx.lineTo(platform.x + 15, y + PLATFORM_HEIGHT + 5);
          ctx.lineTo(platform.x + 20, y + PLATFORM_HEIGHT);
          ctx.stroke();
        } else if (platform.type === 'breakable') {
          ctx.fillStyle = '#a78bfa';
          ctx.fillRect(platform.x, y, platform.width, PLATFORM_HEIGHT);
          // Crack lines
          ctx.strokeStyle = '#6d28d9';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(platform.x + 20, y);
          ctx.lineTo(platform.x + 15, y + PLATFORM_HEIGHT);
          ctx.moveTo(platform.x + 50, y);
          ctx.lineTo(platform.x + 55, y + PLATFORM_HEIGHT);
          ctx.stroke();
        } else if (platform.type === 'moving') {
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(platform.x, y, platform.width, PLATFORM_HEIGHT);
          // Arrow indicators
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.moveTo(platform.x + 5, y + 7);
          ctx.lineTo(platform.x + 10, y + 4);
          ctx.lineTo(platform.x + 10, y + 10);
          ctx.fill();
        } else {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(platform.x, y, platform.width, PLATFORM_HEIGHT);
        }

        ctx.globalAlpha = 1;
      });

      // Draw player
      const p = player.current;
      const py = p.y - cameraY.current;

      // Doodle character (simple cute design)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(p.x + p.width / 2, py + p.height / 2, p.width / 2, p.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(p.x + p.width / 2 - 10, py + p.height / 2 - 5, 4, 0, Math.PI * 2);
      ctx.arc(p.x + p.width / 2 + 10, py + p.height / 2 - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x + p.width / 2, py + p.height / 2 + 5, 12, 0, Math.PI);
      ctx.stroke();

      // Legs (simple lines)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x + p.width / 2 - 8, py + p.height);
      ctx.lineTo(p.x + p.width / 2 - 12, py + p.height + 10);
      ctx.moveTo(p.x + p.width / 2 + 8, py + p.height);
      ctx.lineTo(p.x + p.width / 2 + 12, py + p.height + 10);
      ctx.stroke();

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, [gameStarted, gameOver]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-sky-100 overflow-hidden pt-16">
      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="relative">
          {/* Glowing background effect */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className='absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 blur-[50px] scale-150'
          />
          
          {/* Main title */}
          <motion.h1 
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              backgroundPosition: {
                duration: 4,
                repeat: Infinity,
                ease: 'linear'
              }
            }}
            className='relative text-7xl font-black tracking-wider'
            style={{
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #f97316, #fbbf24)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(251, 191, 36, 0.8)',
              filter: 'drop-shadow(0 4px 20px rgba(251, 191, 36, 0.6))',
            }}
          >
            ⬆️ DOODLE JUMP ⬆️
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            animate={{
              scaleX: [0.7, 1, 0.7],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full'
          />

          {/* Floating platform decorations */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className='absolute -left-20 top-1/2 -translate-y-1/2 text-4xl'
          >
            📦
          </motion.div>
          <motion.div
            animate={{
              y: [10, -10, 10],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5
            }}
            className='absolute -right-20 top-1/2 -translate-y-1/2 text-4xl'
          >
            📦
          </motion.div>
        </div>
      </motion.div>

      {/* Game canvas container */}
      <div className="relative">
        {/* HUD - Positioned relative to canvas */}
        {gameStarted && !gameOver && (
          <>
            {/* Score - Top Left */}
            <div className="absolute -top-14 left-0 text-gray-800 z-10 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-yellow-500/50 shadow-lg">
              <p className="text-xs text-gray-600">Height</p>
              <p className="text-2xl font-bold text-yellow-600">{score}m</p>
            </div>
            
            {/* High Score - Top Right */}
            <div className="absolute -top-14 right-0 z-10">
              <div className="text-gray-800 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-orange-500/50 shadow-lg">
                <p className="text-xs text-gray-600 text-center">Best</p>
                <p className="text-2xl font-bold text-orange-600">{highScore}m</p>
              </div>
            </div>
          </>
        )}

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="border-4 border-yellow-500/30 rounded-lg shadow-2xl shadow-yellow-500/20 bg-sky-50"
        />

        {/* Start screen */}
        <AnimatePresence>
          {!gameStarted && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-50"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold text-white mb-4">🎯 Doodle Jump</h2>
                  <p className="text-xl text-yellow-400 mb-4">Jump as high as you can!</p>
                  <div className="space-y-1 text-gray-200 mb-2">
                    <p><kbd className="px-2 py-1 bg-slate-700 rounded text-sm">A/D</kbd> or <kbd className="px-2 py-1 bg-slate-700 rounded text-sm">←→</kbd> Move</p>
                    <p className="text-sm text-gray-400 mt-2">Auto-jump on platforms</p>
                    <p className="text-sm text-yellow-400">🟢 Normal | 🟡 Moving | 🟣 Breakable | 🔴 Spring</p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transition-all text-lg"
                >
                  Start Jumping!
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over screen */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg z-50"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-white mb-2">Game Over!</h2>
                </motion.div>

                <div className="space-y-2">
                  <p className="text-2xl text-white">Height: <span className="text-yellow-500 font-bold">{score}m</span></p>
                  {score > highScore && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl text-green-400 font-bold"
                    >
                      🎉 New Record!
                    </motion.p>
                  )}
                  <p className="text-lg text-gray-400">Best: {Math.max(score, highScore)}m</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transition-all text-lg"
                >
                  Jump Again (ENTER)
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause overlay */}
        <AnimatePresence>
          {isPaused && gameStarted && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-50"
            >
              <div className="text-center">
                <Pause className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white">Paused</h2>
                <p className="text-gray-400 mt-2">Press ESC or P to continue</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute -bottom-14 right-0 p-2 bg-white/70 backdrop-blur-sm rounded-lg border-2 border-yellow-500/30 hover:border-yellow-500/50 transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-yellow-600" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
