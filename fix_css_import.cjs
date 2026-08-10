const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/@import "tailwindcss";\n\n@import url\('https:\/\/fonts.googleapis.com\/css2\?family=Playfair\+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap'\);/, `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
@import "tailwindcss";`);

fs.writeFileSync('src/index.css', code);
