import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, MessageSquare } from 'lucide-react';

interface CallInterfaceProps {
  onEndCall: () => void;
  isMentora?: boolean;
}

export function CallInterface({ onEndCall, isMentora = false }: CallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  // Auto-hide controls when idle
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetIdleTimer = () => {
      setIsControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsControlsVisible(false), 3000);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Main Video Feed (Full Screen) */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={isMentora ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80" : "https://images.unsplash.com/photo-1610260429712-4ebf2ffdfb0f?auto=format&fit=crop&w=1200&q=80"} 
          alt={isMentora ? "Client Feed" : "Mentora Video Feed"} 
          className="w-full h-full object-cover"
        />
        {/* Subtle Overlay to ensure UI readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Top Bar */}
      <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 transition-opacity duration-500 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            {isMentora ? "Consulta Ativa" : "Consulta"}
          </span>
          <span className="text-xs text-white/50 border-l border-white/20 pl-3">24:15</span>
        </div>
        
        <button className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* Self Preview (Floating Picture-in-Picture) */}
      <motion.div 
        drag
        dragConstraints={{ left: 20, right: 20, top: 20, bottom: 20 }}
        className={`absolute top-24 right-6 w-28 h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-grab active:cursor-grabbing z-20 bg-black transition-opacity duration-500 ${isControlsVisible ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
      >
        {!isVideoOff ? (
          <img 
            src={isMentora ? "https://images.unsplash.com/photo-1610260429712-4ebf2ffdfb0f?auto=format&fit=crop&w=300&q=80" : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"} 
            alt="Self" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <VideoOff className="w-6 h-6 text-white/30" />
          </div>
        )}
        {isMuted && (
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center backdrop-blur-md">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
      </motion.div>

      {/* Controls Bar (WhatsApp/Messenger Style) */}
      <div 
        className={`absolute bottom-10 left-0 right-0 z-20 px-6 flex justify-center transition-all duration-500 ${isControlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-30 hover:opacity-100 hover:translate-y-0'}`}
        onMouseEnter={() => setIsControlsVisible(true)}
      >
        <div className="bg-black/60 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/10 flex items-center gap-6 shadow-2xl">
          {/* Chat Button */}
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Camera Toggle */}
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>

          {/* Mic Toggle */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call */}
          <button 
            onClick={onEndCall}
            className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Reading area hint for Mentora */}
      {isMentora && (
        <div className={`absolute bottom-36 left-1/2 -translate-x-1/2 text-center pointer-events-none transition-opacity duration-500 ${isControlsVisible ? 'opacity-40' : 'opacity-10'}`}>
          <p className="text-[10px] text-white uppercase tracking-[0.5em] font-light">Área de Leitura de Cartas</p>
        </div>
      )}
    </motion.div>
  );
}
