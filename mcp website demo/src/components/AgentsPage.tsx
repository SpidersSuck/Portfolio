import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Zap, Network } from 'lucide-react';

interface AgentsPageProps {
  onBack: () => void;
}

export function AgentsPage({ onBack }: AgentsPageProps) {
  const agents = [
    {
      name: 'ChatGPT',
      role: 'Project Architect',
      badge: 'Planning & Documentation',
      description: 'Designs project architecture, defines specifications, coordinates agent workflows, and maintains comprehensive documentation.',
      contributions: [
        'Project planning and sprint structure',
        'Technical specifications and requirements',
        'Agent coordination strategy',
        'README and documentation authoring',
      ],
      stats: '6 sprints planned • 100% context retention • 44% faster development',
      gradient: 'from-[#10b981] to-[#059669]',
    },
    {
      name: 'DeepSeek',
      role: 'Frontend Specialist',
      badge: 'UI/UX Implementation',
      description: 'Builds responsive interfaces, implements design systems, ensures accessibility compliance, and creates smooth user experiences.',
      contributions: [
        'React component development',
        'Responsive grid systems',
        'CSS design system implementation',
      ],
      stats: '3 major components • 0 accessibility violations • Mobile-first design',
      gradient: 'from-[#06b6d4] to-[#0891b2]',
    },
    {
      name: 'Gemini',
      role: 'Game Developer',
      badge: 'Game Logic & Features',
      description: 'Implements game mechanics, creates interactive experiences, optimizes performance, and ensures keyboard-first controls.',
      contributions: [
        '9+ game implementations',
        'Keyboard navigation systems',
        'LocalStorage integration',
        'Canvas and SVG rendering',
      ],
      stats: '9 games built • 100% keyboard accessible • Smooth 60fps gameplay',
      gradient: 'from-[#8b5cf6] to-[#7c3aed]',
    },
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
            Meet the AI Agents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#9fb3c8]"
          >
            Coordinated by Model Context Protocol (MCP)
          </motion.p>
        </div>

        {/* Agent Showcase */}
        <div className="space-y-8 mb-16">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-[#081522] rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="p-8 md:flex gap-8 items-start">
                {/* Agent Icon */}
                <div className="mb-6 md:mb-0">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-6xl`}>
                    🤖
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h2 className="text-[#e6eef6] mb-2">{agent.name} - {agent.role}</h2>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#06b6d4]/20 text-[#06b6d4] text-sm">
                      {agent.badge}
                    </span>
                  </div>

                  <p className="text-[#9fb3c8] mb-6">{agent.description}</p>

                  <div className="mb-6">
                    <h4 className="text-[#e6eef6] mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-[#10b981]" />
                      Key Contributions
                    </h4>
                    <ul className="space-y-2">
                      {agent.contributions.map((contribution, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#9fb3c8]">
                          <span className="text-[#10b981] mt-1">✓</span>
                          {contribution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#9fb3c8] bg-[#071029] rounded-lg p-3">
                    <Zap className="w-4 h-4 text-[#f59e0b]" />
                    {agent.stats}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MCP Coordination Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#081522] rounded-xl border border-white/10 p-8 mb-16"
        >
          <h2 className="text-[#e6eef6] mb-8 text-center">How MCP Coordinates Development</h2>

          <div className="max-w-3xl mx-auto">
            {/* MCP Coordinator */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-lg p-6 text-white text-center">
                <Network className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xl">MCP Coordinator</div>
              </div>
            </div>

            {/* Arrows and Agents */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agents.map((agent, index) => (
                <div key={agent.name} className="relative">
                  {/* Arrow */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#8b5cf6] hidden md:block">
                    ↕
                  </div>
                  
                  {/* Agent Box */}
                  <div className={`bg-gradient-to-br ${agent.gradient} rounded-lg p-4 text-white text-center`}>
                    <div className="text-lg mb-1">{agent.name}</div>
                    <div className="text-sm opacity-90">{agent.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Zero information loss',
                'Automatic conflict detection',
                '44% faster development cycles',
                'Real-time synchronization',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-[#9fb3c8]">
                  <CheckCircle className="w-5 h-5 text-[#10b981]" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#06b6d4]/10 to-[#8b5cf6]/10 rounded-xl p-8 border border-white/10">
          <h3 className="text-[#e6eef6] mb-4">Want to learn more about MCP coordination?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:scale-105 transition-all duration-200"
              onClick={() => window.open('https://github.com/WSU-CptS483/course-project-SpidersSuck.git', '_blank')}
            >
              Read Technical Documentation
            </button>
            <button
              className="px-6 py-3 rounded-lg bg-[#081522] text-[#e6eef6] border border-white/10 hover:border-white/30 transition-all duration-200"
              onClick={() => window.open('https://github.com/WSU-CptS483/course-project-SpidersSuck/tree/main/logs', '_blank')}
            >
              View Development Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
