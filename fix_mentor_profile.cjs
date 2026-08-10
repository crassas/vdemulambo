const fs = require('fs');

let content = fs.readFileSync('src/views/MentorProfileView.tsx', 'utf8');

content = content.replace(/bg-stone-900/g, 'bg-panel');
content = content.replace(/border-amber-500\/30/g, 'border-border');
content = content.replace(/text-amber-100/g, 'text-cream');
content = content.replace(/bg-amber-400/g, 'bg-gold');
content = content.replace(/text-amber-300/g, 'text-gold');
content = content.replace(/text-stone-400/g, 'text-muted');
content = content.replace(/text-stone-950/g, 'text-[#1B1305]');
content = content.replace(/bg-stone-950/g, 'bg-card');
content = content.replace(/border-white\/10/g, 'border-border');
content = content.replace(/text-stone-300/g, 'text-cream');
content = content.replace(/text-stone-200/g, 'text-cream');
content = content.replace(/text-slate-200/g, 'text-cream');
content = content.replace(/text-slate-400/g, 'text-muted-foreground');
content = content.replace(/text-amber-400/g, 'text-gold');
content = content.replace(/text-white/g, 'text-cream');
content = content.replace(/bg-amber-400\/20/g, 'bg-gold-dim/20');
content = content.replace(/border-amber-400\/30/g, 'border-gold-dim');
content = content.replace(/shadow-amber-400\/20/g, ''); // Will let it be default
content = content.replace(/fill-white text-rose-500/g, 'fill-rose-500 text-rose-500');

fs.writeFileSync('src/views/MentorProfileView.tsx', content);

