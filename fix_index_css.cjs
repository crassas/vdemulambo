const fs = require('fs');
let css = `@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

@theme inline {
  --color-bg: var(--bg);
  --color-panel: var(--panel);
  --color-card: var(--card);
  --color-gold: var(--gold);
  --color-gold-light: var(--gold-light);
  --color-gold-dim: var(--gold-dim);
  --color-cream: var(--cream);
  --color-text-muted: var(--text-muted);
  --color-overlay: var(--overlay);

  --color-background: var(--bg);
  --color-foreground: var(--cream);
  --color-border: var(--card-border);
  --color-popover: var(--panel);
  --color-popover-foreground: var(--cream);
  --color-muted: var(--text-muted);
  --color-muted-foreground: var(--text-muted);
  --color-accent: var(--gold);
  --color-accent-foreground: #1B1305;
  
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
}

:root {
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
}

[data-theme="light"] {
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
}

@layer base {
  body {
    background-color: var(--bg);
    background-image: var(--bg-gradient);
    background-attachment: fixed;
    color: var(--cream);
    font-family: var(--font-sans);
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
  }
}

@layer utilities {
  .eyebrow {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: var(--gold);
  }
  
  .card-base {
    background-color: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    padding: 20px;
  }
  
  .panel-base {
    background-color: var(--panel);
    border: 1px solid var(--panel-border);
    border-radius: 26px;
  }
  
  .glow-gold {
    box-shadow: 0 0 40px var(--gold-dim);
  }
  
  .glow-gold-lg {
    box-shadow: 0 0 60px var(--gold-dim);
  }
  
  .btn-gold {
    background: linear-gradient(180deg, #E8C36B, #D4A94E);
    color: #1B1305;
    border-radius: 999px;
    padding: 13px 22px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .btn-outline {
    background: transparent;
    border: 1px solid var(--gold-dim);
    color: var(--gold);
    border-radius: 999px;
    padding: 13px 22px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .btn-gold:active, .btn-outline:active, .card-base:active {
    transform: scale(0.96);
  }
  
  .bottom-nav-active {
    border-radius: 14px;
    background: linear-gradient(160deg, #2E1638, #1B1420);
    box-shadow: 0 3px 10px rgba(0,0,0,0.45), 0 0 0 1px var(--gold-dim), inset 0 1px 0 rgba(255,255,255,0.06);
    transform: translateY(-2px);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
`;
fs.writeFileSync('src/index.css', css);
