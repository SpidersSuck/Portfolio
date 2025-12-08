import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { TicTacToe } from './games/TicTacToe';
import { Snake } from './games/Snake';
import { MemoryMatch } from './games/MemoryMatch';
import { Breakout } from './games/Breakout';
import { Asteroids } from './games/Asteroids';
import { Pong } from './games/Pong';
import { Pacman } from './games/Pacman';
import Tetris from './games/Tetris';

interface GamePageProps {
  gameId: string;
  onBack: () => void;
}

const GAME_INFO: Record<string, { title: string; component: React.ComponentType<{ onBack: () => void }> }> = {
  tictactoe: { title: 'Tic-Tac-Toe', component: TicTacToe },
  snake: { title: 'Snake', component: Snake },
  memory: { title: 'Memory Match', component: MemoryMatch },
  breakout: { title: 'Breakout', component: Breakout },
  asteroids: { title: 'Asteroids', component: Asteroids },
  pong: { title: 'Pong', component: Pong },
  pacman: { title: 'Pac-Man', component: Pacman },
  tetris: { title: 'Tetris', component: Tetris },
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#071029]"
    >
      <GameComponent onBack={onBack} />
    </motion.div>
  );
}
