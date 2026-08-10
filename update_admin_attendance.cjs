const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminAttendance.tsx', 'utf8');

code = code.replace(
  "import { BentoBox } from '../BentoBox';",
  "import { BentoBox } from '../BentoBox';\nimport { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, setDoc } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';"
);

// We have `const MOCK_CLIENTS: Client[] = [`
// We will replace it entirely.
code = code.replace(/const MOCK_CLIENTS: Client\[\] = \[[\s\S]*?\];/g, "");

code = code.replace(
  "const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);",
  "const [clients, setClients] = useState<Client[]>([]);\n\n  React.useEffect(() => {\n    const q = query(collection(db, 'messages')); // very simple mock mapping from messages\n    const unsub = onSnapshot(q, (snap) => {\n       // this is a naive chat group just to make it functional without mock data\n       const msgs = snap.docs.map(d => ({id: d.id, ...d.data()}) as any);\n       const uniqueClients = [...new Set(msgs.map(m => m.sender))].filter(s => s !== 'cartomante');\n       const c: Client[] = uniqueClients.map((sender: string, i: number) => ({\n         id: sender,\n         name: sender,\n         status: 'waiting',\n         lastMessage: 'Mensagem',\n         type: 'Dúvida',\n         time: 'Agora',\n         unread: 1\n       }));\n       setClients(c);\n    });\n    return () => unsub();\n  }, []);"
);

fs.writeFileSync('src/components/admin/AdminAttendance.tsx', code);
