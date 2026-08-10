const fs = require('fs');

let splashContent = fs.readFileSync('src/components/IntroSplash.tsx', 'utf8');

// Replace with proper Splash styles as requested
splashContent = splashContent.replace(
  /<div className="w-24 h-24 rounded-full border border-gold flex items-center justify-center mb-7 glow-gold-lg">/,
  '<div className="w-24 h-24 rounded-full border border-gold flex items-center justify-center mb-7 glow-gold-lg bg-panel">'
);

fs.writeFileSync('src/components/IntroSplash.tsx', splashContent);

