import React from 'react';
import { Sparkles } from 'lucide-react';

export function DecksSection({ 
  onSelectConsultation,
  title = "Minhas Cartas & Leitura",
  subtitle = "",
  className = ""
}: { 
  onSelectConsultation?: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const tools = [
    "Baralho Cigano",
    "Tarot de Pombagira",
    "Sibila Italiana",
    "Acompanhamento Pessoal",
    "Proteção & Limpeza"
  ];

  return (
    <div className={`w-full py-8 border-t border-white/5 ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E0B1CB]/5 border border-[#E0B1CB]/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#E0B1CB]" />
          </div>
          <h4 className="font-serif text-lg font-black text-cream tracking-tight">{title}</h4>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {tools.map((tool) => (
            <div 
              key={tool} 
              className="px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-[#E0B1CB]/60 hover:text-[#E0B1CB] hover:bg-[#E0B1CB]/5 hover:border-[#E0B1CB]/20 transition-all cursor-default select-none"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
