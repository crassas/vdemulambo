import React from 'react';
import { motion } from 'motion/react';
import { Heart, TrendingUp, Compass, UserCheck, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';
import { DecksSection } from '../components/DecksSection';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onAction: () => void;
}

function ServiceCard({ icon: Icon, title, description, onAction }: ServiceCardProps) {
  return (
    <BentoBox className="p-6 flex flex-col h-full bg-white/[0.04] border border-white/10 rounded-[24px] shadow-lg hover:border-[#9F86C0]/40 transition-all">
      <div className="w-12 h-12 rounded-full bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center text-[#E0B1CB] mb-4 group-hover:scale-105 transition-transform shadow-inner">
        <Icon className="w-5 h-5 text-[#E0B1CB]" />
      </div>
      <h3 className="font-serif text-xl text-foreground mb-2 font-bold">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-6 flex-1">{description}</p>
      <button 
        onClick={onAction}
        className="w-full py-3 rounded-full bg-[#090612]/40 hover:bg-[#9F86C0]/20 text-[#E0B1CB] text-xs font-bold uppercase tracking-widest transition-all border border-white/5 hover:border-[#9F86C0]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        Pedir informações
      </button>
    </BentoBox>
  );
}

interface ServicosViewProps {
  onSelectConsultation: () => void;
  onSelectChat?: () => void;
  hasTodayAppointment?: boolean;
  todayAppointmentTime?: string;
  onOpenBookingModal?: () => void;
}

export function ServicosView({ 
  onSelectConsultation, 
  onSelectChat, 
  hasTodayAppointment, 
  todayAppointmentTime,
  onOpenBookingModal 
}: ServicosViewProps) {
  const services = [
    {
      icon: Heart,
      title: "Trabalhos de Amor",
      description: "Harmonização de laços, limpeza energética afetiva e orientação para encontrar ou fortalecer o amor."
    },
    {
      icon: TrendingUp,
      title: "Prosperidade",
      description: "Desbloqueio de energias financeiras e sessões para atrair abundância e sucesso."
    },
    {
      icon: Compass,
      title: "Abertura de Caminhos",
      description: "Remoção de obstáculos que impedem o seu progresso pessoal e profissional."
    },
    {
      icon: UserCheck,
      title: "Autoestima",
      description: "Resgate do seu poder pessoal, amor-próprio e brilho interior através de acompanhamento dedicado."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto space-y-10 pb-28"
    >
      {/* Header section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 text-[#E0B1CB] text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-[#E0B1CB]" /> Sabedoria & Orientação
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream tracking-tight font-bold">
          Consultas & Atendimentos
        </h1>
        <p className="text-muted-foreground italic font-serif text-sm max-w-md mx-auto">
          "A verdade que procuras está ao teu alcance."
        </p>
      </div>

      {/* Main Feature: Spiritual Consultation */}
      <section>
        <div className="relative overflow-hidden bg-gradient-to-br from-[#140E26]/90 via-[#1B1233]/80 to-[#0C0A14] border border-white/10 rounded-[32px] shadow-2xl p-8 md:p-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#E0B1CB]/10 via-[#9F86C0]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#E0B1CB]/20 text-[#E0B1CB] text-[10px] font-extrabold uppercase tracking-widest border border-[#E0B1CB]/30">
                  Sessão em Destaque
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Atendimento Privado e Seguro
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-cream font-bold leading-tight">
                Consulta Completa
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Um espaço acolhedor e confidencial para obter clareza sobre relacionamentos, caminhos e decisões importantes. Acompanhamento direcionado e escuta atenta.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-cream/80 text-xs font-semibold uppercase tracking-wider bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#9F86C0]" /> Duração: ~45 min
                </div>
                <div className="flex items-center gap-2 text-cream/80 text-xs font-semibold uppercase tracking-wider bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#E0B1CB]" /> Videochamada ou Áudio
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] bg-[#090612]/80 border border-white/10 shadow-2xl">
              {hasTodayAppointment ? (
                <>
                  <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/30 mb-3 animate-pulse">
                    ✨ Sessão Ativa Hoje ({todayAppointmentTime || 'Agendada'})
                  </span>
                  <p className="text-xs text-muted-foreground text-center mb-6 leading-relaxed">
                    A sua sala com Krys Ty Oya está disponível.
                  </p>
                  <button 
                    onClick={onSelectConsultation}
                    className="w-full py-4 bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-[0_10px_25px_rgba(159,134,192,0.3)] flex items-center justify-center gap-2 active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4 text-[#140E26]" /> Entrar na Consulta
                  </button>
                </>
              ) : (
                <>
                  <span className="px-3.5 py-1 rounded-full bg-[#9F86C0]/20 text-[#E0B1CB] text-[10px] font-extrabold uppercase tracking-widest border border-[#9F86C0]/30 mb-3">
                    Acesso Agendado
                  </span>
                  <p className="text-xs text-muted-foreground text-center mb-6 leading-relaxed">
                    Escolha a melhor data e hora para a sua sessão.
                  </p>
                  <button 
                    onClick={onOpenBookingModal || onSelectConsultation}
                    className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] hover:brightness-110 text-[#140E26] text-xs font-extrabold uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-[0_10px_25px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-[#140E26]" /> Agendar Agora
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Baralhos Utilizados Section */}
      <section>
        <DecksSection onSelectConsultation={onSelectConsultation} />
      </section>

      {/* Individual Service Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E0B1CB] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Acompanhamentos Específicos
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex"
            >
              <ServiceCard 
                {...service} 
                onAction={onSelectChat || onSelectConsultation}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer message */}
      <div className="pt-6 text-center opacity-50">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-medium">
          Véus de Mulambo • Krys Ty Oya
        </p>
      </div>
    </motion.div>
  );
}
