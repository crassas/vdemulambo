const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminProfile.tsx', 'utf8');

code = code.replace(
  "import { BentoBox } from '../BentoBox';",
  "import { BentoBox } from '../BentoBox';\nimport { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';"
);

// We replace useState with useEffect
code = code.replace(
  /const \[profileImage, setProfileImage\] = useState\("https:\/\/images\.unsplash\.com\/photo-1544005313-94ddf0286df2\?auto=format&fit=crop&w=300&q=80"\);/,
  "const [profileImage, setProfileImage] = useState('');"
);

code = code.replace(
  /const \[gallery, setGallery\] = useState\(\[[\s\S]*?\]\);/,
  "const [gallery, setGallery] = useState<string[]>([]);"
);

code = code.replace(
  /const \[profile, setProfile\] = useState\(\{[\s\S]*?\}\);/,
  `const [profile, setProfile] = useState({
    name: 'Kris Ty Oya',
    bio: '',
    specialties: [] as string[],
    instagram: '',
    whatsapp: '',
    email: ''
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'settings', 'profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data.info || profile);
          setProfileImage(data.image || '');
          setGallery(data.gallery || []);
        }
      } catch(e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);`
);

// handleSave
const handleSave = `  const handleSave = async () => {
    setIsEditing(false);
    try {
      await setDoc(doc(db, 'settings', 'profile'), {
        info: profile,
        image: profileImage,
        gallery: gallery
      }, { merge: true });
      toast.success('Perfil atualizado!');
    } catch(e) {
      console.error(e);
      toast.error('Erro ao atualizar o perfil.');
    }
  };`;

code = code.replace(/const handleSave = \(\) => \{[\s\S]*?toast\.success\('Perfil atualizado com sucesso!'\);\n  \};/, handleSave);

fs.writeFileSync('src/components/admin/AdminProfile.tsx', code);
