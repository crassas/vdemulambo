const fs = require('fs');
let code = fs.readFileSync('src/views/CartaDoDiaView.tsx', 'utf8');

// Add isRevealed state
code = code.replace(/const \[loading, setLoading\] = useState\(true\);/, `const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);`);

// Replace the return block to include tap to reveal
let returnIdx = code.indexOf('return (\n    <motion.div \n      initial={{ opacity: 0, y: 20 }}');
let newReturn = `return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      <div className="text-center space-y-4">
        <h2 className="eyebrow flex items-center justify-center gap-3">
          <Sparkles className="w-4 h-4" /> Oráculo Diário
        </h2>
        <h1 className="font-serif text-4xl md:text-5xl text-cream tracking-tight">Carta do Dia</h1>
        <p className="text-muted text-xs uppercase tracking-widest flex items-center justify-center gap-2">
          <Calendar className="w-3 h-3" /> {today}
        </p>
      </div>

      {!isRevealed ? (
        <div className="flex flex-col items-center justify-center pt-8">
           <motion.div
             animate={{ y: [0, -8, 0] }}
             transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
             onClick={() => setIsRevealed(true)}
             className="relative aspect-[2/3] w-full max-w-[280px] rounded-[18px] border border-gold-dim bg-panel flex flex-col items-center justify-center cursor-pointer glow-gold transition-transform hover:scale-105"
           >
             <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-4">
               <Moon className="w-8 h-8 text-gold" />
             </div>
             <p className="font-serif text-xl text-cream mb-2">A Carta de Hoje</p>
             <p className="text-xs text-gold uppercase tracking-widest font-bold">Tocar para revelar</p>
           </motion.div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center max-w-3xl mx-auto animate-fade">
          {/* Card Image */}
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="perspective-1000 w-full max-w-[280px] shrink-0"
          >
            <div className="relative group card-base p-2 bg-panel">
              <div className="relative aspect-[2/3] rounded-[12px] overflow-hidden border border-border">
                <img 
                  src={cardData.image} 
                  alt={cardData.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <span className="px-4 py-1.5 rounded-full bg-overlay text-[10px] font-bold uppercase tracking-[0.2em] text-cream border border-border backdrop-blur-md">
                    {cardData.name || 'Mensagem do Oráculo'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Meaning & Actions */}
          <div className="space-y-6 flex-1 w-full">
            <div className="card-base">
              <h3 className="font-serif text-2xl text-gold mb-4 flex items-center gap-3">
                A Mensagem
              </h3>
              <p className="text-cream leading-relaxed text-sm italic font-serif">
                "{cardData.meaning}"
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {cardData.instagramUrl && (
                <button 
                  onClick={() => window.open(cardData.instagramUrl, '_blank')}
                  className="btn-gold w-full text-[13px] uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <Instagram className="w-4 h-4" /> Ver no Instagram
                </button>
              )}
              <button onClick={() => toast.success('Link partilhado!')} className="btn-outline w-full text-[13px] uppercase tracking-widest flex items-center justify-center gap-3">
                <Share2 className="w-4 h-4" /> Partilhar Benção
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
`;

code = code.substring(0, returnIdx) + newReturn;

fs.writeFileSync('src/views/CartaDoDiaView.tsx', code);
