import { motion, useInView } from 'motion/react';
import { useState, useRef } from 'react';
import { Search, ChevronDown, Play, Circle, X } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: any;
  gradient: string;
  image?: string;
}

interface BrowseGamesProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
}

export function BrowseGames({ games, onSelectGame }: BrowseGamesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Add difficulty data to games
  const gamesWithMeta = games.map(game => ({
    ...game,
    difficulty: (['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]) as 'easy' | 'medium' | 'hard',
  }));

  const categories = [
    { id: 'all', name: 'All Games', count: games.length },
    { id: 'arcade', name: 'Arcade', count: games.filter(g => g.category === 'arcade').length },
    { id: 'puzzle', name: 'Puzzle', count: games.filter(g => g.category === 'puzzle').length },
    { id: 'strategy', name: 'Strategy', count: games.filter(g => g.category === 'strategy').length },
    { id: 'memory', name: 'Memory', count: games.filter(g => g.category === 'memory').length },
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', count: games.length },
    { id: 'easy', name: 'Easy', count: Math.floor(games.length / 3) },
    { id: 'medium', name: 'Medium', count: Math.floor(games.length / 3) },
    { id: 'hard', name: 'Hard', count: Math.floor(games.length / 3) },
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
    { id: 'az', name: 'A to Z' },
    { id: 'za', name: 'Z to A' },
  ];

  const filteredGames = gamesWithMeta
    .filter(game => 
      searchQuery ? game.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
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

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6 pt-[160px]">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-5xl text-white mb-2">All Games</h2>
        <p className="text-lg text-white/70">Explore our complete collection</p>
      </motion.div>

      {/* Filter & Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 mb-12"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#06b6d4]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full h-14 pl-14 pr-12 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/50 focus:border-[#06b6d4] focus:bg-white/8 focus:shadow-[0_0_0_4px_rgba(6,182,212,0.2)] outline-none transition-all duration-200"
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

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowDifficultyDropdown(false);
                setShowSortDropdown(false);
              }}
              className="h-14 px-6 rounded-xl bg-white/5 border-2 border-white/10 text-white hover:bg-white/8 hover:border-[#06b6d4] transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-between"
            >
              <span>Category: {categories.find(c => c.id === selectedCategory)?.name.split(' ')[0] || 'All'}</span>
              <ChevronDown size={20} className={`transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-[200px] bg-[#0f1c33] border-2 border-[#06b6d4] rounded-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50"
              >
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full h-11 px-4 rounded-lg text-left hover:bg-[#06b6d4]/10 transition-colors duration-200 flex items-center justify-between ${
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
              className="h-14 px-6 rounded-xl bg-white/5 border-2 border-white/10 text-white hover:bg-white/8 hover:border-[#06b6d4] transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-between"
            >
              <span>Difficulty: {difficulties.find(d => d.id === selectedDifficulty)?.name.split(' ')[0] || 'All'}</span>
              <ChevronDown size={20} className={`transition-transform duration-200 ${showDifficultyDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDifficultyDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-[200px] bg-[#0f1c33] border-2 border-[#06b6d4] rounded-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50"
              >
                {difficulties.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => {
                      setSelectedDifficulty(diff.id);
                      setShowDifficultyDropdown(false);
                    }}
                    className={`w-full h-11 px-4 rounded-lg text-left hover:bg-[#06b6d4]/10 transition-colors duration-200 flex items-center justify-between ${
                      selectedDifficulty === diff.id ? 'bg-[#06b6d4] text-[#071029]' : 'text-white'
                    }`}
                  >
                    <span>{diff.name}</span>
                    <span className="text-xs opacity-70">{diff.count}</span>
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
              className="h-14 px-6 rounded-xl bg-white/5 border-2 border-white/10 text-white hover:bg-white/8 hover:border-[#06b6d4] transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-between"
            >
              <span>Sort: {sortOptions.find(s => s.id === sortBy)?.name.split(' ')[0] || 'Popular'}</span>
              <ChevronDown size={20} className={`transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 w-[200px] bg-[#0f1c33] border-2 border-[#06b6d4] rounded-xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50"
              >
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full h-11 px-4 rounded-lg text-left hover:bg-[#06b6d4]/10 transition-colors duration-200 ${
                      sortBy === option.id ? 'bg-[#06b6d4] text-[#071029]' : 'text-white'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Active Filters */}
      {hasFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-white/70">
            Showing {filteredGames.length} {selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.name.toLowerCase() : 'games'}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="text-[#06b6d4] hover:underline text-sm"
          >
            Clear all
          </button>
        </motion.div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredGames.map((game, index) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
              className="group relative bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#06b6d4] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.2)] transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-[180px] bg-gradient-to-br from-[#06b6d4]/20 to-[#8b5cf6]/20 overflow-hidden">
                {game.image ? (
                  <>
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={80} className="text-white/10" />
                    </div>
                  </>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded bg-black/60 text-[10px] uppercase text-[#06b6d4] backdrop-blur-sm">
                    {game.category}
                  </span>
                </div>
                {/* Quick Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <motion.button
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    onClick={() => onSelectGame(game.id)}
                    className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg"
                  >
                    <Play className="w-6 h-6 text-[#06b6d4]" fill="#06b6d4" />
                  </motion.button>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h3 className="text-xl text-white line-clamp-1">{game.title}</h3>
                <p className="text-[13px] text-white/60 line-clamp-2 leading-snug">{game.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-white/50">
                  <div className="flex items-center gap-1.5">
                    {getDifficultyDots(game.difficulty)}
                    <span className="capitalize">{game.difficulty}</span>
                  </div>
                </div>

                {/* Play Button */}
                <button
                  onClick={() => onSelectGame(game.id)}
                  className="w-full h-10 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 group/btn"
                >
                  Play
                  <Play className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-200" />
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
          <p className="text-white/60 mb-6">Try adjusting your filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:shadow-lg transition-all duration-200"
          >
            Clear Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
