const fs = require('fs');

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace emojis
  content = content.replace(/✨\s*/g, '');
  content = content.replace(/🌿\s*/g, '');
  content = content.replace(/🔮\s*/g, '');
  content = content.replace(/🃏\s*/g, '');
  content = content.replace(/💰\s*/g, '');
  content = content.replace(/Cartomante/g, 'Mentora');
  content = content.replace(/cartomante/g, 'mentora');
  fs.writeFileSync(filePath, content);
}

cleanFile('src/components/LoginPage.tsx');
cleanFile('src/components/DisclaimerModal.tsx');
cleanFile('src/views/NotificationsView.tsx');
cleanFile('src/views/MentorProfileView.tsx');
