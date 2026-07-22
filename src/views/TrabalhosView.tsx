import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Clock, ArrowRight, MessageSquare, X, Send } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';
import toast from 'react-hot-toast';

const MOCK_TRABALHOS = [
  {
    id: '1',
    name: 'Abertura de Caminhos',
    description: 'Trabalho focado em desbloquear áreas da vida que se encontram estagnadas, seja no campo profissional, amoroso ou financeiro. Inclui acompanhamento contínuo durante 7 dias.',
    image: 'https://images.unsplash.com/photo-1603539947678-cd3954edcb15?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://www.instagram.com/reel/DXl_kYiE8B3/?igsh=aXIwbzRoYnNhamJ3',
    duration: '7 dias',
    available: true,
  },
  {
    id: '2',
    name: 'Limpeza Energética',
    description: 'Acompanhamento para remover negatividade. Restauramos a sua harmonia interior de forma equilibrada.',
    image: 'https://images.unsplash.com/photo-1550785131-0d268fc5ce0d?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://www.instagram.com/reel/DZ5C677z8a1/?igsh=MTZoYmpydm9zYjV6bw==',
    duration: '3 dias',
    available: true,
  },
  {
    id: '3',
    name: 'Adoçamento Amoroso',
    description: 'Harmonização de relacionamentos em crise. Trabalhamos a energia do casal para promover a paz, a compreensão e reavivar o afeto sem interferir no livre arbítrio.',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://www.instagram.com/reel/DZDmgcbRQsg/?igsh=MTNob2FlejU5Ymx5cg==',
    duration: '21 dias',
    available: false,
  }
];

export function TrabalhosView() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{id: string, text: string, sender: 'user' | 'mentor'}[]>([
    { id: '0', text: 'Olá! Tem alguma dúvida sobre os trabalhos? Estou aqui para ajudar.', sender: 'mentor' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInterest = (name: string) => {
    toast.success(`Interesse em '${name}' registado com sucesso. A mentora entrará em contacto.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newUserMsg = { id: Date.now().toString(), text: message, sender: 'user' as const };
    setMessages(prev => [...prev, newUserMsg]);
    setMessage('');

    // Simulate mentor reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), text: 'Recebi a tua mensagem. Entrarei em contacto contigo em breve para esclarecer todas as dúvidas. Que a luz te acompanhe.', sender: 'mentor' }
      ]);
    }, 1500);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-12 relative"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-slate-100 mb-4">Trabalhos</h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Conheça os acompanhamentos e trabalhos disponíveis. Selecione a opção que melhor se adequa ao seu momento.
        </p>
      </div>

      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {MOCK_TRABALHOS.map((trabalho) => (
          <div key={trabalho.id} className="w-[85vw] max-w-[280px] sm:w-[320px] md:w-[340px] snap-center shrink-0">
            <BentoBox className="overflow-hidden flex flex-col group border-rose-500/10 h-full">
              {trabalho.image && (
              <div className="h-48 w-full relative overflow-hidden shrink-0">
                <img 
                  src={trabalho.image} 
                  alt={trabalho.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c1a] to-transparent opacity-80" />
                <div className="absolute top-3 right-3">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    trabalho.available 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }`}>
                    {trabalho.available ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                <h3 className="font-serif text-xl text-slate-200">{trabalho.name}</h3>
              </div>
              
              <p className="text-sm text-slate-400 mb-6 flex-1">
                {trabalho.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Duração: {trabalho.duration}</span>
                </div>
                {trabalho.instagramUrl && (
                  <a 
                    href={trabalho.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors text-[10px] font-bold uppercase tracking-widest border border-pink-500/20"
                  >
                    Ver no Instagram
                  </a>
                )}
              </div>
              
              <button 
                onClick={() => handleInterest(trabalho.name)}
                disabled={!trabalho.available}
                className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shrink-0 ${
                  trabalho.available 
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-white/5 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {trabalho.available ? 'Mostrar Interesse' : 'Temporariamente Indisponível'}
                </span>
                {trabalho.available && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </BentoBox>
          </div>
        ))}
      </div>

      {/* Floating Chat */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="w-80 sm:w-96 bg-[#161224] border border-rose-500/20 rounded-3xl shadow-2xl overflow-hidden mb-4 flex flex-col h-[400px]"
            >
              {/* Chat Header */}
              <div className="px-5 py-4 bg-rose-900/20 border-b border-rose-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Mentora" className="w-8 h-8 rounded-full object-cover border border-rose-500/30" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#161224]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-serif text-slate-200">Mentora Mulambo</h4>
                    <p className="text-[9px] text-rose-400 uppercase tracking-widest font-bold">Assistente</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-rose-600 text-white rounded-tr-sm' 
                        : 'bg-white/5 text-slate-300 border border-white/10 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/20">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tirar dúvida..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500/40"
                  />
                  <button 
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
            isChatOpen ? 'bg-white/10 text-slate-300 border border-white/10' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/30'
          }`}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>

    </motion.div>
  );
}

