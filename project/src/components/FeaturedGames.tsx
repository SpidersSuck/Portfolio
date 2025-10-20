import { motion, useInView } from 'motion/react';
import { Play, ArrowRight, Users, Circle } from 'lucide-react';
import { useRef } from 'react';
import { unsplash_tool } from '../lib/unsplash';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  players?: string;
  image?: string;
}

interface FeaturedGamesProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onNavigate: (page: string) => void;
}

export function FeaturedGames({ games, onSelectGame, onNavigate }: FeaturedGamesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const featuredGames = [
    { ...games[1], description: 'Classic arcade meets modern design', difficulty: 'medium' as const, players: '1.2K played' },
    { ...games[6], description: 'Timeless puzzle challenge', difficulty: 'easy' as const, players: '2.5K played' },
    { ...games[3], description: 'Brick-smashing arcade action', difficulty: 'medium' as const, players: '980 played' },
  ];

  const getDifficultyDots = (difficulty: 'easy' | 'medium' | 'hard') => {
    const filled = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    return (
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <Circle
            key={i}
            size={8}
            className={i < filled ? 'fill-[#06b6d4] text-[#06b6d4]' : 'fill-gray-600 text-gray-600'}
          />
        ))}
      </div>
    );
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6 pt-16 relative">
      {/* Background Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#8b5cf6]/5 to-[#06b6d4]/5 blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs uppercase tracking-[2px] text-[#06b6d4] mb-3">Spotlight</div>
          <h2 className="text-5xl text-white mb-2">Featured Games</h2>
          <p className="text-lg text-white/70">Top picks to get you started</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={() => onNavigate('games')}
          className="group mt-6 md:mt-0 px-6 py-3 rounded-lg border-2 border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all duration-300 flex items-center gap-2"
        >
          View All Games
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {featuredGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
            className="group relative bg-[#081522] rounded-2xl overflow-hidden border border-white/10 hover:border-[#06b6d4] transition-all duration-500"
          >
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl animate-[spin_3s_linear_infinite] bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] blur-sm" />
              <div className="absolute inset-[3px] rounded-2xl bg-[#081522]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Game Preview */}
              <div className="relative h-[288px] bg-gradient-to-br from-[#06b6d4]/20 to-[#8b5cf6]/20 overflow-hidden">
                {game.image ? (
                  <>
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                      {game.title[0]}
                    </div>
                  </>
                )}
              </div>

              {/* Game Info */}
              <div className="p-6 space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-xs uppercase text-white">
                    Featured
                  </span>
                  <span className="px-2 py-1 rounded bg-white/10 text-xs uppercase text-[#06b6d4]">
                    {game.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl text-white group-hover:bg-gradient-to-r group-hover:from-[#06b6d4] group-hover:to-[#8b5cf6] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {game.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-white/50 pt-2">
                  <div className="flex items-center gap-2">
                    {getDifficultyDots(game.difficulty)}
                    <span className="capitalize">{game.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{game.players}</span>
                  </div>
                </div>

                {/* Play Button */}
                <button
                  onClick={() => onSelectGame(game.id)}
                  className="w-full mt-4 h-12 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(6,182,212,0.4)] transition-all duration-300 group/btn"
                >
                  Play Now
                  <Play className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
