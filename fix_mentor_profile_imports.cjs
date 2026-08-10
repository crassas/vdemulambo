const fs = require('fs');
let code = fs.readFileSync('src/views/MentorProfileView.tsx', 'utf8');

code = code.replace(
  "import { DecksSection } from '../components/DecksSection';",
  "import { DecksSection } from '../components/DecksSection';\nimport { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { db } from '../lib/firebase';"
);

fs.writeFileSync('src/views/MentorProfileView.tsx', code);
