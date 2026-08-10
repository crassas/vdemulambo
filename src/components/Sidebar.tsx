import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, User, LogOut, Shield, HelpCircle, Bell, Instagram, ExternalLink, Moon, Sparkles, Compass, Star, Globe } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { UserProfile, Language } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ isOpen, onClose, userProfile, setActiveTab }: SidebarProps) {
  const { language, setLanguage, t } = useLanguage();

  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('appTheme') || 'mystic');

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    localStorage.setItem('appTheme', themeName);
    if (themeName === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', themeName);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('appTheme') || 'mystic';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

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
            className="fixed inset-0 z-[60] bg-[#04020a]/90 backdrop-blur-lg cursor-pointer pointer-events-auto"
          />
          
          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-76 sm:w-84 bg-gradient-to-b from-[#0e0a20] via-[#090612] to-[#040308] border-r border-white/10 shadow-[25px_0_60px_-15px_rgba(0,0,0,0.8)] p-0 flex flex-col overflow-hidden rounded-r-[2.2rem] md:rounded-r-[2.8rem]"
          >
            {/* Glowing luxury ambient lights behind panel */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-tr from-[#E0B1CB]/10 to-transparent blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute bottom-24 -left-10 w-44 h-44 bg-gradient-to-tr from-[#9F86C0]/15 to-transparent blur-[50px] rounded-full pointer-events-none" />

            {/* Header / User Profile */}
            <div className="p-6 pb-5 border-b border-white/5 bg-white/[0.02] backdrop-blur-2xl relative z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-[#E0B1CB]/35 to-transparent" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="relative group">
                  {/* Luxury glowing ring */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#9F86C0] via-[#E0B1CB] to-[#9F86C0] opacity-75 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  
                  <div className="relative w-14 h-14 rounded-full p-[1.5px] bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-amber-200 shadow-xl">
                    <div className="w-full h-full rounded-full bg-[#0d091b] flex items-center justify-center overflow-hidden">
                      {userProfile?.fotoPerfil ? (
                        <img 
                          src={userProfile?.fotoPerfil || undefined} 
                          alt="Avatar" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-5 h-5 text-[#E0B1CB]" />
                      )}
                    </div>
                  </div>
                  {/* Connected Status Indicator with Glow */}
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 border-[2.5px] border-[#090612] rounded-full shadow-lg shadow-emerald-400/50" />
                </div>

                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 hover:border-white/20 active:scale-95 relative z-50 pointer-events-auto cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#BE95C4]" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-[17px] font-bold text-[#FDF9FC] tracking-tight">{userProfile?.nome || 'Visitante'}</h2>
                  <span className="text-[10px]">✨</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#9F86C0]/15 to-[#E0B1CB]/15 border border-[#BE95C4]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0B1CB] animate-pulse" />
                  <span className="text-[9px] text-[#E0B1CB] uppercase tracking-[0.18em] font-extrabold">Membro Ouro</span>
                </div>
              </div>
            </div>

            {/* Navigation / Secondary Actions */}
            <div className="flex-1 p-5 sm:p-6 space-y-7 overflow-y-auto custom-scrollbar relative z-10">
              {/* Primary Navigation: Espaço Espiritual */}
              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#E0B1CB] uppercase tracking-[0.22em] font-extrabold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E0B1CB] fill-[#E0B1CB]/10" /> 
                  <span>O Meu Cantinho</span>
                </h3>
                <div className="space-y-1.5">
                  <SidebarItem icon={User} label="Sobre a Krys Ty Oya" onClick={() => handleNav('mentor_profile')} />
                  <SidebarItem icon={Sparkles} label="Publicações & Trabalhos" onClick={() => handleNav('trabalhos')} />
                  <SidebarItem icon={Moon} label="Serviços & Consultas" onClick={() => handleNav('servicos')} />
                </div>
              </section>

              {/* Inspiration Spotlight: Carta do Dia */}
              <section>
                <button 
                  onClick={() => handleNav('carta_dia')}
                  className="w-full relative group overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-tr from-[#9F86C0]/50 via-[#E0B1CB]/30 to-amber-200/50 shadow-xl shadow-[#000]/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="relative bg-gradient-to-b from-[#18112c] to-[#0c0817] rounded-[19px] p-4 flex items-center gap-4 transition-all duration-500 border border-white/5">
                    {/* Animated shine effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 group-hover:animate-[shine_1s_ease-in-out]" />
                    
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#9F86C0]/20 to-[#E0B1CB]/20 border border-[#BE95C4]/30 flex items-center justify-center text-[#E0B1CB] group-hover:scale-110 transition-transform shadow-inner">
                      <Sparkles className="w-5 h-5 text-[#E0B1CB] animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="text-[8px] font-extrabold uppercase tracking-[0.25em] text-[#E0B1CB] block mb-0.5">Mensagem Diária</span>
                      <h4 className="text-[13px] font-serif font-bold text-[#FDF9FC]">Carta do Dia</h4>
                    </div>
                    <div className="ml-auto">
                      <div className="w-7 h-7 rounded-full bg-[#E0B1CB]/15 flex items-center justify-center border border-[#E0B1CB]/30 shadow-md group-hover:rotate-12 transition-transform">
                        <Moon className="w-4 h-4 text-[#E0B1CB]" />
                      </div>
                    </div>
                  </div>
                </button>
              </section>

              {/* Language Selector */}
              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#E0B1CB]/70 uppercase tracking-[0.22em] font-extrabold flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#E0B1CB]" /> 
                  <span>{t('language')}</span>
                </h3>
                <div className="grid grid-cols-3 gap-2 px-1">
                  {(['pt', 'es', 'en'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all border cursor-pointer active:scale-95 ${
                        language === lang
                          ? 'bg-gradient-to-tr from-[#9F86C0]/20 to-[#E0B1CB]/20 text-[#E0B1CB] border-[#E0B1CB]/50 shadow-[0_4px_12px_rgba(224,177,203,0.15)]'
                          : 'bg-white/[0.02] text-slate-400 border-white/5 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      {lang === 'pt' ? 'PT 🇵🇹' : lang === 'es' ? 'ES 🇪🇸' : 'EN 🇬🇧'}
                    </button>
                  ))}
                </div>
              </section>

              {/* Modern Backgrounds / Themes Selector (4 Types) */}
              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#E0B1CB]/70 uppercase tracking-[0.22em] font-extrabold flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-[#E0B1CB]" />
                  <span>Estilo de Fundo Moderno</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 px-1">
                  {[
                    { id: 'mystic', label: 'Noite Mística' },
                    { id: 'champagne', label: 'Champagne Ouro' },
                    { id: 'rose', label: 'Éter Rosê' },
                    { id: 'light', label: 'Claro Sagrado' }
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`py-2 px-2.5 rounded-xl text-[10px] font-bold tracking-wide transition-all border cursor-pointer active:scale-95 flex items-center justify-between ${
                        currentTheme === theme.id
                          ? 'bg-gradient-to-r from-[#9F86C0]/25 to-[#E0B1CB]/25 text-[#E0B1CB] border-[#E0B1CB]/50 shadow-[0_4px_15px_rgba(224,177,203,0.2)]'
                          : 'bg-white/[0.02] text-slate-300 border-white/5 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{theme.label}</span>
                      {currentTheme === theme.id && <span className="w-1.5 h-1.5 rounded-full bg-[#E0B1CB] animate-ping" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Secondary Actions & Account Preferences */}
              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#E0B1CB]/70 uppercase tracking-[0.22em] font-extrabold">Conta e Preferências</h3>
                <div className="space-y-1.5">
                  <SidebarItem icon={User} label="O Meu Perfil" onClick={() => handleNav('perfil')} />
                  <SidebarItem icon={Bell} label="Notificações" badge="2" onClick={() => handleNav('notificacoes')} />
                  <SidebarItem icon={Shield} label="Privacidade & Segurança" onClick={() => handleNav('privacidade')} />
                </div>
              </section>

              {/* Settings & Support */}
              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#E0B1CB]/70 uppercase tracking-[0.22em] font-extrabold">Suporte e Definições</h3>
                <div className="space-y-1.5">
                  <SidebarItem icon={Settings} label="Configurações do App" onClick={() => handleNav('configuracoes')} />
                  <SidebarItem icon={HelpCircle} label="Apoio & FAQs" onClick={() => handleNav('ajuda')} />
                </div>
              </section>

              {/* Community & Social */}
              <section className="space-y-3">
                <h3 className="px-2 text-[9.5px] text-[#E0B1CB]/70 uppercase tracking-[0.22em] font-extrabold">Comunidade</h3>
                <div className="space-y-1.5">
                  <SidebarItem 
                    icon={Instagram} 
                    label="Instagram Oficial" 
                    onClick={() => window.open('https://www.instagram.com/veus.demulambo', '_blank')}
                    external
                  />
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
                <span className="text-[10px] font-extrabold uppercase tracking-widest">{t('logout')}</span>
              </button>
              <div className="text-center space-y-1">
                <p className="text-[8px] text-[#BE95C4]/50 uppercase tracking-[0.22em] font-semibold">Krys Ty Oya • Espaço Pessoal</p>
                <p className="text-[7px] text-[#BE95C4]/35 font-mono">VERSÃO 1.2.0 • TOPO DE GAMA</p>
              </div>
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
  icon: React.ElementType, 
  label: string, 
  badge?: string, 
  onClick?: () => void,
  external?: boolean 
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gradient-to-r hover:from-white/[0.04] hover:to-transparent transition-all duration-300 group border border-transparent hover:border-white/5 active:scale-[0.98] cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#BE95C4] group-hover:bg-[#E0B1CB]/10 group-hover:text-[#E0B1CB] group-hover:border-[#E0B1CB]/25 transition-all duration-300 shadow-sm">
          <Icon className="w-4 h-4 transition-transform group-hover:scale-110 duration-300" />
        </div>
        <span className="text-[#FDF9FC]/80 group-hover:text-[#FDF9FC] text-xs font-semibold tracking-wide transition-colors duration-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-[#E0B1CB] text-[#140E26] text-[8px] font-extrabold px-2 py-0.5 rounded-full shadow-lg shadow-[#E0B1CB]/15">
            {badge}
          </span>
        )}
        {external && (
          <ExternalLink className="w-3.5 h-3.5 text-[#BE95C4]/40 group-hover:text-[#E0B1CB] transition-colors" />
        )}
      </div>
    </button>
  );
}
