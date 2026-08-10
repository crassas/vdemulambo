import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, User, LogOut, BarChart3, MessageSquare, Moon, Image as ImageIcon, Sparkles, Calendar, Quote } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { UserProfile } from '../../types';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
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
          {/* Backdrop with elegant deep dark glass overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#04020a]/90 backdrop-blur-lg pointer-events-auto cursor-pointer"
          />
          
          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-76 sm:w-84 bg-gradient-to-b from-[#0e0a20] via-[#090612] to-[#040308] border-r border-white/10 shadow-[25px_0_60px_-15px_rgba(0,0,0,0.8)] p-0 flex flex-col overflow-hidden rounded-r-[2.2rem] md:rounded-r-[2.8rem]"
          >
            {/* Ambient luxury light halos */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-[#9F86C0]/12 to-transparent blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute bottom-24 -left-10 w-44 h-44 bg-gradient-to-tr from-[#E0B1CB]/15 to-transparent blur-[50px] rounded-full pointer-events-none" />

            {/* Header / Mentor Profile */}
            <div className="p-6 pb-5 border-b border-white/5 bg-white/[0.02] backdrop-blur-2xl relative z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#9F86C0]/35 to-transparent" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="relative group">
                  {/* Glowing luxury circle halo */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#9F86C0] via-[#E0B1CB] to-amber-200 opacity-75 blur-md group-hover:opacity-100 transition duration-1000 animate-pulse" />
                  
                  <div className="relative w-15 h-15 rounded-full p-[1.5px] bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-amber-200 shadow-xl">
                    <div className="w-full h-full rounded-full bg-[#0d091b] flex items-center justify-center overflow-hidden">
                      {userProfile?.fotoPerfil ? (
                        <img 
                          src={userProfile.fotoPerfil} 
                          alt="Mentora" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-6 h-6 text-[#E0B1CB]" />
                      )}
                    </div>
                  </div>
                  {/* Mentor Pulsing Active Status */}
                  <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-400 border-[2.5px] border-[#090612] rounded-full shadow-lg shadow-emerald-400/50 animate-pulse" />
                </div>

                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 hover:border-white/20 text-[#BE95C4] hover:text-[#FDF9FC] transition-colors relative z-50 pointer-events-auto cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-serif text-lg text-[#FDF9FC] font-bold tracking-tight">{userProfile?.nome || 'Krys Ty Oya'}</h2>
                  <Sparkles className="w-4 h-4 text-[#E0B1CB] animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#9F86C0]/15 to-[#E0B1CB]/15 border border-[#BE95C4]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B1CB]" />
                  <span className="text-[8.5px] text-[#E0B1CB] uppercase tracking-[0.2em] font-extrabold">Krys • O Meu Espaço</span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-7 custom-scrollbar relative z-10">
              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#BE95C4]/50 uppercase tracking-[0.25em] font-extrabold">Principal</h3>
                <div className="space-y-1.5">
                  <SidebarItem icon={BarChart3} label="Dashboard" isActive={activeTab === 'metrics'} onClick={() => handleNav('metrics')} />
                  <SidebarItem icon={MessageSquare} label="Visitantes" isActive={activeTab === 'attendance'} onClick={() => handleNav('attendance')} badge="1" />
                  <SidebarItem icon={Moon} label="Carta do Dia" isActive={activeTab === 'carta_dia'} onClick={() => handleNav('carta_dia')} />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#BE95C4]/50 uppercase tracking-[0.25em] font-extrabold">Conteúdo</h3>
                <div className="space-y-1.5">
                  <SidebarItem icon={ImageIcon} label="Galeria" isActive={activeTab === 'galeria'} onClick={() => handleNav('galeria')} />
                  <SidebarItem icon={Quote} label="Reflexões" isActive={activeTab === 'reflexoes'} onClick={() => handleNav('reflexoes')} />
                  <SidebarItem icon={Sparkles} label="Publicações" isActive={activeTab === 'trabalhos'} onClick={() => handleNav('trabalhos')} />
                  <SidebarItem icon={Calendar} label="Agenda" isActive={activeTab === 'agenda'} onClick={() => handleNav('agenda')} />
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#BE95C4]/50 uppercase tracking-[0.25em] font-extrabold">Conta</h3>
                <div className="space-y-1.5">
                  <SidebarItem icon={User} label="Perfil" isActive={activeTab === 'profile'} onClick={() => handleNav('profile')} />
                  <SidebarItem icon={Settings} label="Definições" isActive={activeTab === 'settings'} onClick={() => handleNav('settings')} />
                </div>
              </section>
            </div>

            {/* Footer / Logout */}
            <div className="p-5 border-t border-white/5 bg-white/[0.01] backdrop-blur-xl relative z-10 space-y-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-all group border border-rose-500/10 hover:border-rose-500/20 shadow-md cursor-pointer active:scale-98"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest">Encerrar Sessão</span>
              </button>
              <div className="text-center space-y-1">
                <p className="text-[8px] text-[#BE95C4]/50 uppercase tracking-[0.22em] font-semibold">Krys Ty Oya • O Meu Canto</p>
                <p className="text-[7px] text-[#BE95C4]/35 font-mono">A MINHA GESTÃO</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SidebarItem({ icon: Icon, label, onClick, badge, isActive }: { icon: React.ElementType, label: string, onClick: () => void, badge?: string, isActive?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group cursor-pointer active:scale-[0.98] border ${
        isActive 
          ? 'bg-gradient-to-r from-[#9F86C0]/25 to-[#E0B1CB]/25 text-[#FDF9FC] border-[#E0B1CB]/40 shadow-[0_4px_20px_rgba(159,134,192,0.25)]' 
          : 'hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent border-transparent text-[#BE95C4]/80 hover:text-[#FDF9FC]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-sm ${
          isActive 
            ? 'bg-[#E0B1CB]/20 border-[#E0B1CB]/40 text-[#E0B1CB]' 
            : 'bg-white/[0.01] border-white/5 text-[#BE95C4] group-hover:bg-[#E0B1CB]/10 group-hover:text-[#E0B1CB] group-hover:border-[#E0B1CB]/25'
        }`}>
          <Icon className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" />
        </div>
        <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${
          isActive ? 'text-[#FDF9FC]' : 'text-[#FDF9FC]/85'
        }`}>{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-extrabold flex items-center justify-center shadow-md ${
          isActive 
            ? 'bg-[#E0B1CB] text-[#140E26] shadow-[#E0B1CB]/15' 
            : 'bg-rose-500/15 text-rose-400 border border-rose-500/25 shadow-rose-500/5'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
