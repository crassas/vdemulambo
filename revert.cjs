const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/--background: #0d0818;/g, '--background: oklch(0.16 0.035 285);');
css = css.replace(/--foreground: #fef3c7;/g, '--foreground: oklch(0.97 0.02 85);');
css = css.replace(/--card: #120a22;/g, '--card: oklch(0.22 0.04 285);');
css = css.replace(/--card-foreground: #fef3c7;/g, '--card-foreground: oklch(0.97 0.02 85);');
css = css.replace(/--muted: rgba\(251, 191, 36, 0\.1\);/g, '--muted: oklch(0.24 0.04 285);');
css = css.replace(/--muted-foreground: rgba\(254, 243, 199, 0\.6\);/g, '--muted-foreground: oklch(0.88 0.03 85);');
css = css.replace(/--accent: #fcd34d;/g, '--accent: oklch(0.84 0.16 78);');
css = css.replace(/--border: rgba\(245, 158, 11, 0\.3\);/g, '--border: oklch(0.82 0.14 78 / 30%);');
fs.writeFileSync('src/index.css', css);

