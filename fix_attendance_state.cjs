const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminAttendance.tsx', 'utf8');

const stateCode = `  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'));
    const unsub = onSnapshot(q, (snap) => {
       const msgs = snap.docs.map(d => ({id: d.id, ...d.data()} as any));
       const uniqueClients = [...new Set(msgs.map(m => m.sender))].filter(s => s !== 'cartomante');
       const c: Client[] = uniqueClients.map((sender: string, i: number) => ({
         id: sender,
         name: sender,
         status: 'pending',
         lastMessage: 'Mensagem',
         type: 'Dúvida',
         time: 'Agora',
         sent: false,
         received: true,
         unread: 1
       }));
       setClients(c);
    });
    return () => unsub();
  }, []);
`;

code = code.replace(
  "export function AdminAttendance({ onStartSession }: { onStartSession?: () => void }) {",
  "export function AdminAttendance({ onStartSession }: { onStartSession?: () => void }) {\n" + stateCode
);

fs.writeFileSync('src/components/admin/AdminAttendance.tsx', code);
