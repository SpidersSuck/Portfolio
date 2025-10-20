import { Home, Gamepad2, Info, Bot, User, Settings } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'about', label: 'About', icon: Info },
    { id: 'agents', label: 'Agents', icon: Bot },
  ];

  return (
    <nav className="sticky top-0 z-50 h-[72px] border-b border-white/10 backdrop-blur-lg bg-[#071029]/80">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo and Title */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl text-[#e6eef6]">Mini Web Game Portal</span>
        </button>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors duration-250 flex items-center gap-2 ${
                currentPage === item.id 
                  ? 'text-[#06b6d4]' 
                  : 'text-[#9fb3c8] hover:text-[#06b6d4]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-[#081522] hover:bg-[#081522]/80 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <User className="w-5 h-5 text-[#9fb3c8]" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#081522] hover:bg-[#081522]/80 flex items-center justify-center transition-all duration-200 hover:scale-105">
            <Settings className="w-5 h-5 text-[#9fb3c8]" />
          </button>
        </div>
      </div>
    </nav>
  );
}
