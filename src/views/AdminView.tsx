import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, MessageSquare, Sparkles, User, ShieldCheck, LogOut, Moon, Menu, Bell, Video, X } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { signOut } from 'firebase/auth';
import { AdminMetrics } from '../components/admin/AdminMetrics';
import { AdminAttendance } from '../components/admin/AdminAttendance';
import { AdminCartaDia } from '../components/admin/AdminCartaDia';
import { AdminProfile } from '../components/admin/AdminProfile';
import { AdminTrabalhos } from '../components/admin/AdminTrabalhos';
import { AdminGaleria } from '../components/admin/AdminGaleria';
import { AdminReflexoes } from "../components/admin/AdminReflexoes";
import { AdminAgenda } from '../components/admin/AdminAgenda';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminBottomNav } from '../components/admin/AdminBottomNav';
import { useAuth } from '../hooks/useAuth';

type AdminTab = 'metrics' | 'reflexoes' | 'attendance' | 'carta_dia' | 'galeria' | 'trabalhos' | 'agenda' | 'profile' | 'settings';

export function AdminView({ onStartSession }: { onStartSession?: () => void }) {
  const [adminTab, setAdminTab] = useState<AdminTab>('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile } = useAuth();
  const [firestoreCall, setFirestoreCall] = useState<{ clientName?: string; status?: string } | null>(null);

  useEffect(() => {
    const callDocRef = doc(db, 'calls', 'active_session');
    const unsubscribe = onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.status === 'pending') {
        setFirestoreCall({ clientName: data.clientName || 'Consulente', status: 'pending' });
        toast('Novo pedido de entrada direta na sala!', { icon: '🔔' });
      } else if (data?.status === 'accepted' || data?.status === 'rejected') {
        setFirestoreCall(null);
      }
    }, (err) => {
      console.warn("Admin call listener warning:", err);
    });

    return () => unsubscribe();
  }, []);

  const handleAcceptRequest = async () => {
    setFirestoreCall(null);
    localStorage.setItem('active_call_status', 'accepted');

    try {
      await updateDoc(doc(db, 'calls', 'active_session'), {
        status: 'accepted',
        acceptedAt: Date.now()
      });
      // Clear WebRTC signaling data for a fresh start
      await setDoc(doc(db, 'calls', 'webrtc_signal'), {});
    } catch (e) {
      console.warn("Firestore update error:", e);
    }

    toast.success('Pedido aceite! A abrir canal privado de videochamada...');
    try {
      if (onStartSession) {
        await onStartSession();
      }
    } catch (err) {
      console.error("Failed to start session:", err);
      toast.error('Erro ao iniciar a sessão. Tente novamente.');
      await updateDoc(doc(db, 'calls', 'active_session'), { status: 'pending' });
      setFirestoreCall({ clientName: firestoreCall?.clientName || 'Consulente', status: 'pending' });
    }
  };

  const handleRejectRequest = async () => {
    setFirestoreCall(null);
    localStorage.setItem('active_call_status', 'rejected');

    try {
      await updateDoc(doc(db, 'calls', 'active_session'), {
        status: 'rejected',
        rejectedAt: Date.now()
      });
    } catch (e) {
      console.warn("Firestore update error:", e);
    }

    toast.error('Pedido recusado. Cliente notificado.');
  };

  const renderContent = () => {
    switch (adminTab) {
      case "metrics":
        return <AdminMetrics setActiveTab={setAdminTab} />;
      case "attendance":
        return <AdminAttendance onStartSession={onStartSession} />;
      case "carta_dia":
        return <AdminCartaDia />;
      case "galeria":
        return <AdminGaleria />;
      case "reflexoes":
        return <AdminReflexoes />;
      case "trabalhos":
        return <AdminTrabalhos />;
      case "agenda":
        return <AdminAgenda />;
      case "profile":
        return <AdminProfile />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminMetrics setActiveTab={setAdminTab} />;
    }
  };

  const getTitle = () => {
    switch (adminTab) {
      case 'metrics': return 'Dashboard';
      case 'attendance': return 'Atendimento';
      case 'carta_dia': return 'Carta do Dia';
      case 'galeria': return 'Galeria';
      case 'reflexoes': return 'Reflexões Diárias';
      case 'trabalhos': return 'Publicações';
      case 'agenda': return 'Agenda';
      case 'profile': return 'Perfil';
      case 'settings': return 'Definições';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative px-4 sm:px-6">
      {/* Immersive Admin Lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9F86C0]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C5A059]/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userProfile={profile}
        activeTab={adminTab}
        setActiveTab={(tab: string) => setAdminTab(tab as AdminTab)}
      />

      {/* Premium Floating Header */}
      <header className="sticky top-6 z-40 mb-12 flex flex-row items-center justify-between gap-4 bg-[#140E26]/60 backdrop-blur-2xl border border-white/[0.08] p-4 sm:p-5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] group">
        <div className="flex items-center gap-4 sm:gap-8">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group shrink-0 cursor-pointer shadow-inner"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#E0B1CB] group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center hidden md:flex">
              <ShieldCheck className="w-5 h-5 text-[#E0B1CB] animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-3xl font-black tracking-tight text-cream leading-none">{getTitle()}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                <p className="text-[10px] text-[#E0B1CB] font-black uppercase tracking-[0.3em]">O Meu Painel</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pr-2">
           <div className="text-right hidden sm:block">
             <p className="text-sm font-black text-cream tracking-tight">{profile?.nome || 'Krys Ty Oya'}</p>
             <p className="text-[10px] text-[#E0B1CB]/60 uppercase tracking-widest font-black">Krys • Em Directo</p>
           </div>
           {profile?.fotoPerfil ? (
             <div className="relative">
               <div className="absolute inset-0 bg-[#E0B1CB] rounded-2xl blur-md opacity-20" />
               <img src={profile.fotoPerfil} alt={profile.nome || ''} className="relative w-12 h-12 rounded-2xl border-2 border-white/10 object-cover shadow-2xl" />
             </div>
           ) : (
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
               <User className="w-6 h-6 text-[#E0B1CB]" />
             </div>
           )}
        </div>
      </header>

      {/* Live Incoming Call Banner */}
      <AnimatePresence>
        {firestoreCall && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="p-6 rounded-[28px] bg-[#090612]/90 border-2 border-[#9F86C0]/50 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E0B1CB] animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E0B1CB] flex items-center gap-1.5">
                    <Bell className="w-4 h-4 animate-bounce" /> Chamada Direta na Sessão
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-mono">Agora</span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-lg font-serif font-bold text-foreground">
                    {firestoreCall.clientName} solicita entrada direta na sala
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consulente aguarda na Sala de Contenção & Acolhimento Espiritual.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleRejectRequest}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                  >
                    Recusar
                  </button>
                  <button
                    onClick={handleAcceptRequest}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(159,134,192,0.35)] cursor-pointer"
                  >
                    <Video className="w-4 h-4" /> Aceitar & Entrar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={adminTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Admin Bottom Navigation */}
      <AdminBottomNav activeTab={adminTab} onTabChange={(tab) => setAdminTab(tab as AdminTab)} />
    </div>
  );
}

