const fs = require('fs');

const fileNames = [
  'src/components/IntroSplash.tsx',
  'src/components/BottomNav.tsx',
  'src/components/ThemeSwitcher.tsx',
];

fileNames.forEach(name => {
  if (fs.existsSync(name)) {
    let content = fs.readFileSync(name, 'utf8');
    
    // Clean up backgrounds
    content = content.replace(/bg-\[#0a0518\]\/90/g, 'bg-background/90');
    content = content.replace(/bg-\[#0a0518\]/g, 'bg-background');
    content = content.replace(/bg-\[#160e29\]\/95/g, 'bg-card/95');
    
    // Clean up borders
    content = content.replace(/border-amber-500\/30/g, 'border-accent/30');
    content = content.replace(/border-amber-500\/40/g, 'border-accent/40');
    content = content.replace(/border-amber-400\/10/g, 'border-accent/10');
    content = content.replace(/border-amber-400\/20/g, 'border-accent/20');
    content = content.replace(/border-amber-400\/30/g, 'border-accent/30');
    
    // Texts and bg
    content = content.replace(/text-amber-100/g, 'text-foreground');
    content = content.replace(/text-amber-300/g, 'text-accent');
    content = content.replace(/text-amber-200\/50/g, 'text-muted-foreground');
    content = content.replace(/text-amber-200\/60/g, 'text-muted-foreground');
    
    content = content.replace(/bg-amber-400\/5/g, 'bg-accent/5');
    content = content.replace(/bg-amber-400\/10/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/20/g, 'bg-accent/20');
    
    fs.writeFileSync(name, content);
  }
});
