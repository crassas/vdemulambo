import { Home, Sparkles, MessageCircle, User, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'carta_dia', label: 'Carta', icon: Moon },
    { id: 'trabalhos', label: 'Trabalhos', icon: Sparkles },
    { id: 'servicos', label: 'Consultas', icon: MessageCircle },
    { id: 'mentor_profile', label: 'Mentora', icon: User },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-lg">
      <div className="glass-mystic rounded-[2.5rem] p-2 shadow-mystic-elevated flex items-center justify-around relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent pointer-events-none" />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center justify-center py-2 px-3 group transition-all"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-rose-500/10 rounded-2xl border border-rose-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>
              
              <Icon 
                className={`w-5 h-5 mb-1 transition-all duration-500 relative z-10 ${
                  isActive ? 'text-rose-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-slate-500 group-hover:text-slate-300'
                }`} 
              />
              <span 
                className={`text-[8px] uppercase tracking-widest font-bold transition-all duration-500 relative z-10 ${
                  isActive ? 'text-rose-300 opacity-100 translate-y-0' : 'text-slate-600 opacity-0 translate-y-1 group-hover:opacity-60'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
