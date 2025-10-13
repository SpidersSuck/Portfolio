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

const allGames = [
  { 
    id: 'tictactoe', 
    title: 'Tic-Tac-Toe', 
    description: 'Classic X and O game', 
    icon: Grid3x3, 
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', 
    category: 'strategy', 
    difficulty: 'easy' as const,
    image: 'https://images.unsplash.com/photo-1597840900616-664e930c29df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: 'snake', 
    title: 'Snake', 
    description: 'Guide the snake to eat and grow', 
    icon: Footprints, 
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
    category: 'arcade', 
    difficulty: 'medium' as const,
    image: 'https://images.unsplash.com/photo-1679110451343-f3e151ba42f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: 'memory', 
    title: 'Memory Match', 
    description: 'Find matching pairs of cards', 
    icon: Brain, 
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
    category: 'puzzle', 
    difficulty: 'easy' as const,
    image: 'https://images.unsplash.com/photo-1599666520394-50d845fe09c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: 'breakout', 
    title: 'Breakout', 
    description: 'Break bricks with a ball', 
    icon: Blocks, 
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', 
    category: 'arcade', 
    difficulty: 'medium' as const,
    image: 'https://images.unsplash.com/photo-1616793958347-3e41632671d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: 'simon', 
    title: 'Simon Says', 
    description: 'Remember the color sequence', 
    icon: Radio, 
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
    category: 'memory', 
    difficulty: 'medium' as const,
    image: 'https://images.unsplash.com/photo-1759171052927-83f3b3a72b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: 'minesweeper', 
    title: 'Minesweeper', 
    description: 'Clear grid without mines', 
    icon: Bomb, 
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
    category: 'puzzle', 
    difficulty: 'hard' as const,
    image: 'https://images.unsplash.com/photo-1608741869829-8eb30661c7be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: 'tetris', 
    title: 'Tetris', 
    description: 'Stack falling blocks perfectly', 
    icon: Grid2x2, 
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', 
    category: 'puzzle', 
    difficulty: 'easy' as const,
    image: 'https://images.unsplash.com/photo-1555864400-cc47dd93d427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: '2048', 
    title: '2048', 
    description: 'Merge tiles to reach 2048', 
    icon: Grid2x2, 
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', 
    category: 'puzzle', 
    difficulty: 'medium' as const,
    image: 'https://images.unsplash.com/photo-1592509314528-afd0c8241a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
  { 
    id: 'pong', 
    title: 'Pong', 
    description: 'Classic paddle ball game', 
    icon: Gamepad, 
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', 
    category: 'arcade', 
    difficulty: 'easy' as const,
    image: 'https://images.unsplash.com/photo-1731834451982-9476e9242f04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  },
];

export function HeroHomePage({ onSelectGame, onNavigate }: HeroHomePageProps) {
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
              onClick={() => onSelectGame(allGames[0].id)}
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
            {allGames.length}+ Games • 100% Free • No Downloads
          </motion.div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <QuickStats />

      {/* Featured Games Section */}
      <FeaturedGames games={allGames} onSelectGame={onSelectGame} onNavigate={onNavigate} />

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
