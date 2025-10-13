import { motion } from 'motion/react';
import { ArrowLeft, Target, BookOpen, Code, Accessibility } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function AboutPage({ onBack, onNavigate }: AboutPageProps) {
  const phases = [
    {
      icon: '🎮',
      title: 'Foundation',
      subtitle: 'Assignment 3',
      description: 'Built initial 6-game portal with manual agent coordination. Learned the challenges of context handoffs and integration conflicts.',
      timeline: 'Weeks 1-7',
      metric: '45 min coordination overhead per session',
    },
    {
      icon: '🤖',
      title: 'MCP Integration',
      subtitle: 'Assignment 4',
      description: 'Implemented Model Context Protocol for automated coordination. Eliminated manual handoffs and achieved zero context loss.',
      timeline: 'Week 8',
      metric: '44% development time reduction',
    },
    {
      icon: '🚀',
      title: 'Expansion & Polish',
      subtitle: 'Project Phase',
      description: 'Expanded to 9+ games, modern UI redesign, comprehensive testing, and portfolio preparation.',
      timeline: 'Weeks 9-14',
      metric: '9+ games • 0 accessibility violations',
    },
  ];

  const technologies = [
    { name: 'React', icon: '⚛️' },
    { name: 'TypeScript', icon: '📘' },
    { name: 'Tailwind', icon: '🎨' },
    { name: 'Motion', icon: '✨' },
    { name: 'Canvas API', icon: '🖼️' },
    { name: 'localStorage', icon: '💾' },
    { name: 'MCP', icon: '🔗' },
    { name: 'Figma', icon: '🎯' },
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

        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#e6eef6] mb-4"
          >
            About Mini Web Game Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#9fb3c8]"
          >
            An educational project exploring multi-agent AI development
          </motion.p>
        </div>

        {/* Project Story Section */}
        <div className="mb-16">
          <h2 className="text-[#e6eef6] mb-8">The Project Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#081522] rounded-xl border border-white/10 p-6"
              >
                <div className="text-5xl mb-4 text-center">{phase.icon}</div>
                <h3 className="text-[#e6eef6] text-center mb-2">{phase.title}</h3>
                <p className="text-[#06b6d4] text-sm text-center mb-4">{phase.subtitle}</p>
                <p className="text-[#9fb3c8] text-sm mb-4">{phase.description}</p>
                <div className="text-[#9fb3c8] text-sm mb-2">
                  <strong>Timeline:</strong> {phase.timeline}
                </div>
                <div className="text-[#10b981] text-sm">
                  <strong>Key Metric:</strong> {phase.metric}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission & Goals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#081522] rounded-xl border border-white/10 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-[#06b6d4]" />
              <h2 className="text-[#e6eef6]">Our Mission</h2>
            </div>
            <p className="text-[#9fb3c8]">
              Create accessible, keyboard-first browser games while demonstrating professional multi-agent AI coordination patterns applicable to real-world distributed teams.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#081522] rounded-xl border border-white/10 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-[#8b5cf6]" />
              <h2 className="text-[#e6eef6]">Educational Goals</h2>
            </div>
            <ul className="space-y-2">
              {[
                'Demonstrate MCP coordination in practice',
                'Showcase WCAG AA accessibility compliance',
                'Explore multi-agent development workflows',
                'Provide educational reference for AI-assisted coding',
              ].map((goal, i) => (
                <li key={i} className="flex items-start gap-2 text-[#9fb3c8]">
                  <span className="text-[#10b981] mt-1">🎯</span>
                  {goal}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Technology Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#081522] rounded-xl border border-white/10 p-8 mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-[#f59e0b]" />
            <h2 className="text-[#e6eef6]">Built With</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {technologies.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#071029] rounded-lg p-4 text-center hover:bg-[#071029]/80 transition-colors"
              >
                <div className="text-4xl mb-2">{tech.icon}</div>
                <div className="text-[#e6eef6] text-sm">{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Accessibility Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#10b981]/10 to-[#06b6d4]/10 rounded-xl border border-white/10 p-8 mb-16"
        >
          <div className="md:flex gap-8 items-start">
            <div className="mb-6 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center text-5xl">
                ♿
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Accessibility className="w-8 h-8 text-[#10b981]" />
                <h2 className="text-[#e6eef6]">Accessibility First</h2>
              </div>
              <p className="text-[#9fb3c8] mb-4">
                Every game is fully playable with keyboard controls alone. We follow WCAG 2.1 AA guidelines to ensure everyone can enjoy our games.
              </p>
              <ul className="space-y-2">
                {[
                  'Full keyboard navigation (arrows, enter, space)',
                  'Screen reader compatibility',
                  'High contrast mode support',
                  'Focus indicators on all interactive elements',
                  'No time-based challenges (or pause available)',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#9fb3c8]">
                    <span className="text-[#10b981] mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Course Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#081522] rounded-xl border border-white/10 p-8 mb-16"
        >
          <h2 className="text-[#e6eef6] mb-6">Academic Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#9fb3c8]">
            <div><strong className="text-[#e6eef6]">Course:</strong> CptS 483 - Coding with Agentic AI</div>
            <div><strong className="text-[#e6eef6]">Track:</strong> Web Development</div>
            <div><strong className="text-[#e6eef6]">Semester:</strong> Fall 2025</div>
            <div><strong className="text-[#e6eef6]">Focus:</strong> Multi-Agent Coordination</div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#06b6d4]/10 to-[#8b5cf6]/10 rounded-xl p-8 border border-white/10">
          <h3 className="text-[#e6eef6] mb-4">Ready to play?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('games')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
            >
              Browse All Games
            </button>
            <button className="px-6 py-3 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200">
              View Source Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
