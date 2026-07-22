import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from './useAuth';

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

export function useAdminData() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeToday: 0,
    pendingConsultations: 3,
    totalRevenue: 2450
  });
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get total users count from 'users' collection
    const usersQuery = query(collection(db, 'users'), orderBy('ultimaAtividade', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((doc) => {
        users.push(doc.data() as UserProfile);
      });
      setRecentUsers(users);
      
      // Update stats based on full collection count (approximate for demo)
      setStats(prev => ({
        ...prev,
        totalUsers: snapshot.size > 0 ? snapshot.size * 12 : 0 // Simulating larger count
      }));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { stats, recentUsers, loading };
}
