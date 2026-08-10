import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Video, User, Check, X, ChevronLeft, ChevronRight, Plus, GripVertical } from 'lucide-react';
import { BentoBox } from '../BentoBox';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

// Helper to get formatted date string: YYYY-MM-DD
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
  let day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Adjust so Monday is 0, Sunday is 6
};

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DAY_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function AdminAgenda() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  
  const [unassigned, setUnassigned] = useState<any[]>([
/* Initially empty, can be populated from a 'requests' collection later */
    { id: 'u1', name: 'Sofia Alves', type: 'Consulta de Tarot' },
    { id: 'u2', name: 'Tiago Costa', type: 'Abertura de Caminhos' },
    { id: 'u3', name: 'Joana Martins', type: 'Orientação Espiritual' },
  ]);

  const [appointments, setAppointments] = useState<any[]>([]);

  React.useEffect(() => {
    const q = query(collection(db, 'appointments'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAppointments(data);
    });
    return () => unsub();
  }, []);

  const [draggedItem, setDraggedItem] = useState<any>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>('');
  const [modalTime, setModalTime] = useState<string>('14:00');
  const [modalClient, setModalClient] = useState<string>('');
  const [modalType, setModalType] = useState<string>('Consulta de Tarot');
  const [modalIsFromUnassigned, setModalIsFromUnassigned] = useState<boolean>(false);
  const [modalUnassignedId, setModalUnassignedId] = useState<string | null>(null);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    if (draggedItem) {
      openModal(dateStr, draggedItem);
      setDraggedItem(null);
    }
  };

  const openModal = (dateStr: string, itemToSchedule?: any) => {
    setModalDate(dateStr);
    if (itemToSchedule) {
      setModalClient(itemToSchedule.name);
      setModalType(itemToSchedule.type);
      setModalIsFromUnassigned(true);
      setModalUnassignedId(itemToSchedule.id);
    } else {
      setModalClient('');
      setModalType('Consulta de Tarot');
      setModalIsFromUnassigned(false);
      setModalUnassignedId(null);
    }
    setModalTime('14:00');
    setModalOpen(true);
  };

    const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalClient || !modalTime) return;

    try {
      await addDoc(collection(db, 'appointments'), {
        name: modalClient,
        type: modalType,
        date: modalDate,
        time: modalTime,
        status: 'confirmado',
        createdAt: new Date().toISOString()
      });

      if (modalIsFromUnassigned && modalUnassignedId) {
        setUnassigned(unassigned.filter(u => u.id !== modalUnassignedId));
      }

      toast.success('Consulta agendada com sucesso!');
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao agendar consulta.');
    }
  };

    const handleDeleteAppointment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.success('Consulta cancelada.');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao cancelar consulta.');
    }
  };

  // Calendar rendering logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month); // 0 (Mon) to 6 (Sun)
  
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ empty: true, key: `empty-${i}` });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = formatDate(new Date(year, month, i));
    days.push({ empty: false, day: i, dateStr: dStr, key: dStr });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-full bg-[#9F86C0]/15 border border-[#9F86C0]/30 flex items-center justify-center text-[#E0B1CB] shadow-inner">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground font-bold">Agenda</h2>
          <p className="text-[10px] text-accent/60 uppercase tracking-[0.2em] font-bold">Gestão de Horários</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Pending */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-serif text-lg font-bold text-foreground mb-4">Por Agendar</h3>
          
          {unassigned.length === 0 ? (
            <BentoBox className="p-6 text-center border-dashed border-2 border-white/10 bg-white/[0.02] rounded-[24px]">
              <p className="text-xs text-muted-foreground font-serif italic">Todos os pedidos estão agendados.</p>
            </BentoBox>
          ) : (
            <div className="space-y-3">
              {unassigned.map(item => (
                <BentoBox 
                  key={item.id}
                  className="p-4 bg-white/[0.04] border border-white/10 rounded-[20px] hover:border-[#9F86C0]/50 transition-all duration-300 shadow-md cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e: any) => handleDragStart(e, item)}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-4 h-4 text-[#9F86C0] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-serif font-bold text-foreground">{item.name}</h4>
                      <p className="text-xs text-accent font-medium">{item.type}</p>
                    </div>
                  </div>
                </BentoBox>
              ))}
            </div>
          )}
          
          <div className="pt-4 border-t border-white/10 mt-6">
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              Arraste um consulente para um dia no calendário para agendar, ou clique num dia para adicionar manualmente.
            </p>
          </div>
        </div>

        {/* Right Col: Calendar */}
        <BentoBox className="lg:col-span-3 p-4 sm:p-6 bg-white/[0.04] border border-white/10 rounded-[28px] shadow-2xl">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl text-foreground font-bold capitalize">
              {MONTH_NAMES[month]} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-foreground transition-all border border-white/10 cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-foreground transition-all border border-white/10 cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#9F86C0] pb-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((dayData, idx) => {
              if (dayData.empty) {
                return <div key={dayData.key} className="aspect-square rounded-xl bg-transparent" />;
              }

              const isToday = dayData.dateStr === formatDate(today);
              const dayAppointments = appointments.filter(a => a.date === dayData.dateStr).sort((a, b) => a.time.localeCompare(b.time));

              return (
                <div
                  key={dayData.key}
                  onDragOver={handleDragOver}
                  onDrop={(e: any) => handleDrop(e, dayData.dateStr!)}
                  onClick={() => openModal(dayData.dateStr!)}
                  className={`min-h-[85px] sm:min-h-[110px] p-2 rounded-[20px] border transition-all cursor-pointer group ${
                    isToday 
                      ? 'border-[#9F86C0] bg-[#9F86C0]/15' 
                      : 'border-white/5 bg-[#090612]/40 hover:border-white/20 hover:bg-[#090612]/60 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <span className={`text-xs sm:text-sm font-bold font-mono ${isToday ? 'text-accent font-extrabold' : 'text-muted-foreground'}`}>
                      {dayData.day}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="space-y-1 overflow-y-auto max-h-[60px] custom-scrollbar">
                    {dayAppointments.map(app => (
                      <div 
                        key={app.id} 
                        className="bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 rounded-lg px-2 py-1 text-[9px] sm:text-[10px] text-[#E0B1CB] font-bold truncate flex items-center justify-between shadow-sm"
                        title={`${app.time} - ${app.name} (${app.type})`}
                      >
                        <span className="truncate">{app.time} {app.name.split(' ')[0]}</span>
                        <X 
                          className="w-3 h-3 opacity-60 hover:opacity-100 shrink-0 ml-1 cursor-pointer hover:text-red-400" 
                          onClick={(e) => handleDeleteAppointment(app.id, e)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </BentoBox>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090612]/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#090612]/95 border border-white/10 rounded-[28px] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-bold text-foreground">Agendar Sessão</h3>
                <button type="button" onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-white/5 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAppointment} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-1.5">Data</label>
                  <input 
                    type="date" 
                    value={modalDate} 
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] px-4 py-3.5 text-foreground text-sm focus:border-[#9F86C0]/50 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-1.5">Hora</label>
                  <input 
                    type="time" 
                    value={modalTime} 
                    onChange={(e) => setModalTime(e.target.value)}
                    className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] px-4 py-3.5 text-foreground text-sm focus:border-[#9F86C0]/50 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-1.5">Cliente</label>
                  {modalIsFromUnassigned ? (
                    <div className="w-full bg-white/5 border border-white/10 rounded-[20px] px-4 py-3 text-foreground text-sm flex items-center justify-between">
                      <span className="font-bold">{modalClient}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setModalIsFromUnassigned(false);
                          setModalClient('');
                          setModalType('');
                        }}
                        className="text-xs text-accent font-bold hover:text-white cursor-pointer"
                      >
                        Alterar
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input 
                        type="text" 
                        value={modalClient} 
                        onChange={(e) => setModalClient(e.target.value)}
                        placeholder="Nome do Consulente"
                        className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] px-4 py-3.5 text-foreground text-sm focus:border-[#9F86C0]/50 outline-none"
                        required
                      />
                      {unassigned.length > 0 && (
                        <div className="mt-3.5 space-y-2">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ou selecione um pendente:</p>
                          <div className="flex flex-wrap gap-2">
                            {unassigned.map(u => (
                              <span 
                                key={u.id}
                                onClick={() => {
                                  setModalClient(u.name);
                                  setModalType(u.type);
                                  setModalIsFromUnassigned(true);
                                  setModalUnassignedId(u.id);
                                }}
                                className="text-[10px] px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent font-bold cursor-pointer hover:bg-white/10 hover:text-white transition-all shadow-sm"
                              >
                                {u.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#E0B1CB] font-bold mb-1.5">Tipo de Sessão</label>
                  <input 
                    type="text" 
                    value={modalType} 
                    onChange={(e) => setModalType(e.target.value)}
                    placeholder="Ex: Alinhamento Astral"
                    className="w-full bg-[#090612]/60 border border-white/10 rounded-[20px] px-4 py-3.5 text-foreground text-sm focus:border-[#9F86C0]/50 outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-tr from-[#9F86C0] to-[#E0B1CB] hover:brightness-110 text-[#140E26] text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-[0_0_12px_rgba(159,134,192,0.25)]"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
