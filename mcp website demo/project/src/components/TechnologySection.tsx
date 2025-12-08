import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Bot, RefreshCw, Zap, ArrowRight } from 'lucide-react';

interface TechnologySectionProps {
  onNavigate: (page: string) => void;
}

export function TechnologySection({ onNavigate }: TechnologySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    {
      icon: Bot,
      value: '3',
      label: 'Specialized AI Agents',
      color: '#06b6d4',
      gradient: 'from-[#06b6d4] to-[#0891b2]',
    },
    {
      icon: RefreshCw,
      value: '100%',
      label: 'Context Retention',
      color: '#8b5cf6',
      gradient: 'from-[#8b5cf6] to-[#7c3aed]',
    },
    {
      icon: Zap,
      value: '44%',
      label: 'Development Time Saved',
      color: '#ec4899',
      gradient: 'from-[#ec4899] to-[#db2777]',
    },
  ];

  return (
    <div ref={ref} className="bg-[#071029] pt-[160px] pb-[160px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Agent Network Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent rounded-full blur-3xl" />

              {/* Rotating Diagram */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="line2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="line3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  
                  <line x1="200" y1="80" x2="140" y2="280" stroke="url(#line1)" strokeWidth="2" />
                  <line x1="200" y1="80" x2="260" y2="280" stroke="url(#line2)" strokeWidth="2" />
                  <line x1="140" y1="280" x2="260" y2="280" stroke="url(#line3)" strokeWidth="2" />

                  {/* Animated Particles */}
                  <motion.circle
                    cx="200"
                    cy="80"
                    r="4"
                    fill="#06b6d4"
                    initial={{ opacity: 0 }}
                    animate={{
                      cx: [200, 140],
                      cy: [80, 280],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <motion.circle
                    cx="200"
                    cy="80"
                    r="4"
                    fill="#8b5cf6"
                    initial={{ opacity: 0 }}
                    animate={{
                      cx: [200, 260],
                      cy: [80, 280],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 1,
                    }}
                  />
                  <motion.circle
                    cx="140"
                    cy="280"
                    r="4"
                    fill="#ec4899"
                    initial={{ opacity: 0 }}
                    animate={{
                      cx: [140, 260],
                      cy: [280, 280],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 2,
                    }}
                  />
                </svg>

                {/* Agent Nodes */}
                {/* Top Node - ChatGPT */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-[10%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-[#06b6d4]/10 to-[#06b6d4]/5 backdrop-blur-xl border-2 border-[#06b6d4]/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]"
                  style={{ transform: 'translate(-50%, 0)' }}
                >
                  <div className="text-4xl mb-2">🤖</div>
                  <div className="text-white text-sm">ChatGPT</div>
                  <div className="text-[#06b6d4] text-xs mt-1">Planning</div>
                </motion.div>

                {/* Bottom Left - DeepSeek */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  className="absolute bottom-[10%] left-[15%] w-40 h-40 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#8b5cf6]/5 backdrop-blur-xl border-2 border-[#8b5cf6]/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                >
                  <div className="text-4xl mb-2">🔮</div>
                  <div className="text-white text-sm">DeepSeek</div>
                  <div className="text-[#8b5cf6] text-xs mt-1">Frontend</div>
                </motion.div>

                {/* Bottom Right - Gemini */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                  }}
                  className="absolute bottom-[10%] right-[15%] w-40 h-40 rounded-full bg-gradient-to-br from-[#ec4899]/10 to-[#ec4899]/5 backdrop-blur-xl border-2 border-[#ec4899]/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.3)]"
                >
                  <div className="text-4xl mb-2">✨</div>
                  <div className="text-white text-sm">Gemini</div>
                  <div className="text-[#ec4899] text-xs mt-1">Game Logic</div>
                </motion.div>

                {/* Center Hub - MCP */}
                <motion.div
                  animate={{
                    rotate: -360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.6)]"
                  style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}
                >
                  <div className="absolute inset-[2px] rounded-full bg-[#071029] flex flex-col items-center justify-center">
                    <div className="text-white text-xl">MCP</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider">Coordinator</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="text-xs uppercase tracking-[2px] text-[#06b6d4] mb-3">Powered by AI</div>
            <h2 className="text-4xl text-white mb-6 leading-tight">Multi-Agent Coordination</h2>
            
            <p className="text-white/80 leading-relaxed mb-5">
              This portal showcases advanced AI coordination using Model Context Protocol (MCP). Three specialized agents collaborate seamlessly to build, refine, and maintain the platform.
            </p>

            <p className="text-white/80 leading-relaxed mb-8">
              MCP eliminates context loss, enables real-time error recovery, and ensures 100% specification compliance across all agent transitions.
            </p>

            {/* Stats Grid */}
            <div className="space-y-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="group bg-white/[0.03] border border-white/[0.08] hover:border-white/20 rounded-xl p-5 flex items-center gap-4 transition-all duration-300"
                  style={{ borderLeftWidth: '3px', borderLeftColor: stat.color }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[32px] text-white leading-none mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
              onClick={() => onNavigate('agents')}
              className="group px-8 py-4 rounded-xl bg-transparent border-2 border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all duration-300 flex items-center gap-2"
            >
              Learn About Our Agents
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
