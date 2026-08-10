const fs = require('fs');
let code = fs.readFileSync('src/components/CallInterface.tsx', 'utf8');

// The background should be almost black (e.g. background/95)
// and buttons should have the --gold-dim border, which is `border-gold-dim`
// Local PiP rounded-14px.

code = code.replace(/bg-background\/95 backdrop-blur-3xl/g, 'bg-[#0d071c] backdrop-blur-3xl');
code = code.replace(/rounded-2xl border border-white\/10 shadow-2xl/g, 'rounded-[14px] border border-gold-dim shadow-2xl shadow-black/50');
code = code.replace(/shadow-\[0_0_50px_rgba\(212,169,78,0\.2\)\]/g, 'glow-gold-lg');
code = code.replace(/w-14 h-14/g, 'w-[54px] h-[54px]');
code = code.replace(/w-16 h-16/g, 'w-[54px] h-[54px]'); // if any
code = code.replace(/border-white\/10 bg-white\/5 hover:bg-white\/10/g, 'border-gold-dim bg-white/5 hover:bg-white/10');
code = code.replace(/bg-red-500\/20 text-red-500 border-red-500\/30 hover:bg-red-500\/30/g, 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30');

fs.writeFileSync('src/components/CallInterface.tsx', code);
