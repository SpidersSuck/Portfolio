import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroHomePage } from './components/HeroHomePage';
import { GamesPage } from './components/GamesPage';
import { GamePage } from './components/GamePage';
import { AgentsPage } from './components/AgentsPage';
import { AboutPage } from './components/AboutPage';
import { ProfilePage } from './components/ProfilePage';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only respond to number keys when on home page or games page
      if ((currentView === 'home' || currentView === 'games') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const gameMap: Record<string, string> = {
          '1': 'tictactoe',
          '2': 'snake',
          '3': 'memory',
          '4': 'breakout',
          '5': 'simon',
          '6': 'minesweeper',
          '7': 'tetris',
          '8': '2048',
          '9': 'pong',
        };

        const gameId = gameMap[e.key];
        if (gameId) {
          e.preventDefault();
          setCurrentView(gameId);
        }
      }

      // ESC to go back to home
      if (e.key === 'Escape' && currentView !== 'home') {
        e.preventDefault();
        setCurrentView('home');
      }

      // Keyboard shortcuts for pages
      if (e.altKey) {
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setCurrentView('home');
        } else if (e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          setCurrentView('games');
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          setCurrentView('agents');
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setCurrentView('profile');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentView]);

  const handleNavigate = (page: string) => {
    setCurrentView(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isGameView = ['tictactoe', 'snake', 'memory', 'breakout', 'simon', 'minesweeper', 'tetris', '2048', 'pong'].includes(currentView);

  // Determine the current page for navbar highlighting
  const getCurrentPage = () => {
    if (currentView === 'home') return 'home';
    if (currentView === 'games' || isGameView) return 'games';
    if (currentView === 'agents') return 'agents';
    if (currentView === 'about') return 'about';
    if (currentView === 'profile') return 'profile';
    return 'home';
  };

  return (
    <div className="min-h-screen bg-[#071029]">
      <Navbar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <HeroHomePage 
            key="home"
            onSelectGame={(gameId) => setCurrentView(gameId)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'games' && (
          <GamesPage 
            key="games"
            onSelectGame={(gameId) => setCurrentView(gameId)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'agents' && (
          <AgentsPage 
            key="agents"
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'about' && (
          <AboutPage 
            key="about"
            onBack={() => setCurrentView('home')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage 
            key="profile"
            onBack={() => setCurrentView('home')}
            onSelectGame={(gameId) => setCurrentView(gameId)}
          />
        )}

        {isGameView && (
          <GamePage 
            key={currentView}
            gameId={currentView} 
            onBack={() => setCurrentView('games')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
