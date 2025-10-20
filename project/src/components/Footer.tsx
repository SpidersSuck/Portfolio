import { motion } from 'motion/react';
import { useState } from 'react';
import { Github, MessageCircle, Twitter, Youtube, Mail, ArrowRight, ArrowUp, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectGame: (gameId: string) => void;
  onNavigate: (page: string) => void;
}

export function Footer({ onSelectGame, onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
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

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
            </div>
            <div className="text-lg text-white/95 mb-2" style={{ letterSpacing: '0.5px' }}>
              Play. Learn. Create.
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              An educational gaming platform showcasing AI-powered development coordination.
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="text-white mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Games', action: () => onNavigate('games') },
                { label: 'Featured', action: () => onNavigate('games') },
                { label: 'Categories', action: () => onNavigate('games') },
                { label: 'New Releases', action: () => onNavigate('games') },
                { label: 'Random Game', action: () => onSelectGame('snake') },
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

          {/* About Column */}
          <div>
            <h4 className="text-white mb-5">About</h4>
            <ul className="space-y-3">
              {[
                { label: 'Our Story', action: () => onNavigate('about') },
                { label: 'AI Agents', action: () => onNavigate('agents') },
                { label: 'Technology', action: () => onNavigate('agents') },
                { label: 'Accessibility', action: () => onNavigate('about') },
                { label: 'Open Source', action: () => window.open('https://github.com', '_blank') },
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

          {/* Connect Column */}
          <div>
            <h4 className="text-white mb-5">Connect</h4>
            
            {/* Social Icons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: MessageCircle, label: 'Discord' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social) => (
                <button
                  key={social.label}
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="group w-12 h-12 rounded-lg bg-white/15 backdrop-blur-sm hover:bg-white/25 hover:scale-110 transition-all duration-200 flex items-center justify-center relative overflow-hidden"
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <social.icon size={24} className="text-white relative z-10" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 2, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ))}
            </div>

            {/* Links */}
            <ul className="space-y-3">
              {[
                { label: 'Contact Us', action: () => onNavigate('about') },
                { label: 'Report Bug', action: () => onNavigate('about') },
                { label: 'Suggest Feature', action: () => onNavigate('about') },
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
        </div>

        {/* Divider Line */}
        <div className="relative h-px mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        </div>

        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Left Side - Icon & Text */}
              <div className="flex items-center gap-4 md:flex-1">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-lg text-white mb-0.5">Stay Updated</h4>
                  <p className="text-xs text-white/70">Get notified about new games</p>
                </div>
              </div>

              {/* Right Side - Form */}
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 md:w-64 h-11 px-4 rounded-lg bg-white/20 border border-white/25 text-sm text-white placeholder:text-white/60 focus:border-white/60 focus:bg-white/30 outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  className="h-11 px-6 rounded-lg bg-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center gap-2 flex-shrink-0"
                >
                  <span className="text-sm bg-gradient-to-r from-[#6b21a8] to-[#06b6d4] bg-clip-text text-transparent">
                    Join
                  </span>
                  <ArrowRight size={14} className="text-[#06b6d4]" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative flex items-center justify-center mb-12">
          <div className="absolute inset-x-0 h-px bg-white/20" />
          <div className="relative bg-gradient-to-br from-[#6b21a8] via-[#db2777] to-[#06b6d4] p-2 rounded-full">
            <Sparkles size={28} className="text-white/40" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          {/* Left - Copyright */}
          <div className="text-center md:text-left">
            <div className="text-white/80 mb-1">© 2025 Mini Web Game Portal</div>
            <div className="text-white/60 text-xs">
              Built with MCP <span className="text-white/40 mx-2">•</span> Made for CptS 483
            </div>
          </div>

          {/* Center - Legal Links */}
          <div className="flex items-center gap-1 text-white/75">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors hover:underline">
              Privacy
            </button>
            <span className="text-white/40 mx-2">•</span>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors hover:underline">
              Terms
            </button>
            <span className="text-white/40 mx-2">•</span>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors hover:underline">
              Accessibility
            </button>
          </div>

          {/* Right - Back to Top */}
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
