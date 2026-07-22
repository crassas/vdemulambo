import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Edit2, Check, X, Clock, Settings2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import toast from 'react-hot-toast';

interface Request {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
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

const INITIAL_TRABALHOS: Trabalho[] = [
  {
    id: '1',
    name: 'Abertura de Caminhos',
    description: 'Acompanhamento focado em desbloquear áreas da vida que se encontram estagnadas, seja no campo profissional, amoroso ou financeiro.',
    image: 'https://images.unsplash.com/photo-1603539947678-cd3954edcb15?auto=format&fit=crop&w=400&q=80',
    instagramUrl: 'https://www.instagram.com/reel/DXl_kYiE8B3/?igsh=aXIwbzRoYnNhamJ3',
    duration: '7 dias',
    availableDays: 14,
    acceptsRequests: true,
    active: true,
    customMessage: 'Acompanhamento diário via WhatsApp.',
    requests: [
      { id: 'req1', clientId: 'c1', clientName: 'Ana Silva', status: 'pending', date: 'Hoje, 10:30' },
      { id: 'req2', clientId: 'c2', clientName: 'João Santos', status: 'accepted', date: 'Ontem, 15:45' }
    ]
  },
  {
    id: '2',
    name: 'Limpeza Energética',
    description: 'Descarrego energético para remover negatividade, inveja e feitiços.',
    image: 'https://images.unsplash.com/photo-1550785131-0d268fc5ce0d?auto=format&fit=crop&w=400&q=80',
    instagramUrl: 'https://www.instagram.com/reel/DZ5C677z8a1/?igsh=MTZoYmpydm9zYjV6bw==',
    duration: '3 dias',
    availableDays: 7,
    acceptsRequests: true,
    active: true,
    customMessage: 'Necessário jejum nas 24h anteriores.',
    requests: [
      { id: 'req3', clientId: 'c3', clientName: 'Maria Costa', status: 'pending', date: 'Hoje, 09:15' }
    ]
  }
];

export function AdminTrabalhos() {
  const [trabalhos, setTrabalhos] = useState<Trabalho[]>(INITIAL_TRABALHOS);
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
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-xl font-serif text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-400" />
          Gestão de Trabalhos
        </h2>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white text-[10px] font-bold uppercase tracking-widest transition-colors shadow-lg shadow-rose-500/20 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Novo Trabalho
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {trabalhos.map((trabalho) => {
          const pendingCount = trabalho.requests.filter(r => r.status === 'pending').length;

          return (
          <div key={trabalho.id}>
            <BentoBox className="p-4 border-white/5 bg-white/5">
              <div className="flex flex-col md:flex-row gap-6">
              
              {/* Image & Quick Status */}
              <div className="shrink-0 w-full md:w-48 h-32 rounded-xl overflow-hidden relative border border-white/10">
                <img src={trabalho.image} alt={trabalho.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={() => toggleActive(trabalho.id)}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md transition-colors ${
                      trabalho.active 
                        ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/40' 
                        : 'bg-slate-500/30 text-slate-400 border-slate-500/50 hover:bg-slate-500/40'
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
                    <h3 className="font-serif text-lg text-slate-200">{trabalho.name}</h3>
                    {editingId !== trabalho.id ? (
                      <button 
                        onClick={() => setEditingId(trabalho.id)}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Settings2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSave(trabalho.id)}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-lg shadow-rose-500/20"
                      >
                        <Check className="w-3 h-3" /> Guardar
                      </button>
                    )}
                  </div>

                  {editingId === trabalho.id ? (
                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Dias Disponível</label>
                          <input 
                            type="number" 
                            defaultValue={trabalho.availableDays}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-slate-300 focus:border-rose-500/50 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Duração do Trabalho</label>
                          <input 
                            type="text" 
                            defaultValue={trabalho.duration}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-slate-300 focus:border-rose-500/50 outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Mensagem Personalizada</label>
                        <input 
                          type="text" 
                          defaultValue={trabalho.customMessage}
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-slate-300 focus:border-rose-500/50 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Link Instagram (Opcional)</label>
                        <input 
                          type="url" 
                          defaultValue={trabalho.instagramUrl || ''}
                          placeholder="Ex: https://instagram.com/reel/..."
                          className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm text-slate-300 focus:border-rose-500/50 outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <input 
                          type="checkbox" 
                          id={`accepts-${trabalho.id}`}
                          defaultChecked={trabalho.acceptsRequests}
                          className="w-4 h-4 rounded border-white/10 bg-black/20 text-rose-500 focus:ring-rose-500/50"
                        />
                        <label htmlFor={`accepts-${trabalho.id}`} className="text-sm text-slate-400">Aceita novos pedidos de interesse</label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-4">{trabalho.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs text-slate-300">Duração: {trabalho.duration}</span>
                        </div>
                        <button 
                          onClick={() => toggleRequests(trabalho.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
                            pendingCount > 0 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">
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
                  <div className="p-4 border-x border-b border-white/5 bg-black/20 rounded-b-2xl -mt-4 pt-8 space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Pedidos de Interesse</h4>
                    {trabalho.requests.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">Ainda não existem pedidos para este trabalho.</p>
                    ) : (
                      trabalho.requests.map(request => (
                        <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 font-serif">
                              {request.clientName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-200">{request.clientName}</p>
                              <p className="text-[10px] text-slate-500">{request.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.status === 'pending' ? (
                              <>
                                <button 
                                  onClick={() => handleRequestStatus(trabalho.id, request.id, 'accepted')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Aceitar
                                </button>
                                <button 
                                  onClick={() => handleRequestStatus(trabalho.id, request.id, 'rejected')}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Rejeitar
                                </button>
                              </>
                            ) : request.status === 'accepted' ? (
                              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <Check className="w-3 h-3" /> Aceite
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <X className="w-3 h-3" /> Rejeitado
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
