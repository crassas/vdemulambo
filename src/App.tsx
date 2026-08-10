import { ParticlesBackground } from "./components/ParticlesBackground";
import { Sparkles, Moon, Send, X, Video, Menu, Mic, MicOff, VideoOff, PhoneOff, Camera, User, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './components/LoginPage';
import { IntroSplash } from './components/IntroSplash';
import { useAuth } from './hooks/useAuth';
import { ClientView } from './views/ClientView';
import { AdminView } from './views/AdminView';
import { Sidebar } from './components/Sidebar';
import { CallInterface } from './components/CallInterface';
import { DisclaimerModal } from './components/DisclaimerModal';
import { WelcomeTutorial } from './components/WelcomeTutorial';

import { Toaster } from 'react-hot-toast';

import { playStartSessionSound, playEndSessionSound } from './lib/sounds';

export default function App() {
      const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(profile?.role === 'admin' ? 'dashboard' : 'inicio');
  const [hasCompletedSplash, setHasCompletedSplash] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    if (profile?.role === 'admin' && activeTab === 'inicio') {
      setActiveTab('dashboard');
    }
  }, [profile]);
  
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'payment_pending' | 'payment_sent' | 'mentor_received' | 'in_session' | 'session_completed'>('idle');
  

  useEffect(() => {
    if (sessionStatus === 'in_session') {
      playStartSessionSound();
    } else if (sessionStatus === 'session_completed') {
      playEndSessionSound();
    }
  }, [sessionStatus]);



  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    if (!hasCompletedSplash) {
      return <IntroSplash onDone={() => setHasCompletedSplash(true)} />;
    }
    return <LoginPage />;
  }

  // Logged in flow
  if (profile?.role === 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 px-4 sm:px-6 md:px-10 pt-6 md:pt-8 pb-32">
        <ParticlesBackground />
        <div className="max-w-7xl mx-auto">
          <AdminView onStartSession={() => setSessionStatus('in_session')} />
        </div>

        {/* Admin Footer */}
        <div className="max-w-3xl mx-auto mt-16 text-center pb-8 opacity-60">
           <p className="text-[10px] text-accent uppercase tracking-widest leading-relaxed px-4 font-medium">
             Plataforma exclusiva para organização e comunicação.
           </p>
        </div>

      <AnimatePresence>
          {sessionStatus === 'in_session' && (
            <CallInterface isCartomante={true} onEndCall={() => setSessionStatus('idle')} />
          )}
        </AnimatePresence>

        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }
          }}
        />
      </div>
    );
  }

  return (
    <>
      <DisclaimerModal />
      <AnimatePresence>
        {showTutorial && <WelcomeTutorial userProfile={profile} onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>
      <ParticlesBackground />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userProfile={profile}
        setActiveTab={setActiveTab}
      />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 px-4 md:px-10 pt-20 md:pt-24 pb-32"
      >
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 h-18 bg-gradient-to-b from-[#0e0a20]/95 via-[#090612]/92 to-[#090612]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Left: Hamburger with luxury subtle outer ring */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 text-[#E0B1CB] hover:text-[#FDF9FC] hover:bg-white/5 hover:border-white/10 active:scale-95 transition-all duration-300 cursor-pointer shadow-inner"
            aria-label="Abrir menu"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
          
          {/* Center: App Name styled as a luxury brand */}
          <h1 className="font-serif text-[15px] sm:text-[16px] font-bold uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#FDF9FC] via-[#E0B1CB] to-[#9F86C0] absolute left-1/2 -translate-x-1/2 select-none">
            Véus de Mulambo
          </h1>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
             {profile?.fotoPerfil ? (
               <div className="w-10 h-10 rounded-full p-[1px] bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] shadow-md hover:rotate-6 transition-transform duration-300">
                 <img src={profile?.fotoPerfil || undefined} alt={profile.nome || ''} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
               </div>
             ) : (
               <div className="w-10 h-10 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/25 flex items-center justify-center shadow-md">
                 <User className="w-5 h-5 text-[#E0B1CB]" />
               </div>
             )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <ClientView 
              key={activeTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userProfile={profile}
              sessionStatus={sessionStatus}
              setSessionStatus={setSessionStatus}
            />
          </AnimatePresence>
        </div>

        {/* Client Footer */}
        <div className="max-w-3xl mx-auto mt-16 text-center pb-24 md:pb-8 opacity-60">
           <p className="text-[10px] text-accent uppercase tracking-widest leading-relaxed px-4 font-medium">
             ✨ Plataforma exclusiva para organização e comunicação.<br className="hidden sm:block" /> Nenhum pagamento é efetuado neste sistema.
           </p>
        </div>
      </motion.div>

      {/* Navigation - Only for clients */}
      {sessionStatus !== 'in_session' && (
      <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
          >
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Session Modal */}
      <AnimatePresence>
        {sessionStatus === 'in_session' && (
          <CallInterface isCartomante={false} onEndCall={() => setSessionStatus('session_completed')} />
        )}
      </AnimatePresence>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }
        }}
      />
    </>
  );
}
