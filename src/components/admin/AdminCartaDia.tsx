import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, Type, Instagram, Send, Sparkles, X, Check } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import toast from 'react-hot-toast';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { compressImage } from '../../lib/imageUtils';

export function AdminCartaDia() {
  const [image, setImage] = useState<string | null>(null);
  
  const [meaning, setMeaning] = useState('');
  const [instagramCaption, setInstagramCaption] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 900, 0.75);
        setImage(compressed);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar a imagem.");
      }
    }
  };

  const handleSave = async () => {
    if (!image || !meaning ) {
      toast.error("Preencha todos os campos e adicione uma imagem.");
      return;
    }
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'carta_dia'), {
        image,
        meaning,
        instagramUrl: instagramCaption, // Reusing this for the URL/caption for now
        updatedAt: serverTimestamp()
      });
      toast.success('Carta publicada com sucesso!');
      setIsPreviewMode(false);
      setImage(null);
      
      setMeaning('');
      setInstagramCaption('');
    } catch (error) {
      console.error("Error saving carta do dia:", error);
      toast.error("Erro ao guardar a carta.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AnimatePresence mode="wait">
        {!isPreviewMode ? (
          <motion.div 
            key="editor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Left: Content Editor */}
            <div className="space-y-6">
              <BentoBox className="p-6 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                    <Type className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground font-bold">Conteúdo da Mensagem</h3>
                </div>

                <div className="space-y-4">
                  
                  <div>
                    <label className="text-[10px] text-accent/80 uppercase tracking-[0.2em] font-bold block mb-2">Significado da Carta</label>
                    <textarea 
                      placeholder="Descreva a mensagem que as cartas revelam para hoje..."
                      className="w-full h-40 bg-[#090612]/60 border border-white/10 rounded-[24px] p-4 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 glow-highlight-focus transition-all duration-300 resize-none custom-scrollbar"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-accent/80 uppercase tracking-[0.2em] font-bold block mb-2">Legenda Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-4.5 w-4 h-4 text-[#E0B1CB]" />
                      <textarea 
                        placeholder="Cole aqui a legenda publicada no Instagram..."
                        className="w-full h-24 bg-[#090612]/60 border border-white/10 rounded-[24px] py-4 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-[#9F86C0]/50 focus:ring-1 focus:ring-[#9F86C0]/20 glow-highlight-focus transition-all duration-300 resize-none custom-scrollbar"
                        value={instagramCaption}
                        onChange={(e) => setInstagramCaption(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </BentoBox>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 hover:border-[#9F86C0]/50 transition-all duration-300 group cursor-pointer shadow-md"
                >
                  <Camera className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-all" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-hover:text-foreground">Câmara</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 hover:border-[#9F86C0]/50 transition-all duration-300 group cursor-pointer shadow-md"
                >
                  <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-all" />
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-hover:text-foreground">Galeria</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" capture="environment" />
              </div>
            </div>

            {/* Right: Uploaded Image Preview */}
            <div className="space-y-6 flex flex-col items-center">
              <BentoBox className="relative aspect-[3/4] w-full max-w-[280px] p-2  overflow-hidden bg-input flex items-center justify-center">
                {image ? (
                  <div className="relative w-full h-full p-6">
                    <div className="absolute inset-0 border-[20px] border-accent/20 m-6 pointer-events-none" />
                    <img src={image || undefined} alt="Carta do Dia" className="w-full h-full object-cover rounded-xl" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-8 right-8 p-2 rounded-full bg-destructive text-foreground shadow-float hover:scale-110 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-accent/20 mx-auto" />
                    <p className="text-muted-foreground text-xs font-serif italic">Nenhuma carta selecionada</p>
                  </div>
                )}
              </BentoBox>

              <button 
                onClick={() => setIsPreviewMode(true)}
                disabled={!image || !meaning}
                className="btn-gold w-full text-xs flex justify-center items-center gap-2"
              >
                Ver Pré-visualização <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="flex items-center justify-between px-4">
              <h3 className="font-serif text-2xl text-foreground">Revelação Final</h3>
              <button 
                onClick={() => setIsPreviewMode(false)}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <X className="w-4 h-4" /> Editar
              </button>
            </div>

            <BentoBox className="overflow-hidden border-accent/20 ">
              <div className="aspect-[4/5] relative">
                <img src={image || undefined} alt="Final" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-border text-accent text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" /> Carta do Dia
                  </div>
                  <p className="text-foreground font-serif text-lg leading-relaxed italic">
                    "{meaning}"
                  </p>
                </div>
              </div>
            </BentoBox>

            <button 
              className="w-full py-5 rounded-[2rem] bg-emerald-600 text-foreground font-bold uppercase tracking-[0.2em] shadow-float shadow-emerald-900/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'A Publicar...' : 'Publicar na Plataforma'} <Check className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
