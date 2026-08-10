const fs = require('fs');

const fileNames = [
  'src/views/FaqView.tsx',
  'src/views/NotificationsView.tsx',
];

fileNames.forEach(name => {
  if (fs.existsSync(name)) {
    let content = fs.readFileSync(name, 'utf8');
    
    // Clean up backgrounds
    content = content.replace(/bg-gradient-to-r from-\[#110924\]\/90 to-\[#0a0418\]\/90/g, 'bg-card/80');
    content = content.replace(/bg-gradient-to-r from-purple-950 via-\[#180c35\] to-amber-950\/60/g, 'bg-card/90');
    content = content.replace(/bg-gradient-to-r from-amber-950\/30 via-purple-950\/20 to-stone-900\/40/g, 'bg-card/90');
    content = content.replace(/bg-\[#0e071e\]\/90/g, 'bg-input/80');
    content = content.replace(/bg-\[#0c061a\]/g, 'bg-card/80');
    content = content.replace(/bg-gradient-to-r from-amber-950\/20 via-stone-900\/80 to-stone-900\/90/g, 'bg-card/90');
    content = content.replace(/bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500/g, 'bg-accent');

    // Clean up text colors
    content = content.replace(/text-amber-100\/90/g, 'text-foreground/90');
    content = content.replace(/text-amber-100/g, 'text-foreground');
    content = content.replace(/text-amber-200\/60/g, 'text-muted-foreground');
    content = content.replace(/text-amber-200/g, 'text-accent/90');
    content = content.replace(/text-amber-300\/70/g, 'text-accent/70');
    content = content.replace(/text-amber-300\/80/g, 'text-accent/80');
    content = content.replace(/text-amber-300\/60/g, 'text-accent/60');
    content = content.replace(/text-amber-300/g, 'text-accent');
    content = content.replace(/text-amber-400\/60/g, 'text-accent/60');
    content = content.replace(/text-amber-400\/90/g, 'text-accent/90');
    content = content.replace(/text-amber-400/g, 'text-accent');
    content = content.replace(/text-purple-100\/80/g, 'text-muted-foreground');
    content = content.replace(/text-purple-300\/50/g, 'text-muted-foreground');
    content = content.replace(/text-purple-300\/40/g, 'text-muted-foreground');
    content = content.replace(/text-purple-950/g, 'text-background');

    // Clean up bg colors
    content = content.replace(/bg-amber-400\/10/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/15/g, 'bg-accent/10');
    content = content.replace(/bg-amber-400\/20/g, 'bg-accent/20');
    content = content.replace(/bg-amber-400\/30/g, 'bg-accent/30');
    content = content.replace(/bg-amber-400/g, 'bg-accent');
    content = content.replace(/bg-purple-950\/40/g, 'bg-accent/5');

    // Clean up border colors
    content = content.replace(/border-amber-400\/20/g, 'border-accent/20');
    content = content.replace(/border-amber-400\/25/g, 'border-accent/20');
    content = content.replace(/border-amber-400\/30/g, 'border-accent/30');
    content = content.replace(/border-amber-400\/40/g, 'border-accent/40');
    content = content.replace(/border-amber-500\/10/g, 'border-accent/10');
    content = content.replace(/border-amber-500\/15/g, 'border-accent/20');
    content = content.replace(/border-amber-500\/20/g, 'border-accent/20');
    content = content.replace(/border-amber-500\/30/g, 'border-accent/30');
    
    // Shadows
    content = content.replace(/shadow-\[0_0_12px_rgba\(245,158,11,0\.2\)\]/g, 'shadow-float');
    content = content.replace(/shadow-\[0_0_20px_rgba\(245,158,11,0\.2\)\]/g, 'shadow-float-lg');
    content = content.replace(/shadow-\[0_0_25px_rgba\(245,158,11,0\.5\)\]/g, 'shadow-float-lg');
    content = content.replace(/shadow-amber-500\/10/g, 'shadow-accent/10');

    fs.writeFileSync(name, content);
  }
});
