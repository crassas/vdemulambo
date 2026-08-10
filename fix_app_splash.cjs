const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import IntroSplash
if (!code.includes('import { IntroSplash }')) {
  code = code.replace(/import { LoginPage } from '\.\/components\/LoginPage';/, "import { LoginPage } from './components/LoginPage';\nimport { IntroSplash } from './components/IntroSplash';");
}

// Add state for splash screen
code = code.replace(/const \[activeTab, setActiveTab\] = useState\(profile\?\.role === 'admin' \? 'dashboard' : 'inicio'\);/, `const [activeTab, setActiveTab] = useState(profile?.role === 'admin' ? 'dashboard' : 'inicio');
  const [hasCompletedSplash, setHasCompletedSplash] = useState(false);`);

// Modify not logged in logic
code = code.replace(/\/\/ Not logged in\n  if \(\!user\) \{\n    return <LoginPage \/>;\n  \}/, `// Not logged in
  if (!user) {
    if (!hasCompletedSplash) {
      return <IntroSplash onDone={() => setHasCompletedSplash(true)} />;
    }
    return <LoginPage />;
  }`);

fs.writeFileSync('src/App.tsx', code);
