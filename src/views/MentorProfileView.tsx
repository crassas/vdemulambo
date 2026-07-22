import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Grid, Heart, Sparkles, MessageSquare, PlaySquare, Calendar } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';

export function MentorProfileView({ onSelectConsultation }: { onSelectConsultation: () => void }) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const [expandedBio, setExpandedBio] = useState(false);

  const galleryImages = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1447069387366-5085e7d581a0?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1507652313656-b7af0d937086?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6 pb-24"
    >
      {/* Profile Header (Insta-style) */}
      <div className="pt-4 px-4 sm:px-0">
        <div className="flex items-center gap-6 sm:gap-10 mb-6">
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-rose-500/30 shrink-0 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" 
                alt="Mentora" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-serif text-xl sm:text-2xl text-slate-100">Mentora Mulambo</h2>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-slate-100">142</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Publicações</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-slate-100">5k+</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Consultas</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-slate-100">15</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Anos exp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2 mb-6 text-sm text-slate-300 leading-relaxed max-w-xl">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-3 h-3" /> Orientadora Espiritual
          </div>
          
          <div>
            <p className="font-bold text-slate-200">A ponte entre o visível e o invisível.</p>
            <p>Tarot Evolutivo • Baralho Cigano • Limpeza Energética</p>
            
            {expandedBio && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 text-slate-400"
              >
                Iniciada nas artes divinatórias desde jovem, carrego comigo a sabedoria ancestral e a intuição herdada das minhas raízes. O meu propósito é ouvir o que as cartas têm para te revelar, sem julgamentos, apenas com a clareza que necessitas para dar o próximo passo na tua jornada.
                <br/><br/>
                📍 Lisboa, Portugal 🇵🇹
              </motion.div>
            )}
            
            <button 
              onClick={() => setExpandedBio(!expandedBio)}
              className="text-rose-400 hover:text-rose-300 font-medium text-xs mt-1"
            >
              {expandedBio ? 'mostrar menos' : 'ler mais...'}
            </button>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="border-t border-white/10 flex">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${
            activeTab === 'posts' ? 'text-slate-100 border-t border-slate-100' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Grid className="w-4 h-4" /> Grelha
        </button>
        <button 
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${
            activeTab === 'reels' ? 'text-slate-100 border-t border-slate-100' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <PlaySquare className="w-4 h-4" /> Vídeos
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {activeTab === 'posts' ? (
          galleryImages.map((img, idx) => (
            <div key={idx} className="aspect-square relative group cursor-pointer overflow-hidden bg-white/5">
              <img src={img} alt={`Post ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  <span className="text-xs sm:text-sm font-bold">{Math.floor(Math.random() * 500) + 50}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          [galleryImages[3], galleryImages[4]].map((img, idx) => (
             <div key={idx} className="aspect-[9/16] relative group cursor-pointer overflow-hidden bg-white/5">
              <img src={img} alt={`Reel ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2">
                <PlaySquare className="w-5 h-5 text-white" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Actions / Contacts */}
      <div className="flex gap-3 px-4 sm:px-0">
        <button 
          onClick={onSelectConsultation}
          className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
        >
          <Calendar className="w-4 h-4" /> Marcar Consulta
        </button>
        <button 
          onClick={onSelectConsultation}
          className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" /> Mensagem
        </button>
      </div>

    </motion.div>
  );
}
