import { Grid3x3, Footprints, Brain, Blocks, Radio, Bomb } from 'lucide-react';
import { GameCard } from './GameCard';

interface HomePageProps {
  onSelectGame: (gameId: string) => void;
}

const games = [
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    description: 'Classic X and O game for two players',
    icon: Grid3x3,
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Guide the snake to eat and grow longer',
    icon: Footprints,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Find matching pairs of colorful cards',
    icon: Brain,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break bricks with a bouncing ball',
    icon: Blocks,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  },
  {
    id: 'simon',
    title: 'Simon Says',
    description: 'Remember and repeat the color sequence',
    icon: Radio,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Clear the grid without hitting mines',
    icon: Bomb,
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
];

export function HomePage({ onSelectGame }: HomePageProps) {
  return (
    <div className="min-h-screen bg-[#071029]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-[#e6eef6] mb-4">Play Mini Games</h1>
          <p className="text-[#9fb3c8] mb-4">Keyboard-first accessible browser games</p>
          <p className="text-[#9fb3c8] text-sm">Press 1-6 for instant play</p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              icon={game.icon}
              gradient={game.gradient}
              onPlay={() => onSelectGame(game.id)}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
