import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, RotateCcw, Users, Bot } from 'lucide-react';

type Player = 'X' | 'O' | null;
type GameMode = '2player' | 'vsBot';
type Difficulty = 'easy' | 'medium' | 'hard';

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

export function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });
  const [gameMode, setGameMode] = useState<GameMode>('2player');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isThinking, setIsThinking] = useState(false);

  const checkWinner = useCallback((currentBoard: Player[]) => {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: pattern };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'draw' as const, line: null };
    }
    return null;
  }, []);

  // Minimax algorithm for hard difficulty
  const minimax = useCallback((testBoard: Player[], player: 'X' | 'O', depth: number): number => {
    const result = checkWinner(testBoard);
    if (result) {
      if (result.winner === 'O') return 10 - depth;
      if (result.winner === 'X') return depth - 10;
      return 0;
    }

    const availableMoves = testBoard.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null) as number[];
    
    if (player === 'O') {
      let bestScore = -Infinity;
      for (const move of availableMoves) {
        testBoard[move] = 'O';
        const score = minimax(testBoard, 'X', depth + 1);
        testBoard[move] = null;
        bestScore = Math.max(bestScore, score);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const move of availableMoves) {
        testBoard[move] = 'X';
        const score = minimax(testBoard, 'O', depth + 1);
        testBoard[move] = null;
        bestScore = Math.min(bestScore, score);
      }
      return bestScore;
    }
  }, [checkWinner]);

  // Bot move logic
  const getBotMove = useCallback((currentBoard: Player[]): number => {
    const availableMoves = currentBoard.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null) as number[];
    
    if (availableMoves.length === 0) return -1;

    if (difficulty === 'easy') {
      // Random move
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } 
    
    if (difficulty === 'medium') {
      // 50% chance of best move, 50% random
      if (Math.random() < 0.5) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    }

    // Hard or medium (50% of the time) - use minimax
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'O';
      const score = minimax(testBoard, 'X', 0);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }, [difficulty, minimax]);

  // Bot makes move
  useEffect(() => {
    if (gameMode === 'vsBot' && currentPlayer === 'O' && !winner) {
      setIsThinking(true);
      const timeout = setTimeout(() => {
        const move = getBotMove(board);
        if (move !== -1) {
          handleMove(move, 'O');
        }
        setIsThinking(false);
      }, 500); // Delay for thinking effect
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, gameMode, winner, board, getBotMove]);

  // Check for winner
  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'X' || result.winner === 'O') {
        setScore(prev => ({ ...prev, [result.winner]: prev[result.winner as 'X' | 'O'] + 1 }));
      } else {
        setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    }
  }, [board, checkWinner]);

  const handleMove = (index: number, player: 'X' | 'O') => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    setCurrentPlayer(player === 'X' ? 'O' : 'X');
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isThinking) return;
    if (gameMode === 'vsBot' && currentPlayer === 'O') return;
    
    handleMove(index, currentPlayer);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsThinking(false);
  };

  const changeMode = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    setScore({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className='fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden'>
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotateX: -90 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 12 }}
        className='mb-6 relative'
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4], rotate: [0, 180, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 blur-[60px] scale-150'
        />
        <motion.h1 
          className='relative text-7xl font-black tracking-widest text-cyan-400'
          style={{
            textShadow: '0 0 30px rgba(6, 182, 212, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.5)',
            filter: 'drop-shadow(0 4px 15px rgba(6, 182, 212, 0.5))',
          }}
        >
          ⭕ TIC-TAC-TOE ❌
        </motion.h1>
      </motion.div>

      <div className='flex flex-row items-start justify-center gap-4'>
        {/* Left Panel - Controls & Score */}
        <div className='flex flex-col gap-3 w-[280px]'>
          {/* Game Mode Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-lg p-3 border-2 border-slate-700/50 shadow-xl backdrop-blur-sm'
          >
            <h3 className='text-slate-200 font-semibold text-sm mb-2'>Game Mode</h3>
            <div className='flex gap-2'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => changeMode('2player')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-all ${
                  gameMode === '2player'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-2 border-cyan-400'
                    : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600/50 hover:border-cyan-400/50'
                }`}
              >
                <Users className='w-3 h-3' />
                2 Player
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => changeMode('vsBot')}
                className={`flex-1 px-3 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 transition-all ${
                  gameMode === 'vsBot'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                    : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600/50 hover:border-purple-400/50'
                }`}
              >
                <Bot className='w-3 h-3' />
                vs Bot
              </motion.button>
            </div>
          </motion.div>

          {/* Difficulty Selection */}
          {gameMode === 'vsBot' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-lg p-3 border-2 border-slate-700/50 shadow-xl backdrop-blur-sm'
            >
              <h3 className='text-slate-200 font-semibold text-sm mb-2'>Bot Difficulty</h3>
              <div className='flex flex-col gap-2'>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setDifficulty(level); resetGame(); }}
                    className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all relative overflow-hidden ${
                      difficulty === level
                        ? level === 'easy' 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-2 border-green-400 shadow-lg shadow-green-500/50'
                          : level === 'medium'
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-2 border-yellow-400 shadow-lg shadow-yellow-500/50'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-2 border-red-400 shadow-lg shadow-red-500/50'
                        : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-600/50'
                    }`}
                  >
                    {difficulty === level && (
                      <motion.div
                        layoutId="difficulty-indicator"
                        className="absolute inset-0 bg-white/10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className='relative flex items-center justify-between'>
                      <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                      {difficulty === level && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='text-lg'
                        >
                          ✓
                        </motion.span>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='bg-gradient-to-br from-cyan-950/60 via-slate-900/60 to-purple-950/60 rounded-lg p-3 border-2 border-cyan-500/30 shadow-2xl backdrop-blur-sm'
          >
            <div className='grid grid-cols-3 gap-2'>
              <div className='text-center'>
                <div className='text-cyan-400 text-2xl font-bold'>{score.X}</div>
                <div className='text-slate-400 text-xs mt-0.5 font-medium'>X {gameMode === '2player' ? '(P1)' : '(You)'}</div>
              </div>
              <div className='text-center'>
                <div className='text-slate-400 text-2xl font-bold'>{score.draws}</div>
                <div className='text-slate-400 text-xs mt-0.5 font-medium'>Draws</div>
              </div>
              <div className='text-center'>
                <div className='text-purple-400 text-2xl font-bold'>{score.O}</div>
                <div className='text-slate-400 text-xs mt-0.5 font-medium'>O {gameMode === '2player' ? '(P2)' : '(Bot)'}</div>
              </div>
            </div>
          </motion.div>

          {/* New Game Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetGame}
            className='w-full px-4 py-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 font-semibold text-sm border-2 border-slate-500/50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 shadow-lg'
          >
            <RotateCcw className='w-4 h-4' />
            New Game
          </motion.button>
        </div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg p-4 border-2 border-slate-700/50 shadow-2xl relative'
        >
          {/* Current Player */}
          {!winner && (
            <div className='text-center mb-3'>
              <div className='text-sm text-slate-300'>
                {isThinking ? (
                  <span className='flex items-center justify-center gap-2'>
                    <Bot className='w-4 h-4 animate-pulse' />
                    Bot thinking...
                  </span>
                ) : (
                  <span>
                    Turn: <span className={currentPlayer === 'X' ? 'text-cyan-400 font-bold' : 'text-purple-400 font-bold'}>{currentPlayer}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          <div className='grid grid-cols-3 gap-3' style={{ width: '360px', height: '360px' }}>
            {board.map((cell, index) => {
              const isWinningCell = winningLine?.includes(index);
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: cell || winner || isThinking ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClick(index)}
                  disabled={!!cell || !!winner || isThinking}
                  className='relative rounded-lg transition-all'
                  style={{
                    background: isWinningCell 
                      ? 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)'
                      : 'radial-gradient(circle, #1e293b 0%, #0f172a 100%)',
                    border: isWinningCell ? '3px solid #10b981' : '3px solid rgba(71, 85, 105, 0.5)',
                    boxShadow: isWinningCell 
                      ? '0 0 20px rgba(16, 185, 129, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.2)'
                      : 'inset 0 0 15px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <AnimatePresence>
                    {cell === 'X' && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className='absolute inset-0 flex items-center justify-center'
                      >
                        <X 
                          className='text-cyan-400' 
                          strokeWidth={4} 
                          style={{ 
                            width: '70%', 
                            height: '70%',
                            filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.8))'
                          }} 
                        />
                      </motion.div>
                    )}
                    {cell === 'O' && (
                      <motion.div
                        initial={{ scale: 0, rotate: 180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className='absolute inset-0 flex items-center justify-center'
                      >
                        <Circle 
                          className='text-purple-400' 
                          strokeWidth={4} 
                          style={{ 
                            width: '70%', 
                            height: '70%',
                            filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.8))'
                          }} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Winner Overlay */}
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute inset-0 bg-slate-900/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-4'
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className='text-center'
                >
                  {winner === 'draw' ? (
                    <div className='text-4xl font-bold text-slate-300'>Draw!</div>
                  ) : (
                    <>
                      <div className='text-5xl font-bold mb-2' style={{
                        color: winner === 'X' ? '#06b6d4' : '#a855f7',
                        textShadow: winner === 'X' 
                          ? '0 0 20px rgba(6, 182, 212, 0.8)' 
                          : '0 0 20px rgba(168, 85, 247, 0.8)'
                      }}>
                        {winner} Wins!
                      </div>
                      {gameMode === 'vsBot' && (
                        <div className='text-lg text-slate-400'>
                          {winner === 'X' ? '🎉 You Win!' : '🤖 Bot Wins!'}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className='px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-lg'
                >
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
