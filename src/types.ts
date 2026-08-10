import React from 'react';

export type UserRole = 'cliente' | 'admin';

export interface UserProfile {
  uid: string;
  nome: string | null;
  email: string | null;
  fotoPerfil: string | null;
  role: UserRole;
  dataCriacao?: any;
  ultimaAtividade?: any;
}

export interface Client {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  status: 'pending' | 'paid' | 'completed';
  sent: boolean;
  received: boolean;
  avatar?: string;
  privateNotes?: string;
  history?: ConsultationRecord[];
}

export interface ConsultationRecord {
  id: string;
  date: string;
  service: string;
  notes?: string;
  status: 'Confirmado' | 'Pendente' | 'Concluído';
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  pendingConsultations: number;
  totalRevenue: number;
}

export interface ActivityLog {
  id: string;
  userEmail: string;
  userName: string;
  action: string;
  timestamp: Date;
  type: 'login' | 'consultation' | 'payment' | 'session';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'consultation' | 'card' | 'system';
}

export type Language = 'pt' | 'es' | 'en';

export interface ComponentWithIconProps {
  icon: React.ElementType;
  label?: string;
  value?: string;
  sub?: string;
  highlight?: boolean;
  onClick?: () => void;
}
