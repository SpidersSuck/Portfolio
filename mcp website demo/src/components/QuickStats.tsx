import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Gamepad2, Zap, Trophy, Users } from 'lucide-react';

export function QuickStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const stats = [
    {
      icon: Gamepad2,
      value: '9+',
      label: 'Browser Games',
      gradient: 'from-[#06b6d4] to-[#0891b2]',
    },
    {
      icon: Zap,
      value: '<3s',
      label: 'Load Time',
      gradient: 'from-[#8b5cf6] to-[#7c3aed]',
    },
    {
      icon: Trophy,
      value: '100%',
      label: 'Free Forever',
      gradient: 'from-[#ec4899] to-[#db2777]',
    },
    {
      icon: Users,
      value: 'Unlimited',
      label: 'No downloads!',
      gradient: 'from-[#10b981] to-[#059669]',
    },
  ];

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-[#081522]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#06b6d4]/50 transition-all duration-300 text-center"
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Icon */}
            <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3`}>
              <stat.icon size={28} className="text-white" />
            </div>

            {/* Value */}
            <div className="relative text-3xl text-white mb-1">
              {stat.value}
            </div>

            {/* Label */}
            <div className="relative text-sm text-white/60">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
