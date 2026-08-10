import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Clock, CheckCircle2, XCircle, Shield, Volume2, VolumeX } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface RetentionVideoProps {
  onCancel: () => void;
  onAccepted: () => void;
  mentorName?: string;
}

export function RetentionVideo({ onCancel, onAccepted, mentorName = 'Kris Ty Oya' }: RetentionVideoProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  // Real-time Firestore listener for call status across any device
  useEffect(() => {
    const callDocRef = doc(db, 'calls', 'active_session');

    const unsubscribe = onSnapshot(callDocRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.status === 'accepted') {
        setStatus('accepted');
        setTimeout(() => {
          onAccepted();
        }, 1200);
      } else if (data?.status === 'rejected') {
        setStatus('rejected');
      }
    }, (err) => {
      console.warn("Firestore listener warning:", err);
    });

    // Fallback sync with localStorage for single-browser tabs
    const handleStorageChange = () => {
      const activeCall = localStorage.getItem('active_call_status');
      if (activeCall === 'accepted') {
        setStatus('accepted');
        setTimeout(() => {
          onAccepted();
        }, 1200);
      } else if (activeCall === 'rejected') {
        setStatus('rejected');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onAccepted]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 overflow-hidden"
    >
      {/* Background Contained Video Stream */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-75 contrast-110 blur-[1px]"
          poster="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80"
        >
          {/* Free atmospheric background loop stream */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-mystical-smoke-and-lights-41553-large.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-candles-burning-in-a-dark-room-41549-large.mp4" type="video/mp4" />
        </video>
        {/* Dark atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
      </div>

      {/* Top Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-border">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <span className="text-xs font-bold uppercase tracking-widest text-foreground">
            Sala de Espera do Atendimento
          </span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-2xl bg-card/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors"
          title={isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-accent" />}
        </button>
      </div>

      {/* Central Content Box */}
      <div className="relative z-20 w-full max-w-lg bg-card/90 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6">
        {/* Mentor Avatar */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-accent/40 shadow-xl mx-auto">
            <img
              src="/images/avatar.png"
              alt={mentorName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-accent text-background flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* State Banner */}
        <AnimatePresence mode="wait">
          {status === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Pedido Enviado • A aguardar aprovação</span>
              </div>
              <h2 className="font-serif text-2xl text-foreground font-bold">
                {mentorName} está a preparar o atendimento
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Permaneça nesta sala. O seu pedido deu entrada direta no painel. Assim que {mentorName} aceitar, a videochamada abrirá automaticamente.
              </p>
            </motion.div>
          )}

          {status === 'accepted' && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Entrada Aceite por {mentorName}!</span>
              </div>
              <h2 className="font-serif text-2xl text-foreground font-bold">
                A ligar ao canal privado...
              </h2>
              <p className="text-xs text-emerald-400/90 font-medium">
                A transitar para a sala de videochamada...
              </p>
            </motion.div>
          )}

          {status === 'rejected' && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <XCircle className="w-4 h-4" />
                <span>Atendimento em curso</span>
              </div>
              <h2 className="font-serif text-xl text-foreground font-bold">
                Solicitação Reagendada
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {mentorName} solicitou um breve momento de transição. O seu lugar ficou reservado com prioridade na agenda.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span>Sessão Encriptada & Contida</span>
          </div>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
          >
            Sair da Sala
          </button>
        </div>
      </div>
    </motion.div>
  );
}
