const fs = require('fs');
let code = fs.readFileSync('src/views/MentorProfileView.tsx', 'utf8');

code = code.replace(
  "import { TrabalhosView } from './TrabalhosView';",
  "import { TrabalhosView } from './TrabalhosView';\nimport { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { db } from '../lib/firebase';"
);

code = code.replace(
  /const \[profile, setProfile\] = useState<ProfileData>\(\(\) => \{[\s\S]*?\}\);/g,
  `const [profile, setProfile] = useState<ProfileData>({
    name: "Kris Ty Oya",
    role: "Vidente • Orientadora Espiritual",
    bio: "Há mais de uma década dedicada a ajudar almas a reencontrarem a sua essência. Utilizo os oráculos como ferramenta de cura e evolução pessoal. O meu propósito é trazer clareza para as tuas decisões.",
    quote: '"O futuro não está escrito em pedra, mas sim nas escolhas que fazemos no presente."',
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    stats: {
      consultations: "15k+",
      rating: "5.0",
      reviews: "2.1k",
      years: "12"
    }
  });
  
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'settings', 'profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.info) {
             setProfile(prev => ({
               ...prev,
               name: data.info.name || prev.name,
               bio: data.info.bio || prev.bio,
               role: data.info.specialties?.[0] || prev.role,
               avatarUrl: data.image || prev.avatarUrl
             }));
          }
        }
      } catch(e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);`
);

fs.writeFileSync('src/views/MentorProfileView.tsx', code);
