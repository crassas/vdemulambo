import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Sparkles, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, Crown, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginPage({ selectedRole: initialRole = 'cliente', onBack }: { selectedRole?: 'cliente' | 'admin', onBack?: () => void }) {
  const [role, setRole] = useState<'cliente' | 'admin'>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleQuickLogin = (targetRole: 'admin' | 'cliente') => {
    setIsLoading(true);
    const dummyProfile = {
      uid: targetRole === 'admin' ? 'admin-123' : 'client-123',
      email: targetRole === 'admin' ? 'veusdemulambo@gmail.com' : 'cliente@veusdemulambo.com',
      nome: targetRole === 'admin' ? 'Krys Ty Oya' : 'Visitante Convidado',
      role: targetRole,
      fotoPerfil: targetRole === 'admin' ? '/images/avatar.png' : null
    };
    localStorage.setItem('dummyUser', JSON.stringify(dummyProfile));
    toast.success(`A entrar como ${targetRole === 'admin' ? 'Krys Ty Oya' : 'Visitante'}...`);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Default demo credentials shortcut
    if (email === 'veusdemulambo@gmail.com' && password === 'mentora123') {
      handleQuickLogin('admin');
      return;
    }
    if (email === 'cliente@veusdemulambo.com' && password === 'cliente123') {
      handleQuickLogin('cliente');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Sessão iniciada com sucesso!');
    } catch (err: any) {
      setError('Credenciais incorretas. Verifique os dados ou utilize o acesso direto em baixo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090612] flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-[#E0B1CB]/30 selection:text-white">
      {/* Background ambient ethereal lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#9F86C0]/25 via-[#E0B1CB]/15 to-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none opacity-60" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#C5A059]/15 rounded-full blur-[120px] pointer-events-none opacity-40" />
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#9F86C0]/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Main Card with Premium Depth */}
        <div className="bg-gradient-to-b from-[#140E26]/95 via-[#110B22]/90 to-[#0C0A14]/98 backdrop-blur-[32px] border border-white/10 rounded-[44px] p-7 sm:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden group">
          
          {/* Grain Overlay for Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          {/* Subtle Top Inner Glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E0B1CB]/40 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#E0B1CB]/5 to-transparent pointer-events-none" />

          {/* Emblem & Branding Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center mb-8"
          >
            <div className="relative mb-5 group/logo cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059] to-[#E0B1CB] rounded-full blur-xl opacity-40 group-hover/logo:opacity-80 transition-opacity duration-700" />
              <div className="relative w-20 h-20 rounded-full border border-white/10 bg-[#0C0A14] flex items-center justify-center shadow-inner group-hover/logo:scale-105 transition-transform duration-500">
                <div className="absolute inset-[2px] rounded-full border border-[#E0B1CB]/20" />
                <span className="font-serif text-4xl font-bold bg-gradient-to-br from-white via-cream to-[#C5A059] bg-clip-text text-transparent drop-shadow-sm">
                  V
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0B1CB]/5 border border-[#E0B1CB]/10 text-[#E0B1CB] text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#E0B1CB]/80" /> 
              <span>Portal Privado</span>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-4xl text-cream tracking-tight mb-2 drop-shadow-md">
              Véus de Mulambo
            </h1>
            <p className="text-xs sm:text-[13px] text-muted-foreground/80 leading-relaxed max-w-[280px] font-medium">
              Sintonize com a sua jornada espiritual através do nosso portal de acompanhamento.
            </p>
          </motion.div>

          {/* Role Selector Tabs with Layout Animation */}
          <div className="p-1 rounded-[22px] bg-black/40 border border-white/5 flex mb-8 relative">
            <button
              type="button"
              onClick={() => setRole('cliente')}
              className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2.5 cursor-pointer relative z-10 ${
                role === 'cliente' ? 'text-[#140E26]' : 'text-muted-foreground hover:text-cream'
              }`}
            >
              {role === 'cliente' && (
                <motion.div 
                  layoutId="rolePill"
                  className="absolute inset-0 bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] rounded-[18px] shadow-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <UserCheck className={`w-4 h-4 relative z-10 ${role === 'cliente' ? 'text-[#140E26]' : 'text-muted-foreground'}`} />
              <span className="relative z-10">Visitante</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2.5 cursor-pointer relative z-10 ${
                role === 'admin' ? 'text-[#140E26]' : 'text-muted-foreground hover:text-cream'
              }`}
            >
              {role === 'admin' && (
                <motion.div 
                  layoutId="rolePill"
                  className="absolute inset-0 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] rounded-[18px] shadow-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Crown className={`w-4 h-4 relative z-10 ${role === 'admin' ? 'text-[#140E26]' : 'text-muted-foreground'}`} />
              <span className="relative z-10">Krys</span>
            </button>
          </div>

          {/* Credentials Form */}
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleEmailLogin} 
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-[10px] text-[#E0B1CB]/80 uppercase tracking-[0.2em] font-black block ml-1">
                Identidade Digital
              </label>
              <div className="relative flex items-center group/input">
                <Mail className="absolute left-5 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within/input:text-[#E0B1CB] transition-colors duration-300" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder={role === 'admin' ? "kris@veusdemulambo.pt" : "seu.email@exemplo.com"}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-cream text-sm placeholder:text-muted-foreground/40 outline-none focus:border-[#E0B1CB]/40 focus:ring-4 focus:ring-[#E0B1CB]/5 transition-all duration-300 shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] text-[#E0B1CB]/80 uppercase tracking-[0.2em] font-black block">
                  Segredo de Acesso
                </label>
              </div>
              <div className="relative flex items-center group/input">
                <Lock className="absolute left-5 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within/input:text-[#E0B1CB] transition-colors duration-300" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-cream text-sm placeholder:text-muted-foreground/40 outline-none focus:border-[#E0B1CB]/40 focus:ring-4 focus:ring-[#E0B1CB]/5 transition-all duration-300 shadow-inner"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 text-muted-foreground/60 hover:text-cream transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, brightness: 1.1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-gradient-to-r from-[#C5A059] via-[#9F86C0] to-[#E0B1CB] text-[#140E26] font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_15px_40px_-10px_rgba(197,160,89,0.4)] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 mt-4 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              
              {isLoading ? (
                <div className="w-5 h-5 border-[3px] border-[#140E26]/20 border-t-[#140E26] rounded-full animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">{role === 'admin' ? 'Iniciar Mentoria' : 'Aceder ao Portal'}</span>
                  <ArrowRight className="w-4.5 h-4.5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Error Feedback */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-[11px] flex items-start gap-3 leading-relaxed font-medium">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Access Grid - Refined */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 pt-8 border-t border-white/5"
          >
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E0B1CB]/70">
                Atalhos de Acesso
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-[#E0B1CB]/40" />
                <div className="w-1 h-1 rounded-full bg-[#E0B1CB]/20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('cliente')}
                className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-[#E0B1CB]/30 text-left transition-all group cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-[#9F86C0]/10 flex items-center justify-center text-[#9F86C0] group-hover:scale-110 transition-transform">
                    <UserCheck className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[9px] text-emerald-400 font-black bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    SESSÃO
                  </span>
                </div>
                <span className="text-xs font-black text-cream group-hover:text-[#E0B1CB] transition-colors relative z-10">
                  Visitante
                </span>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#9F86C0]/5 blur-2xl rounded-full group-hover:bg-[#9F86C0]/15 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-[#C5A059]/30 text-left transition-all group cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                    <Crown className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[9px] text-[#C5A059] font-black bg-[#C5A059]/10 px-2.5 py-1 rounded-full border border-[#C5A059]/20">
                    ADM
                  </span>
                </div>
                <span className="text-xs font-black text-cream group-hover:text-[#C5A059] transition-colors relative z-10">
                  Krys Ty Oya
                </span>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[#C5A059]/5 blur-2xl rounded-full group-hover:bg-[#C5A059]/15 transition-colors" />
              </button>
            </div>
          </motion.div>

          {/* Footer with High-End Detailing */}
          <div className="mt-8 pt-5 text-center border-t border-white/5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 text-[9px] text-muted-foreground font-bold tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
              <span>SESSÃO ENCRIPTADA • SERVIDOR SEGURO</span>
            </div>
          </div>

          {onBack && (
            <button 
              type="button"
              onClick={onBack} 
              className="w-full mt-6 text-center text-[10px] text-muted-foreground/60 hover:text-cream transition-all cursor-pointer font-black uppercase tracking-[0.2em] hover:tracking-[0.25em]"
            >
              ← Voltar ao Início
            </button>
          )}

        </div>
      </motion.div>
    </div>
  );
}

