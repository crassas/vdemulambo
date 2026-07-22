import React from 'react';
import { motion } from 'motion/react';
import { Settings, FileText, Download, ShieldCheck, Cpu } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import toast from 'react-hot-toast';

export function AdminSettings() {
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-slate-100">Definições e Documentação</h2>
          <p className="text-[10px] text-pink-500/50 uppercase tracking-[0.2em] font-bold">Gestão do Produto & Especificações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BentoBox className="p-8 border-pink-500/20 bg-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-slate-100">Documentação Completa do Projeto (.md)</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Descarregue o documento oficial contendo arquitetura, fluxos, separação de áreas, autenticação iOS, paleta de cores, wireframes e roadmap.
            </p>
          </div>
          <button
            onClick={handleDownloadDoc}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all"
          >
            <Download className="w-4 h-4" /> Descarregar Documentação .MD
          </button>
        </BentoBox>

        <BentoBox className="p-8 border-white/5 bg-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-slate-100">Estado do Sistema & Segurança</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plataforma otimizada para iOS Safari, PWA ready e Firebase Firestore sincronizado em tempo real.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Versão:</span>
              <span className="text-slate-200 font-mono">1.0.0-prod</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Autenticação:</span>
              <span className="text-emerald-400 font-mono">Firebase + iOS Fallback</span>
            </div>
          </div>
        </BentoBox>
      </div>
    </div>
  );
}
