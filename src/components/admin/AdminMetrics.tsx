import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, MessageCircle, Clock, Moon, Sparkles, Heart, Flame, PhoneIncoming, Zap, Star, ShieldCheck } from 'lucide-react';
import { BentoBox } from '../BentoBox';

export function AdminMetrics({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  return (
    <div className="space-y-12">
      
      {/* Immersive Admin Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 mb-2">
            <Sparkles className="w-3 h-3 text-[#E0B1CB]" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#E0B1CB]">Espaço da Kris</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-cream tracking-tight">Kris Ty Oya</h1>
          <p className="text-sm text-[#BE95C4]/60 font-medium tracking-wide">Gestão das minhas conversas e acompanhamento em tempo real.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
             <p className="text-xs font-black text-cream uppercase tracking-widest">Sincronia</p>
             <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
               Ligação Activa
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Waiting Room Hero (8 cols) */}
        <BentoBox className="md:col-span-8 p-10 sm:p-14 relative overflow-hidden flex flex-col justify-center bg-[#140E26]/40 border border-white/[0.05] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] group">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-[#9F86C0]/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#9F86C0]/15 transition-all duration-1000" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
             <div className="w-20 h-20 rounded-[32px] bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] p-[1px] shadow-2xl shrink-0 group-hover:rotate-6 transition-transform duration-700">
                <div className="w-full h-full rounded-[31px] bg-[#090612] flex items-center justify-center">
                  <PhoneIncoming className="w-8 h-8 text-[#E0B1CB] animate-pulse" />
                </div>
             </div>
             
             <div className="flex-1 space-y-4 text-center md:text-left">
               <div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E0B1CB]">Quem aguarda</span>
                 <h2 className="font-serif text-3xl sm:text-4xl font-black text-cream tracking-tight mt-1">Tudo em dia</h2>
               </div>
               <p className="text-sm sm:text-base text-[#BE95C4]/60 font-medium leading-relaxed max-w-sm">
                  De momento não tens novos pedidos. As notificações de quem me procura aparecerão aqui.
               </p>
               <div className="pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab && setActiveTab('attendance')} 
                    className="px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-cream text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Ver Atendimentos Anteriores
                  </motion.button>
               </div>
             </div>
          </div>
        </BentoBox>

        {/* Quick Share / Info (4 cols) */}
        <BentoBox className="md:col-span-4 p-8 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-white/[0.03] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#9F86C0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center mb-6 shadow-inner mx-auto">
              <Moon className="w-8 h-8 text-[#9F86C0] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="font-serif text-2xl font-black text-cream tracking-tight mb-2">Carta do Dia</h3>
            <p className="text-[10px] text-[#9F86C0] font-black uppercase tracking-[0.25em] mb-6">Sincronizada com o Astral</p>
            <button 
              onClick={() => setActiveTab && setActiveTab('carta_dia')} 
              className="w-full py-4 rounded-2xl bg-[#9F86C0]/10 border border-[#9F86C0]/20 text-[#E0B1CB] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#9F86C0]/20 transition-all cursor-pointer shadow-lg"
            >
              Ver Partilha
            </button>
          </div>
        </BentoBox>
      </div>

      {/* Atomic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StudioCard icon={PhoneIncoming} label="Sessões Hoje" value="3" sub="Fluxo estável" highlight onClick={() => setActiveTab && setActiveTab('agenda')} />
        <StudioCard icon={Users} label="Meus Visitantes" value="18" sub="Pessoas activas" onClick={() => setActiveTab && setActiveTab('attendance')} />
        <StudioCard icon={MessageCircle} label="Mensagens" value="1" sub="Aguardam resposta" highlight onClick={() => setActiveTab && setActiveTab('attendance')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Appointments (7 cols) */}
        <BentoBox className="lg:col-span-7 p-10 bg-[#140E26]/20 border border-white/[0.03] shadow-2xl rounded-[40px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-black text-cream tracking-tight flex items-center gap-4">
              <div className="w-1.5 h-6 bg-[#C5A059] rounded-full" />
              Próximas Conversas
            </h3>
            <span className="text-[9px] font-black text-[#BE95C4]/40 uppercase tracking-[0.3em]">Meus Horários</span>
          </div>
          
          <div className="space-y-4">
            <Appointment name="Ana Silva" time="14:30" type="Tarot de Pombagira" onClick={() => setActiveTab && setActiveTab('agenda')} />
            <Appointment name="Maria João" time="16:00" type="Abertura de Caminhos" onClick={() => setActiveTab && setActiveTab('agenda')} />
            <Appointment name="Inês Correia" time="18:15" type="Orientação Pessoal" onClick={() => setActiveTab && setActiveTab('agenda')} />
          </div>
          
          <button 
            onClick={() => setActiveTab && setActiveTab('agenda')} 
            className="w-full mt-10 py-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[10px] text-[#BE95C4]/60 hover:text-cream hover:border-white/20 uppercase tracking-[0.3em] font-black transition-all cursor-pointer shadow-inner"
          >
            Ver Agenda Completa
          </button>
        </BentoBox>

        {/* Reminders / Philosophy (5 cols) */}
        <BentoBox className="lg:col-span-5 p-10 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] shadow-2xl rounded-[40px] group">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#C5A059]/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#C5A059]/10 transition-colors" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-black text-cream tracking-tight">A Minha Forma de Trabalhar</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="p-8 rounded-[32px] bg-[#090612]/60 backdrop-blur-3xl border border-white/10 shadow-2xl">
              <span className="text-[9px] font-black text-[#C5A059] uppercase tracking-[0.3em] mb-3 block">Valores</span>
              <p className="text-lg font-serif italic text-cream/90 leading-relaxed font-medium">"Os valores são acordados directamente comigo, preservando a proximidade do nosso momento."</p>
            </div>
            
            <div className="flex items-center gap-3 px-4">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <p className="text-[11px] text-[#BE95C4]/60 font-medium italic">
                Tudo o que partilhamos é privado e confidencial.
              </p>
            </div>
          </div>
        </BentoBox>
      </div>
    </div>
  );
}

function StudioCard({ icon: Icon, label, value, sub, highlight = false, onClick }: { icon: React.ElementType, label: string, value: string, sub: string, highlight?: boolean, onClick?: () => void }) {
  return (
    <BentoBox onClick={onClick} className={`p-8 flex flex-col gap-4 cursor-pointer border transition-all duration-500 rounded-[32px] ${highlight ? 'border-[#9F86C0]/30 bg-[#160e2e]/60 shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'border-white/[0.03] bg-white/[0.01]'}`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${highlight ? 'bg-[#9F86C0]/10 text-[#E0B1CB] border border-[#9F86C0]/20' : 'bg-white/5 text-muted-foreground/40 border border-white/5'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-[10px] text-[#BE95C4]/40 uppercase tracking-[0.3em] font-black mb-1">{label}</p>
        <p className="text-3xl font-serif font-black text-cream mb-1">{value}</p>
        <p className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-[#E0B1CB]' : 'text-muted-foreground/40'}`}>{sub}</p>
      </div>
    </BentoBox>
  );
}

function Appointment({ name, time, type, onClick }: { name: string, time: string, type: string, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-6 rounded-[28px] bg-white/[0.02] border border-white/[0.05] hover:border-white/20 transition-all cursor-pointer group shadow-sm">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#9F86C0]/10 to-[#E0B1CB]/10 border border-white/10 flex items-center justify-center text-cream font-serif text-xl font-black group-hover:from-[#9F86C0] group-hover:to-[#E0B1CB] group-hover:text-[#140E26] transition-all duration-500">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-base font-black text-cream tracking-tight">{name}</p>
          <p className="text-[11px] text-[#BE95C4]/40 font-medium uppercase tracking-widest">{type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-serif text-2xl text-cream font-black">{time}</p>
        <span className="inline-block px-2 py-0.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[9px] text-[#C5A059] font-black uppercase tracking-widest mt-1">Confirmada</span>
      </div>
    </div>
  );
}
