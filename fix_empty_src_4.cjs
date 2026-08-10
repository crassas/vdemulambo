const fs = require('fs');

let file = fs.readFileSync('src/App.tsx', 'utf8');
file = file.replace('src={profile.fotoPerfil}', 'src={profile?.fotoPerfil || undefined}');
file = file.replace('src={profile?.fotoPerfil}', 'src={profile?.fotoPerfil || undefined}'); // just in case
fs.writeFileSync('src/App.tsx', file);

let file2 = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
file2 = file2.replace('src={userProfile.fotoPerfil}', 'src={userProfile?.fotoPerfil || undefined}');
fs.writeFileSync('src/components/Sidebar.tsx', file2);

