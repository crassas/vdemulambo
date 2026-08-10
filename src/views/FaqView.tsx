import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  ChevronDown, 
  CreditCard, 
  Sparkles, 
  Calendar, 
  Clock, 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle,
  SearchX,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { BentoBox } from '../components/BentoBox';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ElementType;
  category?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "Vou fazer algum pagamento dentro da aplicação?",
    answer: "Não. A aplicação não processa pagamentos. Caso decida avançar com um atendimento ou outro serviço, todas as informações serão fornecidas diretamente pela mentora através dos canais de contacto.",
    icon: CreditCard,
    category: "Pagamentos & Valores"
  },
  {
    id: 2,
    question: "Esta aplicação faz adivinhações ou promete prever o futuro?",
    answer: "Não. A aplicação destina-se a disponibilizar conteúdos, orientação e acompanhamento de acordo com a abordagem da mentora. As decisões da sua vida pertencem sempre a si.",
    icon: Sparkles,
    category: "Orientações"
  },
  {
    id: 3,
    question: "Como posso pedir um atendimento?",
    answer: "Escolha o atendimento pretendido e envie o seu pedido. A mentora irá analisar a disponibilidade e responder assim que possível.",
    icon: Calendar,
    category: "Atendimentos"
  },
  {
    id: 4,
    question: "Os atendimentos são imediatos?",
    answer: "Não necessariamente. Todos os pedidos dependem da disponibilidade da mentora.",
    icon: Clock,
    category: "Atendimentos"
  },
  {
    id: 5,
    question: "Porque alguns trabalhos aparecem como indisponíveis?",
    answer: "Alguns serviços podem estar temporariamente indisponíveis por decisão da mentora ou devido à agenda.",
    icon: Lock,
    category: "Serviços"
  },
  {
    id: 6,
    question: "Os meus dados estão protegidos?",
    answer: "Sim. Apenas são utilizados os dados necessários para o funcionamento da aplicação e autenticação da sua conta.",
    icon: ShieldCheck,
    category: "Segurança"
  },
  {
    id: 7,
    question: "Preciso de criar uma conta?",
    answer: "Sim. O acesso é realizado através da sua Conta Google para garantir simplicidade e segurança.",
    icon: UserCheck,
    category: "Conta"
  },
  {
    id: 8,
    question: "Posso partilhar a aplicação?",
    answer: "Sim. Pode partilhar o convite ou o link disponibilizado pela mentora com pessoas que considere que possam beneficiar da plataforma.",
    icon: Share2,
    category: "Geral"
  },
  {
    id: 9,
    question: "Quem decide se um pedido é aceite?",
    answer: "Todos os pedidos são analisados exclusivamente pela mentora, que decide a disponibilidade para cada atendimento.",
    icon: CheckCircle2,
    category: "Atendimentos"
  },
  {
    id: 10,
    question: "Esta aplicação substitui aconselhamento médico, psicológico ou jurídico?",
    answer: "Não. Esta plataforma não substitui profissionais de saúde, psicólogos, advogados ou qualquer outro profissional qualificado.",
    icon: AlertCircle,
    category: "Avisos Importantes"
  }
];

interface FaqViewProps {
  onContactMentor: () => void;
}

export function FaqView({ onContactMentor }: FaqViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredItems = FAQ_ITEMS.filter(item => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      item.question.toLowerCase().includes(term) ||
      item.answer.toLowerCase().includes(term) ||
      (item.category && item.category.toLowerCase().includes(term))
    );
  });

  const toggleAccordion = (id: number) => {
    setOpenId(prevId => (prevId === id ? null : id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-28 max-w-3xl mx-auto"
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 bg-gradient-to-br from-[#140E26]/90 via-[#1B1233]/80 to-[#0C0A14] border border-white/10 shadow-2xl text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E0B1CB]/10 via-[#9F86C0]/10 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center mb-4 text-[#E0B1CB] shadow-inner">
            <HelpCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#E0B1CB] mb-2">Apoio ao Consulente</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-cream font-bold mb-2">Perguntas Frequentes</h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
            Esclareça dúvidas sobre o funcionamento da plataforma, agendamentos e acompanhamentos.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative z-10">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#E0B1CB] pointer-events-none" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar perguntas..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#090612]/80 border border-white/10 text-cream placeholder:text-muted-foreground text-xs sm:text-sm focus:outline-none focus:border-[#E0B1CB]/50 transition-all shadow-inner"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 p-1.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-cream transition-colors"
              aria-label="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-[11px] text-muted-foreground mt-2 px-2 font-medium">
            A mostrar {filteredItems.length} {filteredItems.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm}"
          </p>
        )}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const Icon = item.icon;
            const isOpen = openId === item.id;

            return (
              <div 
                key={item.id}
                className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-lg transition-all duration-300 hover:border-[#9F86C0]/40"
              >
                {/* Accordion Header Button */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left group cursor-pointer focus:outline-none rounded-2xl"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all ${
                      isOpen 
                        ? 'bg-[#E0B1CB]/20 text-[#E0B1CB] border border-[#E0B1CB]/30' 
                        : 'bg-[#9F86C0]/10 text-[#E0B1CB] group-hover:bg-[#9F86C0]/20'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      {item.category && (
                        <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#E0B1CB] block mb-0.5">
                          {item.category}
                        </span>
                      )}
                      <h3 className={`text-xs sm:text-sm font-semibold transition-colors ${
                        isOpen ? 'text-[#E0B1CB]' : 'text-cream group-hover:text-white'
                      }`}>
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 bg-[#E0B1CB]/20 text-[#E0B1CB]' : 'bg-white/5 text-muted-foreground group-hover:text-cream'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-white/5 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-16 pr-6">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          /* Empty Search State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/10 text-center flex flex-col items-center justify-center space-y-4 my-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center text-[#E0B1CB]">
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif text-cream font-bold mb-1">
                Nenhuma pergunta encontrada
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Não encontramos nenhuma resposta para "{searchTerm}". Tente pesquisar com outros termos ou entre em contacto com Kris Ty Oya.
              </p>
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-cream text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              Limpar Pesquisa
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA Card */}
      <div className="mt-8 relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-[#140E26] to-[#0C0A14] border border-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center text-[#E0B1CB] shrink-0 shadow-lg">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-cream mb-1">
                A sua dúvida não está aqui?
              </h3>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                Kris Ty Oya está disponível para esclarecer as suas dúvidas e orientar o seu caminho.
              </p>
            </div>
          </div>

          <button
            onClick={onContactMentor}
            className="w-full sm:w-auto shrink-0 group inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] text-[#140E26] font-extrabold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_10px_20px_rgba(159,134,192,0.25)] active:scale-95 cursor-pointer"
          >
            <span>Falar com Kris Ty Oya</span>
            <ArrowRight className="w-4 h-4 text-[#140E26] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
