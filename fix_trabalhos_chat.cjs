const fs = require('fs');
let code = fs.readFileSync('src/views/TrabalhosView.tsx', 'utf8');

code = code.replace(
  /const \[messages, setMessages\] = useState<\{id: string, text: string, sender: 'user' \| 'cartomante'\}\[]>\[[\s\S]*?\]\);/,
  "const [messages, setMessages] = useState<{id: string, text: string, sender: 'user' | 'cartomante'}[]>([]);\n\n  useEffect(() => {\n    const q = query(collection(db, 'messages'));\n    const unsub = onSnapshot(q, (snap) => {\n      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));\n      setMessages(data.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));\n    });\n    return () => unsub();\n  }, []);"
);

fs.writeFileSync('src/views/TrabalhosView.tsx', code);
