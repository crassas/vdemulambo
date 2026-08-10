const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/border-amber-500\/30/g, 'border-accent/20');
content = content.replace(/bg-amber-400\/15/g, 'bg-accent/10');
content = content.replace(/bg-amber-400\/10/g, 'bg-accent/10');
content = content.replace(/border-amber-400\/30/g, 'border-accent/30');
content = content.replace(/border-amber-400\/40/g, 'border-accent/40');
content = content.replace(/text-amber-300/g, 'text-accent');
content = content.replace(/text-amber-100/g, 'text-foreground');
content = content.replace(/bg-amber-400\/25/g, 'bg-accent/20');

fs.writeFileSync('src/App.tsx', content);
