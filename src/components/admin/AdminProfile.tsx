import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Instagram, Phone, Mail, Award, Edit3, Save, Camera, Globe, Heart, Clock, Plus, Trash2 } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import toast from 'react-hot-toast';

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  active: boolean;
}

export function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedBio, setExpandedBio] = useState(false);
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [gallery, setGallery] = useState([
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1447069387366-5085e7d581a0?auto=format&fit=crop&w=300&q=80"
  ]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: 'Mentora Mulambo',
    bio: 'Mentora e orientadora. Dedico a minha vida a guiar as pessoas através da sabedoria das cartas e acompanhamento dedicado. O meu propósito é trazer clareza e paz.',
    specialties: ['Baralho Cigano', 'Limpeza Energética', 'Tarot Evolutivo', 'Orientação Espiritual'],
    instagram: '@mentoramulambo',
    whatsapp: '+351 912 345 678',
    email: 'contacto@mentoramulambo.pt'
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      toast.success('Fotografia atualizada localmente.');
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setGallery([...gallery, url]);
      toast.success('Imagem adicionada à galeria.');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
    toast.success('Imagem removida da galeria.');
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim()) return;
    setProfile({...profile, specialties: [...profile.specialties, newSpecialty.trim()]});
    setNewSpecialty('');
  };

  const removeSpecialty = (spec: string) => {
    setProfile({...profile, specialties: profile.specialties.filter(s => s !== spec)});
  };


  return (
    <div className="space-y-6 pb-20">
      {/* Top Header & Quick Actions */}
      <div className="sticky top-0 z-50 flex justify-between items-center bg-[#0a0812]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shrink-0 shadow-2xl shadow-black/50">
        <h2 className="font-serif text-xl text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-pink-500" /> Perfil Público
        </h2>
        <button 
          onClick={() => {
            setIsEditing(!isEditing);
            if (isEditing) toast.success('Perfil guardado com sucesso.');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            isEditing 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Guardar</> : <><Edit3 className="w-4 h-4" /> Editar</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Photo & Contacts (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <BentoBox className="p-6 border-white/5 bg-white/5 text-center flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-2 border-pink-500/30 shadow-2xl shadow-pink-500/10">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-pink-500 text-white shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {isEditing ? (
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-center font-serif text-xl text-slate-100 focus:outline-none mb-1"
              />
            ) : (
              <h2 className="font-serif text-2xl text-slate-100 mb-1">{profile.name}</h2>
            )}
            <p className="text-[10px] text-pink-500 uppercase tracking-[0.3em] font-bold">Mentora</p>
          </BentoBox>

        </div>

        {/* Right Column: Bio & Specialties (Col span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <BentoBox className="p-6 border-white/5 bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" /> A Minha Biografia
            </h3>
            {isEditing ? (
              <textarea 
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-slate-300 text-sm focus:outline-none focus:border-pink-500/40 transition-all resize-none italic"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            ) : (
              <div>
                <p className={`text-slate-400 text-sm leading-relaxed italic ${!expandedBio ? 'line-clamp-3' : ''}`}>
                  "{profile.bio}"
                </p>
                {profile.bio.length > 100 && (
                  <button 
                    onClick={() => setExpandedBio(!expandedBio)}
                    className="text-pink-500 hover:text-pink-400 text-[10px] font-bold uppercase tracking-widest mt-2 transition-colors"
                  >
                    {expandedBio ? 'Mostrar Menos' : 'Ler Mais...'}
                  </button>
                )}
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((spec, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    {spec}
                    {isEditing && (
                      <button onClick={() => removeSpecialty(spec)} className="hover:text-pink-400 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex items-center gap-2 mt-3 p-1.5 bg-black/20 border border-white/5 rounded-xl max-w-sm">
                  <input 
                    type="text"
                    placeholder="Nova especialidade..."
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-1 text-sm text-slate-200 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialty();
                      }
                    }}
                  />
                  <button 
                    onClick={addSpecialty}
                    className="p-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </BentoBox>

          {/* Horizontal Gallery */}
          <BentoBox className="p-6 border-white/5 bg-white/5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-400" /> Galeria de Fotos
              </h3>
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
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Foto
                  </button>
                </div>
              )}
            </div>

            {gallery.length === 0 ? (
              <p className="text-sm text-slate-400 italic text-center py-4">Nenhuma foto adicionada.</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory custom-scrollbar">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative w-32 h-32 shrink-0 rounded-2xl overflow-hidden border border-white/10 group snap-center">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    {isEditing && (
                      <button 
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </BentoBox>
        </div>
        
        {/* Contacts (Full width at bottom) */}
        <div className="lg:col-span-12">
          <BentoBox className="p-6 border-white/5 bg-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-pink-400" /> Contactos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ContactItem icon={Instagram} label="Instagram" value={profile.instagram} isEditing={isEditing} onChange={(val) => setProfile({...profile, instagram: val})} />
              <ContactItem icon={Phone} label="WhatsApp" value={profile.whatsapp} isEditing={isEditing} onChange={(val) => setProfile({...profile, whatsapp: val})} />
              <ContactItem icon={Mail} label="E-mail" value={profile.email} isEditing={isEditing} onChange={(val) => setProfile({...profile, email: val})} />
            </div>
          </BentoBox>
        </div>
      </div>

    </div>
  );
}

function ContactItem({ icon: Icon, label, value, isEditing, onChange }: { icon: any, label: string, value: string, isEditing?: boolean, onChange?: (val: string) => void }) {
  return (
    <div className="flex flex-col p-3 rounded-xl bg-black/20 border border-white/5 group hover:border-pink-500/20 transition-all gap-1">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-pink-500 transition-colors" />
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
      </div>
      {isEditing && onChange ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500/50 w-full mt-1"
        />
      ) : (
        <span className="text-sm text-slate-300 pl-5">{value}</span>
      )}
    </div>
  );
}
