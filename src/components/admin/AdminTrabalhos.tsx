import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Edit2, Check, X, Clock, Settings2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface Request {
  id: string;
  consulenteId: string;
  consulenteName: string;
  consulenteAvatar?: string;
  status: 'pending' | 'accepted' | 'rejected';
  date: string;
}

interface Trabalho {
  id: string;
  name: string;
  description: string;
  image: string;
  instagramUrl?: string;
  duration: string;
  availableDays: number;
  acceptsRequests: boolean;
  active: boolean;
  customMessage: string;
  requests: Request[];
}



export function AdminTrabalhos() {
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);

  React.useEffect(() => {
    const q = query(collection(db, 'trabalhos'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Trabalho));
      setTrabalhos(data);
    });
    return () => unsub();
  }, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRequestsId, setExpandedRequestsId] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    setTrabalhos(trabalhos.map(t => 
      t.id === id ? { ...t, active: !t.active } : t
    ));
    toast.success('Estado atualizado.');
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    toast.success('Alterações guardadas com sucesso.');
  };

  const toggleRequests = (id: string) => {
    setExpandedRequestsId(expandedRequestsId === id ? null : id);
  };

  const handleRequestStatus = (trabalhoId: string, requestId: string, newStatus: 'accepted' | 'rejected') => {
    setTrabalhos(trabalhos.map(t => {
      if (t.id === trabalhoId) {
        return {
          ...t,
          requests: t.requests.map(r => r.id === requestId ? { ...r, status: newStatus } : r)
        };
      }
      return t;
    }));
    toast.success(newStatus === 'accepted' ? 'Pedido aceite com sucesso.' : 'Pedido rejeitado.');
  };

  return (
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col pb-12">
      <div className="flex justify-between items-center bg-white/[0.04] border border-white/10 rounded-full p-3.5 pl-6 pr-4 shadow-xl shrink-0">
        <h2 className="text-lg font-serif text-foreground flex items-center gap-2 font-bold">
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          Gestão de Trabalhos
        </h2>
        <button className="px-5 py-2.5 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(159,134,192,0.35)] cursor-pointer">
          <Sparkles className="w-4 h-4" /> Novo Trabalho
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
        {trabalhos.map((trabalho) => {
          const pendingCount = trabalho.requests.filter(r => r.status === 'pending').length;

          return (
          <div key={trabalho.id}>
            <BentoBox className="p-5 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl">
              <div className="flex flex-col md:flex-row gap-6">
              
              {/* Image & Quick Status */}
              <div className="shrink-0 w-full md:w-48 h-32 rounded-[20px] overflow-hidden relative border border-white/10">
                <img src={trabalho.image || undefined} alt={trabalho.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#090612]/40" />
                <div className="absolute top-2.5 right-2.5">
                  <button 
                    onClick={() => toggleActive(trabalho.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md transition-all cursor-pointer ${
                      trabalho.active 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/40' 
                        : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {trabalho.active ? 'Ativo' : 'Pausado'}
                  </button>
                </div>
              </div>

              {/* Details & Edit */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg text-foreground font-bold">{trabalho.name}</h3>
                    {editingId !== trabalho.id ? (
                      <button 
                        onClick={() => setEditingId(trabalho.id)}
                        className="p-2.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-accent hover:bg-white/10 transition-colors cursor-pointer shadow-sm"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSave(trabalho.id)}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> Guardar
                      </button>
                    )}
                  </div>

                  {editingId === trabalho.id ? (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-1.5">Dias Disponível</label>
                          <input 
                            type="number" 
                            defaultValue={trabalho.availableDays}
                            className="w-full bg-[#090612]/60 border border-white/10 rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-1.5">Duração do Trabalho</label>
                          <input 
                            type="text" 
                            defaultValue={trabalho.duration}
                            className="w-full bg-[#090612]/60 border border-white/10 rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-1.5">Mensagem Personalizada</label>
                        <input 
                          type="text" 
                          defaultValue={trabalho.customMessage}
                          className="w-full bg-[#090612]/60 border border-white/10 rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 transition-all outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-1.5">Link Instagram (Opcional)</label>
                        <input 
                          type="url" 
                          defaultValue={trabalho.instagramUrl || ''}
                          placeholder="Ex: https://instagram.com/reel/..."
                          className="w-full bg-[#090612]/60 border border-white/10 rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 transition-all outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2.5 mt-2">
                        <input 
                          type="checkbox" 
                          id={`accepts-${trabalho.id}`}
                          defaultChecked={trabalho.acceptsRequests}
                          className="w-4 h-4 rounded-full border border-white/20 bg-[#090612]/60 text-accent focus:ring-[#9F86C0]/50"
                        />
                        <label htmlFor={`accepts-${trabalho.id}`} className="text-sm text-muted-foreground select-none cursor-pointer">Aceita novos pedidos de interesse</label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 italic">"{trabalho.description}"</p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs text-muted-foreground">Duração: <strong className="text-foreground">{trabalho.duration}</strong></span>
                        </div>
                        <button 
                          onClick={() => toggleRequests(trabalho.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                            pendingCount > 0 
                              ? 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 glow-highlight-focus' 
                              : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">
                            {pendingCount > 0 ? `${pendingCount} Pedidos Pendentes` : 'Ver Pedidos'}
                          </span>
                          {expandedRequestsId === trabalho.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Pedidos de Interesse */}
            <AnimatePresence>
              {expandedRequestsId === trabalho.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 border-x border-b border-white/10 bg-[#090612]/60 rounded-b-[28px] -mt-4 pt-8 space-y-3.5 shadow-inner">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-2 px-1">Pedidos de Interesse</h4>
                    {trabalho.requests.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic px-1">Ainda não existem pedidos para este trabalho.</p>
                    ) : (
                      trabalho.requests.map(request => (
                        <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[20px] bg-[#090612]/50 border border-white/10 gap-3 shadow-md">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#9F86C0]/20 border border-[#9F86C0]/30 flex items-center justify-center text-accent font-serif font-bold">
                              {request.consulenteName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{request.consulenteName}</p>
                              <p className="text-[10px] text-muted-foreground">{request.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.status === 'pending' ? (
                              <>
                                <button 
                                  onClick={() => handleRequestStatus(trabalho.id, request.id, 'accepted')}
                                  className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                >
                                  <Check className="w-3.5 h-3.5" /> Aceitar
                                </button>
                                <button 
                                  onClick={() => handleRequestStatus(trabalho.id, request.id, 'rejected')}
                                  className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" /> Rejeitar
                                </button>
                              </>
                            ) : request.status === 'accepted' ? (
                              <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-inner">
                                <Check className="w-3.5 h-3.5" /> Aceite
                              </span>
                            ) : (
                              <span className="px-4 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/25 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-inner">
                                <X className="w-3.5 h-3.5" /> Rejeitado
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </BentoBox>
          </div>
          );
        })}
      </div>
    </div>
  );
}
