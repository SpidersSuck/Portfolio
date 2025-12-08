import { motion } from 'motion/react';
import { Play, List, Grid3x3, Footprints, Brain, Blocks, Radio, Bomb, Grid2x2, Gamepad } from 'lucide-react';
import { QuickStats } from './QuickStats';
import { FeaturedGames } from './FeaturedGames';
import { HowItWorks } from './HowItWorks';
import { TechnologySection } from './TechnologySection';
import { ProjectStory } from './ProjectStory';
import { CTABanner } from './CTABanner';
import { Footer } from './Footer';

interface HeroHomePageProps {
  onSelectGame: (gameId: string) => void;
  onNavigate: (page: string) => void;
}

export function HeroHomePage({ onSelectGame, onNavigate }: HeroHomePageProps) {
  const games = [
    {
      id: 'tictactoe',
      title: 'Tic-Tac-Toe',
      description: 'Classic strategy game',
      category: 'strategy',
      difficulty: 'easy' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/tictactoe.svg'
    },
    {
      id: 'snake',
      title: 'Snake',
      description: 'Eat and grow',
      category: 'arcade',
      difficulty: 'medium' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/snake.svg'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Test your memory',
      category: 'puzzle',
      difficulty: 'easy' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/memory.svg'
    },
    {
      id: 'breakout',
      title: 'Breakout',
      description: 'Break the bricks',
      category: 'arcade',
      difficulty: 'medium' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/breakout.svg'
    },
    {
      id: 'simon',
      title: 'Simon Says',
      description: 'Repeat the pattern',
      category: 'memory',
      difficulty: 'medium' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/simon.svg'
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper',
      description: 'Clear the mines',
      category: 'puzzle',
      difficulty: 'hard' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/minesweeper.svg'
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Stack falling blocks',
      category: 'puzzle',
      difficulty: 'easy' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/tetris.svg'
    },
    {
      id: 'asteroids',
      title: 'Asteroids',
      description: 'Destroy asteroids in space',
      category: 'arcade',
      difficulty: 'medium' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/asteroids.svg'
    },
    {
      id: 'pong',
      title: 'Pong',
      description: 'Classic paddle game',
      category: 'arcade',
      difficulty: 'easy' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/pong.svg'
    },
    {
      id: 'pacman',
      title: 'Pac-Man',
      description: 'The legendary arcade maze game',
      category: 'arcade',
      difficulty: 'medium' as const,
      image: import.meta.env.BASE_URL + 'game-thumbnails/pacman.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#071029]">
      {/* Hero Banner */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 hero-gradient-animated opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071029]/60 via-[#071029]/40 to-[#071029]/80" />

        {/* Floating Game Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/5"
              style={{ 
                left: `${(i * 15) % 100}%`, 
                top: `${(i * 20) % 100}%` 
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 10, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 20 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.5,
              }}
            >
              {i % 3 === 0 ? <Grid3x3 size={60} /> : i % 3 === 1 ? <Gamepad size={60} /> : <Brain size={60} />}
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl gaming-title mb-6 font-black tracking-tight"
          >
            Play Without Limits
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-[#9fb3c8] mb-8 leading-relaxed"
          >
            Browser-based games. Keyboard-first. Accessible to all.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <button
              onClick={() => onSelectGame('tictactoe')}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white text-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center shadow-lg shadow-[#06b6d4]/50"
            >
              <Play className="w-5 h-5" />
              Start Playing
            </button>
            <button
              onClick={() => onNavigate('games')}
              className="px-8 py-4 rounded-lg bg-transparent border-2 border-[#06b6d4] text-[#06b6d4] text-lg hover:bg-[#06b6d4]/10 transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <List className="w-5 h-5" />
              View All Games
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-[#9fb3c8] text-sm"
          >
            9+ Games • 100% Free • No Downloads
          </motion.div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <QuickStats />

      {/* Featured Games Section */}
      <FeaturedGames games={games} onSelectGame={onSelectGame} onNavigate={onNavigate} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Technology & AI Coordination Section */}
      <TechnologySection onNavigate={onNavigate} />

      {/* Project Story Section */}
      <ProjectStory onNavigate={onNavigate} />

      {/* Call-to-Action Banner */}
      <CTABanner onNavigate={onNavigate} />

      {/* Footer */}
      <Footer onSelectGame={onSelectGame} onNavigate={onNavigate} />
    </div>
  );
}
