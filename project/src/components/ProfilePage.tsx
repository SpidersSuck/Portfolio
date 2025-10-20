import { motion } from 'motion/react';
import { ArrowLeft, User, Trophy, Clock, Play, Settings, Share2 } from 'lucide-react';

interface ProfilePageProps {
  onBack: () => void;
  onSelectGame: (gameId: string) => void;
}

export function ProfilePage({ onBack, onSelectGame }: ProfilePageProps) {
  const recentGames = [
    { id: 'snake', name: 'Snake', lastPlayed: '2 hours ago' },
    { id: 'tetris', name: 'Tetris', lastPlayed: '5 hours ago' },
    { id: 'memory', name: 'Memory Match', lastPlayed: '1 day ago' },
    { id: '2048', name: '2048', lastPlayed: '2 days ago' },
    { id: 'breakout', name: 'Breakout', lastPlayed: '3 days ago' },
  ];

  const achievements = [
    { name: 'First Win', unlocked: true, icon: '🏆' },
    { name: 'Perfect Game', unlocked: true, icon: '⭐' },
    { name: 'Speed Demon', unlocked: false, icon: '⚡' },
    { name: 'Marathon Runner', unlocked: false, icon: '🏃' },
    { name: 'Master Player', unlocked: true, icon: '👑' },
    { name: 'Combo King', unlocked: false, icon: '🔥' },
  ];

  const highScores = [
    { game: 'Snake', score: 450, date: '2025-10-10', rank: '🥇' },
    { game: 'Tetris', score: 12500, date: '2025-10-09', rank: '🥈' },
    { game: 'Breakout', score: 8900, date: '2025-10-08', rank: '🥉' },
    { game: '2048', score: 2048, date: '2025-10-07', rank: '' },
    { game: 'Memory Match', score: 45, date: '2025-10-06', rank: '' },
  ];

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
                <div className="text-[#f59e0b] text-2xl">3</div>
                <div className="text-[#9fb3c8] text-sm">High Scores</div>
              </div>
              <div className="text-center">
                <div className="text-[#10b981] text-2xl">2h 45m</div>
                <div className="text-[#9fb3c8] text-sm">Time Played</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Resume Last Game', icon: Play, onClick: () => onSelectGame('snake') },
            { label: 'View Achievements', icon: Trophy, onClick: () => {} },
            { label: 'Settings', icon: Settings, onClick: () => {} },
            { label: 'Share Profile', icon: Share2, onClick: () => {} },
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {recentGames.map((game) => (
              <motion.button
                key={game.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => onSelectGame(game.id)}
                className="bg-[#081522] rounded-xl border border-white/10 p-4 hover:border-white/30 transition-all duration-200"
              >
                <div className="aspect-square bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] rounded-lg mb-3 flex items-center justify-center text-3xl">
                  🎮
                </div>
                <h3 className="text-[#e6eef6] text-sm mb-1">{game.name}</h3>
                <p className="text-[#9fb3c8] text-xs">{game.lastPlayed}</p>
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
                    className={`text-center p-4 rounded-lg ${
                      achievement.unlocked ? 'bg-[#071029]' : 'bg-[#071029]/50 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="text-[#e6eef6] text-sm">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* High Scores */}
          <div>
            <h2 className="text-[#e6eef6] mb-4">Your High Scores</h2>
            <div className="bg-[#081522] rounded-xl border border-white/10 p-6">
              <div className="space-y-3">
                {highScores.map((score, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      i < 3 ? 'bg-gradient-to-r from-[#06b6d4]/10 to-[#8b5cf6]/10' : 'bg-[#071029]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {score.rank && <span className="text-2xl">{score.rank}</span>}
                      <div>
                        <div className="text-[#e6eef6]">{score.game}</div>
                        <div className="text-[#9fb3c8] text-sm">{score.date}</div>
                      </div>
                    </div>
                    <div className="text-[#06b6d4] text-xl">{score.score.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-[#081522] rounded-xl border border-white/10 p-8">
          <h2 className="text-[#e6eef6] mb-6">Settings & Preferences</h2>
          <div className="space-y-4 max-w-2xl">
            {[
              { label: 'High Contrast Mode', enabled: false },
              { label: 'Sound Effects', enabled: true },
              { label: 'Background Music', enabled: false },
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#071029] rounded-lg">
                <span className="text-[#e6eef6]">{setting.label}</span>
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? 'bg-[#06b6d4]' : 'bg-[#9fb3c8]'
                  } relative cursor-pointer`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      setting.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
