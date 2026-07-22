import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, MessageSquare, Sparkles, User, ShieldCheck, LogOut, Moon, Menu } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Status } from '../components/MBWayCard';
import { AdminMetrics } from '../components/admin/AdminMetrics';
import { AdminAttendance } from '../components/admin/AdminAttendance';
import { AdminCartaDia } from '../components/admin/AdminCartaDia';
import { AdminProfile } from '../components/admin/AdminProfile';
import { AdminTrabalhos } from '../components/admin/AdminTrabalhos';
import { AdminGaleria } from '../components/admin/AdminGaleria';
import { AdminAgenda } from '../components/admin/AdminAgenda';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../hooks/useAuth';

type AdminTab = 'metrics' | 'attendance' | 'carta_dia' | 'galeria' | 'trabalhos' | 'agenda' | 'profile' | 'settings';

export function AdminView({ onStartSession }: { onStartSession?: () => void }) {
  const [adminTab, setAdminTab] = useState<AdminTab>('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { profile } = useAuth();

  const renderContent = () => {
    switch (adminTab) {
      case 'metrics':
        return <AdminMetrics />;
      case 'attendance':
        return <AdminAttendance onStartSession={onStartSession} />;
      case 'carta_dia':
        return <AdminCartaDia />;
      case 'galeria':
        return <AdminGaleria />;
      case 'trabalhos':
        return <AdminTrabalhos />;
      case 'agenda':
        return <AdminAgenda />;
      case 'profile':
        return <AdminProfile />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminMetrics />;
    }
  };

  const getTitle = () => {
    switch (adminTab) {
      case 'metrics': return 'Dashboard';
      case 'attendance': return 'Atendimento';
      case 'carta_dia': return 'Carta do Dia';
      case 'galeria': return 'Galeria';
      case 'trabalhos': return 'Publicações';
      case 'agenda': return 'Agenda';
      case 'profile': return 'Perfil';
      case 'settings': return 'Definições';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userProfile={profile}
        activeTab={adminTab}
        setActiveTab={(tab: string) => setAdminTab(tab as AdminTab)}
      />

      {/* Header Info */}
      <div className="sticky top-0 md:top-4 z-40 mb-8 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0812]/90 backdrop-blur-xl border border-pink-500/10 rounded-[2rem] shadow-2xl shadow-black/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 hover:bg-pink-500/20 transition-colors shrink-0 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 items-center justify-center text-pink-500 shrink-0 hidden md:flex">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-slate-100 tracking-tight">{getTitle()}</h2>
            <p className="text-[9px] text-pink-500/50 uppercase tracking-[0.2em] font-bold">Acesso de Mentora</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 hidden md:flex"
          title="Menu"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
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
    </div>
  );
}

