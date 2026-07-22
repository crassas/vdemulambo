import React from 'react';
import { motion } from 'motion/react';
import { Heart, TrendingUp, Compass, UserCheck, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onAction: () => void;
}

function ServiceCard({ icon: Icon, title, description, onAction }: ServiceCardProps) {
  return (
    <BentoBox className="p-6 flex flex-col h-full border-rose-500/10 hover:border-rose-500/30 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-xl text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">{description}</p>
      <button 
        onClick={onAction}
        className="w-full py-3 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-200 text-xs font-bold uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
      >
        Pedir consulta
      </button>
    </BentoBox>
  );
}

export function ServicosView({ onSelectConsultation }: { onSelectConsultation: () => void }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-12 pb-20"
    >
      {/* Header section */}
      <div className="text-center space-y-4">
        <h2 className="text-sm font-sans text-rose-400 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4" /> Sabedoria e Orientação
        </h2>
        <h1 className="font-serif text-4xl md:text-5xl text-slate-100 tracking-tight">Consultas e Serviços</h1>
        <p className="text-slate-500 italic font-serif">
          "A verdade que procuras está ao teu alcance."
        </p>
      </div>

      {/* Main Feature: Spiritual Consultation */}
      <section>
        <BentoBox className="relative overflow-hidden border-2 border-pink-500/20 bg-gradient-to-br from-rose-900/20 to-pink-900/10 shadow-2xl shadow-pink-500/5">
          {/* Decorative gold corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-pink-500/40 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-pink-500/40 rounded-br-3xl" />
          
          <div className="p-8 md:p-12 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-widest border border-pink-500/30">
                  Destaque
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400 uppercase tracking-widest font-bold">
                  <ShieldCheck className="w-3 h-3" /> Máximo Sigilo
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-100">Consulta</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Uma imersão profunda no seu campo vibracional através do baralho cigano e vidência intuitiva. Obtenha respostas claras para as suas dúvidas mais inquietantes.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Duração: ~45 min
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Via Vídeo ou Voz
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-8 rounded-[2rem] glass-mystic border border-pink-500/30 bg-pink-500/5">
              <p className="text-pink-500/60 uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Troca Energética</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-serif text-slate-100">35</span>
                <span className="text-xl font-serif text-pink-500">€</span>
              </div>
              <button 
                onClick={onSelectConsultation}
                className="mt-8 w-full py-4 rounded-2xl button-mystic text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-rose-500/20"
              >
                <MessageSquare className="w-5 h-5" /> Iniciar Agora
              </button>
            </div>
          </div>
        </BentoBox>
      </section>

      {/* Individual Service Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-500/20" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Trabalhos Específicos</h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-500/20" />
        </div>
        
        <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-[260px] sm:w-[280px] snap-center shrink-0 flex flex-col"
            >
              <ServiceCard 
                {...service} 
                onAction={onSelectConsultation}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer message */}
      <div className="pt-10 text-center opacity-40">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.5em] font-light">
          Plataforma Oficial da Mentora Mulambo
        </p>
      </div>
    </motion.div>
  );
}
