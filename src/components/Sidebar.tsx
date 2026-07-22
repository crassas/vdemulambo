import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, User, LogOut, Shield, HelpCircle, Bell, Instagram, ExternalLink, Moon, Sparkles, Compass, Star } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ isOpen, onClose, userProfile, setActiveTab }: SidebarProps) {
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
          {/* Backdrop with intense blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md cursor-pointer pointer-events-auto"
          />
          
          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-72 sm:w-80 bg-mystic-card border-r border-rose-500/10 shadow-[20px_0_40px_rgba(0,0,0,0.4)] p-0 flex flex-col overflow-hidden"
          >
            {/* Header / User Profile */}
            <div className="p-5 border-b border-white/5 bg-white/5 backdrop-blur-xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-rose-500 p-[1px]">
                    <div className="w-full h-full rounded-xl bg-mystic-bg flex items-center justify-center overflow-hidden">
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-[1.5px] border-mystic-bg rounded-full shadow-lg" />
                </div>
                <button 
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 relative z-50 pointer-events-auto"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
              <div>
                <h2 className="font-serif text-base text-slate-100 mb-0.5">{userProfile?.displayName || 'Cliente'}</h2>
                <p className="text-[8px] text-rose-400 uppercase tracking-[0.2em] font-bold">Membro</p>
              </div>
            </div>

            {/* Navigation / Actions */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Special Feature: Carta do Dia */}
              <section>
                <button 
                  onClick={() => handleNav('carta_dia')}
                  className="w-full relative group overflow-hidden rounded-[1.5rem] p-[1px] bg-gradient-to-br from-rose-400/50 via-rose-600/50 to-indigo-600/50 shadow-lg shadow-rose-500/20"
                >
                  <div className="relative bg-[#0f0c1a] rounded-[1.5rem] p-3 flex items-center gap-3 group-hover:bg-rose-900/20 transition-all duration-500">
                    <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-0.5">Inspiração</h4>
                      <p className="text-[11px] font-serif text-slate-100">Carta do Dia</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <Moon className="w-3 h-3 text-rose-300" />
                      </div>
                    </div>
                  </div>
                </button>
              </section>

              {/* Account Section */}
              <section>
                <h3 className="px-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">A Minha Conta</h3>
                <div className="space-y-0.5">
                  <SidebarItem icon={Sparkles} label="Trabalhos" onClick={() => handleNav('trabalhos')} />
                  <SidebarItem icon={Compass} label="Consultas" onClick={() => handleNav('servicos')} />
                  <SidebarItem icon={Star} label="Perfil da Mentora" onClick={() => handleNav('mentor_profile')} />
                  <SidebarItem icon={User} label="O Meu Perfil" onClick={() => handleNav('perfil')} />
                  <SidebarItem icon={Bell} label="Notificações" badge="2" onClick={() => handleNav('notificacoes')} />
                  <SidebarItem icon={Shield} label="Privacidade" onClick={() => handleNav('privacidade')} />
                </div>
              </section>

              {/* Social Section */}
              <section>
                <h3 className="px-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Redes Sociais</h3>
                <div className="space-y-0.5">
                  <SidebarItem 
                    icon={Instagram} 
                    label="Instagram" 
                    onClick={() => window.open('https://www.instagram.com/veus.demulambo?igsh=MTNvaW5nMWR1cDByZQ==', '_blank')}
                    external
                  />
                  <SidebarItem icon={Moon} label="Oráculo Digital" onClick={() => handleNav('oraculo')} />
                </div>
              </section>

              {/* Support Section */}
              <section>
                <h3 className="px-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-2">Suporte</h3>
                <div className="space-y-0.5">
                  <SidebarItem icon={HelpCircle} label="Ajuda" onClick={() => handleNav('ajuda')} />
                  <SidebarItem icon={Settings} label="Configurações" onClick={() => handleNav('configuracoes')} />
                </div>
              </section>
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-md">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all group border border-transparent hover:border-red-500/10"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Sair</span>
              </button>
              <p className="text-[8px] text-slate-600 text-center mt-4 uppercase tracking-widest">Véus de Mulambo © 2026</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SidebarItem({ 
  icon: Icon, 
  label, 
  badge, 
  onClick, 
  external 
}: { 
  icon: any, 
  label: string, 
  badge?: string, 
  onClick?: () => void,
  external?: boolean 
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-500/10 transition-all group border border-transparent hover:border-rose-500/10"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors">
          <Icon className="w-4 h-4 text-slate-400 transition-colors" />
        </div>
        <span className="text-slate-200 text-[11px] font-medium tracking-wide">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg shadow-rose-600/20">
            {badge}
          </span>
        )}
        {external && (
          <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-rose-400 transition-colors" />
        )}
      </div>
    </button>
  );
}
