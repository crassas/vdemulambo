const fs = require('fs');

let content = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');
content = content.replace(
  "{ id: 'servicos', label: 'Consultas', icon: MessageCircle },",
  "{ id: 'agenda', label: 'Agenda', icon: MessageCircle },"
);
fs.writeFileSync('src/components/BottomNav.tsx', content);

let clientContent = fs.readFileSync('src/views/ClientView.tsx', 'utf8');
clientContent = clientContent.replace(
  "case 'servicos':\n        return <ServicosView onStartSession={onStartSession} />;",
  "case 'agenda':\n        return <ServicosView onStartSession={onStartSession} />;"
);
fs.writeFileSync('src/views/ClientView.tsx', clientContent);
