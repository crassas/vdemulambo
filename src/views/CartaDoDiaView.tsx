import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Calendar, Sparkles, Share2 } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';

export function CartaDoDiaView() {
  const today = new Date().toLocaleDateString('pt-PT', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Mock data for the card - in a real app this would come from a database
  const cardData = {
    name: "A Sacerdotisa",
    image: "https://images.unsplash.com/photo-1572916138171-a9881857945d?auto=format&fit=crop&w=800&q=80",
    meaning: "A Sacerdotisa representa a sabedoria intuitiva, o mistério e a compreensão profunda que reside no silêncio. Hoje, o oráculo convida-te a olhar para dentro, a confiar nos teus instintos e a observar as subtilezas do mundo ao teu redor. Não é dia de agir com pressa, mas sim de permitir que a verdade se revele no tempo certo.",
    instagramUrl: "https://www.instagram.com/veus.demulambo?igsh=MTNvaW5nMWR1cDByZQ=="
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      <div className="text-center space-y-4">
        <h2 className="text-sm font-sans text-rose-400 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4" /> Oráculo Diário
        </h2>
        <h1 className="font-serif text-4xl md:text-5xl text-slate-100 tracking-tight">Carta do Dia</h1>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          <Calendar className="w-3 h-3" /> {today}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-center justify-center max-w-3xl mx-auto">
        {/* Card Image */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="perspective-1000 w-full max-w-[280px] shrink-0"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-rose-500/20 blur-3xl rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden border-2 border-rose-500/30 shadow-2xl shadow-rose-500/20">
              <img 
                src={cardData.image} 
                alt={cardData.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b14] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <span className="px-6 py-2 rounded-full glass-mystic text-xs font-bold uppercase tracking-[0.3em] text-rose-200 border border-rose-500/30">
                  {cardData.name}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meaning & Actions */}
        <div className="space-y-8 flex-1 w-full">
          <BentoBox className="p-8 border-rose-500/10 bg-rose-500/5">
            <h3 className="font-serif text-2xl text-rose-200 mb-6 flex items-center gap-3">
              O Significado
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm italic font-serif">
              "{cardData.meaning}"
            </p>
          </BentoBox>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => window.open(cardData.instagramUrl, '_blank')}
              className="w-full py-4 rounded-2xl button-mystic text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <Instagram className="w-5 h-5" /> Ver no Instagram
            </button>
            <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-3">
              <Share2 className="w-4 h-4" /> Partilhar Benção
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
