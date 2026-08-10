import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MessageSquare, Phone, Video, CheckCircle, Clock, DollarSign, ArrowRight, Calendar, Settings2, Check, X, Plus, FileText, Lock, Bell, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, setDoc } from 'firebase/firestore';
import { BentoBox } from '../BentoBox';

interface Consulente {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  status: 'pending' | 'paid' | 'completed';
  sent: boolean;
  received: boolean;
  avatar?: string;
  privateNotes?: string;
}



export function AdminAttendance({ onStartSession }: { onStartSession?: () => void }) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [consulentes, setConsulentes] = useState<Consulente[]>([]);
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [adminReplyText, setAdminReplyText] = useState("");

  useEffect(() => {
    const q = query(collection(db, 'messages'));
    const unsub = onSnapshot(q, (snap) => {
       const msgs = snap.docs.map(d => ({id: d.id, ...d.data()} as any));
       const uniqueConsulentes = [...new Set(msgs.map(m => m.sender || m.chatRoom))].filter(s => s && s !== 'cartomante');
       const c: Consulente[] = uniqueConsulentes.map((sender: string, i: number) => {
         const senderMsgs = msgs.filter(m => m.chatRoom === sender || m.sender === sender || m.recipient === sender);
         const sorted = senderMsgs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
         const lastMsg = sorted[0];
         return {
           id: sender,
           name: sender,
           status: i % 2 === 0 ? 'paid' : 'pending',
           lastMessage: lastMsg ? lastMsg.text : 'Mensagem espiritual',
           type: 'Dúvida',
           time: lastMsg && lastMsg.createdAt ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora',
           sent: lastMsg ? lastMsg.sender === 'cartomante' : false,
           received: lastMsg ? lastMsg.sender !== 'cartomante' : true,
           unread: 0
         };
       });
       setConsulentes(c);
    });
    return () => unsub();
  }, []);

  // Sync active chat's messages in real-time
  useEffect(() => {
    if (!activeChatId) return;
    const q = query(collection(db, 'messages'));
    const unsub = onSnapshot(q, (snap) => {
      const allMsgs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
      const filtered = allMsgs
        .filter(m => m.chatRoom === activeChatId || m.sender === activeChatId || m.recipient === activeChatId)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      setLiveMessages(filtered);
    });
    return () => unsub();
  }, [activeChatId]);

  const handleSendAdminMessage = async (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : adminReplyText;
    if (!text.trim() || !activeChatId) return;

    if (textToSend === undefined) {
      setAdminReplyText("");
    }

    try {
      await addDoc(collection(db, 'messages'), {
        chatRoom: activeChatId,
        sender: 'cartomante',
        recipient: activeChatId,
        text: text,
        createdAt: Date.now()
      });
    } catch (e) {
      console.warn("Error sending admin message:", e);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'inbox' | 'agenda'>('inbox');
  const [showNotes, setShowNotes] = useState(false);
  const [clientNotes, setClientNotes] = useState<Record<string, string>>({
    '1': 'Consulente em busca de orientação afetiva. Leitura de Tarot realizada em 12/07.',
    '2': 'Limpeza energética recomendada. Acompanhamento concluído.',
    '3': 'Aguardar validação do comprovativo MB Way.',
    '4': 'Consulta de Alinhamento Espiritual.'
  });
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);

  const [slots, setSlots] = useState<{time: string, reserved: boolean}[]>([]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');

  const handleStartVideo = (name: string) => {
    toast(`A iniciar videochamada com ${name}...`, { icon: '📹' });
    if (onStartSession) onStartSession();
  };
  
  const handleStartCall = (name: string) => {
    toast(`A iniciar chamada de voz com ${name}...`, { icon: '📞' });
  };

  const handleSaveNotes = (id: string, notes: string) => {
    setClientNotes(prev => ({ ...prev, [id]: notes }));
    toast.success('Notas privadas guardadas com sucesso!');
  };

  const handleAcceptRequest = async (id?: number) => {
    if (id) {
      setPendingRequests(prev => prev.filter(reqId => reqId !== id));
    }
    localStorage.setItem('active_call_status', 'accepted');

    try {
      await updateDoc(doc(db, 'calls', 'active_session'), {
        status: 'accepted',
        acceptedAt: Date.now()
      });
    } catch (e) {
      console.warn("Firestore update error:", e);
    }

    toast.success('Pedido aceite! A abrir canal privado de videochamada...');
    try {
      if (onStartSession) {
        await onStartSession();
      }
    } catch (err) {
      console.error("Failed to start session:", err);
      toast.error('Erro ao iniciar a sessão. Tente novamente.');
      // Restore call status so they can try again
      await updateDoc(doc(db, 'calls', 'active_session'), {
        status: 'pending'
      });
    }
  };

  const handleRejectRequest = async (id?: number) => {
    if (id) {
      setPendingRequests(prev => prev.filter(reqId => reqId !== id));
    }
    localStorage.setItem('active_call_status', 'rejected');

    try {
      await updateDoc(doc(db, 'calls', 'active_session'), {
        status: 'rejected',
        rejectedAt: Date.now()
      });
    } catch (e) {
      console.warn("Firestore update error:", e);
    }

    toast.error('Pedido recusado. Cliente notificado.');
  };

  const handleReceivedPayment = (name: string) => {
    toast.success(`Agendamento de ${name} confirmado! Chat desbloqueado.`);
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
    const chat = consulentes.find(c => c.id === activeChatId);
    if (!chat) return null;
    
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] bg-white/[0.04] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#090612]/60 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveChatId(null)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-foreground transition-all cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-[#9F86C0]/20 flex items-center justify-center border border-[#9F86C0]/30 shadow-inner">
                {chat.avatar ? <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" /> : <span className="text-accent font-serif font-bold text-lg">{chat.name[0]}</span>}
              </div>
              <div>
                <h3 className="font-serif font-bold text-foreground text-sm">{chat.name}</h3>
                <span className="text-[10px] text-accent uppercase tracking-widest font-bold">
                  {chat.status === 'paid' ? '• Consulta Confirmada' : chat.status === 'pending' ? '• Pagamento Pendente' : '• Concluída'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <ActionButton icon={Phone} onClick={(e) => { e.stopPropagation(); handleStartCall(chat.name); }} />
            <ActionButton icon={Video} onClick={(e) => { e.stopPropagation(); handleStartVideo(chat.name); }} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#090612]/20">
          {liveMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
              <MessageSquare className="w-8 h-8 text-[#9F86C0]/40 mb-3 animate-pulse" />
              <p className="text-xs font-serif italic max-w-xs">Inicie a conversa com {chat.name}. Mentalize luz e sabedoria ancestral.</p>
            </div>
          ) : (
            liveMessages.map((msg, idx) => {
              const isAdmin = msg.sender === 'cartomante';
              return (
                <div key={msg.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-[20px] p-4 text-xs sm:text-sm shadow-md border ${
                    isAdmin 
                      ? 'bg-gradient-to-tr from-[#9F86C0]/20 to-[#E0B1CB]/20 border-[#9F86C0]/30 text-foreground rounded-tr-sm' 
                      : 'border-white/10 bg-[#090612]/60 text-muted-foreground rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-1.5 mt-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[9px] text-muted-foreground/60 font-mono">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}
                      </span>
                      {isAdmin && <Check className="w-3.5 h-3.5 text-accent" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Replies */}
        <div className="px-4 pb-2.5 pt-3.5 border-t border-white/10 bg-[#090612]/60 shrink-0 flex gap-2.5 overflow-x-auto custom-scrollbar">
          {[
            "Olá! Sou a Kris Ty Oya, como posso ajudar?",
            "A sua consulta está confirmada para hoje ✨",
            "Por favor, envie o comprovativo MB Way.",
            "Deitei as cartas para a sua questão do Amor ❤️",
            "Muito axé e caminhos abertos na sua jornada! 🙏"
          ].map(reply => (
            <button 
              key={reply} 
              onClick={() => handleSendAdminMessage(reply)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-xs hover:bg-white/10 hover:border-[#9F86C0]/50 hover:text-white transition-all cursor-pointer hover:scale-102 shadow-sm"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 shrink-0 bg-[#090612]/80 border-t border-white/10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAdminMessage();
            }}
            className="relative"
          >
            <input 
              type="text" 
              value={adminReplyText}
              onChange={(e) => setAdminReplyText(e.target.value)}
              placeholder="Escreva a resposta de mentora..." 
              className="w-full bg-[#090612]/60 border border-white/10 rounded-full py-4 pl-5 pr-14 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 transition-all shadow-inner"
            />
            <button 
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 text-accent hover:bg-white/10 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col">
      {/* Top Toggle */}
      <div className="flex bg-white/[0.04] border border-white/10 rounded-full p-1.5 w-full max-w-sm mx-auto shadow-lg">
        <button
          onClick={() => setView('inbox')}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            view === 'inbox' 
              ? 'bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] shadow-[0_0_12px_rgba(159,134,192,0.35)]' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Caixa de Entrada
        </button>
        <button
          onClick={() => setView('agenda')}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            view === 'agenda' 
              ? 'bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] shadow-[0_0_12px_rgba(159,134,192,0.35)]' 
              : 'text-muted-foreground hover:text-foreground'
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
                className="flex-1 flex flex-col space-y-6 min-h-0"
          >
            {/* Search Header */}
            <div className="relative group shrink-0">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9F86C0] group-focus-within:text-white transition-colors" />
              <input 
                type="text"
                placeholder="Procurar consulente ou mensagem espiritual..."
                className="w-full bg-[#090612]/60 border border-white/10 rounded-full py-4 pl-12 pr-5 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 transition-all shadow-inner placeholder:text-muted-foreground/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Clients List */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
              {consulentes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())).map((client) => (
                <div key={client.id}>
                  <BentoBox 
                    className="p-4 bg-white/[0.04] border border-white/10 rounded-[24px] hover:border-[#9F86C0]/40 cursor-pointer group transition-all duration-300 shadow-md"
                    onClick={() => setActiveChatId(client.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-[#9F86C0]/10 flex items-center justify-center shadow-inner">
                            {client.avatar ? (
                              <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-serif text-accent font-bold">{client.name[0]}</span>
                            )}
                          </div>
                          {client.status === 'paid' && (
                            <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-md">
                              <DollarSign className="w-3.5 h-3.5 text-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-serif font-bold text-foreground truncate text-sm">{client.name}</h4>
                            <span className="text-[10px] text-muted-foreground font-mono">{client.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground break-words line-clamp-2 transition-colors pr-2">
                            {client.lastMessage}
                          </p>
                          
                          {/* Status Indicators */}
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${client.sent ? 'bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`} />
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Enviado</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${client.received ? 'bg-[#9F86C0] shadow-[0_0_8px_rgba(159,134,192,0.5)]' : 'bg-slate-700'}`} />
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Recebido</span>
                              </div>
                            </div>
                            {client.status === 'paid' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                                Pago
                              </span>
                            )}
                            {client.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-[10px] text-[#E0B1CB] font-bold uppercase tracking-widest">
                                Pendente
                              </span>
                            )}
                            {client.status === 'completed' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                Concluído
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3">
                        <ActionButton icon={Phone} onClick={(e) => { e.stopPropagation(); handleStartCall(client.name); }} />
                        <ActionButton icon={Video} onClick={(e) => { e.stopPropagation(); handleStartVideo(client.name); }} />
                        {client.status === 'pending' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleReceivedPayment(client.name); }}
                            className="px-4 py-2 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center"
                          >
                            Confirmar
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
                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em]">Pedidos Pendentes</h3>
                <span className="bg-[#9F86C0]/20 border border-[#9F86C0]/30 text-[#E0B1CB] text-xs px-3 py-1 rounded-full font-bold">{pendingRequests.length} Novos</span>
              </div>
              <div className="space-y-3.5">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-white/[0.02] border border-white/5 rounded-[24px]">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-accent" />
                    <p className="text-xs font-serif italic">Não há novos pedidos de agendamento.</p>
                  </div>
                ) : (
                  pendingRequests.map(i => (
                    <div key={i}>
                      <BentoBox className="p-4 bg-white/[0.04] border border-white/10 rounded-[24px] shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-serif font-bold text-foreground text-sm">Consulente #{i}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Hoje às {18 + i}:00 • Alinhamento Astral</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleRejectRequest(i)}
                              className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleAcceptRequest(i)}
                              className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/20 transition-all cursor-pointer"
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
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Meus Horários de Abertura</h3>
                {!isAddingSlot ? (
                  <button 
                    onClick={() => setIsAddingSlot(true)}
                    className="flex items-center gap-2 text-[10px] font-bold text-accent hover:text-white transition-all uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit hover:border-[#9F86C0]/50 cursor-pointer hover:scale-102"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Slot
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input 
                      type="time"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      className="bg-[#090612]/60 border border-white/10 rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50"
                    />
                    <button 
                      onClick={handleAddSlot}
                      className="px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setIsAddingSlot(false)}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <BentoBox className="p-5 bg-white/[0.04] border border-white/10 rounded-[24px]">
                  <h4 className="text-sm font-serif font-bold text-foreground mb-4 border-b border-white/10 pb-2">Hoje</h4>
                  <div className="space-y-2">
                    {slots.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6 font-serif italic">Nenhum horário aberto para hoje.</p>
                    ) : (
                      slots.map((slot, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl ${slot.reserved ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-white/5 border border-transparent'}`}>
                          <span className={`text-sm ${slot.reserved ? 'text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                            {slot.time} {slot.reserved ? '• Reservado' : ''}
                          </span>
                          {slot.reserved ? (
                            <button className="text-emerald-400 p-1.5 rounded-full bg-emerald-500/10 cursor-not-allowed"><Check className="w-4 h-4" /></button>
                          ) : (
                            <button 
                              onClick={() => handleRemoveSlot(slot.time)}
                              className="text-red-400 hover:bg-red-500/20 p-1.5 rounded-full transition-all cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </BentoBox>

                <BentoBox className="p-5 bg-white/[0.04] border border-white/10 rounded-[24px] opacity-60">
                  <h4 className="text-sm font-serif font-bold text-foreground mb-4 border-b border-white/10 pb-2">Amanhã</h4>
                  <div className="flex flex-col items-center justify-center h-28 text-muted-foreground">
                    <Clock className="w-6 h-6 mb-2 opacity-50 text-accent animate-pulse" />
                    <span className="text-xs font-serif italic">Nenhum horário programado</span>
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

function ActionButton({ icon: Icon, onClick }: { icon: React.ElementType, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#9F86C0]/20 text-muted-foreground hover:text-accent transition-all cursor-pointer"
    >
      <Icon className="w-4.5 h-4.5" />
    </button>
  );
}
