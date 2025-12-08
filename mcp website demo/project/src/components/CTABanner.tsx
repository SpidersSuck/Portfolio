import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Gamepad2, Grid3x3, Heart, Cloud, ArrowRight } from 'lucide-react';

interface CTABannerProps {
  onNavigate: (page: string) => void;
}

export function CTABanner({ onNavigate }: CTABannerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const stats = [
    { icon: Grid3x3, number: '12+', label: 'Games' },
    { icon: Heart, number: '100%', label: 'Free' },
    { icon: Cloud, number: '0', label: 'Downloads' },
  ];

  const shapes = [
    { type: 'circle', size: 120, x: '10%', y: '20%', delay: 0 },
    { type: 'circle', size: 80, x: '85%', y: '15%', delay: 0.5 },
    { type: 'triangle', size: 100, x: '15%', y: '70%', delay: 1 },
    { type: 'circle', size: 60, x: '88%', y: '75%', delay: 1.5 },
  ];

  return (
    <div ref={ref} className="relative bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] pt-[120px] pb-[120px] overflow-hidden">
      {/* Animated Grain Texture */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      {/* Floating Geometric Shapes */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        >
          {shape.type === 'circle' ? (
            <div
              className="rounded-full bg-white/10"
              style={{ width: shape.size, height: shape.size }}
            />
          ) : (
            <div
              className="bg-white/10"
              style={{
                width: shape.size,
                height: shape.size,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Confetti Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 50 - 25],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-8"
          >
            <Gamepad2 size={80} className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl text-white mb-4"
          style={{
            textShadow: '0 4px 24px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em',
          }}
        >
          Ready to Start Playing?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-white/95 mb-12"
        >
          Join the fun with keyboard-first browser games
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          onClick={() => onNavigate('games')}
          className="group relative inline-flex items-center justify-center gap-3 h-16 px-16 rounded-xl bg-white text-lg font-bold shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-300 overflow-hidden"
        >
          {/* Animated Glow */}
          <motion.div
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] opacity-0 group-hover:opacity-10"
          />
          
          <span className="relative z-10 bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
            Browse All Games
          </span>
          <ArrowRight className="relative z-10 w-5 h-5 text-[#06b6d4] group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-16 mt-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <stat.icon size={40} className="text-white" />
              <div className="text-4xl text-white">{stat.number}</div>
              <div className="text-sm text-white/90">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Glow Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
