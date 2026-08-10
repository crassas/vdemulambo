const fs = require('fs');

let content = fs.readFileSync('src/views/ClientView.tsx', 'utf8');

// Remove border overrides
content = content.replace(/border-accent\/30/g, '');
content = content.replace(/border-accent\/20/g, '');
content = content.replace(/border-accent\/10/g, '');
content = content.replace(/bg-accent\/5/g, '');
content = content.replace(/bg-white\/5/g, '');

fs.writeFileSync('src/views/ClientView.tsx', content);

