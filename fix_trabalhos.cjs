const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminTrabalhos.tsx', 'utf8');

code = code.replace(
  "import { BentoBox } from '../BentoBox';",
  "import { BentoBox } from '../BentoBox';\nimport { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';"
);

code = code.replace(
  /const INITIAL_TRABALHOS: Trabalho\[\] = \[[\s\S]*?\];/,
  ""
);

code = code.replace(
  /const \[trabalhos, setTrabalhos\] = useState<Trabalho\[\]>\(INITIAL_TRABALHOS\);/,
  "const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);\n\n  React.useEffect(() => {\n    const q = query(collection(db, 'trabalhos'));\n    const unsub = onSnapshot(q, (snap) => {\n      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Trabalho));\n      setTrabalhos(data);\n    });\n    return () => unsub();\n  }, []);"
);

// We need to implement proper add/update/delete instead of just state manipulation, but for now since I want to remove mock data and fix errors, we can leave the state mutation logic in there if it's not actually failing, but wait, if it's connected to firebase it will fail because it mutates state directly and snapshot will overwrite it. 
// "Quero a aplicação feita e funcional" 
// I will quickly fix save/delete

const handleSave = `  const handleSave = async (trabalho: Trabalho) => {
    try {
      if (trabalho.id.startsWith('new_')) {
        const { id, ...rest } = trabalho;
        await addDoc(collection(db, 'trabalhos'), rest);
      } else {
        await updateDoc(doc(db, 'trabalhos', trabalho.id), { ...trabalho });
      }
      setEditingId(null);
      toast.success('Trabalho guardado!');
    } catch(e) {
      console.error(e);
      toast.error('Erro ao guardar.');
    }
  };`;
code = code.replace(/const handleSave = \(trabalho: Trabalho\) => \{[\s\S]*?toast\.success\('Trabalho guardado com sucesso!'\);\n  \};/, handleSave);

const handleDelete = `  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'trabalhos', id));
      toast.success('Trabalho eliminado.');
    } catch(e) {
      console.error(e);
      toast.error('Erro ao eliminar.');
    }
  };`;
code = code.replace(/const handleDelete = \(id: string\) => \{[\s\S]*?toast\.success\('Trabalho eliminado com sucesso!'\);\n  \};/, handleDelete);

fs.writeFileSync('src/components/admin/AdminTrabalhos.tsx', code);
