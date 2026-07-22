import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, User, LogOut, BarChart3, MessageSquare, Moon, Image as ImageIcon, Sparkles, Calendar } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ isOpen, onClose, userProfile, activeTab, setActiveTab }: AdminSidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem('dummyUser');
    signOut(auth).then(() => {
        window.location.reload();
    });
    onClose();
  };

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md pointer-events-auto cursor-pointer"
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-72 sm:w-80 bg-mystic-card border-r border-pink-500/10 shadow-[20px_0_40px_rgba(0,0,0,0.6)] p-0 flex flex-col overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 bg-white/5 backdrop-blur-xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-3">
                <div className="relative">
                  {userProfile?.fotoPerfil ? (
                    <img src={userProfile.fotoPerfil} alt="Mentora" className="w-12 h-12 rounded-xl object-cover border border-pink-500/30" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                      <User className="w-6 h-6 text-pink-500" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10 transition-colors relative z-50 pointer-events-auto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="font-serif text-base text-slate-100 mb-0.5">{userProfile?.nome || 'Mentora'}</h2>
                <p className="text-[8px] text-pink-500 uppercase tracking-[0.2em] font-bold">Acesso de Gestão</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar relative z-10">
              <section>
                <h3 className="px-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Principal</h3>
                <div className="space-y-0.5">
                  <SidebarItem icon={BarChart3} label="Dashboard" isActive={activeTab === 'metrics'} onClick={() => handleNav('metrics')} />
                  <SidebarItem icon={MessageSquare} label="Atendimento" isActive={activeTab === 'attendance'} onClick={() => handleNav('attendance')} badge="1" />
                  <SidebarItem icon={Moon} label="Carta do Dia" isActive={activeTab === 'carta_dia'} onClick={() => handleNav('carta_dia')} />
                </div>
              </section>

              <section>
                <h3 className="px-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Conteúdo</h3>
                <div className="space-y-0.5">
                  <SidebarItem icon={ImageIcon} label="Galeria" isActive={activeTab === 'galeria'} onClick={() => handleNav('galeria')} />
                  <SidebarItem icon={Sparkles} label="Publicações" isActive={activeTab === 'trabalhos'} onClick={() => handleNav('trabalhos')} />
                  <SidebarItem icon={Calendar} label="Agenda" isActive={activeTab === 'agenda'} onClick={() => handleNav('agenda')} />
                </div>
              </section>

              <section>
                <h3 className="px-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Conta</h3>
                <div className="space-y-0.5">
                  <SidebarItem icon={User} label="Perfil" isActive={activeTab === 'profile'} onClick={() => handleNav('profile')} />
                  <SidebarItem icon={Settings} label="Definições" isActive={activeTab === 'settings'} onClick={() => handleNav('settings')} />
                </div>
              </section>
            </div>

            <div className="p-4 border-t border-white/5 bg-white/5 relative z-10">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all group border border-transparent hover:border-red-500/10"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Encerrar Sessão</span>
              </button>
              <p className="text-[8px] text-slate-600 text-center mt-4 uppercase tracking-widest">Véus de Mulambo © 2026</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SidebarItem({ icon: Icon, label, onClick, badge, isActive }: { icon: any, label: string, onClick: () => void, badge?: string, isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
        isActive 
          ? 'bg-pink-500/10 border border-pink-500/20 text-pink-500' 
          : 'hover:bg-white/5 border border-transparent hover:border-white/5 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${isActive ? 'text-pink-500' : 'text-slate-400 group-hover:text-pink-400'} transition-colors`} />
        <span className={`text-xs font-medium tracking-wide ${isActive ? 'text-pink-500' : 'text-slate-200 group-hover:text-pink-400'} transition-colors`}>{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-bold border border-red-500/20 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
