import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Heart, Sparkles, TrendingUp, UserCheck } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

const categories = [
  { title: 'Trabalhos de Amor', description: 'Conheça abordagens dedicadas às relações, aos vínculos e à harmonia afetiva.', icon: Heart },
  { title: 'Prosperidade', description: 'Conteúdos sobre abundância, estabilidade e desenvolvimento dos seus projetos.', icon: TrendingUp },
  { title: 'Abertura de Caminhos', description: 'Informação sobre trabalhos orientados para novos ciclos e possibilidades.', icon: Compass },
  { title: 'Autoestima', description: 'Práticas e acompanhamentos focados no amor-próprio e no poder pessoal.', icon: UserCheck }
];

export function TrabalhosView() {
  const [trabalhos, setTrabalhos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'trabalhos')), snapshot => {
      setTrabalhos(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
      setLoading(false);
    }, error => {
      console.warn('Não foi possível carregar os trabalhos:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const items = trabalhos.length ? trabalhos : categories;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8 pb-28">
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0B1CB]/10 border border-[#E0B1CB]/20 text-[#E0B1CB] text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Montra
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-cream font-bold">Trabalhos & Rituais</h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">Explore trabalhos, categorias e publicações partilhadas por Kris Ty Oya.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-[28px] bg-white/[0.03] border border-white/10 animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item: any, index) => {
            const Icon = item.icon || Sparkles;
            const image = item.image || item.imageUrl || item.url;
            return (
              <article key={item.id || item.title || index} className="overflow-hidden bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[28px] shadow-xl">
                {image && <img src={image} alt={item.name || item.title} className="w-full h-52 object-cover" referrerPolicy="no-referrer" />}
                <div className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-[#9F86C0]/10 border border-[#9F86C0]/20 flex items-center justify-center mb-4"><Icon className="w-5 h-5 text-[#E0B1CB]" /></div>
                  <h2 className="font-serif text-xl text-cream font-bold mb-2">{item.name || item.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  {item.duration && <p className="mt-4 text-[10px] text-[#E0B1CB] uppercase tracking-widest">Duração: {item.duration}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
