import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Volume2, VolumeX } from 'lucide-react';

interface Bell {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
  pitch: number; // For varied bell sounds
  bounceScale: number; // For bounce animation
  bounceTimer: number; // Animation timing
}

interface SnowflakeType {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

// Animation states for bunny
type AnimationState = 'idle' | 'crouch' | 'jump' | 'peak' | 'fall' | 'land';

// Altitude zones for music layers
type AltitudeZone = 'ground' | 'clouds' | 'aurora' | 'space';

const WIDTH = 400;
const HEIGHT = 600;
const GRAVITY = 0.35; // Slower fall for better gameplay between bells
const BOUNCE_STRENGTH = -14; // Moderate bounce - enough to reach bells without launching to space
const RABBIT_SIZE = 35;
const GROUND_Y = HEIGHT - 80;
const FOLLOW_SPEED = 0.03; // Much slower for smoother, more controlled movement
const CAMERA_FOLLOW_SPEED = 0.05; // Camera follows bunny smoothly

export function WinterBells() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('winterBellsHighScore');
      return saved ? parseInt(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(0);

  // Game state refs
  const rabbit = useRef({
    x: WIDTH / 2,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    targetX: WIDTH / 2,
    onGround: true,
    animationState: 'idle' as AnimationState,
    animationTimer: 0,
    facing: 1, // 1 for right, -1 for left
  });

  const bells = useRef<Bell[]>([]);
  const snowflakes = useRef<SnowflakeType[]>([]);
  const particles = useRef<Particle[]>([]);
  const hasLeftGround = useRef(false);
  const animationFrameId = useRef<number | undefined>(undefined);
  const audioContext = useRef<AudioContext | null>(null);
  const comboCount = useRef(0);
  const currentAltitudeZone = useRef<AltitudeZone>('ground');
  const mousePressed = useRef(false);
  const canJump = useRef(true);
  const camera = useRef({
    y: 0, // Camera offset from ground
    targetY: 0, // Where camera wants to be
  });

  // Simple ambient sound reference
  const ambientSound = useRef<{
    source: AudioBufferSourceNode | null;
    gainNode: GainNode | null;
  } | null>(null);

  useEffect(() => {
    try {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
    return () => {
      stopAmbientSound();
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Enhanced sound effects with reverb and variation
  const playBellSound = (pitch: number) => {
    if (!soundEnabled || !audioContext.current) return;
    try {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      const filter = audioContext.current.createBiquadFilter();
      
      // Create a crystalline bell sound
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      // Add slight pitch variation (±5%)
      const variation = pitch * (0.95 + Math.random() * 0.1);
      oscillator.frequency.value = variation;
      oscillator.type = 'sine';
      
      // Bell envelope with reverb-like decay
      filter.type = 'lowpass';
      filter.frequency.value = variation * 2;
      
      const now = audioContext.current.currentTime;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      
      oscillator.start(now);
      oscillator.stop(now + 0.8);
    } catch (e) {
      console.log('Sound error:', e);
    }
  };

  const playJumpSound = () => {
    if (!soundEnabled || !audioContext.current) return;
    try {
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      // Soft hop sound
      oscillator.frequency.value = 300;
      oscillator.type = 'sine';
      
      const now = audioContext.current.currentTime;
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      oscillator.start(now);
      oscillator.stop(now + 0.2);
    } catch (e) {
      console.log('Sound error:', e);
    }
  };

  const playGameOver = () => {
    if (!soundEnabled || !audioContext.current) return;
    playBellSound(200);
    setTimeout(() => playBellSound(150), 150);
  };

  // Simple ambient sound - just soft wind noise (much better than screeching!)
  const playAmbientSound = () => {
    if (!soundEnabled || !audioContext.current) return;
    
    try {
      // Create subtle ambient wind sound
      const ctx = audioContext.current;
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate soft white noise for wind effect
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() - 0.5) * 0.02; // Very quiet
      }
      
      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      
      source.buffer = buffer;
      source.loop = true;
      
      // Low-pass filter for wind effect
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 200;
      
      gainNode.gain.value = 0.03; // Very subtle
      
      source.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      source.start();
      
      // Store reference to stop later
      ambientSound.current = { source, gainNode };
    } catch (e) {
      console.log('Ambient sound error:', e);
    }
  };

  // Stop ambient sound
  const stopAmbientSound = () => {
    if (ambientSound.current?.source) {
      try {
        ambientSound.current.source.stop();
      } catch (e) {
        // Source may already be stopped
      }
      ambientSound.current = null;
    }
  };

  // Altitude zone detection (simplified - no more screeching music!)
  const updateAltitudeZone = (bunnyY: number) => {
    let newZone: AltitudeZone = 'ground';
    
    if (bunnyY < HEIGHT * 0.8) newZone = 'clouds';
    if (bunnyY < HEIGHT * 0.5) newZone = 'aurora';
    if (bunnyY < HEIGHT * 0.2) newZone = 'space';
    
    if (currentAltitudeZone.current !== newZone) {
      currentAltitudeZone.current = newZone;
      // Just log the zone change - no more awful music!
      console.log(`Entering ${newZone} zone`);
    }
  };



  // Initialize snowflakes
  const initSnowflakes = () => {
    const flakes: SnowflakeType[] = [];
    for (let i = 0; i < 40; i++) {
      flakes.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    snowflakes.current = flakes;
  };

  // Add jump particles (snow puff on takeoff/landing)
  const addJumpParticles = (x: number, y: number, isLanding = false) => {
    const particleCount = isLanding ? 8 : 5;
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * (isLanding ? 4 : 2),
        vy: Math.random() * -2 - 1,
        life: 1,
        maxLife: 0.5 + Math.random() * 0.3,
      });
    }
  };

  // Update bunny animation state
  const updateBunnyAnimation = (deltaTime: number) => {
    const r = rabbit.current;
    r.animationTimer += deltaTime;

    // Update facing direction based on movement
    if (Math.abs(r.vx) > 0.1) {
      r.facing = r.vx > 0 ? 1 : -1;
    }

    // State transitions based on physics
    const wasGrounded = r.animationState === 'idle' || r.animationState === 'crouch';
    
    if (r.vy < -5 && wasGrounded) {
      r.animationState = 'jump';
      r.animationTimer = 0;
    } else if (r.vy < -2 && r.animationState === 'jump') {
      r.animationState = 'peak';
      r.animationTimer = 0;
    } else if (r.vy > 2 && (r.animationState === 'peak' || r.animationState === 'jump')) {
      r.animationState = 'fall';
      r.animationTimer = 0;
    } else if (r.onGround && (r.animationState === 'fall' || r.animationState === 'land')) {
      if (r.animationState === 'fall') {
        r.animationState = 'land';
        r.animationTimer = 0;
        addJumpParticles(r.x, r.y + RABBIT_SIZE / 2, true);
      } else if (r.animationTimer > 0.2) {
        r.animationState = 'idle';
        r.animationTimer = 0;
      }
    } else if (r.onGround && r.animationState !== 'land' && r.animationState !== 'crouch') {
      r.animationState = 'idle';
    }
  };

  // Initialize bells starting from above ground
  const initBells = () => {
    const newBells: Bell[] = [];
    let y = GROUND_Y - 80; // Start closer to rabbit for easier first jump
    
    for (let i = 0; i < 15; i++) {
      if (i === 0) {
        // First bell is extra close and positioned well
        y = GROUND_Y - 90;
      } else {
        y -= Math.random() * 40 + 35; // Even closer spacing for reachable jumps
      }
      const x = Math.random() * (WIDTH - 80) + 40;
      newBells.push({
        x,
        y,
        radius: 18,
        hit: false,
        pitch: 400 + Math.random() * 400, // Random pitch for varied bell sounds
        bounceScale: 1,
        bounceTimer: 0,
      });
    }

    bells.current = newBells;
  };

  // Generate new bell above
  const generateBell = (lastY: number) => {
    const y = lastY - Math.random() * 60 - 50;
    const x = Math.random() * (WIDTH - 80) + 40;
    bells.current.push({
      x,
      y,
      radius: 18,
      hit: false,
      pitch: 400 + Math.random() * 400, // Random pitch for varied bell sounds
      bounceScale: 1,
      bounceTimer: 0,
    });
  };

  // Reset game
  const resetGame = () => {
    // Stop any existing animation frames
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }
    
    // Stop ambient sound
    stopAmbientSound();
    
    // Reset React state first
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    
    // Wait a frame then reset everything else
    setTimeout(() => {
      // Reset all game state
      rabbit.current = {
        x: WIDTH / 2,
        y: GROUND_Y,
        vx: 0,
        vy: 0,
        targetX: WIDTH / 2,
        onGround: true,
        animationState: 'idle' as AnimationState,
        animationTimer: 0,
        facing: 1,
      };
      bells.current = [];
      particles.current = [];
      hasLeftGround.current = false;
      comboCount.current = 0;
      currentAltitudeZone.current = 'ground';
      mousePressed.current = false;
      canJump.current = true;
      camera.current = { y: 0, targetY: 0 };
      
      // Initialize new game
      initBells();
      initSnowflakes();
      
      // Start the game after everything is reset
      setGameStarted(true);
      
      // Start ambient sound
      if (soundEnabled) {
        playAmbientSound();
      }
    }, 50); // Small delay to ensure clean state
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    rabbit.current.targetX = e.clientX - rect.left;
  };

  // Handle mouse down - trigger jump
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    if (!gameStarted) {
      resetGame();
      return;
    }
    
    if (gameOver) {
      resetGame();
      return;
    }

    // Trigger jump if bunny can jump
    const r = rabbit.current;
    if ((r.onGround || canJump.current) && !mousePressed.current) {
      mousePressed.current = true;
      
      // Immediate jump for better responsiveness
      r.vy = BOUNCE_STRENGTH; // Same strength as bell bounce so it's consistent
      r.onGround = false;
      canJump.current = false;
      r.animationState = 'jump';
      r.animationTimer = 0;
      
      if (!hasLeftGround.current) {
        hasLeftGround.current = true;
      }
      
      playJumpSound();
      addJumpParticles(r.x, r.y + RABBIT_SIZE / 2);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    mousePressed.current = false;
  };

  // Handle click to start (for overlays)
  const handleCanvasClick = () => {
    if (!gameStarted) {
      resetGame();
      return;
    }
    
    if (gameOver) {
      resetGame();
      return;
    }
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      const r = rabbit.current;

      // Update bunny animation
      updateBunnyAnimation(deltaTime);

      // Update altitude zone for music layers
      updateAltitudeZone(r.y);

      // Update camera to follow bunny (simpler and more reliable)
      if (r.y < GROUND_Y - 100) { 
        // Camera follows bunny upward but keeps bunny in lower part of screen
        const targetOffset = Math.max(0, GROUND_Y - r.y - HEIGHT * 0.7);
        camera.current.targetY = targetOffset;
      } else {
        // Return to ground level when bunny is near ground
        camera.current.targetY = 0;
      }
      
      // Apply smooth camera movement with limits
      const cameraDiff = camera.current.targetY - camera.current.y;
      camera.current.y += cameraDiff * 0.05; // Faster response
      camera.current.y = Math.max(0, camera.current.y); // Never go below 0

      // Smooth horizontal movement following mouse
      const dx = r.targetX - r.x;
      r.vx = dx * FOLLOW_SPEED;
      r.x += r.vx;

      // Clamp within bounds
      if (r.x < RABBIT_SIZE / 2) r.x = RABBIT_SIZE / 2;
      if (r.x > WIDTH - RABBIT_SIZE / 2) r.x = WIDTH - RABBIT_SIZE / 2;

      // Apply gravity when not on ground (with better hang time)
      if (!r.onGround) {
        // Less gravity at peak of jump for better hang time
        if (Math.abs(r.vy) < 2) {
          r.vy += GRAVITY * 0.5; // Half gravity near peak
        } else {
          r.vy += GRAVITY;
        }
      }

      // Add slight air resistance for smoother movement (but not too much!)
      if (!r.onGround && r.vy > 0) {
        r.vy *= 0.998; // Very slight damping only when falling
      }

      // Cap maximum upward velocity to prevent space launches
      if (r.vy < -20) {
        r.vy = -20; // Maximum upward speed
      }
      
      // Apply vertical velocity
      r.y += r.vy;

      // Check if on ground
      if (r.y >= GROUND_Y) {
        if (hasLeftGround.current) {
          // Game over - fell back to ground after leaving
          setGameOver(true);
          playGameOver();
          stopAmbientSound(); // Stop ambient sound on game over
          setScore(currentScore => {
            if (currentScore > highScore) {
              setHighScore(currentScore);
              localStorage.setItem('winterBellsHighScore', currentScore.toString());
            }
            return currentScore;
          });
        } else {
          // Still on starting ground
          r.y = GROUND_Y;
          r.vy = 0;
          r.onGround = true;
          canJump.current = true;
        }
      } else {
        r.onGround = false;
      }

      // Check bell collisions (from any direction)
      bells.current.forEach(bell => {
        if (bell.hit) return;

        const dist = Math.hypot(r.x - bell.x, r.y - bell.y);
        const collisionDist = bell.radius + RABBIT_SIZE / 2;

        // Collision with bell
        if (dist < collisionDist) {
          // Hit the bell!
          bell.hit = true;
          bell.bounceScale = 1.3; // Start bounce animation
          bell.bounceTimer = 0.3; // Bounce duration

          // Mark as left ground
          if (!hasLeftGround.current) {
            hasLeftGround.current = true;
          }
          r.onGround = false;
          canJump.current = true; // Allow jumping after hitting bell

          // Play bell sound with its unique pitch
          playBellSound(bell.pitch);

          // Bounce!
          r.vy = BOUNCE_STRENGTH;
          r.animationState = 'jump';
          r.animationTimer = 0;

          // Add bell hit particles
          addJumpParticles(bell.x, bell.y);

          // Increase combo and score
          comboCount.current += 1;
          setCombo(comboCount.current);
          setScore(prev => prev + comboCount.current * 10);
        }
      });

      // Remove bells below ground
      bells.current = bells.current.filter(bell => bell.y < HEIGHT + 50);

      // Generate new bells
      while (bells.current.length < 15) {
        const lastBell = bells.current[bells.current.length - 1];
        const lastY = lastBell ? lastBell.y : GROUND_Y - 120;
        generateBell(lastY);
      }

      // Update bell animations
      bells.current.forEach(bell => {
        if (bell.bounceTimer > 0) {
          bell.bounceTimer -= deltaTime;
          // Elastic bounce effect
          const progress = 1 - (bell.bounceTimer / 0.3);
          bell.bounceScale = 1 + (0.3 * Math.sin(progress * Math.PI * 3) * Math.exp(-progress * 4));
          
          if (bell.bounceTimer <= 0) {
            bell.bounceScale = 1;
            bell.bounceTimer = 0;
          }
        }
      });

      // Update snowflakes
      snowflakes.current.forEach(flake => {
        flake.y += flake.speed;
        flake.x += Math.sin(flake.y * 0.02) * 0.3;

        if (flake.y > HEIGHT) {
          flake.y = -10;
          flake.x = Math.random() * WIDTH;
        }
      });

      // Update particles
      particles.current = particles.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // Gravity on particles
        particle.life -= deltaTime / particle.maxLife;
        
        return particle.life > 0;
      });

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStarted, gameOver, highScore]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      try {
        // Clear the entire canvas first
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        
        // Save context and apply camera transform
        ctx.save();
        
        // Apply camera transform (but limit it to prevent glitches)
        const safeCamera = Math.max(0, Math.min(camera.current.y, HEIGHT * 2));
        ctx.translate(0, safeCamera);
      
      // Dark blue gradient sky (like screenshot)
      const gradient = ctx.createLinearGradient(0, -camera.current.y, 0, HEIGHT - camera.current.y);
      gradient.addColorStop(0, '#0a1929');
      gradient.addColorStop(0.5, '#1e3a5f');
      gradient.addColorStop(1, '#2c5f8d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, -camera.current.y, WIDTH, HEIGHT + camera.current.y);

      // Draw snowflakes
      snowflakes.current.forEach(flake => {
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw frosted pine trees at bottom (like screenshot)
      const treeY = GROUND_Y + 20;
      const treeCount = 8;
      for (let i = 0; i < treeCount; i++) {
        const treeX = (WIDTH / treeCount) * i + (WIDTH / treeCount / 2);
        const treeHeight = 60 + Math.random() * 20;
        const treeWidth = 40;
        
        // Tree body (layered triangles for pine effect)
        for (let layer = 0; layer < 4; layer++) {
          const layerY = treeY - (layer * 15);
          const layerWidth = treeWidth - (layer * 6);
          
          // Frosted pine color
          ctx.fillStyle = `rgba(200, 230, 240, ${0.6 + layer * 0.1})`;
          ctx.beginPath();
          ctx.moveTo(treeX, layerY - 20);
          ctx.lineTo(treeX - layerWidth / 2, layerY);
          ctx.lineTo(treeX + layerWidth / 2, layerY);
          ctx.closePath();
          ctx.fill();
          
          // Frost highlights
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + layer * 0.1})`;
          ctx.beginPath();
          ctx.moveTo(treeX, layerY - 20);
          ctx.lineTo(treeX - layerWidth / 4, layerY - 10);
          ctx.lineTo(treeX, layerY);
          ctx.closePath();
          ctx.fill();
        }
        
        // Tree trunk
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(treeX - 3, treeY, 6, 15);
      }

      // Snow ground
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, GROUND_Y + 35, WIDTH, HEIGHT - GROUND_Y - 35);
      
      // Ground snow texture
      ctx.fillStyle = 'rgba(230, 240, 255, 0.8)';
      ctx.beginPath();
      for (let x = 0; x < WIDTH; x += 10) {
        ctx.lineTo(x, GROUND_Y + 35 + Math.sin(x * 0.15) * 2);
      }
      ctx.lineTo(WIDTH, HEIGHT);
      ctx.lineTo(0, HEIGHT);
      ctx.closePath();
      ctx.fill();

      // Always restore the context before early returns
      if (!gameStarted || gameOver) {
        ctx.restore();
        if (gameStarted || !gameOver) { // Only continue rendering if needed
          requestAnimationFrame(render);
        }
        return;
      }

      // Draw bells (white/silver like screenshot)
      bells.current.forEach(bell => {
        const bellScreenY = bell.y - camera.current.y;
        if (bellScreenY < -50 || bellScreenY > HEIGHT + 50) return;

        ctx.save();
        ctx.translate(bell.x, bell.y);
        ctx.scale(bell.bounceScale, bell.bounceScale);

        // Bell body (white with silver outline)
        ctx.fillStyle = bell.hit ? '#94a3b8' : '#f0f4f8';
        ctx.strokeStyle = bell.hit ? '#64748b' : '#cbd5e1';
        ctx.lineWidth = 2;

        // Bell shape (more bell-like)
        ctx.beginPath();
        ctx.arc(0, -2, bell.radius * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Bell bottom rim
        ctx.fillStyle = bell.hit ? '#64748b' : '#e2e8f0';
        ctx.beginPath();
        ctx.ellipse(0, bell.radius - 6, bell.radius, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bell shine highlight
        if (!bell.hit) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(-5, -8, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bell top knob
        ctx.fillStyle = bell.hit ? '#94a3b8' : '#cbd5e1';
        ctx.beginPath();
        ctx.arc(0, -bell.radius, 3, 0, Math.PI * 2);
        ctx.fill();

        // Bell clapper
        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.arc(0, 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw particles (snow puffs)
      particles.current.forEach(particle => {
        const alpha = particle.life;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2 * alpha, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw rabbit with animation states
      const r = rabbit.current;

      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.scale(r.facing, 1); // Flip bunny based on facing direction

      // Animation-based scaling and positioning
      let scaleX = 1;
      let scaleY = 1;
      let offsetY = 0;
      let earRotation = 0;

      switch (r.animationState) {
        case 'crouch':
          scaleY = 0.8;
          scaleX = 1.1;
          offsetY = 5;
          break;
        case 'jump':
          scaleY = 1.2;
          scaleX = 0.9;
          offsetY = -3;
          earRotation = -0.2;
          break;
        case 'peak':
          earRotation = -0.1;
          break;
        case 'fall':
          earRotation = 0.2;
          break;
        case 'land':
          scaleY = 0.9;
          scaleX = 1.05;
          offsetY = 3;
          break;
        case 'idle':
          // Subtle breathing animation
          const breathe = Math.sin(r.animationTimer * 4) * 0.03;
          scaleY = 1 + breathe;
          break;
      }

      ctx.scale(scaleX, scaleY);
      ctx.translate(0, offsetY);

      // Rabbit body (white with soft shadow)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1.5;
      
      // Soft shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.ellipse(2, 2, RABBIT_SIZE / 2, RABBIT_SIZE / 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Main body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, RABBIT_SIZE / 2, RABBIT_SIZE / 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Animated ears with rotation
      ctx.save();
      ctx.rotate(earRotation);
      
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffc0cb';
      ctx.lineWidth = 1.5;
      
      // Left ear
      ctx.beginPath();
      ctx.ellipse(-8, -18, 4, 14, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffc0cb';
      ctx.beginPath();
      ctx.ellipse(-8, -14, 2, 7, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Right ear
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffc0cb';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(8, -18, 4, 14, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffc0cb';
      ctx.beginPath();
      ctx.ellipse(8, -14, 2, 7, 0.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      // Eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-6, -3, 2, 0, Math.PI * 2);
      ctx.arc(6, -3, 2, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#ffc0cb';
      ctx.beginPath();
      ctx.arc(0, 2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 4, 4, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Tail
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(RABBIT_SIZE / 2 - 2, 6, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Restore camera transform for UI elements
      ctx.restore();

      requestAnimationFrame(render);
      } catch (error) {
        console.error('Render error:', error);
        // Try to restore context state in case of error
        ctx.restore();
      }
    };

    requestAnimationFrame(render);
  }, [gameStarted, gameOver]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 overflow-hidden pt-16">
      {/* Animated Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
      >
        <h1 className="text-5xl font-black text-blue-600" style={{
          textShadow: '0 2px 10px rgba(59, 130, 246, 0.5)',
        }}>
          ❄️ WINTER BELLS 🔔
        </h1>
      </motion.div>

      {/* Game canvas container */}
      <div className="relative">
        {/* HUD */}
        {gameStarted && !gameOver && (
          <>
            {/* Score */}
            <div className="absolute -top-14 left-0 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-blue-400/50 shadow-lg">
              <p className="text-xs text-gray-600">Score</p>
              <p className="text-2xl font-bold text-blue-600">{score}</p>
            </div>
            
            {/* Combo */}
            {combo > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 z-10 bg-yellow-400/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-yellow-500 shadow-lg"
              >
                <p className="text-xs text-yellow-900 text-center">Combo</p>
                <p className="text-2xl font-bold text-yellow-900">×{combo}</p>
              </motion.div>
            )}
            
            {/* High Score */}
            <div className="absolute -top-14 right-0 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-purple-400/50 shadow-lg">
              <p className="text-xs text-gray-600 text-center">Best</p>
              <p className="text-2xl font-bold text-purple-600">{highScore}</p>
            </div>
          </>
        )}

        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              rabbit.current.targetX = touch.clientX - rect.left;
              handleMouseDown(e as any);
            }
          }}
          onTouchEnd={handleMouseUp}
          className="border-4 border-blue-400/30 rounded-lg shadow-2xl shadow-blue-500/20 bg-sky-50 cursor-pointer select-none"
        />

        {/* Start screen */}
        <AnimatePresence>
          {!gameStarted && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetGame}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-900/70 to-blue-800/70 backdrop-blur-sm rounded-lg z-50 cursor-pointer"
            >
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white mb-4">🐰 Winter Bells 🔔</h2>
                <p className="text-xl text-blue-200 mb-2">Move mouse to guide the bunny</p>
                <p className="text-lg text-blue-300">Land on bells to bounce higher!</p>
                <p className="text-sm text-gray-300 mt-4">Click to start</p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-4xl mt-4"
                >
                  👆
                </motion.div>
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
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-lg z-50"
            >
              <div className="text-center space-y-6">
                <Trophy className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-2">Game Over!</h2>
                <div className="space-y-2">
                  <p className="text-2xl text-white">Score: <span className="text-blue-400 font-bold">{score}</span></p>
                  {score > highScore && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl text-green-400 font-bold"
                    >
                      🎉 New Record!
                    </motion.p>
                  )}
                  <p className="text-lg text-gray-400">Best: {Math.max(score, highScore)}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all text-lg"
                >
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const newSoundEnabled = !soundEnabled;
            setSoundEnabled(newSoundEnabled);
            
            if (gameStarted && !gameOver) {
              if (newSoundEnabled) {
                playAmbientSound();
              } else {
                stopAmbientSound();
              }
            }
          }}
          className="absolute -bottom-14 right-0 p-2 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-blue-400/30 hover:border-blue-400/50 transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-blue-600" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
