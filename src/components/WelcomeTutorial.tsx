import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Compass, Sparkles, ArrowRight, Check, X } from 'lucide-react';

interface WelcomeTutorialProps {
  onClose: () => void;
}

export function WelcomeTutorial({ onClose }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Bem-vindo(a)',
      description: 'Bem-vindo(a) à plataforma Véus de Mulambo. Aqui encontrará o acompanhamento e a orientação que procura de forma simples e organizada.',
      icon: Sparkles,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10'
    },
    {
      title: 'Agendar Consultas',
      description: 'Marque a sua consulta de forma rápida. Na secção de Consultas, escolha o horário que melhor se adapta à sua disponibilidade para um atendimento personalizado.',
      icon: Calendar,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Trabalhos e Serviços',
      description: 'Explore todos os serviços disponíveis. Desde acompanhamentos energéticos a limpezas, tudo foi pensado para auxiliar o seu bem-estar e equilíbrio.',
      icon: Compass,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#030305]/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-mystic-card border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400 border border-white/10 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="relative h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                <div className={`w-20 h-20 rounded-full ${steps[currentStep].bgColor} flex items-center justify-center mb-6`}>
                  {React.createElement(steps[currentStep].icon, { className: `w-10 h-10 ${steps[currentStep].color}` })}
                </div>
                <h2 className="font-serif text-2xl text-slate-100 mb-3">{steps[currentStep].title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep ? 'w-6 bg-rose-500' : 'w-1.5 bg-white/10'
                  }`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              {currentStep === steps.length - 1 ? (
                <>Começar <Check className="w-4 h-4" /></>
              ) : (
                <>Próximo <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
