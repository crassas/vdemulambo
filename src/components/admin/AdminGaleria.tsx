import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, Plus, X, Upload, MoreVertical, Edit2, Trash2, Smartphone, Check, Sparkles } from 'lucide-react';
import { BentoBox } from '../BentoBox';

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

const MOCK_POSTS: Post[] = [
  { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80', category: 'Trabalhos', visibility: 'app_only', caption: 'Abertura de Caminhos ✨', date: new Date() },
  { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80', category: 'Cartas do dia', visibility: 'instagram_too', caption: 'A Estrela - Mensagem de hoje', date: new Date() },
  { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1507652313656-b7af0d937086?auto=format&fit=crop&w=400&q=80', category: 'Mensagens', visibility: 'draft', caption: 'Reflexão da semana', date: new Date() },
];

export function AdminGaleria() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewPostFile(url);
      setNewPostType(file.type.startsWith('video/') ? 'video' : 'image');
      setIsCreating(true);
    }
  };

  const handlePublish = () => {
    if (!newPostFile) return;
    const post: Post = {
      id: Date.now().toString(),
      type: newPostType,
      url: newPostFile,
      category: newPostCategory,
      visibility: newPostVisibility,
      caption: newPostCaption,
      date: new Date()
    };
    setPosts([post, ...posts]);
    setIsCreating(false);
    resetForm();
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
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-slate-100">Galeria</h2>
            <p className="text-[10px] text-pink-500/50 uppercase tracking-[0.2em] font-bold">Gestão de Conteúdo</p>
          </div>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-[#0a0812] rounded-xl font-bold transition-all w-full sm:w-auto"
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
      <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat 
                ? 'bg-pink-500 text-[#0a0812]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {filteredPosts.map(post => (
          <div 
            key={post.id} 
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl bg-white/5"
            onClick={() => setPreviewPost(post)}
          >
            {post.type === 'image' ? (
              <img src={post.url} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <video src={post.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center">
              {post.type === 'video' && <Video className="w-6 h-6 text-white mb-2 shadow-lg" />}
              <p className="text-white text-xs font-medium truncate w-full">{post.caption || 'Sem descrição'}</p>
            </div>

            {/* Visibility Badge */}
            <div className="absolute top-2 right-2 flex gap-1">
              {post.visibility === 'app_only' && (
                <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center shadow-lg" title="Exclusivo na App">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              {post.visibility === 'draft' && (
                <div className="w-4 h-4 rounded-full bg-slate-500 flex items-center justify-center shadow-lg" title="Rascunho">
                  <Edit2 className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Nenhuma publicação encontrada nesta categoria.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && newPostFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#030305]/90 backdrop-blur-sm" onClick={() => { setIsCreating(false); resetForm(); }} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0f0c1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h3 className="font-serif text-lg text-slate-100">Nova Publicação</h3>
                <button onClick={() => { setIsCreating(false); resetForm(); }} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {/* Preview */}
                <div className="aspect-square w-full sm:w-2/3 mx-auto bg-black rounded-xl overflow-hidden flex items-center justify-center">
                  {newPostType === 'image' ? (
                    <img src={newPostFile} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <video src={newPostFile} controls className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Legenda</label>
                    <textarea 
                      value={newPostCaption}
                      onChange={e => setNewPostCaption(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 min-h-[80px] custom-scrollbar"
                      placeholder="Escreva uma legenda..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Categoria</label>
                    <select 
                      value={newPostCategory}
                      onChange={e => setNewPostCategory(e.target.value as Category)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-pink-500/50 appearance-none"
                    >
                      {categories.filter(c => c !== 'Todas').map(cat => (
                        <option key={cat} value={cat} className="bg-[#0f0c1a]">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">Visibilidade</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="radio" name="visibility" checked={newPostVisibility === 'app_only'} onChange={() => setNewPostVisibility('app_only')} className="accent-pink-500 w-4 h-4" />
                        <div>
                          <p className="text-sm text-slate-200 font-medium">Publicar apenas na aplicação</p>
                          <p className="text-xs text-rose-400">✨ Exclusivo para a comunidade da aplicação.</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="radio" name="visibility" checked={newPostVisibility === 'instagram_too'} onChange={() => setNewPostVisibility('instagram_too')} className="accent-pink-500 w-4 h-4" />
                        <div>
                          <p className="text-sm text-slate-200 font-medium flex items-center gap-2">Publicar também no Instagram <Smartphone className="w-3 h-3 text-slate-400" /></p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="radio" name="visibility" checked={newPostVisibility === 'draft'} onChange={() => setNewPostVisibility('draft')} className="accent-pink-500 w-4 h-4" />
                        <div>
                          <p className="text-sm text-slate-200 font-medium">Guardar como rascunho</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/5 bg-white/5 flex gap-3">
                <button onClick={() => { setIsCreating(false); resetForm(); }} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl font-bold transition-all">Cancelar</button>
                <button onClick={handlePublish} className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-[#0a0812] rounded-xl font-bold transition-all flex items-center justify-center gap-2">
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
            <div className="absolute inset-0 bg-[#030305]/95 backdrop-blur-md" onClick={() => setPreviewPost(null)} />
            
            <button 
              onClick={() => setPreviewPost(null)}
              className="absolute top-4 right-4 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row bg-[#0f0c1a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                {previewPost.type === 'image' ? (
                  <img src={previewPost.url} alt={previewPost.caption} className="w-full h-full object-contain" />
                ) : (
                  <video src={previewPost.url} controls className="w-full h-full object-contain" />
                )}
              </div>
              <div className="w-full md:w-80 border-l border-white/5 bg-[#0f0c1a] flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Mentora" className="w-8 h-8 rounded-full border border-pink-500/30" />
                    <span className="text-sm font-bold text-slate-200">Mentora Mulambo</span>
                  </div>
                  <button className="text-slate-400 hover:text-white p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                  <p className="text-slate-200 text-sm whitespace-pre-wrap">{previewPost.caption}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-slate-400 uppercase tracking-widest">{previewPost.category}</span>
                    {previewPost.visibility === 'app_only' && (
                      <span className="px-2 py-1 rounded bg-rose-500/20 text-[10px] text-rose-400 uppercase tracking-widest border border-rose-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Exclusivo App
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 bg-white/5 flex gap-2">
                  <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Edit2 className="w-3 h-3" /> Editar
                  </button>
                  <button onClick={() => handleDelete(previewPost.id)} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
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
