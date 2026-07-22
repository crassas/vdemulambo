import { Sparkles, Moon, Send, X, Video, Menu, Mic, MicOff, VideoOff, PhoneOff, Camera, User, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './components/LoginPage';
import { useAuth } from './hooks/useAuth';
import { ClientView } from './views/ClientView';
import { AdminView } from './views/AdminView';
import { Sidebar } from './components/Sidebar';
import { Status } from './components/MBWayCard';
import { CallInterface } from './components/CallInterface';
import { DisclaimerModal } from './components/DisclaimerModal';
import { WelcomeTutorial } from './components/WelcomeTutorial';

import { Toaster } from 'react-hot-toast';

import { playStartSessionSound, playEndSessionSound } from './lib/sounds';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(profile?.role === 'admin' ? 'dashboard' : 'inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin' && activeTab === 'inicio') {
      setActiveTab('dashboard');
    }
  }, [profile]);
  
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'payment_pending' | 'payment_sent' | 'mentor_received' | 'in_session' | 'session_completed'>('idle');
  
  const activeMbwayStatus = (sessionStatus === 'idle' || sessionStatus === 'payment_pending' ? 'aguardando' : sessionStatus === 'payment_sent' ? 'enviado' : 'aprovado') as Status;

  useEffect(() => {
    if (sessionStatus === 'in_session') {
      playStartSessionSound();
    } else if (sessionStatus === 'session_completed') {
      playEndSessionSound();
    }
  }, [sessionStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // While intro is showing, don't show anything else
  if (showIntro) {
    return (
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-mystic-bg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-rose-400"
        >
          <Moon className="w-16 h-16 mb-8" />
          <motion.h1 
            initial={{ opacity: 0, letterSpacing: "0px" }}
            animate={{ opacity: 1, letterSpacing: "8px" }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-serif text-slate-100 uppercase text-center ml-2"
          >
            Véus de Mulambo
          </motion.h1>
        </motion.div>
      </motion.div>
    );
  }

  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-mystic-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-500/20 border-t-rose-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <LoginPage />;
  }

  // Logged in flow
  if (profile?.role === 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0812] text-slate-200 font-sans selection:bg-pink-500/30 p-6 md:p-10 pb-32">
        <DisclaimerModal />
        <div className="max-w-7xl mx-auto">
          <AdminView onStartSession={() => setSessionStatus('in_session')} />
        </div>

        {/* Admin Footer */}
        <div className="max-w-3xl mx-auto mt-16 text-center pb-8 opacity-60">
           <p className="text-[10px] text-pink-500/80 uppercase tracking-widest leading-relaxed px-4 font-medium">
             ✨ Plataforma exclusiva para organização e comunicação. Nenhum pagamento é efetuado neste sistema.
           </p>
        </div>

        <AnimatePresence>
          {sessionStatus === 'in_session' && (
            <CallInterface isMentora={true} onEndCall={() => setSessionStatus('idle')} />
          )}
        </AnimatePresence>

        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#0a0812',
              color: '#fff',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }
          }}
        />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showTutorial && <WelcomeTutorial onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>
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
        className="min-h-screen bg-mystic-bg text-slate-100 font-sans selection:bg-rose-500/30 p-4 md:p-10 pb-32"
      >
        <header className="sticky top-0 md:top-4 z-40 mb-10 flex flex-row items-center justify-between max-w-7xl mx-auto gap-4 bg-mystic-bg/90 backdrop-blur-xl border border-rose-500/10 p-3 sm:p-4 rounded-[2rem] shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center hover:bg-rose-500/20 transition-all group shrink-0"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3 text-rose-400">
              <Moon className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-xl sm:text-2xl font-serif tracking-wide text-slate-100 hidden sm:block">Véus de Mulambo</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right">
               <p className="text-xs font-medium text-slate-100">{profile?.nome}</p>
               <p className="text-[9px] text-rose-400 uppercase tracking-widest">{profile?.role}</p>
             </div>
             {profile?.fotoPerfil ? (
               <img src={profile.fotoPerfil} alt={profile.nome || ''} className="w-10 h-10 rounded-xl border border-rose-500/30 object-cover" />
             ) : (
               <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                 <User className="w-5 h-5 text-rose-400" />
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
           <p className="text-[10px] text-rose-400 uppercase tracking-widest leading-relaxed px-4 font-medium">
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
          <CallInterface isMentora={false} onEndCall={() => setSessionStatus('session_completed')} />
        )}
      </AnimatePresence>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1425',
            color: '#fff',
            border: '1px solid rgba(168, 85, 247, 0.2)',
          }
        }}
      />
    </>
  );
}
