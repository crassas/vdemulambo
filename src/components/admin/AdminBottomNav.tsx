import { BarChart3, MessageSquare, Moon, Sparkles, User } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminBottomNav({ activeTab, onTabChange }: AdminBottomNavProps) {
  const navItems = [
    { id: 'metrics', label: 'Painel', icon: BarChart3 },
    { id: 'attendance', label: 'Visitantes', icon: MessageSquare, badge: '1' },
    { id: 'carta_dia', label: 'Carta', icon: Moon },
    { id: 'trabalhos', label: 'Publicar', icon: Sparkles },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg px-safe">
      <div className="bg-[#090612]/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex justify-around items-center w-full gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl sm:rounded-full transition-all duration-200 cursor-pointer select-none active:scale-95 min-h-[46px] ${
                isActive 
                  ? "text-[#140E26] font-bold" 
                  : "text-muted-foreground/90 hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeAdminBottomTab"
                  className="absolute inset-0 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] rounded-xl sm:rounded-full shadow-[0_0_20px_rgba(224,177,203,0.4)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex flex-col items-center gap-0.5">
                <div className="relative">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse border border-[#140E26]" />
                  )}
                </div>
                <span className={`text-[8.5px] sm:text-[9.5px] leading-none tracking-[0.1em] uppercase ${isActive ? 'font-black text-[#140E26]' : 'font-bold'}`}>
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
