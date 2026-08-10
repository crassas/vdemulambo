const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/:root \{[\s\S]*?\}/, `:root {
  color-scheme: dark;
  --bg: #0F0A14;
  --bg-gradient: radial-gradient(ellipse 80% 50% at 50% 0%, #2E1638 0%, #0F0A14 65%);
  --panel: #17111D;
  --panel-border: rgba(212,169,78,0.16);
  --card: #1B1420;
  --card-border: rgba(212,169,78,0.14);
  --gold: #D4A94E;
  --gold-light: #E8C36B;
  --gold-dim: rgba(212,169,78,0.55);
  --cream: #F3E9D8;
  --text-muted: #9C8FA0;
  --overlay: rgba(6,4,9,0.72);
}`);

css = css.replace(/\[data-theme="light"\] \{[\s\S]*?\}/, `[data-theme="light"] {
  color-scheme: light;
  --bg: #F6F0E4;
  --bg-gradient: radial-gradient(ellipse 80% 50% at 50% 0%, #EFE1C8 0%, #F6F0E4 65%);
  --panel: #FBF6EC;
  --panel-border: rgba(122,84,20,0.18);
  --card: #FFFDF7;
  --card-border: rgba(122,84,20,0.16);
  --gold: #A3781F;
  --gold-light: #8C6415;
  --gold-dim: rgba(163,120,31,0.6);
  --cream: #241A2C;
  --text-muted: #6E6072;
  --overlay: rgba(40,30,20,0.4);
}`);

css = css.replace(/\.bottom-nav-active \{[\s\S]*?\}/, `.bottom-nav-active {
  border-radius: 14px;
  background: linear-gradient(160deg, #2E1638, #1B1420);
  box-shadow: 0 3px 10px rgba(0,0,0,0.45), 0 0 0 1px var(--gold-dim), inset 0 1px 0 rgba(255,255,255,0.06);
  transform: translateY(-2px);
}`);

fs.writeFileSync('src/index.css', css);
