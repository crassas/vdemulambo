import { motion } from 'motion/react';
import { Calendar, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { DecksSection } from '../components/DecksSection';

interface ServicosViewProps {
  onSelectConsultation: () => void;
  hasTodayAppointment?: boolean;
  todayAppointmentTime?: string;
  upcomingAppointment?: { date: string; time?: string };
  onOpenBookingModal?: () => void;
  onViewAgenda?: () => void;
}

export function ServicosView({
  onSelectConsultation,
  hasTodayAppointment,
  todayAppointmentTime,
  upcomingAppointment,
  onOpenBookingModal,
  onViewAgenda
}: ServicosViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-10 pb-28">
      <header className="text-center space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream font-bold">Consultas & Atendimentos</h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">Marque ou acompanhe o seu atendimento com Kris Ty Oya.</p>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#140E26]/90 via-[#1B1233]/80 to-[#0C0A14] border border-white/10 rounded-[32px] shadow-2xl p-8 md:p-12">
        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-5">
            <span className="inline-flex items-center gap-2 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
              <ShieldCheck className="w-4 h-4" /> Atendimento privado e seguro
            </span>
            <h2 className="font-serif text-3xl text-cream font-bold">Consulta individual</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">Um espaço reservado para conversar, obter orientação e acompanhar as suas marcações.</p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-[28px] bg-[#090612]/80 border border-white/10">
            {hasTodayAppointment ? (
              <>
                <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest mb-3">Consulta confirmada hoje {todayAppointmentTime && `às ${todayAppointmentTime}`}</span>
                <button onClick={onSelectConsultation} className="w-full py-4 bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] text-[#140E26] text-xs font-extrabold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer">
                  <MessageSquare className="w-4 h-4" /> Entrar na Consulta
                </button>
              </>
            ) : (
              <>
                <Calendar className="w-8 h-8 text-[#E0B1CB] mb-3" />
                <p className="text-xs text-muted-foreground text-center mb-2">Não tem nenhuma consulta marcada para hoje.</p>
                {upcomingAppointment && <p className="text-xs text-[#E0B1CB] text-center mb-5">Próxima consulta: {upcomingAppointment.date}{upcomingAppointment.time ? ` às ${upcomingAppointment.time}` : ''}</p>}
                <button onClick={upcomingAppointment ? onViewAgenda : (onOpenBookingModal || onSelectConsultation)} className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] text-[#140E26] text-xs font-extrabold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer">
                  <Sparkles className="w-4 h-4" /> {upcomingAppointment ? 'Ver Agenda' : 'Marcar Consulta'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <DecksSection onSelectConsultation={onOpenBookingModal || onSelectConsultation} />
    </motion.div>
  );
}
