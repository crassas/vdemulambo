const fs = require('fs');

let file = fs.readFileSync('src/views/CartaDoDiaView.tsx', 'utf8');
file = file.replace('src={cardData.image}', 'src={cardData.image || undefined}');
fs.writeFileSync('src/views/CartaDoDiaView.tsx', file);

