import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;

export function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  useEffect(() => {
    checkWinner();
  }, [board]);

  const checkWinner = () => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningLine(pattern);
        setScore(prev => ({ ...prev, [board[a]!]: prev[board[a]!] + 1 }));
        return;
      }
    }
    if (board.every(cell => cell !== null)) {
      setWinner('draw');
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Display */}
      <div className="w-full max-w-md bg-[#081522] rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-[#06b6d4] text-2xl">{score.X}</div>
            <div className="text-[#9fb3c8] text-sm">Player X</div>
          </div>
          <div className="text-center">
            <div className="text-[#9fb3c8] text-2xl">{score.draws}</div>
            <div className="text-[#9fb3c8] text-sm">Draws</div>
          </div>
          <div className="text-center">
            <div className="text-[#8b5cf6] text-2xl">{score.O}</div>
            <div className="text-[#9fb3c8] text-sm">Player O</div>
          </div>
        </div>
      </div>

      {/* Current Player */}
      {!winner && (
        <div className="text-[#e6eef6]">
          Current Player: <span className={currentPlayer === 'X' ? 'text-[#06b6d4]' : 'text-[#8b5cf6]'}>{currentPlayer}</span>
        </div>
      )}

      {/* Game Board */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-3 p-6 bg-[#081522] rounded-xl border border-white/10">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: cell ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(index)}
              className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                winningLine?.includes(index) 
                  ? 'border-[#10b981] bg-[#10b981]/20' 
                  : 'border-white/20 hover:border-white/40 hover:bg-white/5'
              }`}
              disabled={!!cell || !!winner}
            >
              <AnimatePresence>
                {cell === 'X' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.4 }}
                  >
                    <X className="w-10 h-10 text-[#06b6d4]" strokeWidth={3} />
                  </motion.div>
                )}
                {cell === 'O' && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.4 }}
                  >
                    <Circle className="w-10 h-10 text-[#8b5cf6]" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Winner Overlay */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-[#071029]/95 rounded-xl flex flex-col items-center justify-center gap-4"
            >
              <div className="text-3xl text-[#e6eef6]">
                {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
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
      <div className="flex gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
        <button
          onClick={resetScore}
          className="px-6 py-2 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200"
        >
          Reset Score
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="text-[#9fb3c8] text-sm text-center">
        Click on any empty cell to place your mark
      </div>
    </div>
  );
}
