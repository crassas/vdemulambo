const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminAgenda.tsx', 'utf8');

code = code.replace(
  /const \[unassigned, setUnassigned\] = useState\(\[[\s\S]*?\]\);/,
  "const [unassigned, setUnassigned] = useState<any[]>([]);"
);

code = code.replace(
  /const \[appointments, setAppointments\] = useState\(\[[\s\S]*?\]\);/,
  "const [appointments, setAppointments] = useState<any[]>([]);\n\n  React.useEffect(() => {\n    const q = query(collection(db, 'appointments'));\n    const unsub = onSnapshot(q, (snap) => {\n      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));\n      setAppointments(data);\n    });\n    return () => unsub();\n  }, []);"
);

fs.writeFileSync('src/components/admin/AdminAgenda.tsx', code);
