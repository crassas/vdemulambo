import { Check, Clock, Send } from 'lucide-react';

export type Status = 'aguardando' | 'enviado' | 'aprovado';

export function MBWayValidationCard({ 
  clientName, 
  amount, 
  status,
  onSimulateSend,
  onValidate
}: { 
  clientName: string; 
  amount: number;
  status: Status;
  onSimulateSend?: () => void;
  onValidate?: () => void;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-[#0f0c1a]/60 backdrop-blur-md border ${status === 'enviado' ? 'border-rose-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'border-rose-500/20'} p-6 transition-all duration-500`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-sans text-slate-200 font-medium">{clientName}</h3>
          <p className="font-serif text-2xl text-rose-400 mt-1">{amount.toFixed(2)} €</p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'aguardando' && <Clock className="w-5 h-5 text-slate-500" />}
          {status === 'enviado' && <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>}
          {status === 'aprovado' && <Check className="w-5 h-5 text-green-400" />}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="text-xs font-sans text-slate-400 uppercase tracking-widest">
          Estado: {status === 'aguardando' ? 'Aguardando Pagamento' : status === 'enviado' ? 'Sinalizado pelo Cliente' : 'Axé Validado'}
        </div>

        {status === 'aguardando' && (
          <button 
            onClick={onSimulateSend}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-sans text-sm flex items-center justify-center gap-2 transition-colors border border-white/10"
          >
            <Send className="w-4 h-4" />
            Simular: Cliente enviou
          </button>
        )}

        {status === 'enviado' && (
          <button 
            onClick={onValidate}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-sans text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Check className="w-4 h-4" />
            Validar Axé
          </button>
        )}
      </div>
    </div>
  );
}
