import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, Plus, X, Upload, MoreVertical, Edit2, Trash2, Smartphone, Check, Sparkles } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import toast from 'react-hot-toast';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { compressImage } from '../../lib/imageUtils';

type Category = 'Todas' | 'Cartas do dia' | 'Mensagens' | 'Trabalhos' | 'Vídeos' | 'Testemunhos';
type Visibility = 'app_only' | 'instagram_too' | 'draft';

interface Post {
  id: string;
  type: 'image' | 'video';
  url: string;
  category: Category;
  visibility: Visibility;
  caption: string;
  date: Date;
}



export function AdminGaleria() {
  const [posts, setPosts] = useState<Post[]>([]);

  React.useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
      setPosts(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
    return () => unsub();
  }, []);
  const [activeCategory, setActiveCategory] = useState<Category>('Todas');
  const [isCreating, setIsCreating] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Post Form State
  const [newPostFile, setNewPostFile] = useState<string | null>(null);
  const [newPostType, setNewPostType] = useState<'image'|'video'>('image');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<Category>('Cartas do dia');
  const [newPostVisibility, setNewPostVisibility] = useState<Visibility>('app_only');

  const categories: Category[] = ['Todas', 'Cartas do dia', 'Mensagens', 'Trabalhos', 'Vídeos', 'Testemunhos'];

  const filteredPosts = posts.filter(p => activeCategory === 'Todas' || p.category === activeCategory);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let base64: string;
        if (file.type.startsWith('video/')) {
          if (file.size > 800 * 1024) {
            toast.error('O ficheiro de vídeo excede o tamanho máximo permitido (800KB).');
            return;
          }
          base64 = await fileToBase64(file);
        } else {
          base64 = await compressImage(file, 900, 0.75);
        }
        setNewPostFile(base64);
        setNewPostType(file.type.startsWith('video/') ? 'video' : 'image');
        setIsCreating(true);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao processar ficheiro.');
      }
    }
  };

    const handlePublish = async () => {
    if (!newPostFile) return;

    try {
      await addDoc(collection(db, 'posts'), {
        type: newPostType,
        url: newPostFile,
        caption: newPostCaption,
        category: newPostCategory,
        visibility: newPostVisibility,
        date: new Date().toISOString()
      });
      toast.success('Publicado com sucesso!');
      setIsCreating(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao publicar.');
    }
  };

  const resetForm = () => {
    setNewPostFile(null);
    setNewPostCaption('');
    setNewPostCategory('Cartas do dia');
    setNewPostVisibility('app_only');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    setPreviewPost(null);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#9F86C0]/15 border border-[#9F86C0]/30 flex items-center justify-center text-[#E0B1CB] shadow-inner">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl text-foreground">Galeria</h2>
            <p className="text-[10px] text-accent/60 uppercase tracking-[0.2em] font-bold">Gestão de Conteúdo</p>
          </div>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(159,134,192,0.35)] transition-all cursor-pointer hover:scale-102 hover:brightness-110"
        >
          <Plus className="w-4 h-4" /> Nova Publicação
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*,video/*" 
          className="hidden" 
        />
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-2.5 pb-3.5 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat 
                ? 'bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] shadow-[0_0_12px_rgba(159,134,192,0.35)]' 
                : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredPosts.map(post => (
          <div 
            key={post.id} 
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-[24px] border border-white/10 shadow-lg bg-[#090612]/30"
            onClick={() => setPreviewPost(post)}
          >
            {post.type === 'image' ? (
              <img src={post.url} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <video src={post.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            )}
            
            <div className="absolute inset-0 bg-[#090612]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
              {post.type === 'video' && <Video className="w-6 h-6 text-accent mb-2 shadow-lg" />}
              <p className="text-foreground text-xs font-serif font-bold italic truncate w-full">{post.caption || 'Sem descrição'}</p>
            </div>

            {/* Visibility Badge */}
            <div className="absolute top-3 right-3 flex gap-1">
              {post.visibility === 'app_only' && (
                <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-md flex items-center justify-center shadow-lg" title="Exclusivo na App">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                </div>
              )}
              {post.visibility === 'draft' && (
                <div className="w-6 h-6 rounded-full bg-slate-500/20 border border-slate-500/40 backdrop-blur-md flex items-center justify-center shadow-lg" title="Rascunho">
                  <Edit2 className="w-3.5 h-3.5 text-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-24 text-muted-foreground bg-white/[0.02] border border-white/5 rounded-[28px] max-w-md mx-auto">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-30 text-accent" />
          <p className="font-serif italic text-sm">Nenhuma publicação encontrada nesta categoria.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && newPostFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={() => { setIsCreating(false); resetForm(); }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#090612]/95 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#090612]/40">
                <h3 className="font-serif font-bold text-lg text-foreground">Nova Publicação</h3>
                <button onClick={() => { setIsCreating(false); resetForm(); }} className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-white/5 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {/* Preview */}
                <div className="aspect-square w-full sm:w-2/3 mx-auto bg-white/5 border border-white/10 rounded-[24px] overflow-hidden flex items-center justify-center">
                  {newPostType === 'image' ? (
                    <img src={newPostFile} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <video src={newPostFile} controls className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-2 block">Legenda</label>
                    <textarea 
                      value={newPostCaption}
                      onChange={e => setNewPostCaption(e.target.value)}
                      className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] p-4 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-[#9F86C0]/50 min-h-[90px] custom-scrollbar"
                      placeholder="Escreva uma legenda inspiradora..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-2 block">Categoria</label>
                    <div className="relative">
                      <select 
                        value={newPostCategory}
                        onChange={e => setNewPostCategory(e.target.value as Category)}
                        className="w-full bg-[#090612]/80 border border-white/10 rounded-[20px] p-4 text-foreground focus:outline-none focus:border-[#9F86C0]/50 appearance-none"
                      >
                        {categories.filter(c => c !== 'Todas').map(cat => (
                          <option key={cat} value={cat} className="bg-[#090612] text-foreground">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-2 block">Visibilidade</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-4 rounded-[20px] border border-white/10 bg-[#090612]/60 cursor-pointer hover:border-[#9F86C0]/50 transition-all">
                        <input type="radio" name="visibility" checked={newPostVisibility === 'app_only'} onChange={() => setNewPostVisibility('app_only')} className="accent-[#9F86C0] w-4 h-4" />
                        <div>
                          <p className="text-sm text-foreground font-medium">Publicar apenas na aplicação</p>
                          <p className="text-xs text-accent">✨ Conteúdo exclusivo para consulentes.</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-[20px] border border-white/10 bg-[#090612]/60 cursor-pointer hover:border-[#9F86C0]/50 transition-all">
                        <input type="radio" name="visibility" checked={newPostVisibility === 'instagram_too'} onChange={() => setNewPostVisibility('instagram_too')} className="accent-[#9F86C0] w-4 h-4" />
                        <div>
                          <p className="text-sm text-foreground font-medium flex items-center gap-2">Publicar também no Instagram <Smartphone className="w-3.5 h-3.5 text-muted-foreground" /></p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-[20px] border border-white/10 bg-[#090612]/60 cursor-pointer hover:border-[#9F86C0]/50 transition-all">
                        <input type="radio" name="visibility" checked={newPostVisibility === 'draft'} onChange={() => setNewPostVisibility('draft')} className="accent-[#9F86C0] w-4 h-4" />
                        <div>
                          <p className="text-sm text-foreground font-medium">Guardar como rascunho</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 flex gap-3 bg-[#090612]/40">
                <button onClick={() => { setIsCreating(false); resetForm(); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-foreground rounded-full font-bold transition-all cursor-pointer">Cancelar</button>
                <button onClick={handlePublish} className="flex-1 py-3 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold rounded-full transition-all cursor-pointer shadow-[0_0_12px_rgba(159,134,192,0.25)] flex justify-center items-center gap-2">
                  <Check className="w-4 h-4" /> Publicar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View/Edit Modal */}
      <AnimatePresence>
        {previewPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md" onClick={() => setPreviewPost(null)} />
            
            <button 
              onClick={() => setPreviewPost(null)}
              className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row bg-[#090612]/95 rounded-[28px] overflow-hidden border border-white/10 shadow-2xl"
            >
              <div className="flex-1 bg-black/40 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                {previewPost.type === 'image' ? (
                  <img src={previewPost.url} alt={previewPost.caption} className="w-full h-full object-contain" />
                ) : (
                  <video src={previewPost.url} controls className="w-full h-full object-contain" />
                )}
              </div>
              <div className="w-full md:w-80 border-l border-white/10 flex flex-col bg-[#090612]/40">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#090612]/40">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Cartomante" className="w-8 h-8 rounded-full border border-white/15" />
                    <span className="text-sm font-serif font-bold text-foreground">Kris Ty Oya</span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-white/5 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-5 flex-1 overflow-y-auto">
                  <p className="text-foreground text-sm font-serif leading-relaxed whitespace-pre-wrap">"{previewPost.caption}"</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{previewPost.category}</span>
                    {previewPost.visibility === 'app_only' && (
                      <span className="px-3 py-1 rounded-full bg-[#E0B1CB]/20 text-[10px] text-[#E0B1CB] uppercase tracking-widest border border-[#E0B1CB]/30 flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3" /> Exclusivo App
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-white/10 flex gap-2.5 bg-[#090612]/40">
                  <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10">
                    <Edit2 className="w-3 h-3" /> Editar
                  </button>
                  <button onClick={() => handleDelete(previewPost.id)} className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-500/20">
                    <Trash2 className="w-3 h-3" /> Apagar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
