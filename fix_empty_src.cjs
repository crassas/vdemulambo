const fs = require('fs');

let file = fs.readFileSync('src/components/admin/AdminProfile.tsx', 'utf8');
file = file.replace('src={profileImage}', 'src={profileImage || undefined}');
fs.writeFileSync('src/components/admin/AdminProfile.tsx', file);

let file2 = fs.readFileSync('src/components/admin/AdminCartaDia.tsx', 'utf8');
file2 = file2.replace('src={image}', 'src={image || undefined}');
file2 = file2.replace('src={image!}', 'src={image || undefined}');
fs.writeFileSync('src/components/admin/AdminCartaDia.tsx', file2);

let file3 = fs.readFileSync('src/views/MentorProfileView.tsx', 'utf8');
file3 = file3.replace('src={profile.avatarUrl}', 'src={profile.avatarUrl || undefined}');
fs.writeFileSync('src/views/MentorProfileView.tsx', file3);

