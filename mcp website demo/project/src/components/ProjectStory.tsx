import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Clock, TrendingDown, ShieldCheck, Hammer, Network, Rocket, Book, Code } from 'lucide-react';

interface ProjectStoryProps {
  onNavigate: (page: string) => void;
}

export function ProjectStory({ onNavigate }: ProjectStoryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const phases = [
    {
      number: '1',
      badge: 'Weeks 1-7',
      title: 'Foundation & Manual Coordination',
      description: 'Built the initial 3-game portal using manual agent coordination. Discovered the challenges of context handoffs, information loss, and integration conflicts between specialized AI agents.',
      icon: Hammer,
      metricIcon: Clock,
      metricValue: '45 minutes',
      metricContext: 'Coordination overhead per agent session',
      color: '#06b6d4',
      gradient: 'from-[#06b6d4] to-[#0891b2]',
    },
    {
      number: '2',
      badge: 'Week 8',
      title: 'MCP Integration & Automation',
      description: 'Implemented Model Context Protocol to automate agent coordination. Achieved zero context loss, real-time error recovery, and eliminated manual handoffs entirely.',
      icon: Network,
      metricIcon: TrendingDown,
      metricValue: '44% reduction',
      metricContext: 'Development time saved through automation',
      color: '#8b5cf6',
      gradient: 'from-[#8b5cf6] to-[#7c3aed]',
    },
    {
      number: '3',
      badge: 'Weeks 9-14',
      title: 'Expansion & Polish',
      description: 'Expanded from 3 to 12+ games, redesigned UI for modern appeal, conducted comprehensive testing, and prepared portfolio-ready documentation.',
      icon: Rocket,
      metricIcon: ShieldCheck,
      metricValue: '0 violations',
      metricContext: 'Accessibility audit (WCAG AA compliance)',
      color: '#ec4899',
      gradient: 'from-[#ec4899] to-[#db2777]',
    },
  ];

  return (
    <div ref={ref} className="relative bg-gradient-to-b from-[#071029] via-[#0a1433] to-[#071029] pt-[160px] pb-[160px] overflow-hidden">
      {/* Wavy Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
        <svg viewBox="0 0 1200 100" className="absolute w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,0 L0,0 Z"
            fill="#081522"
          />
        </svg>
      </div>

      {/* Animated Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="text-xs uppercase tracking-[2px] text-[#06b6d4] mb-3">Our Journey</div>
          <h2 className="text-5xl text-white mb-4">From Concept to Reality</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            An educational exploration of AI-assisted development
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Spine */}
          <div className="absolute left-0 top-0 bottom-0 w-1 md:left-[70px]">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-b from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] origin-top"
            />
          </div>

          {/* Phase Cards */}
          <div className="space-y-10 relative">
            {phases.map((phase, index) => (
              <div key={phase.number} className="relative flex flex-col md:flex-row gap-6">
                {/* Phase Node */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={isInView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                  className="hidden md:flex w-20 h-20 rounded-full bg-[#071029] border-4 flex-shrink-0 items-center justify-center relative z-10"
                  style={{ borderColor: phase.color }}
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        `0 0 20px ${phase.color}40`,
                        `0 0 40px ${phase.color}60`,
                        `0 0 20px ${phase.color}40`,
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                  />
                  <span className="text-2xl text-white relative z-10">{phase.number}</span>
                </motion.div>

                {/* Phase Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.2 }}
                  className="flex-1 bg-white/[0.03] border border-white/[0.08] hover:border-white/20 rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 group"
                  style={{ borderLeftWidth: '4px', borderLeftColor: phase.color }}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${phase.gradient} text-xs uppercase text-white`}
                    >
                      {phase.badge}
                    </span>
                    <phase.icon size={64} className="text-white/10" />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl text-white mb-4">{phase.title}</h3>

                  {/* Description */}
                  <p className="text-white/70 leading-relaxed mb-6">
                    {phase.description}
                  </p>

                  {/* Key Metric Box */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.3 + 0.4 }}
                    className="bg-[#06b6d4]/10 border border-[#06b6d4] rounded-lg p-5 flex items-center gap-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${phase.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <phase.metricIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-lg text-[#06b6d4]">{phase.metricValue}</div>
                      <div className="text-sm text-white/70">{phase.metricContext}</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mt-16"
        >
          <button
            onClick={() => onNavigate('about')}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:shadow-[0_10px_40px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Book size={20} />
            Read Full Documentation
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 rounded-xl bg-transparent border-2 border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Code size={20} />
            View Source Code
          </a>
        </motion.div>
      </div>
    </div>
  );
}
