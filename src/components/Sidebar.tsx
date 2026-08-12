import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Calendar, Download, ExternalLink, HelpCircle, Instagram, LogOut, Moon, Settings, Shield, Sparkles, User, X } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';

interface SidebarProps { isOpen: boolean; onClose: () => void; userProfile: UserProfile | null; setActiveTab: (tab: string) => void; }

export function Sidebar({ isOpen, onClose, userProfile, setActiveTab }: SidebarProps) {
  const navigate = (tab: string) => { setActiveTab(tab); onClose(); };
  const logout = async () => { await signOut(auth); onClose(); window.location.reload(); };

  return <AnimatePresence>{isOpen && <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[60] bg-[#04020a]/90 backdrop-blur-lg" />
    <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed inset-y-0 left-0 z-[70] w-76 sm:w-84 bg-gradient-to-b from-[#0e0a20] via-[#090612] to-[#040308] border-r border-white/10 rounded-r-[2.2rem] flex flex-col overflow-hidden">
      <header className="p-6 border-b border-white/5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/30 overflow-hidden flex items-center justify-center">{userProfile?.fotoPerfil ? <img src={userProfile.fotoPerfil} alt="Avatar" className="w-full h-full object-cover" /> : <User className="text-[#E0B1CB]" />}</div>
        <div className="flex-1"><h2 className="font-serif text-lg text-cream font-bold">{userProfile?.nome || 'Visitante'}</h2><p className="text-[9px] uppercase tracking-widest text-[#E0B1CB]">Área do cliente</p></div>
        <button onClick={onClose} aria-label="Fechar menu" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center cursor-pointer"><X className="w-4 h-4" /></button>
      </header>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <MenuSection title="Conta"><MenuItem icon={User} label="O Meu Perfil" onClick={() => navigate('perfil')} /><MenuItem icon={Bell} label="Notificações" onClick={() => navigate('notificacoes')} /><MenuItem icon={Shield} label="Privacidade & Segurança" onClick={() => navigate('privacidade')} /></MenuSection>
        <MenuSection title="Conteúdo"><MenuItem icon={Sparkles} label="Publicações & Trabalhos" onClick={() => navigate('trabalhos')} /><MenuItem icon={Calendar} label="Consultas & Atendimentos" onClick={() => navigate('servicos')} /><MenuItem icon={User} label="Sobre Kris Ty Oya" onClick={() => navigate('mentor_profile')} /></MenuSection>
        <button onClick={() => navigate('carta_dia')} className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#9F86C0]/20 to-[#E0B1CB]/10 border border-[#E0B1CB]/30 flex items-center gap-3 cursor-pointer"><Sparkles className="w-5 h-5 text-[#E0B1CB]" /><span className="font-serif text-cream font-bold">Carta do Dia</span><Moon className="w-4 h-4 text-[#E0B1CB] ml-auto" /></button>
        <MenuSection title="Suporte"><MenuItem icon={Settings} label="Configurações do App" onClick={() => navigate('configuracoes')} /><MenuItem icon={HelpCircle} label="Apoio & FAQs" onClick={() => navigate('ajuda')} />{'serviceWorker' in navigator && <MenuItem icon={Download} label="Instalar Aplicação / PWA" onClick={() => navigate('configuracoes')} />}</MenuSection>
        <MenuSection title="Social"><MenuItem icon={Instagram} label="Instagram da Kris" external onClick={() => window.open('https://www.instagram.com/veus.demulambo', '_blank', 'noopener,noreferrer')} /></MenuSection>
      </div>
      <footer className="p-5 border-t border-white/5"><button onClick={logout} className="w-full py-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-400 flex items-center justify-center gap-2 cursor-pointer"><LogOut className="w-4 h-4" /> Terminar sessão</button></footer>
    </motion.aside>
  </>}</AnimatePresence>;
}

function MenuSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="space-y-2"><h3 className="px-2 text-[9px] text-[#E0B1CB]/70 uppercase tracking-[0.22em] font-extrabold">{title}</h3><div className="space-y-1">{children}</div></section>; }
function MenuItem({ icon: Icon, label, onClick, external }: { icon: React.ElementType; label: string; onClick: () => void; external?: boolean }) { return <button onClick={onClick} className="w-full p-3 rounded-2xl hover:bg-white/[0.04] flex items-center gap-3 text-left cursor-pointer"><span className="w-8 h-8 rounded-xl bg-white/[0.03] flex items-center justify-center"><Icon className="w-4 h-4 text-[#BE95C4]" /></span><span className="text-xs text-cream/80 font-semibold">{label}</span>{external && <ExternalLink className="w-3 h-3 ml-auto text-[#BE95C4]" />}</button>; }
