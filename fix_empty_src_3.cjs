const fs = require('fs');

let file = fs.readFileSync('src/components/admin/AdminTrabalhos.tsx', 'utf8');
file = file.replace('src={trabalho.image}', 'src={trabalho.image || undefined}');
fs.writeFileSync('src/components/admin/AdminTrabalhos.tsx', file);

let file2 = fs.readFileSync('src/views/TrabalhosView.tsx', 'utf8');
file2 = file2.replace('src={trabalho.image}', 'src={trabalho.image || undefined}');
fs.writeFileSync('src/views/TrabalhosView.tsx', file2);

