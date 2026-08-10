import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, Trash2, Calendar, MessageSquare, Sparkles, ShieldAlert, CheckCircle2, ChevronRight, Volume2, BellRing, Settings2 } from 'lucide-react';
import { BentoBox } from '../components/BentoBox';
import { NotificationItem } from '../types';
import toast from 'react-hot-toast';

interface NotificationsViewProps {
  onNavigate?: (tab: string) => void;
}

const INITIAL_NOTIFICATIONS: (NotificationItem & { actionTab?: string })[] = [
  {
    id: '1',
    title: 'Consulta Agendada e Confirmada ',
    message: 'A sua sessão de Leitura de Tarot & Búzios foi confirmada por Kris Ty Oya para hoje às 18:00.',
    time: 'Há 12 min',
    read: false,
    type: 'consultation',
    actionTab: 'consultas'
  },
  {
    id: '2',
    title: 'Nova Orientação Espiritual ',
    message: 'Kris Ty Oya enviou-lhe uma nova mensagem privada na sua sala de atendimento ativo.',
    time: 'Há 45 min',
    read: false,
    type: 'info',
    actionTab: 'mensagens'
  },
  {
    id: '3',
    title: 'Carta do Dia Revelada ',
    message: 'A tiragem de sabedoria energética de hoje traz revelações valiosas para os seus caminhos.',
    time: 'Há 3 horas',
    read: true,
    type: 'card',
    actionTab: 'carta_dia'
  },
  {
    id: '4',
    title: 'Agendamento Confirmado com Sucesso ✨',
    message: 'Os detalhes foram validados. O seu lugar na agenda está 100% garantido.',
    time: 'Ontem às 20:15',
    read: true,
    type: 'system',
    actionTab: 'consultas'
  },
  {
    id: '5',
    title: 'Aviso de Limpeza Energética ',
    message: 'Lembrete: Mantenha a vela branca acesa durante o horário da sua oração guiada.',
    time: 'Há 2 dias',
    read: true,
    type: 'info',
    actionTab: 'servicos'
  }
];

export function NotificationsView({ onNavigate }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<(NotificationItem & { actionTab?: string })[]>(() => {
    const saved = localStorage.getItem('app_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'consultation' | 'info'>('all');
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('push_notifications_enabled') === 'true';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleTogglePush = () => {
    const nextState = !pushEnabled;
    setPushEnabled(nextState);
    localStorage.setItem('push_notifications_enabled', String(nextState));
    if (nextState) {
      toast.success('Notificações Push ativadas com sucesso!', {
        icon: '🔔',
        style: { background: '#1c1917', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)' }
      });
    } else {
      toast('Notificações Push pausadas.', { icon: '🔕' });
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas as notificações foram marcadas como lidas.');
  };

  const handleMarkAsRead = (id: string, actionTab?: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (actionTab && onNavigate) {
      onNavigate(actionTab);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificação removida.');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'consultation') return n.type === 'consultation';
    if (activeFilter === 'info') return n.type === 'info' || n.type === 'card';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Calendar className="w-5 h-5 text-[#E0B1CB]" />;
      case 'info':
        return <MessageSquare className="w-5 h-5 text-[#9F86C0]" />;
      case 'card':
        return <Sparkles className="w-5 h-5 text-[#C5A059]" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto">
      {/* Top Banner / System Settings */}
      <div className="p-6 rounded-[28px] bg-gradient-to-br from-[#140E26] to-[#0C0A14] border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-[#E0B1CB]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-cream">Centro de Notificações</h3>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E0B1CB]/20 text-[#E0B1CB] border border-[#E0B1CB]/30">
                    {unreadCount} {unreadCount === 1 ? 'Nova' : 'Novas'}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receba lembretes de consultas, recados de Kris Ty Oya e tiragens diárias.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <button
              onClick={handleTogglePush}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border cursor-pointer ${
                pushEnabled
                  ? 'bg-[#9F86C0]/20 text-[#E0B1CB] border-[#9F86C0]/40 shadow-sm'
                  : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{pushEnabled ? 'Push Ativo' : 'Ativar Push'}</span>
              <div className={`w-2 h-2 rounded-full ${pushEnabled ? 'bg-emerald-400' : 'bg-stone-600'}`} />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#E0B1CB] hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Ler Todas</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'all', label: 'Todas', count: notifications.length },
          { id: 'unread', label: 'Não Lidas', count: unreadCount },
          { id: 'consultation', label: 'Consultas', count: notifications.filter(n => n.type === 'consultation').length },
          { id: 'info', label: 'Mensagens & Avisos', count: notifications.filter(n => n.type === 'info' || n.type === 'card').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#9F86C0]/20 text-[#E0B1CB] border-[#9F86C0]/40 font-bold shadow-md'
                : 'bg-white/[0.03] text-muted-foreground border-white/5 hover:bg-white/10 hover:text-cream'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] ${
              activeFilter === tab.id ? 'bg-[#9F86C0]/30 text-[#E0B1CB]' : 'bg-white/5 text-stone-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 text-center rounded-[28px] bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center gap-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-stone-500">
                <Bell className="w-7 h-7" />
              </div>
              <h4 className="text-base font-serif text-cream font-bold">Sem notificações aqui</h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                {activeFilter === 'unread' 
                  ? 'Está em dia! Não possui avisos pendentes de leitura.' 
                  : 'Nenhuma notificação encontrada nesta categoria.'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  onClick={() => handleMarkAsRead(notif.id, notif.actionTab)}
                  className={`p-5 rounded-[24px] transition-all group border cursor-pointer ${
                    !notif.read
                      ? 'bg-gradient-to-r from-white/[0.06] to-white/[0.02] border-[#9F86C0]/30 shadow-xl'
                      : 'bg-white/[0.02] border-white/5 opacity-80 hover:opacity-100 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon Column */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      !notif.read 
                        ? 'bg-[#9F86C0]/20 border-[#9F86C0]/30 shadow-sm' 
                        : 'bg-white/5 border-white/10'
                    }`}>
                      {getIcon(notif.type)}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold tracking-tight truncate ${
                            !notif.read ? 'text-[#E0B1CB]' : 'text-cream'
                          }`}>
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-[#E0B1CB] shrink-0 animate-pulse" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                          {notif.time}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      {notif.actionTab && (
                        <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#E0B1CB] group-hover:text-white transition-colors">
                          <span>Ver Detalhes</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                    </div>

                    {/* Delete Action */}
                    <button
                      onClick={(e) => handleDelete(e, notif.id)}
                      className="p-2 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0 self-center cursor-pointer"
                      title="Apagar notificação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
