import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onPlay: () => void;
  delay: number;
}

export function GameCard({ title, description, icon: Icon, gradient, onPlay, delay }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
           style={{ background: gradient }} />
      
      <div className="relative bg-[#081522] rounded-xl p-6 border border-white/10 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{ background: `linear-gradient(to bottom right, ${gradient})`, padding: '1px' }}>
          <div className="w-full h-full bg-[#081522] rounded-xl" />
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br"
               style={{ background: gradient }}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <h3 className="text-[#e6eef6] mb-2">{title}</h3>
          <p className="text-[#9fb3c8] mb-4 text-sm">{description}</p>

          {/* Play Button */}
          <button
            onClick={onPlay}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-[#06b6d4]/50"
          >
            Play
          </button>
        </div>
      </div>
    </motion.div>
  );
}
