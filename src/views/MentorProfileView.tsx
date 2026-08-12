import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  Moon, 
  Edit3, 
  Check, 
  X, 
  Instagram, 
  Mail,
  ExternalLink,
  Award,
  ShieldCheck,
  Compass,
  Heart,
  User,
  Info,
  ArrowRight
} from 'lucide-react';
import { DecksSection } from '../components/DecksSection';
import { InstagramFeed } from '../components/InstagramFeed';
import { doc, getDoc, setDoc, collection, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { compressBase64IfNeeded } from '../lib/imageUtils';
import toast from 'react-hot-toast';

interface ProfileData {
  name: string;
  role: string;
  quote: string;
  bio: string;
  avatarUrl: string;
  gallery: string[];
}

export function MentorProfileView({ onSelectConsultation }: { onSelectConsultation: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Kris Ty Oya",
    role: "Cartomante & Orientadora de Caminhos",
    bio: "Dedicada a ouvir-te e a encontrar clareza para os teus desafios. Através das minhas cartas e da minha experiência, ajudo-te a ver o que está escondido com total sigilo e verdade.",
    quote: '"Às vezes, só precisas de alguém que veja o que o teu coração já sabe. Estou aqui para essa conversa."',
    avatarUrl: "/images/avatar.png",
    gallery: []
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'settings', 'profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.info) {
             let loadedName = data.info.name || profile.name;
             if (loadedName === 'Kris Ty Oya' || loadedName === 'Kris') {
               loadedName = 'Kris Ty Oya';
             }
             const updated = {
               name: loadedName,
               bio: data.info.bio || profile.bio,
               role: data.info.specialties?.[0] || profile.role,
               quote: data.info.quote || profile.quote,
               avatarUrl: data.image || profile.avatarUrl,
               gallery: profile.gallery
             };
             setProfile(updated);
             setEditForm(updated);
          }
        }
      } catch(e) {
        console.error(e);
      }
    };
    fetchProfile();
    
    // Subscribe to gallery posts
    const q = query(collection(db, 'posts'));
    const unsub = onSnapshot(q, (snap) => {
      const posts = snap.docs.map(d => d.data() as { url: string; visibility: string });
      const gallery = posts.filter(p => p.visibility !== 'draft').map(p => p.url);
      setProfile(prev => ({ ...prev, gallery }));
    });
    return () => unsub();
  }, []);

  const [editForm, setEditForm] = useState<ProfileData>(profile);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const compressedAvatar = await compressBase64IfNeeded(editForm.avatarUrl, 600, 0.75);

      // 1. Update general settings profile
      const docRef = doc(db, 'settings', 'profile');
      await setDoc(docRef, {
        image: compressedAvatar,
        info: {
          name: editForm.name,
          bio: editForm.bio,
          quote: editForm.quote,
          specialties: [editForm.role]
        }
      }, { merge: true });

      // 2. Also update current admin's user doc
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          nome: editForm.name,
          fotoPerfil: compressedAvatar
        }, { merge: true });
      }

      setProfile({ ...editForm, avatarUrl: compressedAvatar });
      setIsEditing(false);
      toast.success('Perfil guardado com sucesso na base de dados!', {
        style: { background: '#140E26', color: '#E0B1CB', border: '1px solid rgba(255, 255, 255, 0.1)' }
      });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao guardar as definições no servidor.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-10 pb-24 relative px-4 sm:px-6"
    >
      {/* Immersive Atmospheric Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-gradient-to-b from-[#9F86C0]/10 via-[#E0B1CB]/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* 1. Hero Header & Bio Section */}
      <section className="relative pt-2">
        <div className="p-6 sm:p-8 rounded-[36px] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E0B1CB]/5 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
            {/* Portrait Avatar */}
            <div className="relative shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#090612] border-4 border-[#090612]">
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 right-1 z-20">
                <div className="bg-[#090612] border border-emerald-500/50 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Online</span>
                </div>
              </div>
            </div>

            {/* Profile Information & Bio */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-cream tracking-tight mb-1">
                  {profile.name}
                </h1>
                <p className="text-[#E0B1CB] text-xs font-black uppercase tracking-[0.25em]">
                  {profile.role}
                </p>
              </div>

              {/* Quote */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 italic text-cream/90 text-sm font-serif">
                {profile.quote}
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-muted-foreground/90 font-medium leading-relaxed">
                {profile.bio}
              </p>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onSelectConsultation}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] text-[#140E26] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg hover:brightness-110 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Marcar Conversa</span>
                </motion.button>

                <a
                  href="https://instagram.com/veus.demulambo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-cream text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-[#E0B1CB]" />
                  <span>@veus.demulambo</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Stats Bar (Compact) */}
      <section className="hidden">
        {[
          { value: "+10 Anos", label: "Experiência", icon: Award },
          { value: "+5.000", label: "Vidas", icon: Heart },
          { value: "Absoluto", label: "Sigilo", icon: ShieldCheck }
        ].map((stat, i) => (
          <div 
            key={i} 
            className="p-4 rounded-2xl bg-white/[0.015] border border-white/5 text-center flex flex-col items-center justify-center space-y-1"
          >
            <stat.icon className="w-4 h-4 text-[#E0B1CB] mb-0.5" />
            <span className="text-lg font-serif font-black text-cream block leading-none">{stat.value}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#E0B1CB]/70">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* 3. GALERIA - DIRECTLY BELOW BIO & PERFIL */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#E0B1CB] animate-pulse" />
            <h2 className="font-serif text-xl sm:text-2xl font-black text-cream tracking-tight">Galeria da Mentora</h2>
          </div>
        </div>

        {profile.gallery.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 text-muted-foreground text-xs italic">
            Nenhuma foto disponível na galeria.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profile.gallery.map((img, idx) => (
              <div key={idx} className="aspect-square relative group overflow-hidden bg-[#090612] rounded-2xl border border-white/10">
                <img 
                  src={img} 
                  alt={`Galeria ${idx}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Specialties & Contact Details Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specialties */}
        <div className="p-6 rounded-[32px] bg-white/[0.015] border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif text-lg font-bold text-cream">O que posso fazer por ti</h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              "Cartas & Baralho Cigano",
              "Leituras de Tarot",
              "Ajuda em Questões Pessoais",
              "Limpezas de Caminhos",
              "Adoçamentos & Questões Amorosas",
              "Orientação e Proteção Diária"
            ].map((spec, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-cream/80 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts */}
        <div className="hidden">
          <div>
            <h3 className="font-serif text-lg font-bold text-cream mb-4">Fala Comigo</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A059]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-muted-foreground block">Contacto</span>
                  <p className="text-xs font-bold text-cream">+351 912 345 678</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#9F86C0]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-muted-foreground block">E-mail</span>
                  <p className="text-xs font-bold text-cream">contacto@cartomantemulambo.pt</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center gap-2.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Atendimento 100% privado e confidencial.</span>
          </div>
        </div>
      </section>

      {/* Oracles Tags */}
      <DecksSection onSelectConsultation={onSelectConsultation} />

      {/* Edit Trigger - Discreet */}
      <div className="hidden">
        <button
          onClick={() => {
            setEditForm(profile);
            setIsEditing(true);
          }}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-[#E0B1CB] transition-all group px-6 py-2 rounded-full hover:bg-white/[0.02] cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span>Configurações do Perfil</span>
        </button>
      </div>

      {/* Edit Profile Modal Overhaul */}
      <AnimatePresence>
        {false && isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-gradient-to-b from-[#140E26] to-[#090612] border border-white/10 rounded-[44px] p-8 sm:p-10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] space-y-8 max-h-[90vh] overflow-y-auto relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E0B1CB]/40 to-transparent" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#E0B1CB]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-black text-cream">Minha Identidade</h3>
                    <span className="text-[10px] text-[#E0B1CB] font-black uppercase tracking-widest">A Minha Presença</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 text-muted-foreground hover:text-cream transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#E0B1CB] uppercase tracking-[0.2em] ml-1">Como me apresento</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-cream text-sm font-semibold focus:border-[#E0B1CB]/40 outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#E0B1CB] uppercase tracking-[0.2em] ml-1">O que faço</label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-cream text-sm font-semibold focus:border-[#E0B1CB]/40 outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#E0B1CB] uppercase tracking-[0.2em] ml-1">Frase de Boas-vindas</label>
                  <textarea
                    rows={2}
                    value={editForm.quote}
                    onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-cream text-sm font-semibold focus:border-[#E0B1CB]/40 outline-none transition-all shadow-inner resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#E0B1CB] uppercase tracking-[0.2em] ml-1">Sobre mim</label>
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-cream text-sm font-semibold focus:border-[#E0B1CB]/40 outline-none transition-all shadow-inner leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3.5 rounded-2xl bg-white/5 text-muted-foreground text-xs font-black uppercase tracking-widest hover:text-cream transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] text-[#140E26] text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:brightness-110 flex items-center gap-3"
                  >
                    <Check className="w-5 h-5" />
                    <span>Guardar Alterações</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
