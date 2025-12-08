import { motion } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectGame: (gameId: string) => void;
  onNavigate: (page: string) => void;
}

export function Footer({ onSelectGame, onNavigate }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#6b21a8] via-[#db2777] via-[#f97316] to-[#06b6d4] overflow-hidden">
      {/* Animated Wavy Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white overflow-hidden">
        <motion.div
          animate={{
            x: ['-100%', '0%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="h-full w-[200%] bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </div>

      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
            </div>
            <div className="text-lg text-white/95 mb-2" style={{ letterSpacing: '0.5px' }}>
              Play. Learn. Create.
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              A collection of classic games rebuilt from scratch. This educational platform showcases AI-powered development coordination using the Model Context Protocol (MCP) for CptS 483.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-white mb-5 font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Games', action: () => onNavigate('games') },
                { label: 'About', action: () => onNavigate('about') },
                { label: 'AI Agents', action: () => onNavigate('agents') },
                { label: 'Back to Top', action: handleScrollToTop },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="group text-sm text-white/85 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block relative"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-200" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info Column */}
          <div>
            <h4 className="text-white mb-5 font-semibold">Project Info</h4>
            <div className="text-sm text-white/80 leading-relaxed space-y-2">
              <p>Built with React, TypeScript, and Vite</p>
              <p>Styled with Tailwind CSS</p>
              <p>Animations by Framer Motion</p>
              <p className="pt-2 text-white/70">Course Project for CptS 483</p>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-x-0 h-px bg-white/20" />
          <div className="relative bg-gradient-to-br from-[#6b21a8] via-[#db2777] to-[#06b6d4] p-2 rounded-full">
            <Sparkles size={24} className="text-white/40" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          {/* Left - Copyright */}
          <div className="text-center md:text-left">
            <div className="text-white/80 mb-1">© 2025 Mini Web Game Portal</div>
            <div className="text-white/60 text-xs">
              Built with MCP <span className="text-white/40 mx-2">•</span> Made for CptS 483
            </div>
          </div>

          {/* Right - Back to Top Button */}
          <button
            onClick={handleScrollToTop}
            className="group flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 hover:bg-white/30 hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUp size={20} className="text-white" />
              </motion.div>
            </div>
            <span className="text-[10px] uppercase text-white/70 tracking-wider">Top</span>
          </button>
        </div>
      </div>

      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #6b21a8, #db2777, #f97316, #06b6d4)',
          backgroundSize: '400% 400%',
        }}
      />
    </footer>
  );
}
