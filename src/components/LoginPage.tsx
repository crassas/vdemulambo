import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sparkles, Mail, Lock, ShieldCheck, Flame, Smartphone } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword } from 'firebase/auth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn("Popup blocked or failed, trying redirect...", err);
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectErr: any) {
        setError('Erro ao entrar com Google. Tente usar as contas de acesso rápido abaixo.');
        setIsLoading(false);
      }
    }
  };

  const handleQuickLogin = (role: 'admin' | 'cliente') => {
    const dummyProfile = role === 'admin' 
      ? { uid: 'dummy-admin', nome: 'Mentora O Altar', email: 'mentora@altar.com', role: 'admin' }
      : { uid: 'dummy-cliente', nome: 'Cliente Teste', email: 'cliente@altar.com', role: 'cliente' };
    localStorage.setItem('dummyUser', JSON.stringify(dummyProfile));
    window.location.reload();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (email === 'mentora@altar.com' && password === 'mentora123') {
      handleQuickLogin('admin');
      return;
    }
    if (email === 'cliente@altar.com' && password === 'cliente123') {
      handleQuickLogin('cliente');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Credenciais inválidas. Verifique os seus dados ou utilize o acesso rápido para iPhone.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-mystic-bg flex items-center justify-center p-6 overflow-hidden">
      {/* Mystical Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="w-20 h-20 button-mystic rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-rose-400/20"
          >
            <Moon className="w-10 h-10 text-white" fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl font-serif text-slate-100 tracking-wider mb-2">Véus de Mulambo</h1>
          <p className="text-rose-400/80 uppercase tracking-[0.3em] text-[10px] font-medium flex items-center justify-center gap-2">
            <Flame className="w-3 h-3" />
            A sua plataforma de acompanhamento
            <Flame className="w-3 h-3" />
          </p>
        </div>

        <div className="glass-mystic rounded-[2rem] p-8 shadow-mystic relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-20" />
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 font-bold">Email de Acesso</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-slate-200 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1 font-bold">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-slate-200 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 button-mystic disabled:opacity-50 text-white rounded-2xl font-bold mt-2"
            >
              {isLoading ? 'Conectando...' : 'Entrar na Plataforma'}
            </button>
          </form>

          
          {/* TEST ACCOUNTS INFO & 1-CLICK MOBILE BUTTONS */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-3">
             <div className="flex items-center justify-between border-b border-white/5 pb-2">
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Acesso Rápido (iPhone / Mobile)</p>
               <Smartphone className="w-4 h-4 text-pink-400" />
             </div>
             <div className="grid grid-cols-2 gap-2 pt-1">
               <button
                 onClick={() => handleQuickLogin('admin')}
                 className="py-2.5 px-3 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-1.5"
               >
                 ✨ Entrar Mentora
               </button>
               <button
                 onClick={() => handleQuickLogin('cliente')}
                 className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-1.5"
               >
                 🌿 Entrar Cliente
               </button>
             </div>
             <div className="text-[10px] text-slate-500 text-center pt-1 italic">
               Caso prefira, use: mentora@altar.com / mentora123
             </div>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
              <span className="bg-[#161224]/80 px-4 text-slate-500 backdrop-blur-sm rounded-full">Ou através de</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-white/5"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Entrar com Google
          </button>

          {/* Admin Hint - only visible if they start typing the admin email */}
          {email.toLowerCase().includes('beentoowell') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center"
            >
              <p className="text-[10px] text-rose-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Acesso de Mentora Detetado
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs text-center mt-6"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3 text-rose-500/50" />
            Plataforma Oficial
          </p>
        </div>
      </motion.div>
    </div>
  );
}
