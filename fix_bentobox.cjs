const fs = require('fs');
let bento = fs.readFileSync('src/components/BentoBox.tsx', 'utf8');

bento = bento.replace(/className=\{`relative overflow-hidden[\s\S]*?\$\{className\}`\}/, 'className={`card-base relative overflow-hidden group/bento ${onClick ? "cursor-pointer" : ""} ${className}`}');

fs.writeFileSync('src/components/BentoBox.tsx', bento);

