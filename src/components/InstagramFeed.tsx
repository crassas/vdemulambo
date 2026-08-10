import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Grid, PlaySquare, Heart, MessageCircle, X, ExternalLink, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface InstagramPost {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  category: 'Trabalhos' | 'Baralho' | 'Reels' | 'Ritual' | 'Conselho';
  instagramUrl?: string;
}

const DEFAULT_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'reel-1',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80',
    caption: '🌹 Trabalho de Abertura de Caminhos e Proteção com a força de Dona Maria Mulambo. Que toda energia densa seja afastada e a prosperidade reine nos seus passos! ✨🔥\n\n#veusdemulambo #pombagira #mariamulambo #trabalhoespiritual #aberturadecaminhos',
    likes: 1240,
    comments: 185,
    date: 'Há 1 dia',
    category: 'Trabalhos',
    instagramUrl: 'https://www.instagram.com/reel/DbjG_akzcJA/?igsh=OGZvMGxpNWp5Z280'
  },
  {
    id: 'reel-2',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507652313656-b7af0d937086?auto=format&fit=crop&w=600&q=80',
    caption: '🃏 Leitura e Orientação Pessoal com o Baralho Cigano. Respostas claras para o amor, caminhos e decisões importantes. Salve a Rainha! 👑✨\n\n#baralhocigano #cartomante #cartomancia #kristyoya #veusdemulambo',
    likes: 980,
    comments: 142,
    date: 'Há 2 dias',
    category: 'Reels',
    instagramUrl: 'https://www.instagram.com/reel/DbLLniXzgym/?igsh=MTIwOHV2c3M3dmtjZw=='
  },
  {
    id: 'reel-3',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1447069387366-5085e7d581a0?auto=format&fit=crop&w=600&q=80',
    caption: '🕯️ Firmação Especial e Consagração na Força de Dona Mulambo. Luz, respeito e axé para todos os consulentes que confiam no nosso trabalho espiritual. 💜🌹\n\n#pombagira #mariamulambo #axé #fe #rituals',
    likes: 1510,
    comments: 210,
    date: 'Há 3 dias',
    category: 'Trabalhos',
    instagramUrl: 'https://www.instagram.com/reel/DbJIhM9zTRd/?igsh=MTk1YTZldXd3aHg=='
  },
  {
    id: 'reel-4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80',
    caption: '❤️ Rituais de Adoçamento e Harmonização Amorosa. Conexão profunda e clareza nos sentimentos através do nosso trabalho espiritual. Axé! ✨🕊️\n\n#adocamento #amor #uniao #cartomancia #veusdemulambo',
    likes: 1120,
    comments: 165,
    date: 'Há 4 dias',
    category: 'Reels',
    instagramUrl: 'https://www.instagram.com/reel/DaOd4zdTK9q/?igsh=MXZyOHA2djdnajE0eA=='
  },
  {
    id: 'post-5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    caption: '👑 "Quem tem fé em Mulambo nunca caminha no escuro." Gratidão a todos os consulentes pela confiança diária nas consultas. Axé para todos nós! 🙏✨\n\n#kristyoya #veusdemulambo #pombagira #gratidao',
    likes: 1430,
    comments: 210,
    date: 'Há 5 dias',
    category: 'Conselho',
    instagramUrl: 'https://www.instagram.com/veus.demulambo'
  }
];

export function InstagramFeed() {
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>(DEFAULT_INSTAGRAM_POSTS);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setVideoError(false);
  }, [selectedPost]);

  useEffect(() => {
    try {
      const q = query(collection(db, 'posts'));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const firestorePosts: InstagramPost[] = snap.docs.map(docSnap => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              type: d.type || 'image',
              url: d.url,
              caption: d.caption || 'Publicação do Instagram @veus.demulambo',
              likes: Math.floor(Math.random() * 400) + 300,
              comments: Math.floor(Math.random() * 80) + 20,
              date: d.date ? new Date(d.date).toLocaleDateString('pt-PT') : 'Recente',
              category: d.category || 'Trabalhos',
              instagramUrl: d.instagramUrl || 'https://www.instagram.com/veus.demulambo'
            };
          });
          setPosts([...firestorePosts, ...DEFAULT_INSTAGRAM_POSTS]);
        }
      }, () => {});
      return () => unsub();
    } catch {
      // ignore
    }
  }, []);

  const filteredPosts = posts.filter(p => {
    if (filter === 'images') return p.type === 'image';
    if (filter === 'videos') return p.type === 'video';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E0B1CB]/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#E0B1CB]/10 transition-colors duration-1000" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-[28px] p-1 bg-gradient-to-tr from-[#C5A059] via-[#E0B1CB] to-[#9F86C0] shadow-2xl">
                <div className="w-full h-full rounded-[24px] overflow-hidden bg-[#090612] border-4 border-[#090612]">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" 
                    alt="@veus.demulambo" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] p-1.5 rounded-full shadow-xl">
                <Instagram className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-serif font-black text-cream tracking-tight">@veus.demulambo</h3>
                <CheckCircle2 className="w-5 h-5 text-[#E0B1CB] fill-[#E0B1CB]/20" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#E0B1CB]/60">Presença Digital Sagrada</p>
              <div className="flex items-center gap-4 pt-1 text-[11px] text-muted-foreground/60 font-bold">
                <span className="flex items-center gap-1.5"><span className="text-[#E0B1CB]">15.8k</span> Seguidores</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5"><span className="text-[#E0B1CB]">1.2k</span> Publicações</span>
              </div>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.instagram.com/veus.demulambo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-gradient-to-tr from-[#C5A059] to-[#E0B1CB] text-[#140E26] font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3 shadow-xl hover:shadow-[#C5A059]/20 transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>Seguir no Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </div>

      {/* Tabs / Filter Controls */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex gap-3">
          {[
            { id: 'all', label: 'Tudo', icon: Grid },
            { id: 'images', label: 'Fotos', icon: null },
            { id: 'videos', label: 'Reels', icon: PlaySquare }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 cursor-pointer ${
                filter === t.id
                  ? 'bg-[#E0B1CB] text-[#140E26] shadow-lg'
                  : 'text-muted-foreground/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              {t.icon && <t.icon className="w-3.5 h-3.5" />}
              {t.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hidden sm:inline">
          {filteredPosts.length} Arquivos de Luz
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-square rounded-[32px] overflow-hidden cursor-pointer bg-white/[0.01] border border-white/5 hover:border-[#E0B1CB]/40 transition-all shadow-xl"
          >
            {/* Thumbnail or Video */}
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={post.type === 'video' ? (post.thumbnail || post.url) : post.url}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-500" />
              
              {post.type === 'video' && (
                <div className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#E0B1CB]">
                  <PlaySquare className="w-4 h-4 fill-[#E0B1CB]/20" />
                </div>
              )}
            </div>

            {/* Hover Info */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <div className="flex items-center gap-4 text-[11px] font-black text-cream">
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 fill-[#E0B1CB] text-[#E0B1CB]" /> {post.likes}</span>
                <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4 text-[#E0B1CB]" /> {post.comments}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal for Photo / Video */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="relative w-full max-w-4xl bg-[#0c081e]/90 border border-white/10 rounded-[28px] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh] backdrop-blur-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-foreground flex items-center justify-center border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Player Container */}
              <div className="md:col-span-7 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
                {selectedPost.type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black min-h-[300px]">
                    {!videoError ? (
                      <>
                        <video
                          key={selectedPost.id}
                          src={selectedPost.url}
                          controls
                          autoPlay
                          playsInline
                          preload="auto"
                          muted={isMuted}
                          loop
                          onError={() => setVideoError(true)}
                          className="max-h-[70vh] w-full object-contain"
                        />
                        
                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#090612]/80 backdrop-blur-md text-[10px] text-[#E0B1CB] font-bold border border-[#9F86C0]/30 flex items-center gap-1.5 shadow-lg uppercase tracking-widest">
                            <PlaySquare className="w-3.5 h-3.5 text-[#E0B1CB]" /> Instagram Reel
                          </span>
                        </div>

                        {/* Sound Toggle Button */}
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/80 backdrop-blur-md text-[#E0B1CB] border border-[#9F86C0]/30 hover:scale-105 transition-all z-10 flex items-center gap-2 px-3 text-xs font-bold shadow-xl cursor-pointer"
                        >
                          {isMuted ? (
                            <>
                              <VolumeX className="w-4 h-4 text-[#E0B1CB]" />
                              <span>Sem som (Clique para ouvir)</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4 text-emerald-400" />
                              <span>Som ativado</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 w-full h-full relative">
                        <img 
                          src={selectedPost.thumbnail || selectedPost.url} 
                          alt="Poster" 
                          className="w-full max-h-[50vh] object-cover rounded-[20px] opacity-60"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-6">
                          <div className="p-3 rounded-full bg-pink-500/20 border border-pink-500/40 mb-3">
                            <Instagram className="w-8 h-8 text-pink-400 animate-pulse" />
                          </div>
                          <p className="text-base text-foreground font-bold mb-1">Reel de @veus.demulambo</p>
                          <p className="text-xs text-muted-foreground max-w-xs mb-5 leading-relaxed">
                            Este vídeo está disponível para assistir diretamente no Instagram oficial @veus.demulambo.
                          </p>
                          <a
                            href={selectedPost.instagramUrl || "https://www.instagram.com/veus.demulambo"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3.5 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
                          >
                            <Instagram className="w-4 h-4 text-[#140E26]" /> Assistir Reel no Instagram
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <img
                    src={selectedPost.url}
                    alt={selectedPost.caption}
                    className="max-h-[70vh] w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Information & Instagram Header */}
              <div className="md:col-span-5 p-5 flex flex-col justify-between space-y-4 overflow-y-auto max-h-[70vh] md:max-h-[500px] custom-scrollbar">
                <div>
                  {/* Account Info Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB]">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                          alt="Mentor"
                          className="w-full h-full rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground text-sm">veus.demulambo</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E0B1CB]" />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{selectedPost.date}</span>
                      </div>
                    </div>

                    <a
                      href="https://www.instagram.com/veus.demulambo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 px-3 rounded-full bg-[#9F86C0]/10 text-[#E0B1CB] hover:bg-[#9F86C0]/20 border border-[#9F86C0]/20 transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Instagram className="w-4 h-4 text-[#E0B1CB]" /> Seguir
                    </a>
                  </div>

                  {/* Caption */}
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#9F86C0]/20 text-[#E0B1CB] text-[9px] font-bold border border-[#9F86C0]/30 uppercase tracking-widest">
                      {selectedPost.category}
                    </span>
                    <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line font-normal">
                      {selectedPost.caption}
                    </p>
                  </div>
                </div>

                {/* Footer Interaction Stats */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                        <Heart className="w-4 h-4 fill-rose-500" /> {selectedPost.likes} likes
                      </span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageCircle className="w-4 h-4" /> {selectedPost.comments} comentários
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://www.instagram.com/veus.demulambo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Instagram className="w-4 h-4 text-[#140E26]" /> Ver no Instagram Original
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
