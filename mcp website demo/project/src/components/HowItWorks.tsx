import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Grid3x3, MousePointer2, Gamepad2 } from 'lucide-react';

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const steps = [
    {
      number: '01',
      icon: Grid3x3,
      title: 'Browse & Choose',
      description: 'Explore 12+ games across multiple categories. Use filters to find your perfect match.',
      gradient: 'from-[#06b6d4] to-[#0891b2]',
    },
    {
      number: '02',
      icon: MousePointer2,
      title: 'Click to Play',
      description: 'No downloads or installations required. Games load instantly in your browser.',
      gradient: 'from-[#8b5cf6] to-[#7c3aed]',
    },
    {
      number: '03',
      icon: Gamepad2,
      title: 'Play & Track',
      description: 'Full keyboard controls, score tracking, and achievements. All progress saved automatically.',
      gradient: 'from-[#ec4899] to-[#db2777]',
    },
  ];

  return (
    <div ref={ref} className="relative bg-[#081522] pt-[160px] pb-[160px] overflow-hidden">
      {/* Angled Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-[#071029]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }} />

      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      {/* Background Orb */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-[#8b5cf6]/8 to-[#06b6d4]/8 blur-3xl"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="text-xs uppercase tracking-[2px] text-[#06b6d4] mb-3">Simple Process</div>
          <h2 className="text-5xl text-white mb-4">Start Playing in Seconds</h2>
          <p className="text-lg text-white/70">No downloads, no signup, just pure gaming fun</p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Lines (Desktop Only) */}
          <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-1">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-full bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] origin-left"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[#06b6d4] -translate-y-1/2 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Large Number Background */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 text-[96px] leading-none bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-[0.12] select-none pointer-events-none`}>
                {step.number}
              </div>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={isInView ? { scale: [0.8, 1.1, 1.0] } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                className="relative z-10 w-20 h-20 mx-auto mb-6 flex items-center justify-center"
              >
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.gradient} opacity-20 blur-xl`} />
                <step.icon size={40} className={`relative z-10 bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent`} style={{ filter: 'drop-shadow(0 8px 24px rgba(6,182,212,0.3))' }} />
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl text-white mb-4">{step.title}</h3>

              {/* Description */}
              <p className="text-white/70 leading-relaxed max-w-[280px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
