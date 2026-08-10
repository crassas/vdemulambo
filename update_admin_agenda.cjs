const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminAgenda.tsx', 'utf8');

// Replace mock with Firebase
code = code.replace(
  "import { BentoBox } from '../BentoBox';",
  "import { BentoBox } from '../BentoBox';\nimport { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';"
);

code = code.replace(
  /const AGENDA_MOCK = \[[\s\S]*?\];/,
  ""
);

code = code.replace(
  "const [appointments, setAppointments] = useState(AGENDA_MOCK);",
  "const [appointments, setAppointments] = useState<any[]>([]);\n\n  React.useEffect(() => {\n    const q = query(collection(db, 'appointments'));\n    const unsub = onSnapshot(q, (snap) => {\n      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));\n      setAppointments(data);\n    });\n    return () => unsub();\n  }, []);"
);

code = code.replace(
  "const [unassigned, setUnassigned] = useState([",
  "const [unassigned, setUnassigned] = useState<any[]>([\n/* Initially empty, can be populated from a 'requests' collection later */"
);

code = code.replace(
  "const newAppt = {",
  "const newAppt = {"
);

// We need to change handleSaveAppointment and handleDeleteAppointment
const handleSave = `  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalClient || !modalTime) return;

    try {
      await addDoc(collection(db, 'appointments'), {
        name: modalClient,
        type: modalType,
        date: modalDate,
        time: modalTime,
        status: 'confirmado',
        createdAt: new Date().toISOString()
      });

      if (modalIsFromUnassigned && modalUnassignedId) {
        setUnassigned(unassigned.filter(u => u.id !== modalUnassignedId));
      }

      toast.success('Consulta agendada com sucesso!');
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao agendar consulta.');
    }
  };`;

code = code.replace(/const handleSaveAppointment = \(e: React\.FormEvent\) => \{[\s\S]*?setModalOpen\(false\);\n  \};/, handleSave);

const handleDelete = `  const handleDeleteAppointment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'appointments', id));
      toast.success('Consulta cancelada.');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao cancelar consulta.');
    }
  };`;

code = code.replace(/const handleDeleteAppointment = \(id: string, e: React\.MouseEvent\) => \{[\s\S]*?toast\.success\('Consulta cancelada\.'\);\n  \};/, handleDelete);

fs.writeFileSync('src/components/admin/AdminAgenda.tsx', code);
