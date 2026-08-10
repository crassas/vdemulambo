const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminGaleria.tsx', 'utf8');

code = code.replace(
  "import { BentoBox } from '../BentoBox';",
  "import { BentoBox } from '../BentoBox';\nimport { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';\nimport { db } from '../../lib/firebase';"
);

code = code.replace(
  /const MOCK_POSTS: Post\[\] = \[[\s\S]*?\];/,
  ""
);

code = code.replace(
  "const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);",
  "const [posts, setPosts] = useState<Post[]>([]);\n\n  React.useEffect(() => {\n    const q = query(collection(db, 'posts'));\n    const unsub = onSnapshot(q, (snap) => {\n      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));\n      setPosts(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));\n    });\n    return () => unsub();\n  }, []);"
);

// handlePublish
const handlePublish = `  const handlePublish = async () => {
    if (!newPostFile) return;

    try {
      await addDoc(collection(db, 'posts'), {
        type: newPostType,
        url: newPostFile,
        caption: newPostCaption,
        category: newPostCategory,
        visibility: newPostVisibility,
        date: new Date().toISOString()
      });
      toast.success('Publicado com sucesso!');
      setIsCreating(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao publicar.');
    }
  };`;

code = code.replace(/const handlePublish = \(\) => \{[\s\S]*?resetForm\(\);\n  \};/, handlePublish);

// handleDelete
const handleDelete = `  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPreviewPost(null);
      toast.success('Publicação eliminada.');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao eliminar.');
    }
  };`;

code = code.replace(/const handleDelete = \(id: string\) => \{[\s\S]*?toast\.success\('Publicação eliminada\.'\);\n  \};/, handleDelete);

fs.writeFileSync('src/components/admin/AdminGaleria.tsx', code);
