import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Moon, Send, Clock, Check, Video, Star, Zap, Heart, Flame, User, MessageCircle, Phone, Instagram, ShieldCheck, Calendar, X, Compass, Bell, ShieldAlert, Plus, Lock, RefreshCw, Camera } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { RetentionVideo } from '../components/RetentionVideo';
import { CartaDoDiaView } from './CartaDoDiaView';
import { ServicosView } from './ServicosView';
import { MentorProfileView } from './MentorProfileView';
import { TrabalhosView } from './TrabalhosView';
import { FaqView } from './FaqView';
import { NotificationsView } from './NotificationsView';
import { DecksSection } from '../components/DecksSection';
import { InstagramFeed } from '../components/InstagramFeed';
import { UserProfile } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, query, onSnapshot, addDoc } from 'firebase/firestore';
import { compressImage } from '../lib/imageUtils';

interface ClientViewProps {
  key?: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  sessionStatus: 'idle' | 'payment_pending' | 'payment_sent' | 'mentor_received' | 'in_session' | 'session_completed';
  setSessionStatus: (status: 'idle' | 'payment_pending' | 'payment_sent' | 'mentor_received' | 'in_session' | 'session_completed') => void;
}

export function ClientView({ 
  activeTab,
  setActiveTab,
  userProfile,
  sessionStatus, 
  setSessionStatus 
}: ClientViewProps) {
  const [reflexaoAtiva, setReflexaoAtiva] = useState("A intuição é o sussurro da alma.");
  const [isWaitingInRetention, setIsWaitingInRetention] = useState(false);

  // Live Chat States
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookDate, setBookDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookTime, setBookTime] = useState("14:30");
  const [bookType, setBookType] = useState("Consulta de Tarot");

  const [isClearingCache, setIsClearingCache] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editName, setEditName] = useState(userProfile?.nome || '');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  useEffect(() => {
    if (userProfile?.nome) {
      setEditName(userProfile.nome);
    }
  }, [userProfile?.nome]);

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userProfile?.uid) {
      const toastId = toast.loading('A carregar e comprimir imagem...');
      try {
        setIsUpdatingPhoto(true);
        const compressed = await compressImage(file, 400, 0.75);
        const userRef = doc(db, 'users', userProfile.uid);
        await setDoc(userRef, { fotoPerfil: compressed }, { merge: true });
        toast.success('A sua foto de perfil foi atualizada com sucesso!', {
          id: toastId,
          style: { background: '#140E26', color: '#E0B1CB', border: '1px solid rgba(255, 255, 255, 0.1)' }
        });
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar fotografia.', { id: toastId });
      } finally {
        setIsUpdatingPhoto(false);
      }
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('O seu nome não pode estar em branco.');
      return;
    }
    if (userProfile?.uid) {
      const toastId = toast.loading('A guardar alterações...');
      try {
        setIsSavingDetails(true);
        const userRef = doc(db, 'users', userProfile.uid);
        await setDoc(userRef, { nome: editName.trim() }, { merge: true });
        toast.success('O seu nome de perfil foi atualizado com sucesso!', {
          id: toastId,
          style: { background: '#140E26', color: '#E0B1CB', border: '1px solid rgba(255, 255, 255, 0.1)' }
        });
        setIsEditingDetails(false);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao guardar alterações.', { id: toastId });
      } finally {
        setIsSavingDetails(false);
      }
    }
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    const toastId = toast.loading('A limpar cache e a sincronizar...');
    try {
      // 1. Clear local storage app keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('firebase:AuthOrDatabase')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.clear();

      // 2. Clear caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // 3. Clear Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      toast.success('Cache limpa! A recarregar...', { id: toastId });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao limpar a cache.', { id: toastId });
      setIsClearingCache(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("reflexoes_diarias");
    if (saved) {
      const reflexoes = JSON.parse(saved);
      const ativa = reflexoes.find((r: { text: string, active: boolean }) => r.active);
      if (ativa) {
        setReflexaoAtiva(ativa.text);
      }
    }
  }, []);

  // Listen to appointments from Firestore
  useEffect(() => {
    const q = query(collection(db, 'appointments'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAppointments(data);
    }, (err) => {
      console.warn("Notice loading appointments:", err);
    });
    return () => unsub();
  }, []);

  // Real-time Live Chat Synchronizer
  useEffect(() => {
    const clientRoom = userProfile?.nome || 'Visitante';
    const q = query(collection(db, 'messages'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      const filtered = allMsgs
        .filter(m => m.chatRoom === clientRoom || m.sender === clientRoom || m.recipient === clientRoom)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

      if (filtered.length === 0) {
        setMessages([
          {
            id: 'welcome',
            text: 'Olá! Sou a Kris Ty Oya. O que o seu coração busca hoje? Mentalize a sua questão com fé e carinho. ✨',
            sender: 'cartomante',
            createdAt: Date.now() - 60000
          }
        ]);
      } else {
        setMessages(filtered);
      }
    }, (error) => {
      console.warn("Error loading messages:", error);
    });

    return () => unsubscribe();
  }, [userProfile?.nome]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : newMessage;
    if (!text.trim()) return;

    const clientRoom = userProfile?.nome || 'Visitante';
    
    if (textToSend === undefined) {
      setNewMessage("");
    }

    try {
      await addDoc(collection(db, 'messages'), {
        chatRoom: clientRoom,
        sender: clientRoom,
        recipient: 'cartomante',
        text: text,
        createdAt: Date.now()
      });

      // Simulation of live cartomante reading
      setIsTyping(true);
      setTimeout(async () => {
        setIsTyping(false);
        const autoReplies = [
          "Sinto a sua vibração. As cartas mostram caminhos de luz a abrirem-se. Confie no seu destino e mantenha o seu coração em paz. ✨",
          "O amor é a força motriz do universo. Recomendo respirar fundo e alinhar os seus chakras para receber as respostas divinas. Quer deitar as cartas? ❤️",
          "Esta situação traz uma lição de transmutação e força interior. Sinta a proteção dos guias espirituais que acompanham os seus passos. 🌊",
          "A abundância divina flui naturalmente. Lembre-se de agradecer pelas pequenas bênçãos hoje para atrair maiores conquistas amanhã. 🌟",
          "A sua aura está a pedir uma purificação leve. A nossa sessão de Limpeza Energética nos Serviços ajudará imenso a revitalizar. 🌿"
        ];
        
        let replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
        
        if (text.toLowerCase().includes('carta') || text.toLowerCase().includes('tarot') || text.toLowerCase().includes('deitar')) {
          const cards = [
            "A Estrela ✨ (Esperança, cura espiritual e rumo protegido)",
            "O Sol ☀️ (Sucesso, clareza absoluta e alegria no amor)",
            "Os Enamorados 💞 (Decisões do coração, harmonia e novas parcerias)",
            "A Sacerdotisa 🔮 (Intuição aguçada, mistérios revelados e sabedoria)",
            "A Imperatriz 👑 (Crescimento, fertilidade e realização de desejos)"
          ];
          const chosenCard = cards[Math.floor(Math.random() * cards.length)];
          replyText = `Feche os olhos e respire fundo... Tirei-lhe uma carta: **${chosenCard}**. Sinta a mensagem que esta carta traz para o seu momento presente. 🌌`;
        }

        await addDoc(collection(db, 'messages'), {
          chatRoom: clientRoom,
          sender: 'cartomante',
          recipient: clientRoom,
          text: replyText,
          createdAt: Date.now()
        });
      }, 2000);

    } catch (e) {
      console.warn("Error sending message to Firestore:", e);
    }
  };

  // Format today's date YYYY-MM-DD
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Check if current user has a confirmed appointment TODAY
  const consulenteName = (userProfile?.nome || 'Visitante').trim().toLowerCase();
  
  const todayAppointment = appointments.find(a => {
    const appName = (a.name || '').trim().toLowerCase();
    const isUserMatch = !a.name || appName.includes(consulenteName) || consulenteName.includes(appName);
    return a.date === todayStr && (a.status === 'confirmado' || !a.status) && isUserMatch;
  });

  const hasTodayAppointment = Boolean(todayAppointment);

  const userAppointments = appointments.filter(a => {
    const appName = (a.name || '').trim().toLowerCase();
    return !a.name || appName.includes(consulenteName) || consulenteName.includes(appName);
  });

  // User's upcoming appointments
  const upcomingAppointment = userAppointments
    .filter(a => a.date > todayStr && (a.status === 'confirmado' || !a.status))
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const handleStartEntry = async () => {
    // Relaxed check for testing
    // if (!hasTodayAppointment) {
    //   toast.error('O acesso à sala está restrito ao dia da sua consulta agendada!');
    //   return;
    // }

    localStorage.setItem('active_call_status', 'pending');
    localStorage.setItem('active_call_request', JSON.stringify({
      clientName: userProfile?.nome || 'Visitante',
      timestamp: Date.now()
    }));

    try {
      await setDoc(doc(db, 'calls', 'active_session'), {
        status: 'pending',
        clientName: userProfile?.nome || 'Visitante',
        updatedAt: Date.now()
      });
    } catch (e) {
      console.warn("Firestore setDoc notice:", e);
    }

    setIsWaitingInRetention(true);
    toast.success('Solicitação de entrada enviada a Kris Ty Oya!');
  };

  const handleBookAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate || !bookTime) {
      toast.error('Selecione uma data e hora válidas.');
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        name: userProfile?.nome || 'Visitante',
        type: bookType,
        date: bookDate,
        time: bookTime,
        status: 'confirmado',
        createdAt: new Date().toISOString()
      });

      // Save notification locally for user
      const savedNotifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
      const newNotif = {
        id: String(Date.now()),
        title: 'Consulta Agendada com Sucesso ✨',
        message: `A sua ${bookType} ficou agendada para o dia ${bookDate} às ${bookTime}. No próprio dia receberá um alerta para entrar na sala.`,
        time: 'Agora mesmo',
        read: false,
        type: 'consultation',
        actionTab: 'agenda'
      };
      localStorage.setItem('app_notifications', JSON.stringify([newNotif, ...savedNotifs]));

      toast.success(`Consulta agendada para ${bookDate} às ${bookTime}!`);
      setBookingModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao guardar agendamento.');
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12 pb-32"
          >
            {/* 1. Immersive Welcome Hero */}
            <div className="relative overflow-hidden p-10 sm:p-14 rounded-[48px] bg-[#140E26]/40 border border-white/[0.05] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] group">
              {/* Atmospheric Depth */}
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#9F86C0]/10 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#E0B1CB]/5 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                  {/* Portrait with Glowing Aura */}
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#090612] border-4 border-[#090612]">
                        <img 
                          src={userProfile?.fotoPerfil || "/images/avatar.png"} 
                          alt={userProfile?.nome || 'Visitante'} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E0B1CB]">O Meu Cantinho</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-serif font-black text-cream leading-tight tracking-tighter">
                      Bem-vinda, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream to-[#E0B1CB]">{userProfile?.nome ? userProfile.nome.split(' ')[0] : 'Visitante'}</span>.
                    </h2>
                    <p className="text-sm sm:text-lg text-[#E0B1CB]/80 font-medium max-w-md">
                      Espero que este espaço lhe traga a paz e a clareza que procura hoje.
                    </p>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('servicos')}
                  className="px-10 py-5 rounded-3xl bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] text-[#140E26] text-[11px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer shadow-[0_20px_40px_rgba(197,160,89,0.2)] hover:shadow-[0_20px_50px_rgba(197,160,89,0.3)] flex items-center justify-center gap-4"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Marcar Consulta</span>
                </motion.button>
              </div>
            </div>

            {/* 2. Atomic Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Daily Insight (8 cols) */}
              <BentoBox className="md:col-span-8 p-10 sm:p-14 flex flex-col justify-center relative bg-white/[0.01] border border-white/[0.03] overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#9F86C0]/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#9F86C0]/10 transition-colors" />
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center text-[#E0B1CB]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E0B1CB]">Sopro da Alma</span>
                    <h4 className="text-xs font-bold text-muted-foreground/80 tracking-widest">ORIENTAÇÃO DIÁRIA</h4>
                  </div>
                </div>
                
                <p className="font-serif italic text-2xl sm:text-4xl text-cream/90 leading-[1.4] font-medium max-w-2xl">
                  "{reflexaoAtiva}"
                </p>
                
                <div className="absolute bottom-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Moon className="w-32 h-32 text-cream" />
                </div>
              </BentoBox>

              {/* Quick Navigation Cards (4 cols each) */}
              <div className="md:col-span-4 flex flex-col gap-6">
                {/* Carta do Dia */}
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setActiveTab('carta_dia')}
                  className="flex-1 p-8 rounded-[40px] bg-gradient-to-br from-[#140E26] to-[#0C0A14] border border-white/10 group cursor-pointer relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#9F86C0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center mb-6 shadow-inner">
                      <Moon className="w-6 h-6 text-[#9F86C0]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-black text-cream mb-2 tracking-tight group-hover:text-[#9F86C0] transition-colors">Carta do Dia</h3>
                      <p className="text-[11px] text-muted-foreground/80 font-medium leading-relaxed">Sua mensagem diária.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Agenda */}
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setActiveTab('agenda')}
                  className="flex-1 p-8 rounded-[40px] bg-gradient-to-br from-[#140E26] to-[#0C0A14] border border-white/10 group cursor-pointer relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#E0B1CB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 flex items-center justify-center mb-6 shadow-inner">
                      <Calendar className="w-6 h-6 text-[#E0B1CB]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-black text-cream mb-2 tracking-tight group-hover:text-[#E0B1CB] transition-colors">Minha Agenda</h3>
                      <p className="text-[11px] text-muted-foreground/80 font-medium leading-relaxed">Ver sessões marcadas.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 3. Featured Services Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#C5A059] rounded-full" />
                  <h3 className="text-[11px] font-black text-cream uppercase tracking-[0.4em]">Publicações & Trabalhos</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('servicos')}
                  className="text-[10px] font-black text-[#E0B1CB] uppercase tracking-widest hover:text-cream transition-colors"
                >
                  Ver Todos
                </button>
              </div>
              
              <HorizontalCarousel>
                <SessaoCard onClick={() => setActiveTab('servicos')} 
                  image="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80"
                  title="Abertura de Caminhos"
                  duration="Rituais de Prosperidade"
                  icon={<Flame className="w-4 h-4 text-[#C5A059]" />}
                />
                <SessaoCard onClick={() => setActiveTab('servicos')} 
                  image="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=400&q=80"
                  title="Alinhamento Amoroso"
                  duration="Conexão & Destino"
                  icon={<Heart className="w-4 h-4 text-rose-400" />}
                />
                <SessaoCard onClick={() => setActiveTab('servicos')} 
                  image="https://images.unsplash.com/photo-1534062633719-75ea751d3824?auto=format&fit=crop&w=400&q=80"
                  title="Limpeza Espiritual"
                  duration="Purificação da Aura"
                  icon={<Zap className="w-4 h-4 text-indigo-400" />}
                />
              </HorizontalCarousel>
            </section>

            {/* 4. Atomic Details & Social */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <DecksSection onSelectConsultation={() => setActiveTab('servicos')} />
              <div className="flex flex-col justify-end">
                 <InstagramFeed />
              </div>
            </section>
          </motion.div>
        );
      case 'consultas':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pb-24"
          >
            {/* Consultations Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(140px,auto)]">
              
              {/* Main Booking Block (Large 4x2) */}
              <BentoBox className="col-span-2 md:col-span-4 row-span-2 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9F86C0] to-transparent opacity-50" />
                
                {hasTodayAppointment ? (
                  /* Today is appointment day! Unlocked room */
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full max-w-md">
                    <div className="mb-4 p-4 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce">
                      <Video className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/40 mb-3">
                      ✨ A Sua Consulta é HOJE! ({todayAppointment?.time || 'Confirmada'})
                    </span>
                    <h3 className="font-serif text-3xl text-foreground mb-2">{todayAppointment?.type || 'Sessão de Tarot & Orientação'}</h3>
                    <p className="text-xs text-muted-foreground mb-6 max-w-sm leading-relaxed">
                      O seu horário reservado com Kris Ty Oya está ativo. Clique abaixo para solicitar a entrada direta na sala privada de videochamada.
                    </p>
                    
                    {sessionStatus === 'idle' && (
                      <button 
                        onClick={handleStartEntry}
                        className="w-full text-xs flex justify-center items-center gap-2 py-4 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold rounded-full transition-all shadow-xl shadow-[#9F86C0]/25 cursor-pointer"
                      >
                        <Video className="w-5 h-5 text-[#140E26]" />
                        Entrar na Sala de Consulta
                      </button>
                    )}

                    {sessionStatus === 'session_completed' && (
                      <div className="flex flex-col items-center w-full max-w-sm">
                        <p className="text-xs text-emerald-400 font-bold mb-4">Sessão de hoje concluída com sucesso!</p>
                        <button 
                          onClick={() => {
                            setSessionStatus('idle');
                            setActiveTab('trabalhos');
                          }}
                          className="w-full text-xs flex justify-center items-center gap-2 py-3 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold rounded-full transition-all cursor-pointer"
                        >
                          Ver Trabalhos & Acompanhamentos
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Restricted access block - Not today */
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full max-w-md">
                    <div className="mb-4 p-4 rounded-full bg-[#9F86C0]/10 text-[#E0B1CB] border border-[#9F86C0]/20 shadow-inner">
                      <Lock className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#9F86C0]/20 text-[#E0B1CB] text-[10px] font-bold uppercase tracking-widest border border-[#9F86C0]/30 mb-3">
                      Entrada Restrita ao Dia Agendado
                    </span>
                    <h3 className="font-serif text-2xl text-foreground mb-2">Sala de Videochamada Fechada</h3>
                    
                    {upcomingAppointment ? (
                      <div className="bg-white/[0.02] p-4 rounded-[20px] border border-white/10 mb-6 text-left w-full">
                        <p className="text-xs font-semibold text-[#E0B1CB] mb-1 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#E0B1CB]" /> Próxima Consulta Confirmada:
                        </p>
                        <p className="text-sm font-serif text-foreground font-bold">
                          {upcomingAppointment.type} — {upcomingAppointment.date} às {upcomingAppointment.time}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-2 italic">
                          O acesso à sala de atendimento abre automaticamente no próprio dia da consulta. Receberá uma notificação assim que o canal for desbloqueado.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mb-6 max-w-sm leading-relaxed">
                        Ainda não possui uma consulta agendada para hoje. Para falar por vídeo ou áudio com Kris Ty Oya, escolha o dia e hora que preferir na sua Agenda.
                      </p>
                    )}

                    <button 
                      onClick={() => setBookingModalOpen(true)}
                      className="w-full text-xs flex justify-center items-center gap-2 py-3.5 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold rounded-full transition-all shadow-[0_0_15px_rgba(159,134,192,0.3)] cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#140E26]" />
                      Agendar Consulta na Agenda
                    </button>
                  </div>
                )}
              </BentoBox>

              {/* Tarot Expresso (2x1) */}
              <ConsultationOption 
                title="Tarot Expresso" 
                desc="Resposta via áudio." 
                icon={<Moon className="w-5 h-5 text-[#E0B1CB]" />} 
                className="col-span-2"
                onClick={() => setActiveTab("mensagens")}
              />

              {/* Preparation Guide (2x1 or span more) */}
              <BentoBox className="col-span-2 p-6 flex flex-col justify-center bg-white/[0.04] border border-white/10 rounded-[24px] shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-4 h-4 text-[#E0B1CB]" />
                  <h4 className="text-[10px] font-bold text-[#E0B1CB] uppercase tracking-widest">Regra de Agendamento</h4>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  "No próprio dia marcado, receberá um alerta automático de abertura da sala de consulta."
                </p>
              </BentoBox>
            </div>
          </motion.div>
        );
      case 'mensagens':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Dating App Inspired Chat Screen */}
            <div className="flex flex-col h-[580px] rounded-[32px] overflow-hidden bg-white/[0.04] border border-white/10 shadow-2xl relative">
              
              {/* Soft decorative background glow */}
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#9F86C0]/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#E0B1CB]/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 bg-[#090612]/60 backdrop-blur-md flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Glowing Pulse Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-[#9F86C0]/40 bg-[#9F86C0]/10 shadow-lg shadow-[#9F86C0]/10">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" 
                        alt="Kris Ty Oya" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#090612] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5">
                      Kris Ty Oya
                      <Sparkles className="w-3.5 h-3.5 text-[#E0B1CB] animate-pulse" />
                    </h3>
                    <p className="text-[10px] text-[#E0B1CB]/90 uppercase tracking-widest font-bold flex items-center gap-1">
                      <span>Online • Kris</span>
                    </p>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      toast.success("A iniciar chamada de áudio privada...");
                      setActiveTab('consultas');
                    }}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#E0B1CB] transition-all flex items-center justify-center border border-white/5 cursor-pointer"
                    title="Chamada de Áudio"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      toast.success("A iniciar chamada de vídeo...");
                      setActiveTab('consultas');
                    }}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#E0B1CB] transition-all flex items-center justify-center border border-white/5 cursor-pointer"
                    title="Videochamada"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setSessionStatus('session_completed');
                      toast.success("Consulta finalizada com sucesso!");
                      setActiveTab('inicio');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-red-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                    title="Concluir Consulta"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Finalizar</span>
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar relative z-10 flex flex-col">
                <div className="text-center my-2 select-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
                    Canal Espiritual Encriptado ✨
                  </span>
                </div>

                {messages.map((msg, idx) => {
                  const isMentor = msg.sender === 'cartomante';
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-start gap-2.5 max-w-[82%] ${isMentor ? 'self-start' : 'self-end flex-row-reverse'}`}
                    >
                      {/* Mentor Icon for Received Messages */}
                      {isMentor && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#9F86C0]/20 bg-[#9F86C0]/5 shrink-0 hidden sm:block">
                          <img 
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" 
                            alt="Kris" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <div 
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                            isMentor 
                              ? 'bg-[#090612]/80 border border-white/10 text-foreground rounded-tl-none' 
                              : 'bg-gradient-to-tr from-[#9F86C0] via-[#9F86C0]/70 to-[#E0B1CB]/25 border border-[#9F86C0]/30 text-white rounded-tr-none'
                          }`}
                        >
                          <p className="whitespace-pre-line">{msg.text}</p>
                        </div>
                        <span className={`block text-[9px] text-muted-foreground/60 mt-1 ${isMentor ? 'text-left pl-1' : 'text-right pr-1'}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Agora'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Bouncing Typing Indicator */}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 self-start bg-[#090612]/80 border border-white/10 p-3 rounded-2xl rounded-tl-none max-w-[120px] shadow-sm ml-10"
                  >
                    <span className="text-[10px] text-[#E0B1CB] font-medium">Kris está a escrever...</span>
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-[#E0B1CB] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#E0B1CB] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#E0B1CB] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Quick suggestions (Ice-Breakers) */}
              <div className="px-4 py-2 shrink-0 flex gap-2 overflow-x-auto custom-scrollbar relative z-10 bg-[#090612]/40 border-t border-white/10">
                {[
                  { text: "Tirar uma Carta de Tarot 🔮", icon: "🔮" },
                  { text: "Como vai o meu Amor? ❤️", icon: "❤️" },
                  { text: "Previsão Espiritual ✨", icon: "✨" },
                  { text: "Conselho para Hoje 🌌", icon: "🌌" },
                  { text: "Fazer uma Limpeza 🌿", icon: "🌿" }
                ].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSendMessage(item.text)}
                    className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#9F86C0]/20 border border-white/10 text-foreground/90 hover:text-[#E0B1CB] text-[11px] font-medium transition-all duration-300 hover:scale-102 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>

              {/* Chat Input Capsule Bar */}
              <div className="p-4 sm:p-5 shrink-0 relative z-10">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="bg-[#090612]/75 backdrop-blur-xl border border-white/10 rounded-[28px] p-4 shadow-2xl flex flex-col gap-3 transition-all duration-300 hover:border-white/15 focus-within:border-[#9F86C0]/50 focus-within:shadow-[0_0_18px_rgba(159,134,192,0.4)]"
                >
                  {/* TextArea / Input */}
                  <textarea
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mentalize e pergunte..." 
                    className="w-full bg-transparent border-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-none px-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  {/* Action row */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    {/* Left controls */}
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => handleSendMessage("Como vai o meu Amor? ❤️")}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#E0B1CB] transition-all flex items-center justify-center border border-white/5 cursor-pointer active:scale-95"
                        title="Perguntar sobre Amor"
                      >
                        <Heart className="w-4 h-4 text-red-400" />
                      </button>
                      
                      <button 
                        type="button"
                        onClick={() => handleSendMessage("Quero tirar uma carta de Tarot, por favor! 🔮")}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#E0B1CB] transition-all flex items-center justify-center border border-white/5 cursor-pointer active:scale-95"
                        title="Tirar uma Carta"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </button>

                      <button 
                        type="button"
                        onClick={() => handleSendMessage("Fazer uma Limpeza Energética 🌿")}
                        className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-[#E0B1CB] transition-all flex items-center gap-1.5 border border-white/5 text-[11px] font-semibold cursor-pointer active:scale-95"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span>Auto</span>
                      </button>
                    </div>

                    {/* Right send button */}
                    <button 
                      type="submit"
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 flex items-center justify-center text-slate-950 font-bold transition-all shadow-[0_0_18px_rgba(159,134,192,0.5)] active:scale-95 shrink-0 cursor-pointer"
                      title="Enviar Mensagem"
                    >
                      <Send className="w-4 h-4 text-slate-950 fill-slate-950 translate-x-0.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        );
      case 'rituais':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pb-24"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(160px,auto)]">
              {/* Ritual Header (4x2) */}
              <BentoBox className="col-span-2 md:col-span-4 lg:row-span-2 relative group cursor-pointer overflow-hidden bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl">
                <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80" alt="Sessão" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090612] to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 rounded-full bg-[#9F86C0]/20 border border-[#9F86C0]/30 text-[10px] uppercase tracking-widest text-[#E0B1CB] mb-3 block w-fit">Exclusivo</span>
                  <h3 className="text-3xl font-serif text-foreground font-bold">A Jornada de Kris Ty Oya</h3>
                  <p className="text-xs text-muted-foreground mt-1">Sintonize com o seu propósito divino.</p>
                </div>
              </BentoBox>

              {/* Ritual Grid Items (2x2 or carousels integrated) */}
              <div className="col-span-2 md:col-span-4 lg:col-span-6 mt-4">
                <HorizontalCarousel title="Trabalhos Exclusivos">
                  <SessaoCard onClick={() => setActiveTab('trabalhos')} image="..." title="Abertura" duration="3 Dias" icon={<Heart className="w-4 h-4 text-red-500" />} />
                  <SessaoCard onClick={() => setActiveTab('trabalhos')} image="..." title="Sessão" duration="1 Noite" icon={<Flame className="w-4 h-4 text-orange-400" />} />
                </HorizontalCarousel>
              </div>
            </div>
          </motion.div>
        );
      case 'perfil':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
             <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <BentoBox className="md:col-span-5 lg:col-span-4 p-6 text-center flex flex-col items-center justify-center bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#9F86C0]/5 to-transparent opacity-50" />
                  <div 
                    onClick={() => profileInputRef.current?.click()} 
                    className="relative mb-4 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] rounded-full blur-md opacity-25 group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#9F86C0] via-[#E0B1CB] to-[#C5A059] shadow-md transition-transform duration-300 group-hover:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#090612] border-4 border-[#140E26] flex items-center justify-center relative">
                        {userProfile?.fotoPerfil ? (
                          <>
                            <img 
                              src={userProfile.fotoPerfil} 
                              alt={userProfile.nome || 'Cliente'} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                            <User className="w-10 h-10 text-[#E0B1CB]/60 hidden fallback-icon" />
                          </>
                        ) : (
                          <User className="w-10 h-10 text-[#E0B1CB]/60" />
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-300">
                          <Camera className="w-5 h-5 text-[#E0B1CB]" />
                          <span className="text-[8px] uppercase tracking-wider text-[#E0B1CB] font-bold">Alterar</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] rounded-full border-2 border-[#140E26] flex items-center justify-center shadow-md">
                      <Camera className="w-3.5 h-3.5 text-[#140E26]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-cream mb-1 font-bold">{userProfile?.nome || 'Visitante'}</h3>
                  <p className="text-[9px] text-[#E0B1CB] uppercase tracking-widest font-bold">Membro desde Julho 2024</p>
                  
                  <input 
                    type="file" 
                    ref={profileInputRef} 
                    onChange={handleProfilePhotoChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </BentoBox>
                
                <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-fr">
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center bg-white/[0.04] border border-white/10 rounded-[24px] shadow-lg">
                      <Calendar className="w-5 h-5 text-emerald-400 mb-2" />
                      <p className="text-2xl font-serif text-foreground mb-1 font-bold">12</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Consultas</p>
                   </BentoBox>
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center bg-white/[0.04] border border-white/10 rounded-[24px] shadow-lg">
                      <Flame className="w-5 h-5 text-orange-400 mb-2" />
                      <p className="text-2xl font-serif text-foreground mb-1 font-bold">4</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Sessões</p>
                   </BentoBox>
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center bg-white/[0.04] border border-white/10 rounded-[24px] shadow-lg">
                      <Moon className="w-5 h-5 text-[#E0B1CB] mb-2" />
                      <p className="text-2xl font-serif text-foreground mb-1 font-bold">3</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Cartas Tiradas</p>
                   </BentoBox>
                   <BentoBox className="p-4 flex flex-col items-center justify-center text-center bg-white/[0.04] border border-white/10 rounded-[24px] shadow-lg">
                      <Zap className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-[10px] font-bold text-foreground mb-1 mt-2">Nível 2</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Iniciado</p>
                   </BentoBox>
                </div>
             </div>
             <BentoBox className="p-6 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E0B1CB] mb-4">Avisos e Configurações</h3>
                <div className="space-y-2">
                   <button 
                     onClick={() => {
                       setEditName(userProfile?.nome || '');
                       setIsEditingDetails(true);
                     }}
                     className="w-full flex items-center justify-between p-3 rounded-xl bg-[#090612]/40 hover:bg-[#9F86C0]/10 border border-white/5 hover:border-[#9F86C0]/20 transition-all text-left cursor-pointer"
                   >
                     <span className="text-xs text-muted-foreground">Alterar Dados Pessoais</span>
                     <User className="w-4 h-4 text-muted-foreground" />
                   </button>
                   <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#090612]/40 hover:bg-[#9F86C0]/10 border border-white/5 hover:border-[#9F86C0]/20 transition-all text-left cursor-pointer">
                     <span className="text-xs text-muted-foreground">Definições de Notificações</span>
                     <Bell className="w-4 h-4 text-muted-foreground" />
                   </button>
                   <button 
                     onClick={handleClearCache}
                     disabled={isClearingCache}
                     className="w-full flex items-center justify-between p-3 rounded-xl bg-[#E0B1CB]/5 hover:bg-[#E0B1CB]/15 border border-[#E0B1CB]/10 hover:border-[#E0B1CB]/30 transition-all text-left cursor-pointer disabled:opacity-50"
                   >
                     <span className="text-xs text-[#E0B1CB] font-semibold">Limpar Cache & Sincronizar</span>
                     <RefreshCw className={`w-4 h-4 text-[#E0B1CB] ${isClearingCache ? 'animate-spin' : ''}`} />
                   </button>
                </div>
             </BentoBox>

             {/* Personal Details Editing Modal */}
             <AnimatePresence>
               {isEditingDetails && (
                 <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                   <div className="absolute inset-0 bg-[#090612]/85 backdrop-blur-md" onClick={() => setIsEditingDetails(false)} />
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="relative w-full max-w-sm bg-[#140E26] border border-white/10 p-8 rounded-[2rem] shadow-2xl z-10 space-y-5"
                   >
                     <button 
                       onClick={() => setIsEditingDetails(false)}
                       className="absolute top-5 right-5 text-muted-foreground hover:text-foreground cursor-pointer"
                     >
                       <X className="w-4 h-4" />
                     </button>
                     <div className="text-center pb-2">
                       <h3 className="font-serif text-2xl text-cream font-bold">Dados Pessoais</h3>
                       <p className="text-xs text-cream/60 mt-1">Como a queríamos tratar no espaço?</p>
                     </div>
                     
                     <form onSubmit={handleSaveDetails} className="space-y-5">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-[#E0B1CB]">Nome ou Pseudónimo</label>
                         <input 
                           type="text"
                           value={editName}
                           onChange={(e) => setEditName(e.target.value)}
                           className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-cream text-sm focus:outline-none focus:border-[#E0B1CB]/40 focus:bg-white/[0.05]"
                           placeholder="Visitante"
                           required
                         />
                       </div>
                       
                       <div className="flex gap-3 pt-2">
                         <button 
                           type="button"
                           onClick={() => setIsEditingDetails(false)}
                           className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-[10px] uppercase tracking-widest font-black text-cream hover:bg-white/5 transition-colors cursor-pointer"
                         >
                           Cancelar
                         </button>
                         <button 
                           type="submit"
                           disabled={isSavingDetails}
                           className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E0B1CB] text-[#140E26] text-[10px] uppercase tracking-widest font-black hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                         >
                           Guardar
                         </button>
                       </div>
                     </form>
                   </motion.div>
                 </div>
               )}
             </AnimatePresence>
          </motion.div>
        );
      case 'carta_dia':
        return <CartaDoDiaView />;
      case 'servicos':
        return (
          <ServicosView 
            onSelectConsultation={() => setActiveTab('consultas')} 
            onSelectChat={() => setActiveTab('mensagens')} 
            hasTodayAppointment={hasTodayAppointment}
            todayAppointmentTime={todayAppointment?.time}
            onOpenBookingModal={() => setBookingModalOpen(true)}
          />
        );
      case 'agenda':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 pb-24"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.04] p-6 rounded-[28px] border border-white/10 shadow-2xl">
              <div>
                <h2 className="text-3xl font-serif text-foreground font-bold mb-1">A Minha Agenda</h2>
                <p className="text-xs text-muted-foreground">
                  Acompanhe as suas marcações e agende novas consultas com Kris Ty Oya.
                </p>
              </div>
              <button 
                onClick={() => setBookingModalOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-[0_0_12px_rgba(159,134,192,0.25)] flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4 text-[#140E26]" /> Nova Marcação
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#E0B1CB] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#E0B1CB]" /> As Minhas Consultas Reservadas
              </h3>

              {userAppointments.length === 0 ? (
                <BentoBox className="p-8 text-center flex flex-col items-center justify-center space-y-3 border border-white/10 border-dashed rounded-[28px] bg-white/[0.02]">
                  <Calendar className="w-8 h-8 text-muted-foreground opacity-40" />
                  <p className="text-sm font-serif text-foreground">Nenhuma consulta agendada de momento.</p>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Escolha o melhor dia e horário para conversar com Kris Ty Oya.
                  </p>
                  <button 
                    onClick={() => setBookingModalOpen(true)}
                    className="px-6 py-3.5 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-[0_0_12px_rgba(159,134,192,0.25)] mt-2"
                  >
                    Agendar Agora
                  </button>
                </BentoBox>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAppointments.map((app) => {
                    const isToday = app.date === todayStr;
                    return (
                      <AppointmentCard 
                        key={app.id}
                        date={isToday ? 'HOJE' : app.date} 
                        time={app.time} 
                        type={app.type} 
                        status={isToday ? 'Confirmado (HOJE)' : (app.status || 'Confirmado')} 
                        onClick={() => setActiveTab(isToday ? 'consultas' : 'agenda')} 
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        );
      case 'trabalhos':
        return <TrabalhosView onSelectChat={() => setActiveTab('mensagens')} />;
      case 'mentor_profile':
        return <MentorProfileView onSelectConsultation={() => setActiveTab('consultas')} />;
      case 'ajuda':
      case 'faq':
        return <FaqView onContactMentor={() => setActiveTab('mensagens')} />;
      case 'notificacoes':
        return <NotificationsView onNavigate={setActiveTab} />;
      case 'privacidade':
      case 'configuracoes':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 glass-mystic rounded-[2rem]"
          >
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-serif text-foreground mb-4">Em Breve</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Esta secção da plataforma está a ser preparada. 
              Em breve, novas publicações serão aqui partilhadas.
            </p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'inicio': return 'Área do Cliente';
      case 'consultas': return 'Consultas';
      case 'mensagens': return 'Consulta';
      case 'perfil': return 'O Meu Perfil';
      case 'mentor_profile': return 'Sobre Mim';
      case 'servicos': return 'Consultas e Serviços';
      case 'agenda': return 'Agenda';
      case 'carta_dia': return 'Carta do Dia';
      case 'notificacoes': return 'Notificações';
      case 'configuracoes': return 'Configurações';
      case 'ajuda':
      case 'faq': return 'Apoio & Perguntas Frequentes';
      default: return 'Plataforma';
    }
  };

  return (
    <div className="pb-10">
      <h2 className="text-sm font-sans text-accent/80 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        {getTitle()}
      </h2>
      
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      <AnimatePresence>
        {isWaitingInRetention && (
          <RetentionVideo
            onCancel={() => setIsWaitingInRetention(false)}
            onAccepted={() => {
              setIsWaitingInRetention(false);
              setSessionStatus('in_session');
            }}
          />
        )}
      </AnimatePresence>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090612]/90 backdrop-blur-md animate-in fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#090612]/95 border border-white/10 p-6 sm:p-8 rounded-[28px] w-full max-w-md shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setBookingModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#9F86C0]/15 border border-[#9F86C0]/30 flex items-center justify-center text-[#E0B1CB] shadow-inner">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">Agendar Consulta</h3>
                  <p className="text-[10px] text-accent/60 uppercase tracking-[0.2em] font-bold">Kris Ty Oya</p>
                </div>
              </div>

              <form onSubmit={handleBookAppointmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-1.5">
                    Tipo de Atendimento
                  </label>
                  <select 
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value)}
                    className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] px-4 py-3.5 text-foreground text-sm focus:border-[#9F86C0]/50 outline-none cursor-pointer"
                  >
                    <option value="Consulta de Tarot" className="bg-[#140E26] text-foreground">Consulta de Tarot & Baralho</option>
                    <option value="Orientação Espiritual" className="bg-[#140E26] text-foreground">Orientação Espiritual Completa</option>
                    <option value="Abertura de Caminhos" className="bg-[#140E26] text-foreground">Sessão de Abertura de Caminhos</option>
                    <option value="Limpeza Energética" className="bg-[#140E26] text-foreground">Avaliação de Limpeza Energética</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-1.5">
                      Data
                    </label>
                    <input 
                      type="date"
                      value={bookDate}
                      min={todayStr}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] px-4 py-3.5 text-foreground text-sm focus:border-[#9F86C0]/50 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-1.5">
                      Hora
                    </label>
                    <input 
                      type="time"
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] px-4 py-3.5 text-foreground text-sm focus:border-[#9F86C0]/50 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-[20px] bg-[#9F86C0]/10 border border-[#9F86C0]/20 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#E0B1CB] shrink-0 mt-0.5" />
                  <span>
                    No próprio dia {bookDate}, o botão de entrada na videochamada ficará ativado na sua aplicação.
                  </span>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-[0_0_12px_rgba(159,134,192,0.25)] flex items-center justify-center gap-2 mt-2"
                >
                  <Check className="w-4 h-4 text-[#140E26]" />
                  Confirmar Agendamento
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SessaoCard({ image, title, duration, icon, onClick }: { image: string, title: string, duration: string, icon: React.ReactNode, onClick?: () => void }) {
  return (
    <div className="w-[75vw] max-w-[280px] sm:w-[320px] shrink-0 snap-center group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden h-[340px] rounded-[32px] border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(224,177,203,0.15)] hover:border-[#E0B1CB]/30">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090612] via-[#090612]/60 to-transparent" />
        
        <div className="absolute top-4 right-4 p-3 rounded-2xl bg-[#090612]/40 backdrop-blur-md border border-white/10 shadow-lg text-[#E0B1CB]">
          {icon}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-cream text-[10px] font-bold uppercase tracking-widest w-fit mb-3">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {duration}
          </span>
          <h4 className="font-serif text-2xl font-bold text-cream mb-4 group-hover:text-[#E0B1CB] transition-colors leading-tight">
            {title}
          </h4>
          
          <button className="w-full py-3.5 bg-white/5 group-hover:bg-[#E0B1CB]/10 rounded-2xl text-xs font-bold tracking-widest text-[#E0B1CB] border border-white/10 group-hover:border-[#E0B1CB]/30 transition-all uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md">
            <span>Saber Mais</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ date, time, type, status, onClick }: { key?: string, date: string, time: string, type: string, status: string, onClick?: () => void }) {
  const isConfirmed = status.toLowerCase().includes('confirmado');
  return (
    <div className="w-[85vw] max-w-[320px] sm:w-[340px] shrink-0 snap-center cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[32px] group hover:border-[#9F86C0]/40 transition-all duration-300 shadow-2xl">
        {/* Decorative corner accent */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#9F86C0]/20 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl bg-[#9F86C0]/10 text-[#E0B1CB] border border-[#9F86C0]/20 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border shadow-sm ${
            isConfirmed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[#E0B1CB]/10 border-[#E0B1CB]/20 text-[#E0B1CB]'
          }`}>
            {status}
          </span>
        </div>

        <div>
          <h4 className="text-cream font-serif text-2xl font-bold mb-2 group-hover:text-[#E0B1CB] transition-colors">{type}</h4>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <span className="text-[#C5A059] font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {date}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#9F86C0]/50" />
            <span className="text-cream font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9F86C0]" /> {time}
            </span>
          </div>
        </div>

        <button className="w-full mt-6 py-3.5 bg-white/[0.03] group-hover:bg-white/[0.08] rounded-2xl text-xs font-bold uppercase tracking-widest text-cream transition-all border border-white/10 shadow-sm flex items-center justify-center gap-2">
          <span>Aceder à Sessão</span>
        </button>
      </div>
    </div>
  );
}

function QuickCard({ label, icon, onClick }: { label: string, icon: React.ReactNode, onClick?: () => void }) {
  return (
    <BentoBox 
      onClick={onClick}
      className="p-6 bg-white/[0.04] border border-white/10 rounded-[24px] flex flex-col items-center justify-center text-center gap-3 group cursor-pointer hover:border-[#9F86C0]/50 transition-all shadow-lg"
    >
      <div className="p-3.5 rounded-full bg-[#9F86C0]/10 text-[#E0B1CB] border border-[#9F86C0]/20 group-hover:scale-105 group-hover:bg-[#9F86C0]/20 transition-all">
        {icon}
      </div>
      <span className="text-xs font-bold text-foreground tracking-widest group-hover:text-[#E0B1CB] transition-colors uppercase">{label}</span>
    </BentoBox>
  );
}

function ConsultationOption({ title, desc, icon, className = '', onClick }: { title: string, desc: string, icon: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <BentoBox onClick={onClick} className={`p-6 bg-white/[0.04] border border-white/10 rounded-[24px] flex items-center gap-6 cursor-pointer transition-all group hover:border-[#9F86C0]/50 shadow-lg ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center text-[#E0B1CB] group-hover:bg-[#9F86C0]/20 transition-all shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-serif text-lg font-bold text-foreground mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </BentoBox>
  );
}

function ProductCard({ title, price, finalPrice, shippingMethod, setShippingMethod }: { title: string, price: number, finalPrice: number, shippingMethod: string, setShippingMethod: (method: 'mao' | 'ctt') => void }) {
  return (
    <BentoBox className="p-6 bg-white/[0.04] border border-white/10 rounded-[28px] flex flex-col h-full shadow-2xl">
      <div className="mb-6">
        <h3 className="font-serif text-2xl font-bold mb-1 text-foreground">{title}</h3>
        <p className="text-[#E0B1CB] text-xs font-bold uppercase tracking-widest">A combinar</p>
      </div>
      
      <div className="mt-auto space-y-4">
        <div className="flex bg-[#090612]/80 rounded-full p-1 border border-white/5">
          <button 
            type="button"
            onClick={() => setShippingMethod('mao')}
            className={`flex-1 py-3 text-xs font-bold rounded-full transition-all ${shippingMethod === 'mao' ? 'bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] shadow-md' : 'text-muted-foreground hover:text-white'}`}
          >
            Em Mão
          </button>
          <button 
            type="button"
            onClick={() => setShippingMethod('ctt')}
            className={`flex-1 py-3 text-xs font-bold rounded-full transition-all ${shippingMethod === 'ctt' ? 'bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] text-[#140E26] shadow-md' : 'text-muted-foreground hover:text-white'}`}
          >
            CTT
          </button>
        </div>
        <button type="button" className="w-full py-4 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(159,134,192,0.25)] cursor-pointer">
          Pedir informações
        </button>
      </div>
    </BentoBox>
  );
}

function SimpleProductCard({ title, price, onClick }: { title: string, price: string, onClick?: () => void }) {
  return (
    <BentoBox onClick={onClick} className="p-6 bg-white/[0.04] border border-white/10 rounded-[28px] flex flex-col justify-between group cursor-pointer hover:border-[#9F86C0]/50 transition-all shadow-2xl">
      <div>
        <div className="w-full aspect-square rounded-[20px] mb-4 overflow-hidden border border-white/5 bg-[#090612]/30 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#E0B1CB]/60 group-hover:scale-105 transition-transform" />
        </div>
        <h4 className="font-serif text-lg font-bold text-foreground mb-1">{title}</h4>
        <p className="text-[#E0B1CB] text-sm font-bold">{price}</p>
      </div>
      <button className="mt-6 w-full py-3 bg-[#9F86C0]/10 hover:bg-[#9F86C0]/20 rounded-full text-xs font-bold uppercase tracking-widest text-[#E0B1CB] border border-[#9F86C0]/30 transition-all cursor-pointer">
        ADICIONAR AO AXÉ
      </button>
    </BentoBox>
  );
}

