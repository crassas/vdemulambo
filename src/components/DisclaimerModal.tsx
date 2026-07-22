import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { BentoBox } from './BentoBox';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md"
          >
            <BentoBox className="bg-[#161224] border-rose-500/20 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                  <Info className="w-6 h-6 text-rose-400" />
                </div>
                
                <h2 className="text-xl font-serif text-slate-100 mb-2">✨ Informação importante ✨</h2>
                
                <div className="space-y-4 text-sm text-slate-300 mt-6 leading-relaxed">
                  <p>
                    Esta aplicação destina-se exclusivamente à comunicação, acompanhamento e organização das consultas.
                  </p>
                  <p className="text-rose-300 font-medium">
                    Nenhum pagamento é realizado dentro da plataforma.
                  </p>
                  <p>
                    Quaisquer contribuições ou transferências são efetuadas apenas através dos meios acordados diretamente com a mentora.
                  </p>
                  <p className="text-xs text-slate-500 italic mt-6">
                    A utilização da plataforma implica a aceitação destas condições.
                  </p>
                </div>

                <button 
                  onClick={handleAccept}
                  className="mt-8 px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20 w-full justify-center"
                >
                  <Check className="w-4 h-4" /> Compreendi
                </button>
              </div>
            </BentoBox>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
