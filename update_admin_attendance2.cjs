const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminAttendance.tsx', 'utf8');

code = code.replace(/MOCK_CLIENTS/g, "clients");

fs.writeFileSync('src/components/admin/AdminAttendance.tsx', code);
