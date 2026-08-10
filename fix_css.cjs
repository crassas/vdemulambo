const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/--background: oklch\(0\.16 0\.035 285\);/g, '--background: #0d0818;');
css = css.replace(/--foreground: oklch\(0\.97 0\.02 85\);/g, '--foreground: #fef3c7;');
css = css.replace(/--card: oklch\(0\.22 0\.04 285\);/g, '--card: #180f2b;');
css = css.replace(/--card-foreground: oklch\(0\.97 0\.02 85\);/g, '--card-foreground: #fef3c7;');
css = css.replace(/--popover: oklch\(0\.20 0\.035 285\);/g, '--popover: #150d24;');
css = css.replace(/--popover-foreground: oklch\(0\.97 0\.02 85\);/g, '--popover-foreground: #fef3c7;');
css = css.replace(/--muted: oklch\(0\.24 0\.04 285\);/g, '--muted: #23173d;');
css = css.replace(/--muted-foreground: oklch\(0\.88 0\.03 85\);/g, '--muted-foreground: #d1c8e1;');
css = css.replace(/--accent: oklch\(0\.84 0\.16 78\);/g, '--accent: #fcd34d;');
css = css.replace(/--accent-foreground: oklch\(0\.14 0\.03 285\);/g, '--accent-foreground: #451a03;');
css = css.replace(/--border: oklch\(0\.82 0\.14 78 \/ 30\%\);/g, '--border: rgba(252, 211, 77, 0.25);');

fs.writeFileSync('src/index.css', css);
