import toast from "react-hot-toast";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Instagram, Calendar, Sparkles, Share2, Moon } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function CartaDoDiaView() {
  const [cardData, setCardData] = useState<{
    image: string;
    meaning: string;
    instagramUrl: string;
    name?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchCartaDoDia = async () => {
      try {
        const docRef = doc(db, 'settings', 'carta_dia');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCardData(docSnap.data() as any);
        } else {
          setCardData(null);
        }
      } catch (error) {
        console.error("Error fetching Carta do Dia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartaDoDia();
  }, []);

  const today = new Date().toLocaleDateString('pt-PT', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6 text-[#E0B1CB]" />
        </div>
        <p className="text-xs font-bold text-[#E0B1CB] uppercase tracking-[0.2em]">A carregar a mensagem do dia...</p>
      </div>
    );
  }

  if (!cardData) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto my-12 p-8 rounded-[28px] bg-white/[0.03] border border-white/10 text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center mb-6 mx-auto shadow-inner">
          <Moon className="w-8 h-8 text-[#E0B1CB]" />
        </div>
        <h2 className="font-serif text-2xl text-cream font-bold mb-3">Tiragem Diária em Breve</h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          A Kris Ty Oya disponibiliza a carta diariamente. Volte em breve para receber a orientação do dia.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-28"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 text-[#E0B1CB] text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Mensagem do Dia
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cream font-bold tracking-tight">
          Carta do Dia
        </h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#E0B1CB]" /> {today}
        </p>
      </div>

      {!isRevealed ? (
        <div className="flex flex-col items-center justify-center pt-4">
           <motion.div
             animate={{ y: [0, -8, 0] }}
             transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
             onClick={() => setIsRevealed(true)}
             className="relative aspect-[2/3] w-full max-w-[280px] rounded-[24px] p-1 bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 select-none"
           >
             <div className="absolute inset-1 rounded-[20px] bg-[#090612]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E1730] to-[#2D2342] border border-[#E0B1CB]/30 flex items-center justify-center mb-5 shadow-xl">
                 <Moon className="w-8 h-8 text-[#E0B1CB]" />
               </div>
               <p className="font-serif text-xl text-cream font-bold mb-2">Mensagem do Dia</p>
               <p className="text-xs text-[#C5A059] uppercase tracking-[0.2em] font-extrabold bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] bg-clip-text text-transparent">
                 Tocar para revelar
               </p>
             </div>
           </motion.div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center max-w-3xl mx-auto">
          {/* Card Image */}
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[280px] shrink-0"
          >
            <div className="relative rounded-[24px] overflow-hidden border border-white/10 shadow-2xl bg-[#090612] p-2">
              <div className="relative aspect-[2/3] rounded-[18px] overflow-hidden">
                <img 
                  src={cardData.image || undefined} 
                  alt={cardData.name || 'Carta do Dia'} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Meaning & Actions */}
          <div className="space-y-5 flex-1 w-full">
            <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/10 shadow-xl">
              <h3 className="font-serif text-2xl text-[#C5A059] font-bold mb-3 flex items-center gap-2">
                A Orientação
              </h3>
              <p className="text-cream leading-relaxed text-sm italic font-serif">
                "{cardData.meaning}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {cardData.instagramUrl && (
                <button 
                  onClick={() => window.open(cardData.instagramUrl, '_blank')}
                  className="btn-gold flex-1 py-3.5 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <Instagram className="w-4 h-4" /> Ver no Instagram
                </button>
              )}
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Carta do Dia - Véus de Mulambo', text: cardData.meaning }).catch(() => {});
                  } else {
                    toast.success('Mensagem copiada para partilha!');
                  }
                }} 
                className="py-3.5 px-6 rounded-full bg-white/5 hover:bg-white/10 text-cream border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#E0B1CB]" /> Partilhar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
