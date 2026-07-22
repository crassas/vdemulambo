import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MessageSquare, Phone, Video, CheckCircle, Clock, DollarSign, ArrowRight, Calendar, Settings2, Check, X, Plus } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  status: 'pending' | 'paid' | 'completed';
  sent: boolean;
  received: boolean;
  avatar?: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Ana Silva', lastMessage: 'Gostaria de saber mais sobre o trabalho...', time: '10:45', status: 'paid', sent: true, received: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
  { id: '2', name: 'Maria Santos', lastMessage: 'Obrigada pela orientação de ontem.', time: 'Ontem', status: 'completed', sent: true, received: true, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
  { id: '3', name: 'Ricardo Pereira', lastMessage: 'Aguardo a confirmação do MB Way.', time: '2h atrás', status: 'pending', sent: false, received: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
  { id: '4', name: 'Sofia Costa', lastMessage: 'Qual é o melhor horário para hoje?', time: '5 min', status: 'paid', sent: true, received: false },
];

export function AdminAttendance({ onStartSession }: { onStartSession?: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'inbox' | 'agenda'>('inbox');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<number[]>([1, 2]);
  const [slots, setSlots] = useState<{time: string, reserved: boolean}[]>([
    { time: '18:00', reserved: false },
    { time: '19:00', reserved: false },
    { time: '21:00', reserved: true },
  ]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');

  const handleStartVideo = (name: string) => {
    toast(`A iniciar videochamada com ${name}...`, { icon: '📹' });
    if (onStartSession) onStartSession();
  };
  
  const handleStartCall = (name: string) => {
    toast(`A iniciar chamada de voz com ${name}...`, { icon: '📞' });
  };

  const handleAcceptRequest = (id: number) => {
    setPendingRequests(prev => prev.filter(reqId => reqId !== id));
    toast.success('Pedido aceite. O cliente foi notificado.');
  };

  const handleRejectRequest = (id: number) => {
    setPendingRequests(prev => prev.filter(reqId => reqId !== id));
    toast.error('Pedido recusado.');
  };

  const handleReceivedPayment = (name: string) => {
    toast.success(`Pagamento de ${name} confirmado! Chat desbloqueado.`);
  };

  const handleAddSlot = () => {
    if (newSlotTime.trim() === '') return;
    setSlots(prev => [...prev, { time: newSlotTime, reserved: false }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewSlotTime('');
    setIsAddingSlot(false);
    toast.success('Horário adicionado com sucesso!');
  };

  const handleRemoveSlot = (time: string) => {
    setSlots(prev => prev.filter(slot => slot.time !== time));
    toast.success('Horário removido com sucesso!');
  };

  if (activeChatId) {
    const chat = MOCK_CLIENTS.find(c => c.id === activeChatId);
    if (!chat) return null;
    
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] bg-black/20 border border-white/5 rounded-[2rem] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveChatId(null)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-pink-900/20 flex items-center justify-center border border-pink-500/20">
                {chat.avatar ? <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" /> : <span className="text-pink-500 font-serif">{chat.name[0]}</span>}
              </div>
              <div>
                <h3 className="font-medium text-slate-100">{chat.name}</h3>
                <span className="text-[10px] text-pink-500 uppercase tracking-widest">{chat.status === 'paid' ? 'Pagamento Confirmado' : chat.status === 'pending' ? 'Aguarda Pagamento' : 'Consulta Concluída'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <ActionButton icon={Phone} onClick={(e) => { e.stopPropagation(); handleStartCall(chat.name); }} />
            <ActionButton icon={Video} onClick={(e) => { e.stopPropagation(); handleStartVideo(chat.name); }} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300 relative group">
              {chat.lastMessage}
              <span className="block text-[9px] text-slate-500 mt-2">{chat.time}</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-pink-500/10 border border-pink-500/20 rounded-2xl rounded-tr-sm p-4 text-sm text-pink-100/90">
              Claro, posso ajudar com isso. Vamos agendar uma sessão?
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[9px] text-pink-500/60">Agora mesmo</span>
                <Check className="w-3 h-3 text-pink-500/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Replies */}
        <div className="px-4 pb-2 pt-4 bg-white/5 border-t border-white/10 shrink-0 flex gap-2 overflow-x-auto custom-scrollbar">
          {["Bom dia!", "Como posso ajudar?", "A sua consulta está confirmada.", "Por favor, envie o comprovativo."].map(reply => (
            <button key={reply} className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs hover:bg-pink-500/20 transition-colors">
              {reply}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 shrink-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Escreva a sua mensagem..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:border-pink-500/50 transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-pink-500 hover:bg-pink-500/20 rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col">
      {/* Top Toggle */}
      <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 w-full max-w-sm mx-auto">
        <button
          onClick={() => setView('inbox')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            view === 'inbox' 
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Caixa de Entrada
        </button>
        <button
          onClick={() => setView('agenda')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            view === 'agenda' 
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Agenda & Chamadas
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'inbox' ? (
          <motion.div 
            key="inbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col space-y-6 min-h-0"
          >
            {/* Search Header */}
            <div className="relative group shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-pink-500 transition-colors" />
              <input 
                type="text"
                placeholder="Procurar cliente ou mensagem..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/40 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Clients List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {MOCK_CLIENTS.map((client) => (
                <div key={client.id}>
                  <BentoBox 
                    className="p-4 hover:bg-white/10 cursor-pointer group border-white/5 bg-white/5 transition-all"
                    onClick={() => setActiveChatId(client.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-pink-900/20 bg-pink-900/10 flex items-center justify-center">
                        {client.avatar ? (
                          <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-serif text-pink-500">{client.name[0]}</span>
                        )}
                      </div>
                      {client.status === 'paid' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0f0c1a] flex items-center justify-center">
                          <DollarSign className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-slate-100 truncate">{client.name}</h4>
                        <span className="text-[10px] text-slate-500">{client.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 break-words line-clamp-2 group-hover:text-slate-300 transition-colors">
                        {client.lastMessage}
                      </p>
                      
                      {/* Status Indicators */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${client.sent ? 'bg-pink-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`} />
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Enviado</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${client.received ? 'bg-rose-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-slate-700'}`} />
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest">Recebido</span>
                          </div>
                        </div>
                        {client.status === 'paid' && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Pago</span>}
                        {client.status === 'pending' && <span className="text-[10px] text-pink-500 font-bold uppercase tracking-widest">Pendente</span>}
                        {client.status === 'completed' && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Concluído</span>}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <ActionButton icon={Phone} onClick={(e) => { e.stopPropagation(); handleStartCall(client.name); }} />
                      <ActionButton icon={Video} onClick={(e) => { e.stopPropagation(); handleStartVideo(client.name); }} />
                      {client.status === 'pending' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleReceivedPayment(client.name); }}
                          className="ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center"
                        >
                          Recebi
                        </button>
                      )}
                    </div>
                  </div>
                </BentoBox>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="agenda"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col space-y-6 min-h-0 overflow-y-auto custom-scrollbar pr-2"
          >
            {/* Pedidos de Consulta */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-pink-500 uppercase tracking-widest">Pedidos Pendentes</h3>
                <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-1 rounded-full font-bold">{pendingRequests.length} Novos</span>
              </div>
              <div className="space-y-3">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-6 text-slate-500">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Não há pedidos pendentes.</p>
                  </div>
                ) : (
                  pendingRequests.map(i => (
                    <div key={i}>
                      <BentoBox className="p-4 border-pink-500/20 bg-pink-500/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-pink-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-100">Novo Cliente #{i}</p>
                            <p className="text-xs text-slate-400 mt-1">Hoje às {18 + i}:00 • Consulta de Tarot</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleRejectRequest(i)}
                            className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleAcceptRequest(i)}
                            className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </BentoBox>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Gerir Horários */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-8">
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest">Meus Horários</h3>
                {!isAddingSlot ? (
                  <button 
                    onClick={() => setIsAddingSlot(true)}
                    className="flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors uppercase tracking-widest bg-pink-500/10 px-3 py-1.5 rounded-lg w-fit"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Slot
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input 
                      type="time"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500/50"
                    />
                    <button 
                      onClick={handleAddSlot}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setIsAddingSlot(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BentoBox className="p-4 bg-white/5 border-white/10">
                  <h4 className="text-sm font-medium text-slate-200 mb-3 border-b border-white/5 pb-2">Hoje</h4>
                  <div className="space-y-2">
                    {slots.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">Sem horários definidos.</p>
                    ) : (
                      slots.map((slot, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${slot.reserved ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                          <span className={`text-sm ${slot.reserved ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {slot.time} {slot.reserved ? '(Reservado)' : ''}
                          </span>
                          {slot.reserved ? (
                            <button className="text-slate-500 p-1.5 rounded-md cursor-not-allowed"><Check className="w-4 h-4" /></button>
                          ) : (
                            <button 
                              onClick={() => handleRemoveSlot(slot.time)}
                              className="text-red-400 hover:bg-red-500/20 p-1.5 rounded-md transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </BentoBox>

                <BentoBox className="p-4 bg-white/5 border-white/10 opacity-60">
                  <h4 className="text-sm font-medium text-slate-200 mb-3 border-b border-white/5 pb-2">Amanhã</h4>
                  <div className="flex flex-col items-center justify-center h-24 text-slate-500">
                    <Clock className="w-6 h-6 mb-2 opacity-50" />
                    <span className="text-xs">Nenhum horário aberto</span>
                  </div>
                </BentoBox>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({ icon: Icon, onClick }: { icon: any, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 text-slate-400 hover:text-pink-400 transition-all border border-white/5"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
