const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  /--background: oklch\(0\.16 0\.035 285\);/g,
  '--background: #0d0818;'
);
css = css.replace(
  /--foreground: oklch\(0\.97 0\.02 85\);/g,
  '--foreground: #fef3c7;'
);
css = css.replace(
  /--card: oklch\(0\.22 0\.04 285\);/g,
  '--card: #120a22;'
);
css = css.replace(
  /--card-foreground: oklch\(0\.97 0\.02 85\);/g,
  '--card-foreground: #fef3c7;'
);
css = css.replace(
  /--muted: oklch\(0\.24 0\.04 285\);/g,
  '--muted: rgba(251, 191, 36, 0.1);'
);
css = css.replace(
  /--muted-foreground: oklch\(0\.88 0\.03 85\);/g,
  '--muted-foreground: rgba(254, 243, 199, 0.6);'
);
css = css.replace(
  /--accent: oklch\(0\.84 0\.16 78\);/g,
  '--accent: #fcd34d;'
);
css = css.replace(
  /--border: oklch\(0\.82 0\.14 78 \/ 30\%\);/g,
  '--border: rgba(245, 158, 11, 0.3);'
);

fs.writeFileSync('src/index.css', css);
