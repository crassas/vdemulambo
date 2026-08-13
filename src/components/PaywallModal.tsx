import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CreditCard, Sparkles, X, Star } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'tier1' | 'tier2';
}

export function PaywallModal({ isOpen, onClose, tier }: PaywallModalProps) {
  if (!isOpen) return null;

  const handleStripeCheckout = () => {
    // Inject real Stripe payment link here
    const checkoutUrl = tier === 'tier1' 
      ? 'https://buy.stripe.com/test_123' 
      : 'https://buy.stripe.com/test_456';
    window.open(checkoutUrl, '_blank');
  };

  const content = tier === 'tier1' ? {
    title: 'Desbloquear Leitura Detalhada',
    price: '15€',
    features: ['Leitura completa de 3 cartas', 'Análise enviada para sua conta', 'Prioridade máxima']
  } : {
    title: 'Agendar Consulta de 45 Minutos',
    price: '50€',
    features: ['Consulta ao vivo por vídeo', 'Tiragem completa (passado, presente, futuro)', 'Desbloqueio energético do campo amoroso']
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-br from-[#140E26] to-[#090612] border border-[#E0B1CB]/20 rounded-3xl p-6 shadow-2xl overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#9F86C0]/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#E0B1CB]/20 blur-[80px] rounded-full pointer-events-none" />
          
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white/90 z-10 transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9F86C0] to-[#E0B1CB] shadow-[0_0_20px_rgba(224,177,203,0.4)] flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-[#140E26]" />
            </div>
            
            <h2 className="text-2xl font-serif font-black text-cream tracking-tight mb-2 uppercase">
              {content.title}
            </h2>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cream to-[#E0B1CB] mb-6">
              {content.price}
            </div>

            <ul className="space-y-3 mb-8 w-full text-left">
              {content.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                  <Star className="w-4 h-4 text-[#C5A059] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <button 
              onClick={handleStripeCheckout}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A059] via-[#E0B1CB] to-[#9F86C0] text-[#140E26] font-black uppercase tracking-widest text-sm hover:brightness-110 shadow-lg shadow-[#E0B1CB]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Desbloquear Agora
            </button>
            <p className="text-[10px] text-white/40 mt-4 uppercase tracking-widest font-mono flex items-center gap-1 justify-center">
              <Sparkles className="w-3 h-3" /> Transação Segura por Stripe
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
