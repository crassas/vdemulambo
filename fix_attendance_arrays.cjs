const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminAttendance.tsx', 'utf8');

code = code.replace(
  /const \[pendingRequests, setPendingRequests\] = useState<number\[\]>\(\[1, 2\]\);/,
  "const [pendingRequests, setPendingRequests] = useState<number[]>([]);"
);

code = code.replace(
  /const \[slots, setSlots\] = useState<\{time: string, reserved: boolean\}\[]>\(\[[\s\S]*?\]\);/,
  "const [slots, setSlots] = useState<{time: string, reserved: boolean}[]>([]);"
);

fs.writeFileSync('src/components/admin/AdminAttendance.tsx', code);
