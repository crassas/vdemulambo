import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    'welcome': 'Bem-vinda ao seu Espaço',
    'inicio': 'Início',
    'carta_dia': 'Carta do Dia',
    'servicos': 'Serviços',
    'mentora': 'A Mentora',
    'trabalhos': 'Publicações',
    'faq': 'Perguntas',
    'consultations': 'Consultas',
    'messages': 'Mensagens',
    'notifications': 'Notificações',
    'settings': 'Definições',
    'logout': 'Encerrar Sessão',
    'login': 'Entrar',
    'spiritual_guidance': 'Orientação Espiritual',
    'daily_card': 'Carta do Dia',
    'explore_services': 'Explorar Serviços',
    'mentor_profile': 'Perfil da Mentora',
    'language': 'Idioma',
    'portuguese': 'Português',
    'spanish': 'Español',
    'english': 'English',
  },
  es: {
    'welcome': 'Bienvenida a tu Espacio',
    'inicio': 'Inicio',
    'carta_dia': 'Carta del Día',
    'servicos': 'Servicios',
    'mentora': 'La Mentora',
    'trabalhos': 'Publicaciones',
    'faq': 'Preguntas',
    'consultations': 'Consultas',
    'messages': 'Mensajes',
    'notifications': 'Notificaciones',
    'settings': 'Ajustes',
    'logout': 'Cerrar Sesión',
    'login': 'Iniciar Sesión',
    'spiritual_guidance': 'Orientación Espiritual',
    'daily_card': 'Carta del Día',
    'explore_services': 'Explorar Servicios',
    'mentor_profile': 'Perfil de la Mentora',
    'language': 'Idioma',
    'portuguese': 'Português',
    'spanish': 'Español',
    'english': 'English',
  },
  en: {
    'welcome': 'Welcome to your Space',
    'inicio': 'Home',
    'carta_dia': 'Daily Card',
    'servicos': 'Services',
    'mentora': 'The Mentor',
    'trabalhos': 'Publications',
    'faq': 'FAQ',
    'consultations': 'Consultations',
    'messages': 'Messages',
    'notifications': 'Notifications',
    'settings': 'Settings',
    'logout': 'Log Out',
    'login': 'Sign In',
    'spiritual_guidance': 'Spiritual Guidance',
    'daily_card': 'Daily Card',
    'explore_services': 'Explore Services',
    'mentor_profile': 'Mentor Profile',
    'language': 'Language',
    'portuguese': 'Português',
    'spanish': 'Español',
    'english': 'English',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'es' || saved === 'en' || saved === 'pt') ? saved : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['pt']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
