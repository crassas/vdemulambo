const fs = require('fs');

let content = fs.readFileSync('src/views/ClientView.tsx', 'utf8');

// Clean up backgrounds
content = content.replace(/bg-gradient-to-b from-\[#[0-9a-f]+\] to-\[#[0-9a-f]+\]/g, '');
content = content.replace(/bg-gradient-to-br from-amber-500\/10 via-purple-950\/20 to-transparent/g, '');
content = content.replace(/bg-\[#120a22\]\/90/g, '');

// Clean up text colors
content = content.replace(/text-amber-100/g, 'text-foreground');
content = content.replace(/text-amber-200/g, 'text-accent/90');
content = content.replace(/text-amber-300/g, 'text-accent');
content = content.replace(/text-slate-100/g, 'text-foreground');
content = content.replace(/text-slate-200/g, 'text-muted-foreground');
content = content.replace(/text-slate-300/g, 'text-muted-foreground');
content = content.replace(/text-stone-950/g, 'text-background');

// Clean up bg colors
content = content.replace(/bg-amber-400\/5/g, 'bg-accent/5');
content = content.replace(/bg-amber-400\/10/g, 'bg-accent/10');
content = content.replace(/bg-amber-400\/15/g, 'bg-accent/10');
content = content.replace(/bg-amber-400\/20/g, 'bg-accent/20');
content = content.replace(/bg-amber-400\/25/g, 'bg-accent/20');
content = content.replace(/bg-amber-400\/50/g, 'bg-accent/50');
content = content.replace(/bg-amber-500\/10/g, 'bg-accent/10');
content = content.replace(/bg-amber-500\/20/g, 'bg-accent/20');
content = content.replace(/bg-amber-400/g, 'bg-accent');

// Clean up border colors
content = content.replace(/border-amber-400\/20/g, 'border-accent/20');
content = content.replace(/border-amber-400\/30/g, 'border-accent/30');
content = content.replace(/border-amber-400\/40/g, 'border-accent/40');
content = content.replace(/border-amber-400\/50/g, 'border-accent/50');
content = content.replace(/border-amber-400\/60/g, 'border-accent/60');
content = content.replace(/border-amber-500\/20/g, 'border-accent/20');
content = content.replace(/border-amber-500\/25/g, 'border-accent/20');
content = content.replace(/border-amber-500\/30/g, 'border-accent/30');
content = content.replace(/border-amber-500\/40/g, 'border-accent/40');

// Clean up gradients
content = content.replace(/bg-gradient-to-r from-amber-500\/20 via-amber-400\/15 to-purple-600\/20/g, 'bg-accent/10');
content = content.replace(/hover:from-amber-500\/30 hover:to-purple-600\/30/g, 'hover:bg-accent/20');
content = content.replace(/bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600/g, 'bg-accent');
content = content.replace(/hover:from-amber-400 hover:to-amber-500/g, 'hover:brightness-110');
content = content.replace(/shadow-\[0_0_20px_rgba\(245,158,11,0\.3\)\]/g, 'shadow-float');

fs.writeFileSync('src/views/ClientView.tsx', content);

