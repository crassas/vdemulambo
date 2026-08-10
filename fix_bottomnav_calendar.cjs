const fs = require('fs');

let content = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');
if (!content.includes('Calendar')) {
  content = content.replace("import { Home, Sparkles, MessageCircle, User, Moon }", "import { Home, Sparkles, MessageCircle, User, Moon, Calendar }");
}
content = content.replace(
  "{ id: 'agenda', label: 'Agenda', icon: MessageCircle },",
  "{ id: 'agenda', label: 'Agenda', icon: Calendar },"
);
fs.writeFileSync('src/components/BottomNav.tsx', content);
