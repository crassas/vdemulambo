const fs = require('fs');

const fileNames = [
  'src/components/Sidebar.tsx',
  'src/views/TrabalhosView.tsx',
];

fileNames.forEach(name => {
  if (fs.existsSync(name)) {
    let content = fs.readFileSync(name, 'utf8');
    
    // Clean up backgrounds
    content = content.replace(/bg-\[#120a22\]\/95/g, 'bg-card/95');
    content = content.replace(/bg-\[#120a22\]/g, 'bg-card');
    content = content.replace(/bg-amber-950\/30/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/10/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/15/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/20/g, 'bg-accent/20');
    content = content.replace(/bg-amber-500\/10/g, 'bg-accent/10');
    content = content.replace(/bg-amber-500\/20/g, 'bg-accent/20');
    content = content.replace(/bg-amber-400/g, 'bg-accent');
    
    // Borders
    content = content.replace(/border-amber-400\/20/g, 'border-accent/20');
    content = content.replace(/border-amber-400\/30/g, 'border-accent/30');
    content = content.replace(/border-amber-400\/40/g, 'border-accent/40');
    content = content.replace(/border-amber-500\/20/g, 'border-accent/20');
    content = content.replace(/border-amber-500\/30/g, 'border-accent/30');
    content = content.replace(/border-amber-500\/40/g, 'border-accent/40');
    
    // Text
    content = content.replace(/text-amber-100/g, 'text-foreground');
    content = content.replace(/text-amber-200/g, 'text-accent/90');
    content = content.replace(/text-amber-300/g, 'text-accent');
    content = content.replace(/text-amber-400/g, 'text-accent');
    content = content.replace(/text-amber-500/g, 'text-accent');
    content = content.replace(/text-amber-200\/60/g, 'text-muted-foreground');

    // Fill
    content = content.replace(/fill-amber-400/g, 'fill-accent');

    // Shadow
    content = content.replace(/shadow-amber-500\/10/g, 'shadow-accent/10');
    content = content.replace(/shadow-\[0_0_15px_rgba\(245,158,11,0\.2\)\]/g, 'shadow-float');
    content = content.replace(/shadow-\[0_0_15px_rgba\(168,85,247,0\.4\)\]/g, 'shadow-float');

    // Gradient
    content = content.replace(/bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500/g, 'bg-accent');
    content = content.replace(/bg-gradient-to-t from-\[#0d0818\] via-\[#0d0818\]\/40 to-transparent/g, 'bg-gradient-to-t from-background via-background/40 to-transparent');
    
    fs.writeFileSync(name, content);
  }
});
