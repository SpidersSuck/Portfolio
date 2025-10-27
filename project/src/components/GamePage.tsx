import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { TicTacToe } from './games/TicTacToe';
import { Snake } from './games/Snake';
import { MemoryMatch } from './games/MemoryMatch';
import { Breakout } from './games/Breakout';
import { SimonSays } from './games/SimonSays';
import { Minesweeper } from './games/Minesweeper';
import { Tetris } from './games/Tetris';
import { Game2048 } from './games/Game2048';
import { Pong } from './games/Pong';

interface GamePageProps {
  gameId: string;
  onBack: () => void;
}

const GAME_INFO: Record<string, { title: string; component: React.ComponentType }> = {
  tictactoe: { title: 'Tic-Tac-Toe', component: TicTacToe },
  snake: { title: 'Snake', component: Snake },
  memory: { title: 'Memory Match', component: MemoryMatch },
  breakout: { title: 'Breakout', component: Breakout },
  simon: { title: 'Simon Says', component: SimonSays },
  minesweeper: { title: 'Minesweeper', component: Minesweeper },
  tetris: { title: 'Tetris', component: Tetris },
  '2048': { title: '2048', component: Game2048 },
  pong: { title: 'Pong', component: Pong },
};

export function GamePage({ gameId, onBack }: GamePageProps) {
  const gameInfo = GAME_INFO[gameId];
  
  if (!gameInfo) {
    return (
      <div className="min-h-screen bg-[#071029] flex items-center justify-center">
        <div className="text-[#e6eef6]">Game not found</div>
      </div>
    );
  }

  const GameComponent = gameInfo.component;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#071029]"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[#9fb3c8] hover:text-[#06b6d4] transition-colors duration-250"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <GameComponent />
        </motion.div>
      </div>
    </motion.div>
  );
}
