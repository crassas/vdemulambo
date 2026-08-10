const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx,js,jsx}');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace manual gradients for buttons with btn-gold
  content = content.replace(
    /className="(?:[^"]*)bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600(?:[^"]*)"/g,
    'className="btn-gold w-full text-xs"'
  );
  
  content = content.replace(
    /className="(?:[^"]*)button-mystic(?:[^"]*)"/g,
    'className="btn-gold w-full text-xs flex justify-center items-center gap-2"'
  );
  
  // Replace card bases
  content = content.replace(
    /className="(?:[^"]*)bg-card border border-border shadow-float hover:shadow-float-lg hover:border-accent\/30 transition-all duration-500(?:[^"]*)"/g,
    'className="card-base group/bento ${onClick ? \'cursor-pointer\' : \'\'} ${className}"'
  );

  // Check if modified
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
  }
}
