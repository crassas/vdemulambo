const fs = require('fs');
let code = fs.readFileSync('src/views/TrabalhosView.tsx', 'utf8');

code = code.replace(/className=\{`w-full py-3\.5 rounded-2xl flex items-center justify-center gap-2 transition-all shrink-0 font-bold \$\{\n\s+trabalho\.available\n\s+\? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-\[0_0_20px_rgba\(245,158,11,0\.25\)\]'\n\s+: 'bg-stone-900 text-stone-500 border border-stone-800 cursor-not-allowed'\n\s+\}`\}/, 'className={`w-full flex items-center justify-center gap-2 shrink-0 ${trabalho.available ? "btn-gold" : "btn-outline opacity-50 cursor-not-allowed"}`}');

fs.writeFileSync('src/views/TrabalhosView.tsx', code);
