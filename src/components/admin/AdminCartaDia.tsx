import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, Type, Instagram, Send, Sparkles, X, Check } from 'lucide-react';
import { BentoBox } from '../BentoBox';

export function AdminCartaDia() {
  const [image, setImage] = useState<string | null>(null);
  const [meaning, setMeaning] = useState('');
  const [instagramCaption, setInstagramCaption] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
              <BentoBox className="p-6 border-pink-900/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                    <Type className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl text-slate-100">Conteúdo da Mensagem</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-pink-500/70 uppercase tracking-[0.2em] font-bold block mb-2">Nome da Carta</label>
                    <input 
                      type="text"
                      placeholder="Ex: A Sacerdotisa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-pink-500/40 transition-all font-serif"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-pink-500/70 uppercase tracking-[0.2em] font-bold block mb-2">Significado da Carta</label>
                    <textarea 
                      placeholder="Descreva a mensagem que as cartas revelam para hoje..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-pink-500/40 transition-all resize-none custom-scrollbar"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-pink-500/70 uppercase tracking-[0.2em] font-bold block mb-2">Legenda Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
                      <textarea 
                        placeholder="Cole aqui a legenda publicada no Instagram..."
                        className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-pink-500/40 transition-all resize-none custom-scrollbar"
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
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all group"
                >
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-pink-500 group-hover:scale-110 transition-all" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-200">Câmara</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-pink-500/10 hover:border-pink-500/30 transition-all group"
                >
                  <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-pink-500 group-hover:scale-110 transition-all" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-200">Galeria</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>
            </div>

            {/* Right: Uploaded Image Preview */}
            <div className="space-y-6 flex flex-col items-center">
              <BentoBox className="relative aspect-[3/4] w-full max-w-[280px] p-2 border-pink-900/30 overflow-hidden bg-black/40 flex items-center justify-center">
                {image ? (
                  <div className="relative w-full h-full p-6">
                    <div className="absolute inset-0 border-[20px] border-pink-900/20 m-6 pointer-events-none" />
                    <img src={image} alt="Carta do Dia" className="w-full h-full object-cover rounded-xl" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-8 right-8 p-2 rounded-full bg-red-500 text-white shadow-xl hover:scale-110 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-pink-500/20 mx-auto" />
                    <p className="text-slate-500 text-xs font-serif italic">Nenhuma carta selecionada</p>
                  </div>
                )}
              </BentoBox>

              <button 
                onClick={() => setIsPreviewMode(true)}
                disabled={!image || !meaning}
                className="w-full max-w-[280px] py-5 rounded-[2rem] bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold uppercase tracking-[0.2em] shadow-2xl shadow-pink-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-3"
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
              <h3 className="font-serif text-2xl text-slate-100">Revelação Final</h3>
              <button 
                onClick={() => setIsPreviewMode(false)}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
              >
                <X className="w-4 h-4" /> Editar
              </button>
            </div>

            <BentoBox className="overflow-hidden border-pink-500/20 bg-[#0f0c1a]">
              <div className="aspect-[4/5] relative">
                <img src={image!} alt="Final" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c1a] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-500 text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" /> Carta do Dia
                  </div>
                  <p className="text-slate-100 font-serif text-lg leading-relaxed italic">
                    "{meaning}"
                  </p>
                </div>
              </div>
            </BentoBox>

            <button 
              className="w-full py-5 rounded-[2rem] bg-emerald-600 text-white font-bold uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
              onClick={() => {
                alert('Carta publicada com sucesso!');
                setIsPreviewMode(false);
                setImage(null);
                setMeaning('');
                setInstagramCaption('');
              }}
            >
              Publicar na Plataforma <Check className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
