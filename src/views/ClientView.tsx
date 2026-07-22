import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Moon, Send, Clock, Check, Video, Star, Zap, Heart, Flame, User, MessageCircle, Phone, Instagram, ShieldCheck, Calendar, X, Compass, Bell } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { ExpandableSection } from '../components/ExpandableSection';
import { CartaDoDiaView } from './CartaDoDiaView';
import { ServicosView } from './ServicosView';
import { MentorProfileView } from './MentorProfileView';
import { TrabalhosView } from './TrabalhosView';
import { UserProfile } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface ClientViewProps {
  key?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  sessionStatus: 'idle' | 'payment_pending' | 'payment_sent' | 'mentor_received' | 'in_session' | 'session_completed';
  setSessionStatus: (status: any) => void;
}

export function ClientView({ 
  activeTab,
  setActiveTab,
  userProfile,
  sessionStatus, 
  setSessionStatus 
}: ClientViewProps) {
  
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 pb-24"
          >
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(160px,auto)]">
              
              {/* Main Highlight Block (4x2) */}
              <BentoBox className="col-span-2 md:col-span-4 lg:row-span-2 group cursor-pointer overflow-hidden border-rose-500/30">
                <img 
                  src="https://images.unsplash.com/photo-1507652313656-b7af0d937086?auto=format&fit=crop&w=1200&q=80" 
                  alt="Sessão Video" 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-rose-400 mb-2">
                    <Flame className="w-4 h-4 fill-rose-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Em Destaque</span>
                  </div>
                  <h3 className="text-3xl font-serif text-slate-100">Caminhos Abertos</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-sm">Conecte-se com a abundância através do acompanhamento de Mulambo.</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-rose-600/20 backdrop-blur-md border border-rose-400/30 flex items-center justify-center group-hover:bg-rose-600/40 transition-all duration-300">
                    <Play className="w-6 h-6 text-rose-100 ml-1" fill="currentColor" />
                  </div>
                </div>
              </BentoBox>

              {/* Intuition Block (2x2) */}
              <BentoBox className="col-span-2 lg:row-span-2 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-[#0f0c1a] to-[#030305] border-white/5">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-600/10 blur-3xl rounded-full" />
                <Sparkles className="w-8 h-8 text-rose-500/20 mb-6" />
                <p className="text-xl text-slate-200 font-serif italic leading-relaxed">
                  "A intuição é o sussurro da alma."
                </p>
                <div className="mt-8 pt-6 border-t border-rose-500/10 w-full">
                  <p className="text-[10px] text-rose-400 uppercase tracking-widest font-bold">Conselho do Dia</p>
                </div>
              </BentoBox>

              {/* Small Feature: Instagram (2x1) */}
              <BentoBox 
                onClick={() => window.open('https://www.instagram.com/veus.demulambo?igsh=MTNvaW5nMWR1cDByZQ==', '_blank')}
                className="col-span-2 p-6 flex items-center justify-between group cursor-pointer hover:bg-rose-600/10 transition-all border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Instagram</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Siga o Axé</p>
                  </div>
                </div>
                <Star className="w-4 h-4 text-rose-500/20 group-hover:text-rose-400 transition-colors" />
              </BentoBox>

              {/* Small Feature: Support (2x1) */}
              <BentoBox 
                onClick={() => setActiveTab('servicos')}
                className="col-span-2 p-6 flex items-center justify-between group cursor-pointer hover:bg-rose-600/10 transition-all border-rose-500/20 bg-rose-500/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Serviços</h4>
                    <p className="text-[10px] text-rose-400/60 uppercase tracking-widest">Consultas e Mais</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                  <Sparkles className="w-4 h-4 text-rose-500/40 group-hover:text-rose-400" />
                </div>
              </BentoBox>

              {/* Mentor Profile Introduction (2x1) */}
              <BentoBox 
                onClick={() => setActiveTab('mentor_profile')}
                className="col-span-2 p-6 flex items-center justify-between group cursor-pointer hover:bg-rose-600/10 transition-all border-rose-500/10 bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-rose-500/30 group-hover:scale-110 transition-transform">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Mentora" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">A Mentora</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Perfil da Mentora</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                  <Star className="w-4 h-4 text-rose-300/40 group-hover:text-rose-300" />
                </div>
              </BentoBox>

              {/* Featured Services Section in Grid */}
              <div className="col-span-2 md:col-span-4 lg:col-span-6 mt-4">
                <HorizontalCarousel title="Serviços & Trabalhos">
                  <SessaoCard 
                    image="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80"
                    title="Trabalho do Amor"
                    duration="3 Dias"
                    icon={<Heart className="w-4 h-4 text-red-500" />}
                  />
                  <SessaoCard 
                    image="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80"
                    title="Limpeza Energética"
                    duration="7 Dias"
                    icon={<Zap className="w-4 h-4 text-indigo-400" />}
                  />
                  <SessaoCard 
                    image="https://images.unsplash.com/photo-1534062633719-75ea751d3824?auto=format&fit=crop&w=400&q=80"
                    title="Prosperidade"
                    duration="5 Dias"
                    icon={<Star className="w-4 h-4 text-yellow-500" />}
                  />
                </HorizontalCarousel>
              </div>

            </div>
          </motion.div>
        );
      case 'consultas':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pb-24"
          >
            {/* Consultations Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(140px,auto)]">
              
              {/* Main Booking Block (Large 4x2) */}
              <BentoBox className="col-span-2 md:col-span-4 row-span-2 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border-rose-500/30">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />
                <div className="mb-6 p-4 rounded-full bg-rose-500/10 border border-rose-500/20">
                  <Video className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="font-serif text-3xl text-slate-100 mb-2">Sessão de Orientação</h3>
                
                {sessionStatus === 'idle' && (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full max-w-md">
                    <p className="text-xs text-slate-400 mb-6 max-w-sm">Bem-vinda(o). Escolha um dos horários disponíveis para a sua jornada de 45 min.</p>
                    
                    <div className="w-full space-y-3 mb-6 text-left">
                      <p className="text-[10px] text-rose-400 uppercase tracking-widest font-bold px-2">Horários para Hoje</p>
                      
                      <button 
                        onClick={() => {
                          toast.success('Pedido enviado para a Mentora Mulambo!');
                          setTimeout(() => {
                            toast('A Mentora aceitou o seu pedido.', { icon: '✨' });
                            setSessionStatus('payment_pending');
                          }, 3000);
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-rose-400" />
                          <span className="text-slate-200 font-medium">18:00</span>
                        </div>
                        <span className="text-xs text-rose-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Pedir Marcação</span>
                      </button>

                      <button 
                        onClick={() => {
                          toast.success('Pedido enviado para a Mentora Mulambo!');
                          setTimeout(() => {
                            toast('A Mentora aceitou o seu pedido.', { icon: '✨' });
                            setSessionStatus('payment_pending');
                          }, 3000);
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-rose-400" />
                          <span className="text-slate-200 font-medium">19:00</span>
                        </div>
                        <span className="text-xs text-rose-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Pedir Marcação</span>
                      </button>
                    </div>
                  </div>
                )}

                {sessionStatus === 'payment_pending' && (
                  <div className="flex flex-col items-center animate-in fade-in duration-500 w-full max-w-sm">
                    <p className="text-slate-300 mb-4">Envie <strong className="text-rose-400">45.00 €</strong> via MB Way para:</p>
                    <div className="w-full font-mono text-2xl tracking-[0.2em] text-slate-100 mb-8 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 flex items-center justify-center gap-3">
                       <span className="text-rose-500/50">912</span> 345 <span className="text-rose-500/50">678</span>
                    </div>
                    <button 
                      onClick={() => {
                        toast.success('Confirmação enviada!');
                        setSessionStatus('payment_sent');
                        setTimeout(() => {
                          toast.success('A Mentora confirmou o pagamento.', { icon: '💰' });
                          setSessionStatus('mentor_received');
                        }, 3000);
                      }}
                      className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 font-medium transition-colors border border-white/10 flex items-center justify-center gap-3"
                    >
                      <Send className="w-4 h-4 text-rose-400" /> Já enviei
                    </button>
                  </div>
                )}

                {sessionStatus === 'payment_sent' && (
                  <div className="flex flex-col items-center animate-in fade-in duration-500">
                    <span className="relative flex h-16 w-16 mb-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-30"></span>
                      <span className="relative inline-flex rounded-full h-16 w-16 bg-rose-500/20 border border-rose-500/50 items-center justify-center">
                        <Clock className="w-7 h-7 text-rose-400" />
                      </span>
                    </span>
                    <p className="text-rose-300 font-medium text-lg">Aguardando validação da Mentora...</p>
                    <p className="text-sm text-slate-500 mt-2">Receberá uma notificação quando a sala abrir.</p>
                  </div>
                )}

                {sessionStatus === 'mentor_received' && (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-green-400 font-medium text-lg mb-8">Axé Validado. A sua sala está pronta.</p>
                    <button 
                      onClick={() => setSessionStatus('in_session')}
                      className="px-10 py-4 rounded-2xl button-mystic text-white font-medium flex items-center gap-3"
                    >
                      <Video className="w-6 h-6" /> Entrar na Consulta
                    </button>
                  </div>
                )}

                {sessionStatus === 'session_completed' && (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full max-w-sm">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                      <Star className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="font-serif text-2xl text-slate-100 mb-4 text-center">Obrigado pela tua confiança.</h3>
                    <p className="text-sm text-slate-400 mb-8 text-center leading-relaxed">
                      Se desejares, podes visitar a área de trabalhos e conhecer outros acompanhamentos disponíveis.
                    </p>
                    
                    <div className="space-y-3 w-full">
                      <button 
                        onClick={() => {
                          setSessionStatus('idle');
                          setActiveTab('trabalhos');
                        }}
                        className="w-full py-4 rounded-2xl button-mystic text-white text-[10px] font-bold uppercase tracking-widest flex justify-center"
                      >
                        Ver Trabalhos
                      </button>
                      <button 
                        onClick={() => setSessionStatus('idle')}
                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest transition-colors"
                      >
                        Talvez mais tarde
                      </button>
                    </div>
                  </div>
                )}
              </BentoBox>

              {/* Tarot Expresso (2x1) */}
              <ConsultationOption 
                title="Tarot Expresso" 
                price="15€" 
                desc="Resposta via áudio." 
                icon={<Moon className="w-5 h-5 text-indigo-400" />} 
                className="col-span-2"
              />

              {/* Preparation Guide (2x1 or span more) */}
              <BentoBox className="col-span-2 p-6 flex flex-col justify-center border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Preparação</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  "Respire fundo 3 vezes antes de entrar na sala."
                </p>
              </BentoBox>
            </div>
          </motion.div>
        );
      case 'mensagens':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pb-24"
          >
            {/* Chat Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(120px,auto)]">
              <BentoBox className="col-span-2 md:col-span-4 lg:col-span-6 row-span-3 p-0 overflow-hidden bg-gradient-to-br from-[#0f0c1a] to-[#030305] border-rose-500/10">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-slate-100">Mentora Mulambo</h3>
                      <p className="text-[10px] text-green-500 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSessionStatus('session_completed')}
                      className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center gap-2 px-4"
                    >
                      <X className="w-4 h-4" /> 
                      <span className="text-[10px] font-bold uppercase tracking-widest">Finalizar</span>
                    </button>
                    <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 transition-all border border-white/5"><Phone className="w-4 h-4" /></button>
                    <button className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 transition-all border border-white/5"><Video className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="h-[300px] p-6 flex flex-col justify-end gap-4">
                  <div className="max-w-[80%] self-start bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/10">
                    <p className="text-xs text-slate-300">O que o seu coração busca hoje?</p>
                  </div>
                </div>
                <div className="p-4 border-t border-white/5 flex items-center gap-3">
                  <input type="text" placeholder="Mensagem..." className="flex-1 bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-xs text-slate-200 focus:outline-none focus:border-rose-400" />
                  <button className="p-3 rounded-xl button-mystic text-white"><Send className="w-4 h-4" /></button>
                </div>
              </BentoBox>
            </div>
          </motion.div>
        );
      case 'rituais':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pb-24"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(160px,auto)]">
              {/* Ritual Header (4x2) */}
              <BentoBox className="col-span-2 md:col-span-4 lg:row-span-2 relative group cursor-pointer overflow-hidden border-rose-500/10">
                <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80" alt="Sessão" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030305] to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 rounded-full bg-rose-600/20 border border-rose-400/30 text-[10px] uppercase tracking-widest text-rose-200 mb-3 block w-fit">Exclusivo</span>
                  <h3 className="text-3xl font-serif text-slate-100">A Jornada de Mulambo</h3>
                  <p className="text-xs text-slate-400 mt-1">Sintonize com o seu propósito divino.</p>
                </div>
              </BentoBox>

              {/* Ritual Grid Items (2x2 or carousels integrated) */}
              <div className="col-span-2 md:col-span-4 lg:col-span-6 mt-4">
                <HorizontalCarousel title="Trabalhos Exclusivos">
                  <SessaoCard image="..." title="Abertura" duration="3 Dias" icon={<Heart className="w-4 h-4 text-red-500" />} />
                  <SessaoCard image="..." title="Sessão" duration="1 Noite" icon={<Flame className="w-4 h-4 text-orange-400" />} />
                </HorizontalCarousel>
              </div>
            </div>
          </motion.div>
        );
      case 'perfil':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
             <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <BentoBox className="md:col-span-5 lg:col-span-4 p-6 text-center flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center overflow-hidden">
                       <User className="w-10 h-10 text-rose-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#161224]" />
                  </div>
                  <h3 className="text-xl font-serif text-slate-100 mb-1">{userProfile?.nome || 'Cliente'}</h3>
                  <p className="text-[9px] text-rose-400 uppercase tracking-widest">Membro desde Julho 2024</p>
                </BentoBox>
                
                <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-fr">
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center">
                      <Calendar className="w-5 h-5 text-emerald-400 mb-2" />
                      <p className="text-2xl font-serif text-slate-100 mb-1">12</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Consultas</p>
                   </BentoBox>
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center">
                      <Flame className="w-5 h-5 text-orange-400 mb-2" />
                      <p className="text-2xl font-serif text-slate-100 mb-1">4</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Sessões</p>
                   </BentoBox>
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center">
                      <Moon className="w-5 h-5 text-rose-400 mb-2" />
                      <p className="text-2xl font-serif text-slate-100 mb-1">3</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Cartas Tiradas</p>
                   </BentoBox>
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center">
                      <Zap className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-[10px] font-bold text-slate-100 mb-1 mt-2">Nível 2</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">Iniciado</p>
                   </BentoBox>
                </div>
             </div>
             <BentoBox className="p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Avisos e Configurações</h3>
                <div className="space-y-2">
                   <button className="w-full flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors text-left">
                     <span className="text-xs text-slate-300">Alterar Dados Pessoais</span>
                     <User className="w-4 h-4 text-slate-500" />
                   </button>
                   <button className="w-full flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors text-left">
                     <span className="text-xs text-slate-300">Definições de Notificações</span>
                     <Bell className="w-4 h-4 text-slate-500" />
                   </button>
                </div>
             </BentoBox>
          </motion.div>
        );
      case 'carta_dia':
        return <CartaDoDiaView />;
      case 'servicos':
        return <ServicosView onSelectConsultation={() => setActiveTab('consultas')} />;
      case 'trabalhos':
        return <TrabalhosView />;
      case 'mentor_profile':
        return <MentorProfileView onSelectConsultation={() => setActiveTab('consultas')} />;
      case 'notificacoes':
      case 'privacidade':
      case 'oraculo':
      case 'ajuda':
      case 'configuracoes':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 glass-mystic rounded-[2rem]"
          >
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-rose-400" />
            </div>
            <h2 className="text-3xl font-serif text-slate-100 mb-4">Em Breve</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Esta secção da plataforma está a ser preparada. 
              Em breve, novas publicações serão aqui partilhadas.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'inicio': return 'Área do Cliente';
      case 'consultas': return 'Consultas';
      case 'mensagens': return 'Consulta';
      case 'perfil': return 'O Meu Perfil';
      case 'mentor_profile': return 'Sobre Mim';
      case 'servicos': return 'Consultas e Serviços';
      case 'carta_dia': return 'Carta do Dia';
      case 'notificacoes': return 'Notificações';
      case 'configuracoes': return 'Configurações';
      default: return 'Plataforma';
    }
  };

  return (
    <div className="pb-10">
      <h2 className="text-sm font-sans text-rose-400/80 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        {getTitle()}
      </h2>
      
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}

function SessaoCard({ image, title, duration, icon }: { image: string, title: string, duration: string, icon: any }) {
  return (
    <div className="w-[75vw] max-w-[240px] sm:w-[280px] shrink-0 snap-center group">
      <BentoBox className="p-0 overflow-hidden flex flex-col h-[280px]">
        <div className="h-40 relative overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] to-transparent opacity-60" />
          <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {icon}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-serif text-base text-slate-100 mb-1">{title}</h4>
          <p className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-widest">
            <Clock className="w-3 h-3" /> {duration}
          </p>
          <button className="mt-auto w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl text-[10px] font-bold tracking-widest text-rose-200 border border-rose-400/30 transition-all uppercase">
            Ver Trabalho
          </button>
        </div>
      </BentoBox>
    </div>
  );
}

function AppointmentCard({ date, time, type, status }: { date: string, time: string, type: string, status: string }) {
  return (
    <div className="w-[75vw] max-w-[240px] sm:w-[280px] shrink-0 snap-center">
      <BentoBox className="p-5 border-rose-500/10 hover:border-rose-500/30 transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <Calendar className="w-5 h-5" />
          </div>
          <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full border ${
            status === 'Confirmado' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
          }`}>
            {status}
          </span>
        </div>
        <div>
          <h4 className="text-slate-100 font-serif text-lg mb-1">{type}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span className="text-rose-400 font-bold">{date}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>{time}</span>
          </p>
        </div>
        <button className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-200 transition-all border border-white/10">
          Ver Detalhes
        </button>
      </BentoBox>
    </div>
  );
}


function QuickCard({ label, icon, onClick }: { label: string, icon: any, onClick?: () => void }) {
  return (
    <BentoBox 
      onClick={onClick}
      className="p-6 flex flex-col items-center justify-center text-center gap-3 group cursor-pointer hover:bg-rose-600/10 border-rose-500/10 hover:border-rose-500/30 transition-all"
    >
      <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
        {icon}
      </div>
      <span className="text-xs font-medium text-slate-300 tracking-wider group-hover:text-slate-100 transition-colors uppercase">{label}</span>
    </BentoBox>
  );
}

function ConsultationOption({ title, price, desc, icon, className = '' }: { title: string, price: string, desc: string, icon: any, className?: string }) {
  return (
    <BentoBox className={`p-6 flex items-center gap-6 cursor-pointer hover:bg-white/5 transition-colors group border-white/5 hover:border-rose-500/20 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-serif text-lg text-slate-100">{title}</h4>
          <span className="text-rose-400 font-medium">{price}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </BentoBox>
  );
}

function ProductCard({ title, price, finalPrice, shippingMethod, setShippingMethod }: any) {
  return (
    <BentoBox className="p-6 flex flex-col h-full bg-gradient-to-br from-[#0f0c1a] to-[#030305] border-rose-500/20">
      <div className="mb-6">
        <h3 className="font-serif text-xl mb-1 text-slate-100">{title}</h3>
        <p className="text-rose-400 text-lg font-medium">{price.toFixed(2)} €</p>
      </div>
      
      <div className="mt-auto space-y-4">
        <div className="flex bg-[#030305]/80 rounded-2xl p-1 border border-rose-500/10">
          <button 
            onClick={() => setShippingMethod('mao')}
            className={`flex-1 py-3 text-xs font-medium rounded-xl transition-all ${shippingMethod === 'mao' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Em Mão
          </button>
          <button 
            onClick={() => setShippingMethod('ctt')}
            className={`flex-1 py-3 text-xs font-medium rounded-xl transition-all ${shippingMethod === 'ctt' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            CTT (+4.50€)
          </button>
        </div>
        <button className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-2xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          Comprar • {finalPrice.toFixed(2)} €
        </button>
      </div>
    </BentoBox>
  );
}

function SimpleProductCard({ title, price }: { title: string, price: string }) {
  return (
    <BentoBox className="p-6 flex flex-col justify-between group cursor-pointer border-white/5 hover:border-rose-500/20 transition-all">
      <div>
        <div className="w-full aspect-square rounded-2xl bg-white/5 mb-4 overflow-hidden border border-white/5 group-hover:border-rose-500/10 transition-colors">
          <div className="w-full h-full flex items-center justify-center text-slate-600">
             <Sparkles className="w-8 h-8 opacity-20" />
          </div>
        </div>
        <h4 className="font-serif text-lg text-slate-200 mb-1">{title}</h4>
        <p className="text-rose-400 font-medium">{price}</p>
      </div>
      <button className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-100 transition-all border border-white/5">
        ADICIONAR AO AXÉ
      </button>
    </BentoBox>
  );
}

