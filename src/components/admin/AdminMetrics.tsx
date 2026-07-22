import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, MessageCircle, TrendingUp, UserPlus, Clock, Moon, Sparkles, BarChart3, BookOpen, Heart } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import { MetricsChart } from '../MetricsChart';

export function AdminMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Consultas deste mês" value="142" color="text-pink-400" />
        <StatCard icon={Users} label="Clientes acompanhados" value="1,284" color="text-rose-400" />
        <StatCard icon={Clock} label="Pedidos pendentes" value="8" color="text-amber-400" />
        <StatCard icon={UserPlus} label="Novos clientes" value="+5" color="text-emerald-400" />
        <StatCard icon={MessageCircle} label="Mensagens por responder" value="12" color="text-blue-400" />
        <StatCard icon={TrendingUp} label="Atividade recente" value="+15%" color="text-purple-400" />
        <StatCard icon={BookOpen} label="Horários disponíveis" value="4" color="text-teal-400" />
        <StatCard icon={Heart} label="Pedidos de interesse" value="23" color="text-indigo-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <BentoBox className="lg:col-span-2 p-6 h-[350px] flex flex-col border-pink-900/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-500" />
              Acompanhamento Mensal
            </h3>
            <span className="text-[10px] text-pink-500/50 uppercase tracking-widest font-bold">Últimos 30 dias</span>
          </div>
          <div className="flex-1">
            <MetricsChart />
          </div>
        </BentoBox>

        <BentoBox className="p-6 border-pink-900/20 bg-pink-500/5">
          <h3 className="font-serif text-xl text-slate-100 mb-1 flex items-center gap-2">
            <Moon className="w-5 h-5 text-pink-400" />
            Painel da Mentora
          </h3>
          <p className="text-xs text-slate-400 mb-6">Resumo da atividade deste mês.</p>

          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <h4 className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">
                <Sparkles className="w-4 h-4 text-pink-400" /> Atividade do mês
              </h4>
              <p className="text-3xl font-serif text-slate-100 mb-3">2 450 €</p>
              <p className="text-[10px] text-slate-500 leading-relaxed italic border-t border-white/5 pt-3">
                Este valor representa apenas a atividade registada pela mentora e não pagamentos efetuados pela aplicação.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Média / Consulta</p>
                <p className="text-xl font-serif text-slate-100">45 €</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Retenção</p>
                <p className="text-xl font-serif text-slate-100">85%</p>
              </div>
            </div>
          </div>
        </BentoBox>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <BentoBox className="p-4 flex flex-col gap-1 border-white/5 bg-white/5">
      <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-2 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</p>
      <p className="text-xl font-serif text-slate-100">{value}</p>
    </BentoBox>
  );
}

