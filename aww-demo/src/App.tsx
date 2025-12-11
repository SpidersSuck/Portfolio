import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { StoriesPage } from './components/StoriesPage';
import { EventsPage } from './components/EventsPage';
import { EventGalleryPage } from './components/EventGalleryPage';
import { StorePage } from './components/StorePage';
import { DonationPage } from './components/DonationPage';
import { ProfilePage } from './components/ProfilePage';
import { ContactPage } from './components/ContactPage';
import { LoginModal } from './components/LoginModal';
import { AdminCMS } from './components/AdminCMS';
import { DebugPage } from './components/DebugPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Show admin hint on first load
  React.useEffect(() => {
    const hasSeenHint = localStorage.getItem('aww_admin_hint_seen');
    if (!hasSeenHint && currentPage === 'home') {
      setTimeout(() => setShowAdminHint(true), 2000);
      setTimeout(() => {
        setShowAdminHint(false);
        localStorage.setItem('aww_admin_hint_seen', 'true');
      }, 8000);
    }
  }, []);

  const handlePageChange = (page: string) => {
    // If trying to access edit-events, open AdminCMS modal instead
    if (page === 'edit-events') {
      setIsAdminCMSOpen(true);
      return;
    }
    // If trying to access profile page without being logged in, show login modal
    if (page === 'profile' && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  const handleProfileClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      setCurrentPage('profile');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'stories':
        return <StoriesPage />;
      case 'events':
        return <EventsPage onPageChange={handlePageChange} />;
      case 'event-gallery':
        return <EventGalleryPage />;
      case 'store':
        return <StorePage />;
      case 'donate':
        return <DonationPage />;
      case 'profile':
        return <ProfilePage onPageChange={handlePageChange} />;
      case 'contact':
        return <ContactPage />;
      case 'debug':
        return <DebugPage />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      
      {/* Admin CMS Modal */}
      {isAdminCMSOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          {/* Editing Mode Badge */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed top-20 right-6 z-[60] bg-gradient-to-r from-[#f7941D] to-[#F79520] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <motion.span 
              className="text-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ⚙️
            </motion.span>
            <span className="font-bold">Admin Mode</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
          
          <div className="h-full overflow-auto">
            <AdminCMS onNavigateHome={() => setIsAdminCMSOpen(false)} />
          </div>
        </div>
      )}

      <Footer onPageChange={handlePageChange} />

      {/* Floating Profile Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.8 
        }}
      >
        <motion.button
          onClick={handleProfileClick}
          className="relative w-14 h-14 bg-gradient-to-br from-[#f7941D] to-[#F79520] text-white rounded-full shadow-lg flex items-center justify-center group overflow-hidden"
          title={user ? `${user.firstName} ${user.lastName} - My Profile` : "Sign in to view profile"}
          whileHover={{ 
            scale: 1.15,
            rotate: [0, -10, 10, 0],
            boxShadow: "0 25px 50px -12px rgba(247, 148, 29, 0.4)"
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 15 
          }}
        >
          {/* Background gradient animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#F79520] to-[#f7941D] rounded-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* User initials */}
          <motion.div 
            className="relative z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-inner"
            whileHover={{ 
              scale: 1.1,
              backgroundColor: "rgba(255, 255, 255, 0.3)"
            }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <span className="text-sm font-bold tracking-wide">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : '?'}
            </span>
          </motion.div>
          
          {/* Animated ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 1.3, 1.5],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
        
        {/* Profile tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={{ y: 10, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
        >
          {user ? `${user.firstName} ${user.lastName}` : 'Sign in'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </motion.div>
      </motion.div>

      {/* Admin Access Hint - Shows once on first visit */}
      {showAdminHint && currentPage === 'home' && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-[#004080] to-[#0056b3] text-white p-4 rounded-lg shadow-2xl max-w-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold mb-1">👋 Admin Access</p>
              <p className="text-sm text-gray-200">
                Log in as admin to see "⚙️ Admin" in the navbar!
              </p>
              <p className="text-xs text-gray-300 mt-2">
                Username: <strong>admin</strong>
              </p>
            </div>
            <button
              onClick={() => setShowAdminHint(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#0056b3]"></div>
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}