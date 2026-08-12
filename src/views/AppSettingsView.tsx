import { useState } from 'react';
import { Download, Globe, Moon, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { useLanguage } from '../context/LanguageContext';

export function AppSettingsView({ onClearCache }: { onClearCache: () => Promise<void> }) {
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'mystic');

  const selectTheme = (value: string) => {
    setTheme(value);
    localStorage.setItem('appTheme', value);
    document.documentElement.setAttribute('data-theme', value);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <header><h1 className="text-3xl font-serif text-cream font-bold">Configurações do App</h1><p className="text-sm text-muted-foreground mt-2">Personalize a aplicação e mantenha os dados locais sincronizados.</p></header>
      <section className="p-6 rounded-[28px] bg-white/[0.03] border border-white/10 space-y-4">
        <h2 className="font-serif text-xl text-cream flex items-center gap-2"><Globe className="w-5 h-5 text-[#E0B1CB]" /> Idioma</h2>
        <div className="grid grid-cols-3 gap-3">{(['pt', 'es', 'en'] as Language[]).map(value => <button key={value} onClick={() => setLanguage(value)} className={`py-3 rounded-xl border text-xs font-bold uppercase cursor-pointer ${language === value ? 'bg-[#E0B1CB]/20 border-[#E0B1CB]/50 text-[#E0B1CB]' : 'border-white/10 text-muted-foreground'}`}>{value}</button>)}</div>
      </section>
      <section className="p-6 rounded-[28px] bg-white/[0.03] border border-white/10 space-y-4">
        <h2 className="font-serif text-xl text-cream flex items-center gap-2"><Moon className="w-5 h-5 text-[#E0B1CB]" /> Tema e aparência</h2>
        <div className="grid grid-cols-2 gap-3">{[{id:'mystic',label:'Noite Mística'},{id:'champagne',label:'Champagne Ouro'},{id:'rose',label:'Éter Rosé'},{id:'light',label:'Claro'}].map(item => <button key={item.id} onClick={() => selectTheme(item.id)} className={`py-3 rounded-xl border text-xs cursor-pointer ${theme === item.id ? 'bg-[#E0B1CB]/20 border-[#E0B1CB]/50 text-[#E0B1CB]' : 'border-white/10 text-muted-foreground'}`}>{item.label}</button>)}</div>
      </section>
      {'serviceWorker' in navigator && <section className="p-6 rounded-[28px] bg-white/[0.03] border border-white/10"><h2 className="font-serif text-xl text-cream flex items-center gap-2"><Download className="w-5 h-5 text-[#E0B1CB]" /> Instalação PWA</h2><p className="text-sm text-muted-foreground mt-2">Pode instalar esta aplicação através da opção “Instalar aplicação” do seu navegador.</p></section>}
      <button onClick={onClearCache} className="w-full py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-[#E0B1CB] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"><RefreshCw className="w-4 h-4" /> Limpar cache e sincronizar</button>
    </div>
  );
}
