import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Maximize2, Minimize2, Info, Volume2, VolumeX } from 'lucide-react';

interface PacmanProps {
  onBack: () => void;
}

export function Pacman({ onBack }: PacmanProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [volume, setVolume] = useState(20);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const volumeStateRef = useRef({ volume: 20, isMuted: false });
  const gameUrl = `${import.meta.env.BASE_URL}pacman-game/index.html`;

  // Update volume state ref whenever volume or mute changes
  useEffect(() => {
    volumeStateRef.current = { volume, isMuted };
  }, [volume, isMuted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle iframe load - apply saved volume
  useEffect(() => {
    const handleIframeLoad = () => {
      // Give the game time to initialize, then apply the saved volume
      setTimeout(() => {
        applyCurrentVolume();
      }, 1500);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      return () => iframe.removeEventListener('load', handleIframeLoad);
    }
  }, []);

  const applyCurrentVolume = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        const { volume: vol, isMuted: muted } = volumeStateRef.current;
        const actualVolume = muted ? 0 : vol / 100;
        iframeRef.current.contentWindow.postMessage({
          type: 'setVolume',
          volume: actualVolume
        }, '*');
      } catch (error) {
        console.error('Error sending volume message:', error);
      }
    }
  };

  useEffect(() => {
    // Apply volume changes to the game with debouncing
    const timer = setTimeout(() => {
      applyCurrentVolume();
    }, 150); // Debounce to prevent too many messages
    
    return () => clearTimeout(timer);
  }, [volume, isMuted]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && iframeRef.current) {
      iframeRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm border-b border-white/10"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">PAC-MAN</h1>
            <p className="text-sm text-white/60">Classic Arcade Game</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-[#ffff00] transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ffff00] 
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#ffff00] 
                [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              title={`Volume: ${volume}%`}
            />
            <span className="text-xs text-white/60 w-8">{volume}%</span>
          </div>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${
              showInfo ? 'bg-[#ffff00] text-black' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Game Info"
          >
            <Info size={20} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-black/40 backdrop-blur-sm border-b border-white/10 p-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-[#ffff00] mb-4">How to Play</h2>
            <div className="grid md:grid-cols-2 gap-6 text-white/80">
              <div>
                <h3 className="font-semibold text-white mb-2">Controls:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• <span className="text-[#ffff00]">Arrow Keys</span> - Move Pac-Man</li>
                  <li>• <span className="text-[#ffff00]">Swipe</span> - Mobile controls</li>
                  <li>• <span className="text-[#ffff00]">End</span> - Pause game</li>
                  <li>• <span className="text-[#ffff00]">Escape</span> - Open menu</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Objective:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Eat all dots to complete the level</li>
                  <li>• Avoid the colorful ghosts</li>
                  <li>• Eat power pellets to turn ghosts blue</li>
                  <li>• Eat blue ghosts for bonus points</li>
                  <li>• Collect fruit for extra points</li>
                  <li>• <span className="text-[#ffff00]">Current level shown at top-left</span></li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-white/60">
                This is an accurate historical tribute to the original 1980 Pac-Man arcade game by Namco.
                Created by Shaun Williams and Mason Borda.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Game Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,255,0,0.3)] border-2 border-[#ffff00]/20">
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <iframe
              ref={iframeRef}
              src={gameUrl}
              className="absolute inset-0 w-full h-full"
              title="Pac-Man Game"
              allow="fullscreen"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pb-6 text-white/40 text-sm"
      >
        <p>Click inside the game area to start playing!</p>
      </motion.div>
    </div>
  );
}

