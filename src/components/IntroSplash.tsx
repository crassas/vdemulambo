import React, { useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { motion } from 'motion/react';

function EtherealBackground() {
  const particles = [
    { id: 1, size: 220, top: '10%', left: '10%', delay: 0, duration: 14 },
    { id: 2, size: 260, top: '55%', left: '65%', delay: 2, duration: 18 },
    { id: 3, size: 160, top: '70%', left: '15%', delay: 4, duration: 15 },
    { id: 4, size: 200, top: '20%', left: '60%', delay: 1, duration: 16 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Soft main ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#9F86C0]/20 via-[#E0B1CB]/12 to-transparent blur-3xl" />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-tr from-[#E0B1CB]/15 to-[#C5A059]/10 blur-2xl"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
          }}
          animate={{
            y: [0, -20, 15, 0],
            x: [0, 12, -12, 0],
            opacity: [0.25, 0.55, 0.25],
            scale: [1, 1.06, 0.96, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* Very faint starry background overlay */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E0B1CB_1px,transparent_1px)] [background-size:28px_28px]" />
    </div>
  );
}

export function IntroSplash({ onDone }: { onDone: (role?: 'cliente' | 'admin') => void }) {
  const [screen, setScreen] = useState<'splash' | 'age'>('splash');
  const [ageOk, setAgeOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);

  // Splash Screen
  if (screen === 'splash') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans bg-transparent relative overflow-hidden">
        <EtherealBackground />

        <div className="relative w-36 h-36 rounded-full mb-8 p-1 bg-gradient-to-tr from-[#C5A059] via-[#E0B1CB] to-[#9F86C0] shadow-[0_12px_40px_rgba(0,0,0,0.6)] select-none group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#E0B1CB] opacity-50 blur-xl animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-[#130F22] overflow-hidden border-[3px] border-[#0C0A14] flex items-center justify-center shadow-inner">
            <img 
              src="/images/avatar.png" 
              alt="Véus de Mulambo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h1 className="font-serif font-black text-5xl sm:text-6xl text-center leading-[1.08] tracking-tight my-4 text-gold-relevo select-none">
          Véus de<br/>Mulambo
        </h1>
        
        <p className="font-serif italic text-sm text-[#E0B1CB]/90 tracking-wide mb-10 text-center max-w-xs">
          "Onde a luz do mistério revela os caminhos do destino."
        </p>

        <button
          onClick={() => setScreen('age')}
          className="btn-gold inline-flex items-center justify-center gap-3 text-sm px-8 py-4 shadow-[0_8px_25px_rgba(197,160,89,0.3)] active:scale-95 transition-all"
        >
          <span>Entrar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Age & Terms Screen
  if (screen === 'age') {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 font-sans bg-transparent relative overflow-hidden">
        <EtherealBackground />

        <div className="w-full max-w-[420px] panel-base p-8 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E0B1CB]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E1730] to-[#2D2342] border border-[#E0B1CB]/25 flex items-center justify-center mb-6 shadow-xl relative z-10">
            <Shield className="text-[#E0B1CB] w-6 h-6 drop-shadow" />
          </div>
          
          <h2 className="font-serif font-bold text-2xl text-cream m-0 leading-[1.15] mb-2">
            Confirmação de Acesso
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-[1.6] mb-6">
            Este espaço consagra temas de cartomancia, orientação e trabalhos espirituais. Acesso reservado a maiores de idade.
          </p>

          <div className="space-y-3 mb-8">
            <button 
              onClick={() => setAgeOk(!ageOk)} 
              className="flex items-center gap-3.5 w-full bg-white/[0.03] hover:bg-white/[0.06] p-3.5 rounded-xl border border-white/5 cursor-pointer text-left transition-all active:scale-[0.98]"
            >
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${ageOk ? 'bg-gradient-to-b from-[#E0B1CB] to-[#9F86C0] border-transparent shadow-[0_0_10px_rgba(224,177,203,0.4)]' : 'border-white/20 bg-transparent'}`}>
                {ageOk && <span className="text-[#0C0A14] font-bold text-xs">✓</span>}
              </span>
              <span className="text-cream text-xs sm:text-sm font-medium leading-[1.4]">Confirmo que tenho mais de 18 anos</span>
            </button>
            
            <button 
              onClick={() => setTermsOk(!termsOk)} 
              className="flex items-center gap-3.5 w-full bg-white/[0.03] hover:bg-white/[0.06] p-3.5 rounded-xl border border-white/5 cursor-pointer text-left transition-all active:scale-[0.98]"
            >
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${termsOk ? 'bg-gradient-to-b from-[#E0B1CB] to-[#9F86C0] border-transparent shadow-[0_0_10px_rgba(224,177,203,0.4)]' : 'border-white/20 bg-transparent'}`}>
                {termsOk && <span className="text-[#0C0A14] font-bold text-xs">✓</span>}
              </span>
              <span className="text-cream text-xs sm:text-sm font-medium leading-[1.4]">Li e aceito os termos de utilização do espaço</span>
            </button>
          </div>

          <button
            onClick={() => onDone()}
            disabled={!(ageOk && termsOk)}
            className="w-full btn-gold py-4 inline-flex items-center justify-center gap-2 transition-all disabled:opacity-45 disabled:pointer-events-none shadow-[0_8px_25px_rgba(197,160,89,0.3)] active:scale-98"
          >
            <span>Entrar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

