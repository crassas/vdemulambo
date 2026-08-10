const fs = require('fs');

let content = fs.readFileSync('src/views/ClientView.tsx', 'utf8');

content = content.replace(
  'className="p-5   hover:border-accent/40 transition-all shadow-lg"',
  'className="p-5 hover:border-gold-dim transition-all shadow-lg"'
);

content = content.replace(
  'className="p-2.5 rounded-xl bg-accent/10 text-accent border "',
  'className="p-2.5 rounded-xl bg-gold/10 text-gold border border-gold-dim"'
);

content = content.replace(
  'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  'bg-green-500/10 border-green-500/20 text-green-500'
);

content = content.replace(
  'bg-accent/20 border-accent/40 text-accent',
  'bg-gold/10 border-gold-dim text-gold'
);

content = content.replace(
  'className="w-full mt-4 py-2.5 bg-accent/10 hover:bg-accent/20 rounded-xl text-xs font-bold uppercase tracking-wider text-accent/90 transition-all border  shadow-sm"',
  'className="w-full mt-4 py-2.5 bg-transparent hover:bg-gold/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gold transition-all border border-gold-dim shadow-sm"'
);

content = content.replace(
  '<span className="w-1.5 h-1.5 rounded-full 0" />',
  '<span className="w-1.5 h-1.5 rounded-full bg-gold" />'
);

fs.writeFileSync('src/views/ClientView.tsx', content);

