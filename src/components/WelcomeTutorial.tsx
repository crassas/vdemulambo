import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Compass, Sparkles, ArrowRight, Check, X, Camera, User, Heart, ShieldCheck } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { compressImage } from '../lib/imageUtils';
import { UserProfile } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface WelcomeTutorialProps {
  userProfile: UserProfile | null;
  onClose: () => void;
}

export function WelcomeTutorial({ userProfile, onClose }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.nome || '');
      setPhoto(userProfile.fotoPerfil);
    }
  }, [userProfile]);

  const steps = [
    {
      title: 'Um Espaço Sagrado',
      subtitle: 'Seja muito Bem-vinda, Irmã',
      description: 'Este portal foi criado com carinho e luz exclusivamente para o acolhimento, orientação e bem-estar de mulheres. Sinta-se protegida e em harmonia no seu novo cantinho espiritual.',
      icon: Sparkles,
      color: 'text-[#E0B1CB]',
      bgColor: 'bg-[#9F86C0]/10',
      glowColor: 'from-[#9F86C0]/20 to-transparent'
    },
    {
      title: 'Orientação Individual',
      subtitle: 'Consultas & Serviços',
      description: 'Marque as suas consultas e explore trabalhos de Limpeza Energética ou Alinhamento de forma próxima e intuitiva. Um acompanhamento espiritual privado, pensado para nutrir o seu templo interior.',
      icon: Calendar,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      glowColor: 'from-emerald-500/10 to-transparent'
    },
    {
      title: 'O Seu Cantinho',
      subtitle: 'Personalize o seu Perfil',
      description: 'Para que a Kris Ty Oya a possa tratar sempre pelo nome e reconhecer o seu olhar a cada atendimento, dê um toque especial ao seu perfil de visitante.',
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      glowColor: 'from-pink-500/10 to-transparent'
    }
  ];

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressed = await compressImage(file, 400, 0.75);
        setPhoto(compressed);
        toast.success('Fotografia de perfil carregada com sucesso!', {
          style: { background: '#140E26', color: '#E0B1CB', border: '1px solid rgba(255, 255, 255, 0.1)' }
        });
      } catch (err) {
        console.error(err);
        toast.error('Não foi possível carregar a imagem selecionada.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save profile customizations to Firestore before closing
      if (!name.trim()) {
        toast.error('Por favor, introduza o seu nome para continuarmos.');
        return;
      }
      if (userProfile?.uid) {
        try {
          setIsSaving(true);
          const userRef = doc(db, 'users', userProfile.uid);
          await setDoc(userRef, {
            nome: name.trim(),
            fotoPerfil: photo
          }, { merge: true });
          
          toast.success(`Seja bem-vinda ao seu templo, ${name.trim()}! ✨`, {
            style: { background: '#140E26', color: '#E0B1CB', border: '1px solid rgba(255, 255, 255, 0.1)' },
            duration: 4000
          });
        } catch (err) {
          console.error(err);
          toast.error('Erro ao guardar as suas definições.');
        } finally {
          setIsSaving(false);
        }
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#090612]/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#140E26] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${steps[currentStep].glowColor} opacity-50 blur-3xl pointer-events-none transition-all duration-700`} />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground border border-white/10 z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-12 relative z-10">
          <div className="min-h-[350px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                {currentStep < 2 ? (
                  <>
                    {/* Pulsing Icon Visual */}
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] rounded-full blur-xl opacity-35 animate-pulse" />
                      <div className={`relative w-24 h-24 rounded-full ${steps[currentStep].bgColor} flex items-center justify-center border border-white/10`}>
                        {React.createElement(steps[currentStep].icon, { className: `w-12 h-12 ${steps[currentStep].color}` })}
                      </div>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E0B1CB] mb-2">
                      {steps[currentStep].subtitle}
                    </p>
                    <h2 className="font-serif text-3xl text-cream mb-4 font-bold tracking-tight">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-sm text-cream/70 leading-relaxed max-w-sm">
                      {steps[currentStep].description}
                    </p>
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    {/* Beautiful Dynamic Photo Upload Step */}
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E0B1CB] mb-2">
                      {steps[currentStep].subtitle}
                    </p>
                    <h2 className="font-serif text-3xl text-cream mb-3 font-bold tracking-tight">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-xs text-cream/60 leading-relaxed max-w-sm mb-8">
                      {steps[currentStep].description}
                    </p>

                    {/* Interactive Avatar Container */}
                    <div className="relative group cursor-pointer mb-8" onClick={handlePhotoClick}>
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                      <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] shadow-2xl transition-transform duration-300 group-hover:scale-105">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#090612] border-4 border-[#140E26] flex items-center justify-center relative">
                          {photo ? (
                            <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-16 h-16 text-[#E0B1CB]/40" />
                          )}
                          
                          {/* Hover camera overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-300">
                            <Camera className="w-6 h-6 text-[#E0B1CB]" />
                            <span className="text-[9px] uppercase tracking-wider text-[#E0B1CB] font-black">Alterar</span>
                          </div>
                        </div>
                      </div>

                      {/* Small Camera Badge */}
                      <div className="absolute bottom-1 right-1 w-9 h-9 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] text-[#140E26] rounded-full border-4 border-[#140E26] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-12">
                        <Camera className="w-3.5 h-3.5 font-bold" />
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handlePhotoChange} 
                      accept="image/*" 
                      className="hidden" 
                    />

                    {/* Input Field for Name */}
                    <div className="w-full max-w-xs space-y-2 text-left">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#E0B1CB]/70 ml-2">Como a queríamos tratar?</label>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Insira o seu nome ou pseudónimo"
                        className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-[#E0B1CB]/40 focus:bg-white/[0.05] transition-all text-center tracking-wide placeholder-white/20"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 mt-4 opacity-80">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Dados visíveis apenas para si e para a mentora</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots and Navigation Button Bar */}
          <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
            {/* Steps indicator dots */}
            <div className="flex gap-2.5">
              {steps.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => currentStep < 2 && setCurrentStep(index)}
                  disabled={currentStep === 2}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    index === currentStep 
                      ? 'w-8 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB]' 
                      : 'w-2 bg-white/10 hover:bg-white/20'
                  }`}
                  aria-label={`Ir para passo ${index + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              disabled={isUploading || isSaving}
              className="flex items-center gap-3 px-8 py-4.5 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] hover:from-[#d1ab63] hover:to-[#ebc1d8] text-[#140E26] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? (
                <>Entrar no Templo <Check className="w-4 h-4" /></>
              ) : (
                <>Seguinte <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
