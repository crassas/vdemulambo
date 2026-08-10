const fs = require('fs');

let adminContent = fs.readFileSync('src/components/admin/AdminCartaDia.tsx', 'utf8');

// Remove Nome da Carta
adminContent = adminContent.replace(
  /<div>\s*<label[^>]*>Nome da Carta<\/label>[\s\S]*?<\/div>/,
  ''
);

// Remove the state variables for name
adminContent = adminContent.replace(/const \[name, setName\] = useState\(''\);/, '');
adminContent = adminContent.replace(/name,\s*/, '');

fs.writeFileSync('src/components/admin/AdminCartaDia.tsx', adminContent);

let clientContent = fs.readFileSync('src/views/CartaDoDiaView.tsx', 'utf8');
clientContent = clientContent.replace(/name: string;\s*/, '');
clientContent = clientContent.replace(
  /<div className="absolute bottom-6 left-0 right-0 text-center">[\s\S]*?<\/div>/,
  ''
);
fs.writeFileSync('src/views/CartaDoDiaView.tsx', clientContent);

