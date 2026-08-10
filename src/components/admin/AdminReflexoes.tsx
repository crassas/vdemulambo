import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Plus, Trash2, Edit2, Sparkles, Check, X } from 'lucide-react';
import { BentoBox } from '../BentoBox';

export interface Reflexao {
  id: string;
  text: string;
  date: string;
  active: boolean;
}

export function AdminReflexoes() {
  const [reflexoes, setReflexoes] = useState<Reflexao[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('reflexoes_diarias');
    if (saved) {
      setReflexoes(JSON.parse(saved));
    } else {
      // Default reflection
      setReflexoes([
        {
          id: '1',
          text: 'A intuição é o sussurro da alma.',
          date: new Date().toISOString(),
          active: true
        }
      ]);
    }
  }, []);

  const saveReflexoes = (newReflexoes: Reflexao[]) => {
    setReflexoes(newReflexoes);
    localStorage.setItem('reflexoes_diarias', JSON.stringify(newReflexoes));
  };

  const handleSave = () => {
    if (!text.trim()) return;

    if (editingId) {
      const updated = reflexoes.map(r => 
        r.id === editingId ? { ...r, text } : r
      );
      saveReflexoes(updated);
      setEditingId(null);
    } else {
      // Deactivate all others if setting a new one as active
      const updated = reflexoes.map(r => ({ ...r, active: false }));
      const newReflexao: Reflexao = {
        id: Date.now().toString(),
        text,
        date: new Date().toISOString(),
        active: true
      };
      saveReflexoes([newReflexao, ...updated]);
      setIsCreating(false);
    }
    setText('');
  };

  const handleSetEdit = (ref: Reflexao) => {
    setEditingId(ref.id);
    setText(ref.text);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const updated = reflexoes.filter(r => r.id !== id);
    saveReflexoes(updated);
  };

  const handleSetActive = (id: string) => {
    const updated = reflexoes.map(r => ({
      ...r,
      active: r.id === id
    }));
    saveReflexoes(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#9F86C0]/15 border border-[#9F86C0]/30 flex items-center justify-center text-[#E0B1CB] shadow-inner">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl text-foreground">Reflexões Diárias</h2>
            <p className="text-[10px] text-accent/60 uppercase tracking-[0.2em] font-bold">Mensagens para a Página Inicial</p>
          </div>
        </div>
        
        {!isCreating && !editingId && (
          <button 
            onClick={() => { setIsCreating(true); setText(''); }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(159,134,192,0.35)] transition-all cursor-pointer hover:scale-102 hover:brightness-110"
          >
            <Plus className="w-4 h-4" /> Nova Reflexão
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <BentoBox className="p-6 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl">
              <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                {editingId ? 'Editar Reflexão' : 'Nova Reflexão'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Mensagem</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escreva a mensagem inspiradora..."
                    className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] p-4 text-foreground focus:outline-none focus:border-[#9F86C0]/50 min-h-[120px] custom-scrollbar italic font-serif text-lg leading-relaxed placeholder:text-muted-foreground/30"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => { setIsCreating(false); setEditingId(null); setText(''); }}
                    className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-foreground transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!text.trim()}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] disabled:opacity-50 text-[#140E26] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_12px_rgba(159,134,192,0.25)]"
                  >
                    <Check className="w-4 h-4" /> Guardar
                  </button>
                </div>
              </div>
            </BentoBox>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reflexoes.map(reflexao => (
          <div key={reflexao.id} className="h-full">
            <BentoBox 
              className={`p-6 flex flex-col justify-between min-h-[220px] transition-all rounded-[28px] border duration-300 shadow-md ${
                reflexao.active 
                  ? 'border-[#9F86C0]/50 bg-gradient-to-tr from-[#9F86C0]/15 to-[#E0B1CB]/5 shadow-purple-500/5' 
                  : 'border-white/10 bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <Quote className={`w-6 h-6 ${reflexao.active ? 'text-accent' : 'text-muted-foreground/30'}`} />
                  {reflexao.active && (
                    <span className="px-3 py-1 rounded-full bg-[#E0B1CB]/20 text-[10px] text-[#E0B1CB] uppercase tracking-widest border border-[#E0B1CB]/30 flex items-center gap-1 font-bold shadow-sm">
                      <Sparkles className="w-3 h-3" /> Ativa
                    </span>
                  )}
                </div>
                <p className={`font-serif text-lg italic leading-relaxed mb-6 ${reflexao.active ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  "{reflexao.text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                  {new Date(reflexao.date).toLocaleDateString('pt-PT')}
                </span>
                <div className="flex items-center gap-2">
                  {!reflexao.active && (
                    <button 
                      onClick={() => handleSetActive(reflexao.id)}
                      className="p-2 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-muted-foreground hover:text-emerald-400 transition-all cursor-pointer"
                      title="Definir como Ativa"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleSetEdit(reflexao)}
                    className="p-2 rounded-full bg-white/5 hover:bg-[#9F86C0]/20 border border-white/10 text-muted-foreground hover:text-white transition-all cursor-pointer"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(reflexao.id)}
                    className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
                    title="Apagar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </BentoBox>
          </div>
        ))}
        {reflexoes.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground font-serif italic bg-white/[0.02] border border-white/5 rounded-[28px]">
            Nenhuma reflexão registada.
          </div>
        )}
      </div>
    </div>
  );
}
