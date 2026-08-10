import React, { useState } from 'react';
import { Settings, FileText, Download, ShieldCheck, RefreshCw } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import toast from 'react-hot-toast';

export function AdminSettings() {
  const [isClearing, setIsClearing] = useState(false);

  const handleDownloadDoc = async () => {
    try {
      const response = await fetch('/documentacao_veus_de_mulambo.md');
      const text = await response.text();
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'documentacao_veus_de_mulambo.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Documentação descarregada com sucesso!');
    } catch (e) {
      toast.error('Erro ao descarregar documentação.');
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    const toastId = toast.loading('A limpar cache e a sincronizar...');
    try {
      // 1. Clear application storage keys (excluding firebase auth so they stay logged in if using real Firebase)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('firebase:AuthOrDatabase')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();

      // 2. Clear browser Cache Storage API
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // 3. Clear service worker registrations
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      toast.success('Cache limpa com sucesso! A recarregar...', { id: toastId });
      
      // 4. Force reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao limpar a cache.', { id: toastId });
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-3.5 mb-8 bg-white/[0.04] border border-white/10 rounded-full p-3.5 pl-5 shadow-xl">
        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
          <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div>
          <h2 className="font-serif text-xl text-foreground font-bold">Definições e Especificações</h2>
          <p className="text-[10px] text-accent/70 uppercase tracking-[0.2em] font-bold">Documentação & Estado da Plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BentoBox className="p-8 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-foreground font-bold">Documentação Completa (.md)</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Descarregue o documento oficial contendo arquitetura, fluxos, separação de áreas e especificações.
            </p>
          </div>
          <button
            onClick={handleDownloadDoc}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(159,134,192,0.35)] cursor-pointer"
          >
            <Download className="w-4 h-4" /> Descarregar .MD
          </button>
        </BentoBox>

        <BentoBox className="p-8 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-serif text-xl text-foreground font-bold">Estado & Segurança</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Plataforma otimizada para iOS Safari, PWA ready e Firebase Firestore em tempo real.
            </p>
          </div>
          <div className="p-5 rounded-[20px] bg-[#090612]/60 border border-white/10 space-y-2.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Versão:</span>
              <span className="text-foreground font-mono bg-white/5 px-2.5 py-0.5 rounded-full text-[10px] border border-white/5">1.0.0-prod</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Autenticação:</span>
              <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-500/20">Firebase + Fallback</span>
            </div>
          </div>
        </BentoBox>

        <BentoBox className="p-8 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl space-y-6 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <RefreshCw className={`w-6 h-6 ${isClearing ? 'animate-spin' : ''}`} />
            </div>
            <h3 className="font-serif text-xl text-foreground font-bold">Gestão de Cache</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Limpe a cache local do navegador, service workers e force uma ressincronização em tempo real com o servidor.
            </p>
          </div>
          <button
            onClick={handleClearCache}
            disabled={isClearing}
            className="w-full py-4 px-6 rounded-full bg-[#E0B1CB]/10 hover:bg-[#E0B1CB]/20 border border-[#E0B1CB]/30 text-[#E0B1CB] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isClearing ? 'animate-spin' : ''}`} /> Limpar Cache & Recarregar
          </button>
        </BentoBox>
      </div>
    </div>
  );
}
