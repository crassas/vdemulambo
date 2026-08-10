const fs = require('fs');

// AdminCartaDia.tsx
let carta = fs.readFileSync('src/components/admin/AdminCartaDia.tsx', 'utf8');
carta = carta.replace(/setName\(''\);/, "setCardData(prev => ({...prev, name: ''}));"); // assuming it's related to cardData
// Wait, I should verify AdminCartaDia.tsx first.

// AdminGaleria.tsx
let galeria = fs.readFileSync('src/components/admin/AdminGaleria.tsx', 'utf8');
if (!galeria.includes("import toast")) {
  galeria = galeria.replace("import { BentoBox } from '../BentoBox';", "import { BentoBox } from '../BentoBox';\nimport toast from 'react-hot-toast';");
  fs.writeFileSync('src/components/admin/AdminGaleria.tsx', galeria);
}

// MentorProfileView.tsx
let mentor = fs.readFileSync('src/views/MentorProfileView.tsx', 'utf8');
if (!mentor.includes("import { doc, getDoc, setDoc } from 'firebase/firestore';")) {
  mentor = mentor.replace("import { TrabalhosView } from './TrabalhosView';", "import { TrabalhosView } from './TrabalhosView';\nimport { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { db } from '../lib/firebase';");
  fs.writeFileSync('src/views/MentorProfileView.tsx', mentor);
}

