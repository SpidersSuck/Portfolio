import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Pause, Play, Trophy, Volume2, VolumeX, Zap } from 'lucide-react';

interface Asteroid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

const WIDTH = 600;
const HEIGHT = 450;
const SHIP_SIZE = 15;
const ROTATION_SPEED = 0.04;
const THRUST_POWER = 0.15;
const FRICTION = 0.97;
const MAX_SPEED = 4;
const BULLET_SPEED = 8;
const BULLET_LIFETIME = 50;

export function Asteroids() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('asteroidsHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Game state stored in refs for immediate access in animation loop
  const ship = useRef({
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    thrusting: false
  });
  
  const asteroids = useRef<Asteroid[]>([]);
  const bullets = useRef<Bullet[]>([]);
  const keys = useRef<{ [key: string]: boolean }>({});
  const invulnerable = useRef(false);
  const invulnerableUntil = useRef(0);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastShot = useRef(0);
  const levelingUp = useRef(false);

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
      const ctx = audioContext.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio errors
    }
  };

  const playShoot = () => playSound(440, 0.1);
  const playExplosion = () => {
    playSound(100, 0.2);
    setTimeout(() => playSound(50, 0.3), 50);
  };
  const playThrust = () => playSound(150, 0.05);

  // Initialize level
  const initLevel = (levelNum: number) => {
    const newAsteroids: Asteroid[] = [];
    // Start with 3 asteroids, level 2 gets 5, then gradually increase
    const count = Math.min(3 + (levelNum - 1) * 2, 7); // Cap at 7 asteroids
    
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = Math.random() * WIDTH;
        y = Math.random() * HEIGHT;
      } while (Math.hypot(x - WIDTH / 2, y - HEIGHT / 2) < 200); // Larger safe zone
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.5; // Slower asteroids
      
      newAsteroids.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 40,
        rotation: Math.random() * Math.PI * 2
      });
    }
    
    asteroids.current = newAsteroids;
    
    // Grant temporary invulnerability at start of new level
    invulnerable.current = true;
    invulnerableUntil.current = Date.now() + 3000; // 3 seconds
  };

  // Reset game
  const resetGame = () => {
    ship.current = {
      x: WIDTH / 2,
      y: HEIGHT / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      thrusting: false
    };
    asteroids.current = [];
    bullets.current = [];
    keys.current = {};
    invulnerable.current = false;
    levelingUp.current = false;
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    initLevel(1);
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

      if (!gameStarted || gameOver) return;

      if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPaused(p => !p);
        return;
      }

      keys.current[e.key.toLowerCase()] = true;

      // Shooting - only space bar during gameplay
      if (e.key === ' ' && !isPaused && gameStarted && !gameOver) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastShot.current > 150) { // Rate limit shots - faster shooting
          lastShot.current = now;
          playShoot();
          const s = ship.current;
          bullets.current.push({
            x: s.x + Math.cos(s.angle) * SHIP_SIZE,
            y: s.y + Math.sin(s.angle) * SHIP_SIZE,
            vx: Math.cos(s.angle) * BULLET_SPEED + s.vx,
            vy: Math.sin(s.angle) * BULLET_SPEED + s.vy,
            age: 0
          });
        }
      }
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
  }, [gameStarted, gameOver, isPaused, soundEnabled]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = () => {
      const s = ship.current;
      const k = keys.current;

      // Rotation
      if (k['a'] || k['arrowleft']) {
        s.angle -= ROTATION_SPEED;
      }
      if (k['d'] || k['arrowright']) {
        s.angle += ROTATION_SPEED;
      }

      // Thrust
      s.thrusting = k['w'] || k['arrowup'];
      if (s.thrusting) {
        s.vx += Math.cos(s.angle) * THRUST_POWER;
        s.vy += Math.sin(s.angle) * THRUST_POWER;
        if (Math.random() > 0.8) playThrust();
      }

      // Apply friction
      s.vx *= FRICTION;
      s.vy *= FRICTION;

      // Speed limit
      const speed = Math.hypot(s.vx, s.vy);
      if (speed > MAX_SPEED) {
        s.vx = (s.vx / speed) * MAX_SPEED;
        s.vy = (s.vy / speed) * MAX_SPEED;
      }

      // Update position with wrap-around
      s.x = (s.x + s.vx + WIDTH) % WIDTH;
      s.y = (s.y + s.vy + HEIGHT) % HEIGHT;

      // Update bullets
      bullets.current = bullets.current
        .map(b => ({
          ...b,
          x: (b.x + b.vx + WIDTH) % WIDTH,
          y: (b.y + b.vy + HEIGHT) % HEIGHT,
          age: b.age + 1
        }))
        .filter(b => b.age < BULLET_LIFETIME);

      // Update asteroids
      asteroids.current = asteroids.current.map(a => ({
        ...a,
        x: (a.x + a.vx + WIDTH) % WIDTH,
        y: (a.y + a.vy + HEIGHT) % HEIGHT,
        rotation: a.rotation + 0.02
      }));

      // Collision: bullets vs asteroids
      const newAsteroids: Asteroid[] = [];
      let scoreIncrease = 0;

      bullets.current = bullets.current.filter(bullet => {
        const hitIndex = asteroids.current.findIndex(asteroid =>
          Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y) < asteroid.size
        );

        if (hitIndex !== -1) {
          const hit = asteroids.current[hitIndex];
          asteroids.current.splice(hitIndex, 1);
          playExplosion();

          // Score based on size
          if (hit.size >= 35) scoreIncrease += 20;
          else if (hit.size >= 20) scoreIncrease += 50;
          else scoreIncrease += 100;

          // Split asteroid if large enough
          if (hit.size > 15) {
            for (let i = 0; i < 2; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 0.5 + Math.random() * 0.8; // Slower split asteroids
              newAsteroids.push({
                x: hit.x,
                y: hit.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: hit.size / 2,
                rotation: Math.random() * Math.PI * 2
              });
            }
          }

          return false; // Remove bullet
        }
        return true;
      });

      asteroids.current.push(...newAsteroids);
      
      if (scoreIncrease > 0) {
        setScore(prev => prev + scoreIncrease);
      }

      // Check if invulnerability should end
      if (invulnerable.current && Date.now() > invulnerableUntil.current) {
        invulnerable.current = false;
      }

      // Collision: ship vs asteroids
      if (!invulnerable.current) {
        const hit = asteroids.current.find(a =>
          Math.hypot(s.x - a.x, s.y - a.y) < a.size + SHIP_SIZE / 2
        );

        if (hit) {
          playExplosion();
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setScore(currentScore => {
                if (currentScore > highScore) {
                  setHighScore(currentScore);
                  localStorage.setItem('asteroidsHighScore', currentScore.toString());
                }
                return currentScore;
              });
            } else {
              // Respawn
              ship.current = {
                x: WIDTH / 2,
                y: HEIGHT / 2,
                vx: 0,
                vy: 0,
                angle: -Math.PI / 2,
                thrusting: false
              };
              invulnerable.current = true;
              invulnerableUntil.current = Date.now() + 2000; // 2 seconds after respawn
            }
            return newLives;
          });
        }
      }

      // Check if level complete
      if (asteroids.current.length === 0 && !levelingUp.current) {
        levelingUp.current = true;
        setLevel(prev => {
          const nextLevel = prev + 1;
          setShowLevelUp(true);
          setTimeout(() => {
            setShowLevelUp(false);
            initLevel(nextLevel);
            levelingUp.current = false;
          }, 2000);
          return nextLevel;
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
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 100; i++) {
        const x = (i * 137.508) % WIDTH;
        const y = (i * 98.764) % HEIGHT;
        ctx.fillRect(x, y, 1, 1);
      }

      if (!gameStarted || gameOver) {
        requestAnimationFrame(render);
        return;
      }

      const s = ship.current;

      // Draw ship
      if (!invulnerable.current || Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle + Math.PI / 2);

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -SHIP_SIZE);
        ctx.lineTo(SHIP_SIZE / 2, SHIP_SIZE / 2);
        ctx.lineTo(0, SHIP_SIZE / 4);
        ctx.lineTo(-SHIP_SIZE / 2, SHIP_SIZE / 2);
        ctx.closePath();
        ctx.stroke();

        // Thrust flame
        if (s.thrusting) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(-3, SHIP_SIZE / 2);
          ctx.lineTo(0, SHIP_SIZE + Math.random() * 5);
          ctx.lineTo(3, SHIP_SIZE / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      // Draw asteroids
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      asteroids.current.forEach(a => {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.rotation);
        ctx.beginPath();
        const sides = 8;
        for (let i = 0; i <= sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const r = a.size * (0.8 + Math.sin(i * 1.5) * 0.2);
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw bullets
      ctx.fillStyle = '#fbbf24';
      bullets.current.forEach(b => {
        ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
      });

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  }, [gameStarted, gameOver]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden pt-16">
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
            className='absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 blur-[50px] scale-150'
          />
          
          {/* Main title with animated gradient */}
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
              background: 'linear-gradient(90deg, #a855f7, #ec4899, #f97316, #a855f7)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
              filter: 'drop-shadow(0 4px 20px rgba(168, 85, 247, 0.6))',
            }}
          >
            ☄️ ASTEROIDS ☄️
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
            className='absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full'
          />

          {/* Floating asteroids decoration */}
          <motion.div
            animate={{
              x: [-20, 20, -20],
              y: [-8, 8, -8],
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className='absolute -left-16 top-1/2 -translate-y-1/2 text-3xl'
          >
            🪨
          </motion.div>
          <motion.div
            animate={{
              x: [20, -20, 20],
              y: [8, -8, 8],
              rotate: [360, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2
            }}
            className='absolute -right-16 top-1/2 -translate-y-1/2 text-3xl'
          >
            🪨
          </motion.div>
        </div>
      </motion.div>

      {/* Game canvas container */}
      <div className="relative">
        {/* HUD - Positioned relative to canvas */}
        {gameStarted && !gameOver && (
          <>
            {/* Score - Top Left */}
            <div className="absolute -top-14 left-0 text-white z-10 bg-slate-900/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-yellow-500/30">
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-2xl font-bold text-yellow-400">{score}</p>
            </div>
            
            {/* Level - Top Center */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10">
              <div className="text-white bg-slate-900/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30">
                <p className="text-xs text-gray-400 text-center">Level</p>
                <p className="text-2xl font-bold text-cyan-400">{level}</p>
              </div>
            </div>
            
            {/* Lives - Top Right */}
            <div className="absolute -top-14 right-0 z-10">
              <div className="text-white bg-slate-900/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/30">
                <p className="text-xs text-gray-400 mb-1 text-center">Lives</p>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`text-2xl transition-all ${
                        i < lives ? 'opacity-100' : 'opacity-20 grayscale'
                      }`}
                    >
                      🚀
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="border-2 border-purple-500/30 rounded-lg shadow-2xl shadow-purple-500/20"
        />

        {/* Start screen */}
        <AnimatePresence>
          {!gameStarted && !gameOver && (
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
                  <h2 className="text-4xl font-bold text-white mb-4">🚀 Asteroids</h2>
                  <p className="text-xl text-purple-400 mb-4">Destroy all asteroids!</p>
                  <div className="space-y-1 text-gray-300 mb-2">
                    <p><kbd className="px-2 py-1 bg-slate-700 rounded text-sm">A/D</kbd> or <kbd className="px-2 py-1 bg-slate-700 rounded text-sm">←→</kbd> Rotate</p>
                    <p><kbd className="px-2 py-1 bg-slate-700 rounded text-sm">W</kbd> or <kbd className="px-2 py-1 bg-slate-700 rounded text-sm">↑</kbd> Thrust</p>
                    <p><kbd className="px-2 py-1 bg-slate-700 rounded text-sm">SPACE</kbd> Shoot</p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all text-lg"
                >
                  Click to Start
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over overlay */}
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
                  <p className="text-2xl text-white">Score: <span className="text-yellow-500 font-bold">{score}</span></p>
                  {score > highScore && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl text-green-400 font-bold"
                    >
                      🎉 New High Score!
                    </motion.p>
                  )}
                  <p className="text-lg text-gray-400">High Score: {Math.max(score, highScore)}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all text-lg"
                >
                  Play Again (ENTER)
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up overlay */}
        <AnimatePresence>
          {showLevelUp && gameStarted && !gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-lg z-50"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
                className="text-center"
              >
                <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
                  LEVEL {level}
                </h2>
                <p className="text-2xl text-white font-bold">Get Ready!</p>
              </motion.div>
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
      </div>
    </div>
  );
}
