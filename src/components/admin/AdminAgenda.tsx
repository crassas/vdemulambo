import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { BentoBox } from '../BentoBox';

export function AdminAgenda() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-slate-100">Agenda</h2>
          <p className="text-[10px] text-pink-500/50 uppercase tracking-[0.2em] font-bold">Gestão de Horários</p>
        </div>
      </div>

      <BentoBox className="p-10 border-white/5 bg-white/5 text-center space-y-4">
        <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="font-serif text-xl text-slate-300">Agenda de Consultas</h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          A funcionalidade de agenda estará disponível em breve. Poderá gerir todas as suas marcações aqui.
        </p>
      </BentoBox>
    </div>
  );
}
