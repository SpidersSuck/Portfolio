/* Add to the top of the file or inside a <style jsx> block if using CSS-in-JS */
import './profile-animated-border.css';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Trophy, Play, Settings } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  onSelectGame: (gameId: string) => void;
}

export function ProfilePage({ onBack, onSelectGame }: ProfilePageProps) {
    const [activeAchievement, setActiveAchievement] = useState<number | null>(null);
  const recentGames = [
    { id: 'snake', name: 'Snake', lastPlayed: '2 hours ago', image: '/game-thumbnails/snake.svg' },
    { id: 'pacman', name: 'Pac-Man', lastPlayed: '3 hours ago', image: '/game-thumbnails/pacman.svg' },
    { id: 'tetris', name: 'Tetris', lastPlayed: '5 hours ago', image: '/game-thumbnails/tetris.svg' },
    { id: 'memory', name: 'Memory Match', lastPlayed: '1 day ago', image: '/game-thumbnails/memory.svg' },
    { id: '2048', name: '2048', lastPlayed: '2 days ago', image: '/game-thumbnails/2048.svg' },
    { id: 'breakout', name: 'Breakout', lastPlayed: '3 days ago', image: '/game-thumbnails/breakout.svg' },
  ];

  const achievements = [
    { name: 'First Win', unlocked: true, icon: '🏆', description: 'Win your first game.' },
    { name: 'Perfect Game', unlocked: true, icon: '⭐', description: 'Win a game without making any mistakes.' },
    { name: 'Speed Demon', unlocked: false, icon: '⚡', description: 'Win a game in under 2 minutes.' },
    { name: 'Marathon Runner', unlocked: false, icon: '🏃', description: 'Play for more than 1 hour in a single session.' },
    { name: 'Master Player', unlocked: true, icon: '👑', description: 'Achieve the highest score in any game.' },
    { name: 'Combo King', unlocked: false, icon: '🔥', description: 'Perform a combo of 5 or more actions.' },
  ];

  const highScores = [
  { game: 'Pac-Man', score: 18750, date: '2025-10-11', rank: '🥇' },
  { game: 'Tetris', score: 12500, date: '2025-10-09', rank: '🥈' },
  { game: 'Breakout', score: 8900, date: '2025-10-08', rank: '🥉' },
  { game: 'Snake', score: 450, date: '2025-10-10', rank: '' },
  { game: '2048', score: 2048, date: '2025-10-07', rank: '' },
  { game: 'Memory Match', score: 45, date: '2025-10-06', rank: '' },
  ];

  const [settings, setSettings] = useState([
    { label: 'High Contrast Mode', enabled: false },
    { label: 'Sound Effects', enabled: true },
    { label: 'Background Music', enabled: false },
  ]);

  const toggleSetting = (idx: number) => {
    setSettings(prev => prev.map((s, i) => i === idx ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="min-h-screen bg-[#071029]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-[#9fb3c8] hover:text-[#06b6d4] transition-colors duration-250"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Header Section */}
        <div className="bg-[#081522] rounded-xl border border-white/10 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-[#e6eef6] mb-2">Welcome back!</h1>
              <p className="text-[#9fb3c8]">Track your gaming progress and achievements</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-[#06b6d4] text-2xl">8/9</div>
                <div className="text-[#9fb3c8] text-sm">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-[#f59e0b] text-2xl font-bold">
                  {highScores.length > 0 ? highScores[0].score.toLocaleString() : 0}
                </div>
                <div className="text-[#9fb3c8] text-sm">High Score</div>
                <div className="text-xs text-[#64748b] mt-1">{highScores.length > 0 ? highScores[0].game : ''}</div>
              </div>
              <div className="text-center">
                <div className="text-[#10b981] text-2xl">2h 45m</div>
                <div className="text-[#9fb3c8] text-sm">Time Played</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Resume Last Game', icon: Play, onClick: () => onSelectGame('snake') },
            { label: 'View Achievements', icon: Trophy, onClick: () => {} },
            { label: 'Settings', icon: Settings, onClick: () => {} },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="bg-[#081522] rounded-xl border border-white/10 p-4 hover:border-white/30 transition-all duration-200 flex items-center gap-3 text-[#e6eef6]"
            >
              <action.icon className="w-5 h-5 text-[#06b6d4]" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Recent Games Section */}
        <div className="mb-8">
          <h2 className="text-[#e6eef6] mb-4">Recently Played</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {recentGames.map((game) => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.04 }}
                onClick={() => onSelectGame(game.id)}
                className="group rounded-lg border border-white/10 p-2 transition-all duration-300 flex flex-col items-center justify-end min-h-[110px] sm:min-h-[140px] md:min-h-[170px] overflow-hidden relative"
                style={{ minWidth: 0, background: 'none', position: 'relative' }}
              >
                {/* Game Image */}
                <div className="absolute inset-0 w-full h-full z-0">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                {/* Animated Border Gradient - now above image */}
                <div className="absolute inset-0 rounded-lg pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-lg profile-animated-border" />
                  <div className="absolute inset-[4px] rounded-lg bg-transparent" />
                </div>
                {/* Overlay for text readability */}
                <div className="w-full px-2 py-1 rounded-md z-10 relative" style={{ background: 'rgba(8, 21, 34, 0.85)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', marginBottom: '4px' }}>
                  <h3 className="text-[#e6eef6] text-base font-semibold mb-1 text-center truncate w-full" style={{ textShadow: '0 2px 8px #000, 0 0 2px #10b981' }}>{game.name}</h3>
                  <p className="text-[#9fb3c8] text-sm font-medium text-center truncate w-full" style={{ textShadow: '0 1px 6px #000' }}>{game.lastPlayed}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Achievements & High Scores Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Achievements */}
          <div>
            <h2 className="text-[#e6eef6] mb-4">Achievements</h2>
            <div className="bg-[#081522] rounded-xl border border-white/10 p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((achievement, i) => (
                  <div
                    key={i}
                    className={`text-center p-4 rounded-lg relative group ${
                      achievement.unlocked ? 'bg-[#071029]' : 'bg-[#071029]/50 opacity-50'
                    }`}
                    tabIndex={0}
                    onMouseEnter={() => setActiveAchievement(i)}
                    onMouseLeave={() => setActiveAchievement(null)}
                    onFocus={() => setActiveAchievement(i)}
                    onBlur={() => setActiveAchievement(null)}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="text-[#e6eef6] text-sm">{achievement.name}</div>
                  </div>
                ))}
              </div>
              {/* Achievement Descriptions Box */}
              {/* Achievement Description Hover Box */}
              <div className="mt-6 min-h-[48px] flex items-center justify-center">
                {activeAchievement !== null && (
                  <div className="bg-gradient-to-br from-[#081522] via-[#071029] to-[#10b981]/10 border-2 border-[#10b981]/60 shadow-lg text-[#e6eef6] text-base px-4 py-2 rounded-xl font-medium" style={{ minWidth: '220px', textAlign: 'center' }}>
                    <span className="text-xl mr-2">{achievements[activeAchievement].icon}</span>
                    <span className="font-semibold">{achievements[activeAchievement].name}:</span>
                    <span className="text-[#9fb3c8] ml-2">{achievements[activeAchievement].description}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* High Scores */}
          <div>
            <h2 className="text-[#e6eef6] mb-4">Highest Score and Game Name</h2>
            <div className="bg-[#081522] rounded-xl border border-white/10 p-6">
              <div className="space-y-3">
                {highScores.map((score, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      i === 0 ? 'bg-gradient-to-r from-[#fbbf24]/20 to-[#f59e0b]/10' : 'bg-[#071029]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {score.rank && <span className="text-2xl">{score.rank}</span>}
                      <div>
                        <div className="text-[#e6eef6] font-bold">{score.score.toLocaleString()}</div>
                        <div className="text-[#9fb3c8] text-sm">{score.game}</div>
                        <div className="text-[#64748b] text-xs">{score.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Preferences removed as requested */}
      </div>
    </div>
  );
}