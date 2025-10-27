import { motion, useInView } from 'motion/react';
import { useState, useRef } from 'react';
import { Search, ChevronDown, Play, Circle, Users, X, Filter, SlidersHorizontal, Star, Clock, Trophy, Zap } from 'lucide-react';
import { Grid3x3, Footprints, Brain, Blocks, Radio, Bomb, Grid2x2, Gamepad } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: any;
  gradient: string;
  rating?: number;
  playtime?: string;
  features?: string[];
  image?: string;
}

interface GamesPageProps {
  onSelectGame: (gameId: string) => void;
  onNavigate: (page: string) => void;
}

const allGames: Game[] = [
  { 
    id: 'tictactoe', 
    title: 'Tic-Tac-Toe', 
    description: 'Classic X and O strategy game for two players', 
    icon: Grid3x3, 
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', 
    category: 'strategy', 
    difficulty: 'easy',
    rating: 4.2,
    playtime: '5 min',
    features: ['2 Players', 'Quick Match', 'Strategy'],
    image: '/game-thumbnails/tictactoe.svg'
  },
  { 
    id: 'snake', 
    title: 'Snake', 
    description: 'Guide the snake to eat and grow without hitting walls', 
    icon: Footprints, 
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
    category: 'arcade', 
    difficulty: 'medium',
    rating: 4.7,
    playtime: '10 min',
    features: ['High Score', 'Endless', 'Arcade'],
    image: '/game-thumbnails/snake.svg'
  },
  { 
    id: 'memory', 
    title: 'Memory Match', 
    description: 'Find matching pairs of cards in this brain-teasing challenge', 
    icon: Brain, 
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
    category: 'puzzle', 
    difficulty: 'easy',
    rating: 4.5,
    playtime: '8 min',
    features: ['Brain Training', 'Memory', 'Timed'],
    image: '/game-thumbnails/memory.svg'
  },
  { 
    id: 'breakout', 
    title: 'Breakout', 
    description: 'Break all the bricks with your ball and paddle', 
    icon: Blocks, 
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', 
    category: 'arcade', 
    difficulty: 'medium',
    rating: 4.6,
    playtime: '15 min',
    features: ['Power-ups', 'Levels', 'Classic'],
    image: '/game-thumbnails/breakout.svg'
  },
  { 
    id: 'simon', 
    title: 'Simon Says', 
    description: 'Remember and repeat the color sequence patterns', 
    icon: Radio, 
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
    category: 'memory', 
    difficulty: 'medium',
    rating: 4.3,
    playtime: '12 min',
    features: ['Pattern Memory', 'Progressive', 'Sound'],
    image: '/game-thumbnails/simon.svg'
  },
  { 
    id: 'minesweeper', 
    title: 'Minesweeper', 
    description: 'Clear the grid without triggering any hidden mines', 
    icon: Bomb, 
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
    category: 'puzzle', 
    difficulty: 'hard',
    rating: 4.8,
    playtime: '20 min',
    features: ['Logic', 'Strategy', 'Classic'],
    image: '/game-thumbnails/minesweeper.svg'
  },
  { 
    id: 'tetris', 
    title: 'Tetris', 
    description: 'Stack falling blocks perfectly to clear lines', 
    icon: Grid2x2, 
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', 
    category: 'puzzle', 
    difficulty: 'easy',
    rating: 4.9,
    playtime: '30 min',
    features: ['Classic', 'Endless', 'High Score'],
    image: '/game-thumbnails/tetris.svg'
  },
  { 
    id: '2048', 
    title: '2048', 
    description: 'Merge tiles to reach the coveted 2048 tile', 
    icon: Grid2x2, 
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', 
    category: 'puzzle', 
    difficulty: 'medium',
    rating: 4.4,
    playtime: '15 min',
    features: ['Math', 'Strategy', 'Addictive'],
    image: '/game-thumbnails/2048.svg'
  },
  { 
    id: 'pong', 
    title: 'Pong', 
    description: 'Classic paddle ball game that started it all', 
    icon: Gamepad, 
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', 
    category: 'arcade', 
    difficulty: 'easy',
    rating: 4.1,
    playtime: '10 min',
    features: ['2 Players', 'Retro', 'Fast-Paced'],
    image: '/game-thumbnails/pong.svg'
  },
];

export function GamesPage({ onSelectGame, onNavigate }: GamesPageProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const categories = [
    { id: 'all', name: 'All Games', count: allGames.length },
    { id: 'arcade', name: 'Arcade', count: allGames.filter(g => g.category === 'arcade').length },
    { id: 'puzzle', name: 'Puzzle', count: allGames.filter(g => g.category === 'puzzle').length },
    { id: 'strategy', name: 'Strategy', count: allGames.filter(g => g.category === 'strategy').length },
    { id: 'memory', name: 'Memory', count: allGames.filter(g => g.category === 'memory').length },
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'az', name: 'A to Z' },
    { id: 'za', name: 'Z to A' },
  ];

  const filteredGames = allGames
    .filter(game => 
      searchQuery ? game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    game.description.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )
    .filter(game => 
      selectedCategory !== 'all' ? game.category === selectedCategory : true
    )
    .filter(game => 
      selectedDifficulty !== 'all' ? game.difficulty === selectedDifficulty : true
    )
    .sort((a, b) => {
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const getDifficultyDots = (difficulty: 'easy' | 'medium' | 'hard') => {
    const filled = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    return (
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <Circle
            key={i}
            size={6}
            className={i < filled ? 'fill-[#06b6d4] text-[#06b6d4]' : 'fill-gray-600 text-gray-600'}
          />
        ))}
      </div>
    );
  };

  const hasFilters = searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  const totalGames = allGames.length;
  const totalCategories = categories.filter(c => c.id !== 'all').length;

  return (
    <div className="min-h-screen bg-[#071029]">
      {/* Hero Banner */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 hero-gradient-animated opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071029]/60 via-[#071029]/40 to-[#071029]" />

        {/* Floating Game Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[Grid3x3, Gamepad, Brain, Bomb, Radio, Footprints].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute text-white/5"
              style={{ 
                left: `${(i * 18) % 100}%`, 
                top: `${(i * 25) % 100}%` 
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, 15, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 25 + i * 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.7,
              }}
            >
              <Icon size={70} />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#06b6d4]/20 to-[#8b5cf6]/20 border border-[#06b6d4]/30 mb-8 backdrop-blur-sm"
            >
              <Gamepad size={18} className="text-[#06b6d4]" />
              <span className="text-sm text-[#06b6d4] font-medium tracking-wide">GAME LIBRARY</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-7xl lg:text-8xl gaming-title mb-6 font-black tracking-tight"
            >
              Level Up Your Fun
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-[#9fb3c8] max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Discover {totalGames} epic browser games across {totalCategories} thrilling categories. No downloads. Pure gaming.
            </motion.p>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-8"
            >
              <div className="flex items-center gap-2 text-white/70">
                <Trophy className="w-5 h-5 text-[#06b6d4]" />
                <span className="text-sm font-medium">100% Free</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Zap className="w-5 h-5 text-[#8b5cf6]" />
                <span className="text-sm font-medium">Instant Play</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Star className="w-5 h-5 text-[#ec4899]" />
                <span className="text-sm font-medium">No Downloads</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={ref} className="max-w-7xl mx-auto px-6 py-16 -mt-8">
        {/* Advanced Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-[#081522]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8 relative z-50"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#06b6d4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game name or description..."
              className="w-full h-14 pl-14 pr-12 rounded-xl bg-[#071029] border-2 border-white/10 text-white placeholder:text-white/40 focus:border-[#06b6d4] focus:shadow-[0_0_0_4px_rgba(6,182,212,0.1)] outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-white/60">
              <SlidersHorizontal size={18} />
              <span className="text-sm">Filters:</span>
            </div>

            {/* Category */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowDifficultyDropdown(false);
                  setShowSortDropdown(false);
                }}
                className="h-11 px-5 rounded-lg bg-[#071029] border border-white/20 text-white hover:border-[#06b6d4] transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <Filter size={16} />
                <span>{categories.find(c => c.id === selectedCategory)?.name || 'Category'}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-56 bg-[#0f1c33] border-2 border-[#06b6d4] rounded-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50"
                >
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full h-10 px-4 rounded-lg text-left text-sm hover:bg-[#06b6d4]/10 transition-colors duration-200 flex items-center justify-between ${
                        selectedCategory === cat.id ? 'bg-[#06b6d4] text-[#071029]' : 'text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs opacity-70">{cat.count}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Difficulty */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDifficultyDropdown(!showDifficultyDropdown);
                  setShowCategoryDropdown(false);
                  setShowSortDropdown(false);
                }}
                className="h-11 px-5 rounded-lg bg-[#071029] border border-white/20 text-white hover:border-[#06b6d4] transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <span className="capitalize">{selectedDifficulty === 'all' ? 'Difficulty' : selectedDifficulty}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${showDifficultyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDifficultyDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-48 bg-[#0f1c33] border-2 border-[#06b6d4] rounded-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50"
                >
                  {difficulties.map(diff => (
                    <button
                      key={diff.id}
                      onClick={() => {
                        setSelectedDifficulty(diff.id);
                        setShowDifficultyDropdown(false);
                      }}
                      className={`w-full h-10 px-4 rounded-lg text-left text-sm hover:bg-[#06b6d4]/10 transition-colors duration-200 ${
                        selectedDifficulty === diff.id ? 'bg-[#06b6d4] text-[#071029]' : 'text-white'
                      }`}
                    >
                      {diff.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowCategoryDropdown(false);
                  setShowDifficultyDropdown(false);
                }}
                className="h-11 px-5 rounded-lg bg-[#071029] border border-white/20 text-white hover:border-[#06b6d4] transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <span>Sort: {sortOptions.find(s => s.id === sortBy)?.name}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-52 bg-[#0f1c33] border-2 border-[#06b6d4] rounded-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50"
                >
                  {sortOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full h-10 px-4 rounded-lg text-left text-sm hover:bg-[#06b6d4]/10 transition-colors duration-200 ${
                        sortBy === option.id ? 'bg-[#06b6d4] text-[#071029]' : 'text-white'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Clear Filters */}
            {hasFilters && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="ml-auto text-[#06b6d4] hover:text-[#0891b2] transition-colors text-sm flex items-center gap-1"
              >
                <X size={16} />
                Clear filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-white/60">
            <span>
              Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </span>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                className="group relative bg-[#081522] rounded-2xl overflow-hidden border border-white/10 hover:border-[#06b6d4] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(6,182,212,0.2)] transition-all duration-300"
              >
                {/* Game Preview */}
                <div className="relative h-48 bg-gradient-to-br from-[#06b6d4]/20 to-[#8b5cf6]/20 overflow-hidden">
                  {game.image ? (
                    <>
                      <img 
                        src={game.image} 
                        alt={game.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081522] via-[#081522]/40 to-transparent" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081522] via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon size={80} className="text-white/10" />
                      </div>
                    </>
                  )}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#081522]/80 backdrop-blur-sm text-xs text-[#06b6d4] border border-[#06b6d4]/30">
                      {game.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-[#081522]/80 backdrop-blur-sm">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white">{game.rating}</span>
                  </div>

                  {/* Quick Play Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => onSelectGame(game.id)}
                      className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-7 h-7 text-[#06b6d4] ml-1" fill="#06b6d4" />
                    </motion.button>
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-6">
                  <h3 className="text-xl text-white mb-2 group-hover:text-[#06b6d4] transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-white/60 mb-4 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.features?.slice(0, 3).map((feature, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/5 text-xs text-white/70">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        {getDifficultyDots(game.difficulty)}
                        <span className="capitalize">{game.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{game.playtime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => onSelectGame(game.id)}
                    className="w-full h-11 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <Play size={16} />
                    Play Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search size={48} className="text-white/20" />
            </div>
            <h3 className="text-2xl text-white mb-2">No games found</h3>
            <p className="text-white/60 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:shadow-lg transition-all duration-200"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
