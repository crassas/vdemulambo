import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Instagram, 
  Phone, 
  Mail, 
  Edit3, 
  Save, 
  Camera, 
  Heart, 
  Plus, 
  Trash2, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  ExternalLink, 
  Image as ImageIcon,
  MessageCircle,
  Copy,
  Info
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { compressImage, compressBase64IfNeeded } from '../../lib/imageUtils';
import toast from 'react-hot-toast';

export function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/images/avatar.png');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  ]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: 'Krys Ty Oya • Véus de Mulambo',
    role: 'Mentora • Cartomante • Orientação Pessoal',
    bio: '💃 @veus.demulambo | Cartomancia, Baralho Cigano, Leitura de Cartas e Orientação Pessoal com a força de Maria Mulambo. Atendimentos com sigilo absoluto, verdade e abertura de caminhos.',
    quote: '"A ponte para a tua clareza e paz de espírito. Orientação sincera para o teu caminho."',
    specialties: [
      'Cartomancia Tradicional', 
      'Baralho Cigano', 
      'Tarot de Pombagira', 
      'Abertura de Caminhos', 
      'Orientação Pessoal', 
      'Proteção & Limpeza'
    ],
    instagram: '@veus.demulambo',
    whatsapp: '+351 912 345 678',
    email: 'contacto@cartomantemulambo.pt'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'settings', 'profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.info) {
            setProfile(prev => ({
              ...prev,
              ...data.info,
              role: data.info.specialties?.[0] || prev.role
            }));
          }
          if (data.image) setProfileImage(data.image);
          if (data.gallery && data.gallery.length > 0) setGallery(data.gallery);
        }
      } catch(e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 0.75);
        setProfileImage(compressed);
        toast.success('Fotografia de perfil atualizada!');
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar a fotografia.');
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (gallery.length >= 6) {
        toast.error('Limite máximo de 6 fotografias na galeria.');
        return;
      }
      try {
        const compressed = await compressImage(file, 800, 0.75);
        setGallery(prev => [...prev, compressed]);
        toast.success('Foto adicionada à galeria!');
      } catch (err) {
        console.error(err);
        toast.error('Erro ao adicionar foto.');
      }
    }
  };

  const handleSave = async () => {
    try {
      toast.loading('A otimizar e guardar perfil...', { id: 'saving-profile' });
      const docRef = doc(db, 'settings', 'profile');
      
      const compressedImg = await compressBase64IfNeeded(profileImage, 600, 0.75);
      const cappedGallery = gallery.slice(0, 6);
      const compressedGallery = await Promise.all(
        cappedGallery.map(img => compressBase64IfNeeded(img, 800, 0.75))
      );

      await setDoc(docRef, {
        info: profile,
        image: compressedImg,
        gallery: compressedGallery
      }, { merge: true });

      toast.success('Perfil de Mentora atualizado na base de dados!', {
        id: 'saving-profile',
        style: { background: '#140E26', color: '#E0B1CB', border: '1px solid rgba(255, 255, 255, 0.1)' }
      });
      setIsEditing(false);
    } catch (e: any) {
      console.error(e);
      toast.error('Erro ao guardar alterações: ' + (e.message || 'Erro no servidor'), { id: 'saving-profile' });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
    toast.success('Foto removida da galeria.');
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim()) return;
    if (profile.specialties.includes(newSpecialty.trim())) {
      toast.error('Especialidade já existe.');
      return;
    }
    setProfile(prev => ({ ...prev, specialties: [...prev.specialties, newSpecialty.trim()] }));
    setNewSpecialty('');
  };

  const removeSpecialty = (spec: string) => {
    setProfile(prev => ({ ...prev, specialties: prev.specialties.filter(s => s !== spec) }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-28 max-w-5xl mx-auto font-sans"
    >
      {/* Sticky Top Control Toolbar */}
      <div className="sticky top-2 z-40 flex items-center justify-between bg-[#140E26]/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-5 py-3.5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold text-cream leading-none">
              Perfil da Mentora
            </h1>
            <span className="text-[10px] text-muted-foreground font-medium">
              Gestão de Identidade Pública & Contactos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 ${
              isEditing 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white shadow-emerald-500/20' 
                : 'bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26]'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Alterações</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Editar Perfil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Portrait, Status & Quick Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-7 text-center flex flex-col items-center bg-gradient-to-b from-[#140E26] via-[#110B22] to-[#0C0A14] border border-white/10 rounded-[32px] shadow-2xl relative overflow-hidden">
            
            {/* Top halo glow */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E0B1CB]/40 to-transparent" />
            
            {/* Portrait Container */}
            <div className="relative mb-5 group cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#090612] relative">
                  <img 
                    src={profileImage} 
                    alt="Kris Ty Oya" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Upload Overlay Button */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2.5 rounded-full bg-[#E0B1CB] text-[#140E26] shadow-xl hover:scale-110 transition-transform cursor-pointer border-2 border-[#090612]"
                title="Alterar Fotografia"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {/* Name / Role Form or Display */}
            {isEditing ? (
              <div className="w-full space-y-3 mb-3">
                <div>
                  <label className="text-[10px] font-extrabold text-[#E0B1CB] uppercase tracking-wider block mb-1">
                    Nome Visível
                  </label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#090612] border border-white/10 rounded-xl px-3 py-2 text-center text-sm font-bold text-cream focus:border-[#E0B1CB]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#E0B1CB] uppercase tracking-wider block mb-1">
                    Cargo / Subtítulo
                  </label>
                  <input 
                    type="text" 
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full bg-[#090612] border border-white/10 rounded-xl px-3 py-2 text-center text-xs text-muted-foreground focus:border-[#E0B1CB]"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <h2 className="font-serif text-2xl font-bold text-cream tracking-tight mb-1">
                  {profile.name}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 text-[#E0B1CB] text-[10px] font-extrabold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-[#E0B1CB]" />
                  <span>{profile.role}</span>
                </div>
              </div>
            )}

            {/* Verification Status */}
            <div className="w-full pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Perfil Verificado</span>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-xl font-serif font-bold text-cream block">+10 Anos</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Experiência</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-xl font-serif font-bold text-cream block">+5.000</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Consultas</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Specialties & Quote (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Biography & Quote Card */}
          <div className="p-7 bg-gradient-to-b from-[#140E26] via-[#110B22] to-[#0C0A14] border border-white/10 rounded-[32px] shadow-2xl relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#E0B1CB] flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" /> A Minha Biografia & Apresentação
              </h3>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-extrabold text-[#E0B1CB] uppercase tracking-wider block mb-1">
                    Citação / Mensagem Inspiradora
                  </label>
                  <input 
                    type="text"
                    value={profile.quote}
                    onChange={(e) => setProfile({ ...profile, quote: e.target.value })}
                    className="w-full bg-[#090612] border border-white/10 rounded-xl p-3 text-xs text-cream focus:border-[#E0B1CB]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#E0B1CB] uppercase tracking-wider block mb-1">
                    Texto Biográfico
                  </label>
                  <textarea 
                    rows={4}
                    className="w-full bg-[#090612] border border-white/10 rounded-2xl p-4 text-xs text-cream focus:border-[#E0B1CB] resize-none leading-relaxed"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.quote && (
                  <blockquote className="p-4 rounded-2xl bg-[#090612]/80 border-l-2 border-[#E0B1CB] font-serif italic text-sm text-cream/90 leading-relaxed">
                    {profile.quote}
                  </blockquote>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Specialties Badges Section */}
            <div className="mt-7 pt-6 border-t border-white/10">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-3.5">
                Especialidades & Cartas
              </h4>
              
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((spec, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-1.5 rounded-full bg-[#9F86C0]/15 border border-[#9F86C0]/30 text-[#E0B1CB] text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <span>{spec}</span>
                    {isEditing && (
                      <button 
                        type="button"
                        onClick={() => removeSpecialty(spec)} 
                        className="text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex items-center gap-2 mt-4 p-1.5 bg-[#090612] border border-white/10 rounded-2xl max-w-sm">
                  <input 
                    type="text"
                    placeholder="Adicionar especialidade..."
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-1.5 text-xs text-cream outline-none placeholder:text-muted-foreground"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialty();
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={addSpecialty}
                    className="p-2 rounded-xl bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] text-[#140E26] hover:brightness-110 transition-all cursor-pointer font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Full-width Gallery Section */}
        <div className="lg:col-span-12">
          <div className="p-7 bg-gradient-to-b from-[#140E26] via-[#110B22] to-[#0C0A14] border border-white/10 rounded-[32px] shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#E0B1CB]" />
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#E0B1CB]">
                  Galeria de Fotografias
                </h3>
              </div>
              {isEditing && (
                <div>
                  <input 
                    type="file" 
                    ref={galleryInputRef} 
                    onChange={handleGalleryUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Foto</span>
                  </button>
                </div>
              )}
            </div>

            {gallery.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/5 text-muted-foreground text-xs italic">
                Nenhuma foto adicionada à galeria.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square relative group overflow-hidden bg-[#090612] rounded-2xl border border-white/10">
                    <img 
                      src={img} 
                      alt={`Galeria ${idx}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="p-3 rounded-full bg-rose-500 text-white shadow-xl hover:scale-110 transition-transform cursor-pointer"
                          title="Apagar Foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="lg:col-span-12">
          <div className="p-7 bg-gradient-to-b from-[#140E26] via-[#110B22] to-[#0C0A14] border border-white/10 rounded-[32px] shadow-2xl">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#E0B1CB] mb-5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#E0B1CB]" /> Canais de Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ContactCard 
                icon={Instagram} 
                label="Instagram" 
                value={profile.instagram} 
                isEditing={isEditing} 
                onChange={(val) => setProfile({ ...profile, instagram: val })}
                onCopy={() => copyToClipboard(profile.instagram, 'Instagram')}
                actionUrl={`https://instagram.com/${profile.instagram.replace('@', '')}`}
              />
              <ContactCard 
                icon={MessageCircle} 
                label="WhatsApp" 
                value={profile.whatsapp} 
                isEditing={isEditing} 
                onChange={(val) => setProfile({ ...profile, whatsapp: val })}
                onCopy={() => copyToClipboard(profile.whatsapp, 'WhatsApp')}
                actionUrl={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
              />
              <ContactCard 
                icon={Mail} 
                label="E-mail Directo" 
                value={profile.email} 
                isEditing={isEditing} 
                onChange={(val) => setProfile({ ...profile, email: val })}
                onCopy={() => copyToClipboard(profile.email, 'E-mail')}
                actionUrl={`mailto:${profile.email}`}
              />
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <Info className="w-4 h-4 text-[#E0B1CB] shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Plataforma exclusiva para organização e comunicação espiritual.
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function ContactCard({ 
  icon: Icon, 
  label, 
  value, 
  isEditing, 
  onChange,
  onCopy,
  actionUrl
}: { 
  icon: React.ElementType, 
  label: string, 
  value: string, 
  isEditing?: boolean, 
  onChange?: (val: string) => void,
  onCopy?: () => void,
  actionUrl?: string
}) {
  return (
    <div className="p-5 rounded-2xl bg-[#090612]/80 border border-white/10 flex flex-col justify-between gap-3 group hover:border-[#9F86C0]/40 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center text-[#E0B1CB]">
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-extrabold">{label}</span>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1">
            {onCopy && (
              <button 
                type="button"
                onClick={onCopy}
                className="p-1.5 rounded-lg text-stone-400 hover:text-cream hover:bg-white/10 transition-colors cursor-pointer"
                title="Copiar"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            {actionUrl && (
              <a 
                href={actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-stone-400 hover:text-[#E0B1CB] hover:bg-white/10 transition-colors"
                title="Abrir"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {isEditing && onChange ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#090612] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-cream focus:border-[#E0B1CB] w-full"
        />
      ) : (
        <span className="text-sm font-bold text-cream truncate">{value}</span>
      )}
    </div>
  );
}
