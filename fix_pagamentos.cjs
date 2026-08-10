const fs = require('fs');

let adminFile = fs.readFileSync('src/components/admin/AdminAttendance.tsx', 'utf8');
adminFile = adminFile.replace(
  /Pagamento de \$\{name\} confirmado!/g,
  'Agendamento de ${name} confirmado!'
).replace(
  /Aguarda Pagamento/g,
  'A Confirmar'
).replace(
  /Pagamento Confirmado/g,
  'Confirmado'
);
fs.writeFileSync('src/components/admin/AdminAttendance.tsx', adminFile);

let notifFile = fs.readFileSync('src/views/NotificationsView.tsx', 'utf8');
notifFile = notifFile.replace(
  /Pagamento Confirmado com Sucesso 💳/g,
  'Agendamento Confirmado com Sucesso ✨'
).replace(
  /O comprovativo MB Way foi validado\. O seu lugar na agenda está 100% garantido\./g,
  'Os detalhes foram validados. O seu lugar na agenda está 100% garantido.'
);
fs.writeFileSync('src/views/NotificationsView.tsx', notifFile);

