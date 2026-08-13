import { Home, Sparkles, User, Moon, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'carta_dia', label: 'Carta', icon: Moon },
    { id: 'trabalhos', label: 'Trabalhos', icon: Sparkles },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'mentor_profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-lg px-safe">
      <div className="bg-[#090612]/60 backdrop-blur-[40px] border border-white/[0.12] rounded-full p-2.5 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9),inset_0_1px_3px_rgba(255,255,255,0.2)] flex justify-around items-center w-full gap-2 relative overflow-hidden magic-noise">
        {/* Subtle glass reflection effect */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70" />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center flex-1 py-2.5 px-1 rounded-2xl transition-all duration-300 cursor-pointer select-none active:scale-95 min-h-[46px] ${isActive
                  ? "text-[#140E26]"
                  : "text-muted-foreground/90 hover:text-[#E0B1CB]"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute inset-0 bg-gradient-to-tr from-[#C5A059] via-[#E0B1CB] to-[#9F86C0] rounded-2xl shadow-[0_10px_25px_rgba(197,160,89,0.3)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex flex-col items-center gap-1">
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'scale-100 opacity-80'}`} />
                <span className={`text-[9px] uppercase tracking-[0.15em] leading-none ${isActive ? 'font-black' : 'font-bold'}`}>
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
