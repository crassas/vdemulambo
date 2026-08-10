import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function TrabalhosView({ onSelectChat }: { onSelectChat?: () => void }) {
  const [trabalhos, setTrabalhos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'trabalhos'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTrabalhos(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleInterest = (name: string) => {
    if (onSelectChat) {
      onSelectChat();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto space-y-8 pb-28 relative"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 text-[#E0B1CB] text-[10px] font-bold uppercase tracking-widest mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#E0B1CB]" /> Caminho Espiritual
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-cream font-bold tracking-tight">
          Trabalhos & Rituais
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Conheça os acompanhamentos e trabalhos espirituais individuais. Selecione a opção que melhor se adequa ao seu momento para pedir orientações.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-[32px] bg-white/[0.03] border border-white/10 animate-pulse p-6 flex flex-col justify-between">
              <div className="h-44 bg-white/5 rounded-2xl mb-4" />
              <div className="h-6 w-3/4 bg-white/5 rounded mb-2" />
              <div className="h-12 w-full bg-white/5 rounded mb-4" />
              <div className="h-10 w-full bg-white/5 rounded-full" />
            </div>
          ))}
        </div>
      ) : trabalhos.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] bg-white/[0.03] border border-white/10 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center text-[#E0B1CB] mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-cream mb-2">Trabalhos em Atualização</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            Novos rituais e acompanhamentos espirituais estão a ser preparados. Entre em contacto direto para esclarecer dúvidas.
          </p>
          {onSelectChat && (
            <button
              onClick={onSelectChat}
              className="px-6 py-3 bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] text-[#140E26] text-xs font-bold uppercase tracking-widest rounded-full shadow-md"
            >
              Falar com Cartomante
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabalhos.map((trabalho) => (
            <div key={trabalho.id} className="flex">
              <div className="w-full overflow-hidden flex flex-col group bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[32px] shadow-2xl hover:border-[#9F86C0]/40 transition-all duration-500">
                {trabalho.image && (
                  <div className="h-52 w-full relative overflow-hidden shrink-0">
                    <img 
                      src={trabalho.image || undefined} 
                      alt={trabalho.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090612] via-[#090612]/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-md ${
                        trabalho.available 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : 'bg-stone-800/80 text-stone-400 border-stone-700'
                      }`}>
                        {trabalho.available ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#E0B1CB] shrink-0" />
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream">{trabalho.name}</h3>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                    {trabalho.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto mb-6">
                    <div className="flex items-center gap-2 text-xs text-[#E0B1CB] font-bold uppercase tracking-wider">
                      <Clock className="w-4 h-4 shrink-0 text-[#E0B1CB]" />
                      <span>Duração: {trabalho.duration}</span>
                    </div>
                    {trabalho.instagramUrl && (
                      <a 
                        href={trabalho.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9F86C0]/10 text-[#E0B1CB] hover:bg-[#9F86C0]/25 transition-colors text-[9px] font-bold uppercase tracking-widest border border-[#9F86C0]/20"
                      >
                        Instagram
                      </a>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleInterest(trabalho.name)}
                    disabled={!trabalho.available}
                    className={`w-full flex items-center justify-center gap-2 transition-all shrink-0 font-extrabold uppercase tracking-widest text-xs py-4 rounded-2xl ${
                      trabalho.available 
                        ? "bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] cursor-pointer shadow-[0_10px_20px_rgba(159,134,192,0.25)] active:scale-95" 
                        : "bg-white/5 border border-white/10 text-muted-foreground opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <span>{trabalho.available ? 'Pedir Informações' : 'Indisponível'}</span>
                    {trabalho.available && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
