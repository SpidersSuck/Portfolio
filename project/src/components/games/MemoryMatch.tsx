import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Clock } from 'lucide-react';

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🍑', '🥝'];

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: number;
    if (isPlaying && !gameWon) {
      interval = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon]);

  useEffect(() => {
    if (matches === 8) {
      setGameWon(true);
      setIsPlaying(false);
    }
  }, [matches]);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setIsPlaying(false);
    setGameWon(false);
  };

  const handleCardClick = (id: number) => {
    if (!isPlaying) setIsPlaying(true);
    
    const card = cards[id];
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(prev => prev + 1);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats Display */}
      <div className="w-full max-w-[360px] bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-[#06b6d4] text-2xl">{moves}</div>
            <div className="text-[#9fb3c8] text-sm">Moves</div>
          </div>
          <div className="text-center">
            <div className="text-[#f59e0b] text-2xl flex items-center justify-center gap-1">
              <Clock className="w-5 h-5" />
              {formatTime(time)}
            </div>
            <div className="text-[#9fb3c8] text-sm">Time</div>
          </div>
          <div className="text-center">
            <div className="text-[#10b981] text-2xl">{matches}/8</div>
            <div className="text-[#9fb3c8] text-sm">Matches</div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-3 p-6 bg-[#081522] rounded-xl border border-white/10">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className="relative w-20 h-20 rounded-lg"
              disabled={card.isFlipped || card.isMatched}
            >
              <motion.div
                className="w-full h-full rounded-lg flex items-center justify-center cursor-pointer"
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Back */}
                <div 
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    opacity: card.isFlipped || card.isMatched ? 0 : 1
                  }}
                >
                  <div className="text-3xl">❓</div>
                </div>

                {/* Card Front */}
                <div 
                  className={`absolute inset-0 rounded-lg flex items-center justify-center ${
                    card.isMatched 
                      ? 'bg-gradient-to-br from-[#10b981] to-[#059669] shadow-lg shadow-[#10b981]/50' 
                      : 'bg-[#071029] border-2 border-white/20'
                  }`}
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    opacity: card.isFlipped || card.isMatched ? 1 : 0
                  }}
                >
                  <div className="text-4xl">{card.emoji}</div>
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Win Overlay */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-[#071029]/95 rounded-xl flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">🎉 You Won! 🎉</div>
              <div className="text-xl text-[#10b981]">{moves} moves</div>
              <div className="text-xl text-[#f59e0b]">{formatTime(time)}</div>
              <button
                onClick={initializeGame}
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
        onClick={initializeGame}
        className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </button>

      {/* Keyboard Hints */}
      <div className="text-[#9fb3c8] text-sm text-center">
        Click on cards to flip and find matching pairs
      </div>
    </div>
  );
}
