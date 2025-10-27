import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play } from 'lucide-react';

type Color = 'red' | 'blue' | 'green' | 'yellow';

const COLORS = {
  red: { bg: '#dc2626', active: '#ef4444', position: 'top-left' },
  blue: { bg: '#2563eb', active: '#3b82f6', position: 'top-right' },
  green: { bg: '#16a34a', active: '#22c55e', position: 'bottom-left' },
  yellow: { bg: '#ca8a04', active: '#eab308', position: 'bottom-right' },
};

export function SimonSays() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  const playSound = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const getFrequency = (color: Color) => {
    const frequencies = {
      red: 329.63,    // E4
      blue: 261.63,   // C4
      green: 392.00,  // G4
      yellow: 440.00, // A4
    };
    return frequencies[color];
  };

  const flashColor = async (color: Color) => {
    setActiveColor(color);
    playSound(getFrequency(color), 0.3);
    await new Promise(resolve => setTimeout(resolve, 400));
    setActiveColor(null);
    await new Promise(resolve => setTimeout(resolve, 200));
  };

  const showSequence = async () => {
    setIsShowingSequence(true);
    setIsUserTurn(false);
    for (const color of sequence) {
      await flashColor(color);
    }
    setIsUserTurn(true);
    setIsShowingSequence(false);
  };

  const startGame = () => {
    const firstColor = Object.keys(COLORS)[Math.floor(Math.random() * 4)] as Color;
    setSequence([firstColor]);
    setUserSequence([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (sequence.length > 0 && !gameOver) {
      showSequence();
    }
  }, [sequence]);

  const handleColorClick = async (color: Color) => {
    if (!isUserTurn || isShowingSequence || gameOver) return;

    await flashColor(color);

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // Check if the user's input matches the sequence so far
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong color
      setGameOver(true);
      setIsUserTurn(false);
      if (score > highScore) {
        setHighScore(score);
      }
      playSound(100, 0.5); // Error sound
      return;
    }

    // Check if the user completed the sequence
    if (newUserSequence.length === sequence.length) {
      // Correct! Add a new color
      setScore(prev => prev + 1);
      setUserSequence([]);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const nextColor = Object.keys(COLORS)[Math.floor(Math.random() * 4)] as Color;
      setSequence([...sequence, nextColor]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Display */}
      <div className="w-full max-w-[360px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-[#8b5cf6] text-2xl">{score}</div>
            <div className="text-[#9fb3c8] text-sm">Current Score</div>
          </div>
          <div className="text-center">
            <div className="text-[#f59e0b] text-2xl">{highScore}</div>
            <div className="text-[#9fb3c8] text-sm">High Score</div>
          </div>
        </div>
      </div>

      {/* Status */}
      {isPlaying && !gameOver && (
        <div className="text-[#e6eef6]">
          {isShowingSequence ? 'Watch the sequence...' : isUserTurn ? 'Your turn!' : 'Get ready...'}
        </div>
      )}

      {/* Game Board */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-4 p-6 bg-[#081522] rounded-xl border border-white/10">
          {(Object.keys(COLORS) as Color[]).map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: isUserTurn ? 1.05 : 1 }}
              whileTap={{ scale: isUserTurn ? 0.95 : 1 }}
              onClick={() => handleColorClick(color)}
              disabled={!isUserTurn || isShowingSequence}
              className="w-24 h-24 rounded-2xl transition-all duration-150 shadow-lg disabled:cursor-not-allowed"
              style={{
                backgroundColor: activeColor === color ? COLORS[color].active : COLORS[color].bg,
                opacity: activeColor === color ? 1 : 0.7,
                transform: activeColor === color ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Start Overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-[#071029]/95 rounded-xl flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">Simon Says</div>
              <p className="text-[#9fb3c8] text-center max-w-xs">
                Watch the sequence and repeat it by clicking the colored buttons
              </p>
              <button
                onClick={startGame}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-[#071029]/95 rounded-xl flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">Game Over!</div>
              <div className="text-xl text-[#8b5cf6]">Score: {score}</div>
              {score === highScore && score > 0 && (
                <div className="text-[#f59e0b]">New High Score! 🎉</div>
              )}
              <button
                onClick={startGame}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sequence Indicator */}
      {isPlaying && !gameOver && (
        <div className="bg-[#081522] rounded-xl p-4 border border-white/10">
          <div className="text-[#9fb3c8] text-sm text-center">
            Sequence Length: {sequence.length}
          </div>
        </div>
      )}

      {/* Controls */}
      {isPlaying && !gameOver && (
        <button
          onClick={() => {
            setIsPlaying(false);
            setSequence([]);
            setUserSequence([]);
          }}
          className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Quit Game
        </button>
      )}

      {/* Keyboard Hints */}
      <div className="text-[#9fb3c8] text-sm text-center">
        Watch the pattern, then repeat it by clicking the buttons
      </div>
    </div>
  );
}
