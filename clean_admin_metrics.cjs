const fs = require('fs');

const fileNames = [
  'src/components/admin/AdminMetrics.tsx',
  'src/components/admin/AdminSidebar.tsx',
];

fileNames.forEach(name => {
  if (fs.existsSync(name)) {
    let content = fs.readFileSync(name, 'utf8');
    
    content = content.replace(/bg-amber-400\/10/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/15/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/20/g, 'bg-accent/20');
    content = content.replace(/bg-amber-400\/25/g, 'bg-accent/20');
    content = content.replace(/bg-amber-400\/50/g, 'bg-accent/50');
    content = content.replace(/bg-amber-500\/10/g, 'bg-accent/10');
    content = content.replace(/bg-amber-500\/20/g, 'bg-accent/20');
    content = content.replace(/bg-amber-400/g, 'bg-accent');

    content = content.replace(/border-amber-400\/20/g, 'border-accent/20');
    content = content.replace(/border-amber-400\/30/g, 'border-accent/30');
    content = content.replace(/border-amber-400\/40/g, 'border-accent/40');
    content = content.replace(/border-amber-400\/50/g, 'border-accent/50');
    content = content.replace(/border-amber-400\/60/g, 'border-accent/60');
    content = content.replace(/border-amber-500\/20/g, 'border-accent/20');
    content = content.replace(/border-amber-500\/25/g, 'border-accent/20');
    content = content.replace(/border-amber-500\/30/g, 'border-accent/30');
    content = content.replace(/border-amber-500\/40/g, 'border-accent/40');
    
    content = content.replace(/text-amber-100/g, 'text-foreground');
    content = content.replace(/text-amber-200/g, 'text-accent/90');
    content = content.replace(/text-amber-300/g, 'text-accent');
    content = content.replace(/text-amber-200\/60/g, 'text-muted-foreground');
    
    content = content.replace(/border-red-500\/10/g, 'border-destructive/30');
    content = content.replace(/border-red-500\/20/g, 'border-destructive/40');
    
    content = content.replace(/text-gilt/g, 'text-accent');
    
    fs.writeFileSync(name, content);
  }
});
