const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove showIntro and introRole state
code = code.replace(/const \[showIntro, setShowIntro\] = useState\(true\);\n/, '');
code = code.replace(/const \[introRole, setIntroRole\] = useState<'cliente' \| 'admin'>\('cliente'\);\n/, '');

// Fix the corrupted showIntro if block
code = code.replace(/  if \(showIntro\) \{\n      if \(role\) setIntroRole\(role\);\n      setShowIntro\(false\);\n    \}\} \/>;\n  \}/, '');

// Fix the LoginPage render
code = code.replace(/<LoginPage selectedRole=\{introRole\} onBack=\{.*\} \/>/, '<LoginPage />');

fs.writeFileSync('src/App.tsx', code);
