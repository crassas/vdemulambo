import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '../lib/firebase';

type AuthMode = 'login' | 'register';

function authErrorMessage(code?: string) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Já existe uma conta com este e-mail.';
    case 'auth/invalid-email':
      return 'Indique um endereço de e-mail válido.';
    case 'auth/weak-password':
      return 'A palavra-passe deve ter, pelo menos, 6 caracteres.';
    case 'auth/popup-closed-by-user':
      return 'A entrada com Google foi cancelada.';
    case 'auth/popup-blocked':
      return 'O browser bloqueou a janela do Google. Permita pop-ups e tente novamente.';
    case 'auth/unauthorized-domain':
      return 'Este endereço ainda não está autorizado no Firebase Authentication.';
    case 'auth/network-request-failed':
      return 'Não foi possível ligar ao serviço. Verifique a internet e tente novamente.';
    case 'auth/too-many-requests':
      return 'Foram feitas demasiadas tentativas. Aguarde alguns minutos.';
    default:
      return 'Não foi possível iniciar sessão. Confirme os dados e tente novamente.';
  }
}

export function LoginPage({ onBack }: { selectedRole?: 'cliente' | 'admin'; onBack?: () => void }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetFeedback = () => setError(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    resetFeedback();
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Sessão iniciada com Google.');
    } catch (err: any) {
      setError(authErrorMessage(err?.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    resetFeedback();

    try {
      if (mode === 'register') {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: name.trim() });
        toast.success('Conta criada com sucesso.');
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        toast.success('Sessão iniciada com sucesso.');
      }
    } catch (err: any) {
      setError(authErrorMessage(err?.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    resetFeedback();
    if (!email.trim()) {
      setError('Escreva primeiro o seu e-mail para receber a recuperação.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      toast.success('Enviámos as instruções de recuperação para o seu e-mail.');
    } catch (err: any) {
      setError(authErrorMessage(err?.code));
    } finally {
      setIsLoading(false);
    }
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    resetFeedback();
  };

  return (
    <div className="min-h-screen bg-[#090612] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-[#E0B1CB]/30 selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#9F86C0]/25 via-[#E0B1CB]/15 to-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none opacity-60" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#C5A059]/15 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-gradient-to-b from-[#140E26]/95 via-[#110B22]/90 to-[#0C0A14]/98 backdrop-blur-[32px] border border-white/10 rounded-[40px] p-7 sm:p-9 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E0B1CB]/40 to-transparent" />

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="absolute top-5 left-5 w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#E0B1CB] hover:bg-white/10 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex flex-col items-center text-center mb-7">
            <div className="relative w-20 h-20 mb-5 rounded-full border border-[#C5A059]/35 bg-[#0C0A14] flex items-center justify-center shadow-[0_0_35px_rgba(197,160,89,0.16)]">
              <span className="font-serif text-4xl font-bold bg-gradient-to-br from-white via-[#F3E9D8] to-[#C5A059] bg-clip-text text-transparent">V</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0B1CB]/5 border border-[#E0B1CB]/10 text-[#E0B1CB] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Espaço privado
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#F3E9D8] tracking-tight mb-2">Véus de Mulambo</h1>
            <p className="text-xs sm:text-[13px] text-[#9C8FA0] leading-relaxed max-w-[290px]">
              Entre na sua conta para falar com a Kris Ty Oya e acompanhar os seus pedidos.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full min-h-12 rounded-2xl bg-[#F3E9D8] text-[#140E26] font-extrabold text-sm flex items-center justify-center gap-3 hover:bg-white active:scale-[0.99] transition-all disabled:opacity-50"
          >
            <span className="w-6 h-6 rounded-full bg-white border border-black/10 text-sm font-black flex items-center justify-center text-[#4285F4]">G</span>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 my-6 text-[10px] uppercase tracking-[0.2em] text-[#9C8FA0]">
            <span className="h-px flex-1 bg-white/10" />
            ou por e-mail
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="p-1 rounded-2xl bg-black/35 border border-white/5 flex mb-6">
            <button
              type="button"
              onClick={() => changeMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.14em] transition-all ${mode === 'login' ? 'bg-[#E0B1CB] text-[#140E26]' : 'text-[#9C8FA0]'}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => changeMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.14em] transition-all ${mode === 'register' ? 'bg-[#E0B1CB] text-[#140E26]' : 'text-[#9C8FA0]'}`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <AnimatePresence initial={false}>
              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <label className="text-[10px] text-[#E0B1CB]/80 uppercase tracking-[0.18em] font-black block mb-2 ml-1">Nome</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-4 h-4 text-[#9C8FA0]" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      type="text"
                      autoComplete="name"
                      placeholder="O seu nome"
                      className="w-full bg-black/35 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#F3E9D8] text-sm outline-none focus:border-[#E0B1CB]/50"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-[10px] text-[#E0B1CB]/80 uppercase tracking-[0.18em] font-black block mb-2 ml-1">E-mail</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-[#9C8FA0]" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-black/35 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#F3E9D8] text-sm outline-none focus:border-[#E0B1CB]/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="text-[10px] text-[#E0B1CB]/80 uppercase tracking-[0.18em] font-black">Palavra-passe</label>
                {mode === 'login' && (
                  <button type="button" onClick={handlePasswordReset} className="text-[10px] text-[#C5A059] hover:text-[#E8C36B]">
                    Recuperar
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-[#9C8FA0]" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-black/35 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-[#F3E9D8] text-sm outline-none focus:border-[#E0B1CB]/50"
                  required
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-4 text-[#9C8FA0] hover:text-[#F3E9D8]" aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-[11px] flex items-start gap-3 leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-12 bg-gradient-to-r from-[#C5A059] via-[#9F86C0] to-[#E0B1CB] text-[#140E26] font-black text-[11px] uppercase tracking-[0.18em] rounded-2xl shadow-[0_14px_35px_-12px_rgba(197,160,89,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99] transition-all"
            >
              {isLoading ? <span className="w-5 h-5 border-[3px] border-[#140E26]/20 border-t-[#140E26] rounded-full animate-spin" /> : <>{mode === 'register' ? 'Criar a minha conta' : 'Entrar'}<ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-7 pt-5 text-center border-t border-white/5">
            <div className="inline-flex items-center gap-2 text-[9px] text-[#9C8FA0] font-bold tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
              Acesso protegido pelo Firebase Authentication
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
