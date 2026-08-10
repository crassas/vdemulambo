const fs = require('fs');
let loginContent = fs.readFileSync('src/components/LoginPage.tsx', 'utf8');

loginContent = loginContent.replace(
  /className="w-full bg-card border border-border rounded-\[14px\] py-4 px-\[18px\] text-cream text-\[15px\] mb-4 outline-none focus:border-accent transition-colors"/g,
  'className="w-full bg-card border border-border rounded-[14px] py-4 px-[18px] text-cream text-[15px] mb-4 outline-none focus:border-gold-dim transition-colors"'
);

loginContent = loginContent.replace(
  /className="w-full bg-card border border-border rounded-\[14px\] py-4 px-\[18px\] text-cream text-\[15px\] mb-7 outline-none focus:border-accent transition-colors"/g,
  'className="w-full bg-card border border-border rounded-[14px] py-4 px-[18px] text-cream text-[15px] mb-7 outline-none focus:border-gold-dim transition-colors"'
);

fs.writeFileSync('src/components/LoginPage.tsx', loginContent);
