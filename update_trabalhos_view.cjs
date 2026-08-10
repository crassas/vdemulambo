const fs = require('fs');
let code = fs.readFileSync('src/views/TrabalhosView.tsx', 'utf8');

code = code.replace(
  "import { BentoBox } from '../components/BentoBox';",
  "import { BentoBox } from '../components/BentoBox';\nimport { collection, query, onSnapshot, addDoc } from 'firebase/firestore';\nimport { db } from '../lib/firebase';"
);

code = code.replace(
  /const MOCK_TRABALHOS = \[[\s\S]*?\];/,
  ""
);

code = code.replace(
  "export function TrabalhosView({ onSelectChat }: { onSelectChat?: () => void }) {",
  "export function TrabalhosView({ onSelectChat }: { onSelectChat?: () => void }) {\n  const [trabalhos, setTrabalhos] = useState<any[]>([]);\n\n  useEffect(() => {\n    const q = query(collection(db, 'trabalhos'));\n    const unsub = onSnapshot(q, (snap) => {\n      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));\n      setTrabalhos(data);\n    });\n    return () => unsub();\n  }, []);\n"
);

code = code.replace(
  /\{MOCK_TRABALHOS\.map\(\(trabalho\) => \(/g,
  "{trabalhos.map((trabalho) => ("
);

// We need to implement proper chat logic, but for now we can just leave the mock chat behavior (since it's a frontend mock for chatting before auth maybe?), or we can change it to add a request. 
// "Falta o calendário para adicionar as pessoas que estão lá"
// Actually, sending a message can just add an "appointment request" or "chat message" to Firebase.
const handleSendMessage = `  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      });
      setMessage('');
      toast.success('Mensagem enviada com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar mensagem.');
    }
  };`;

code = code.replace(/const handleSendMessage = \(e: React\.FormEvent\) => \{[\s\S]*?\}, 1500\);\n  \};/, handleSendMessage);

fs.writeFileSync('src/views/TrabalhosView.tsx', code);
