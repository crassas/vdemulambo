const fs = require('fs');
let code = fs.readFileSync('src/components/CallInterface.tsx', 'utf8');

// PiP
code = code.replace(/className={\`absolute top-24 right-6 w-32 h-44 rounded-2xl overflow-hidden border-2 border-accent\/40 shadow-2xl cursor-grab active:cursor-grabbing z-20 bg-zinc-900 transition-opacity duration-500/g, 'className={`absolute top-24 right-6 w-32 h-44 rounded-[14px] overflow-hidden border border-gold-dim shadow-2xl cursor-grab active:cursor-grabbing z-20 bg-[#0d071c] transition-opacity duration-500 glow-gold-lg');

// Controls Panel
code = code.replace(/bg-black\/70 backdrop-blur-xl px-6 py-4 rounded-\[2rem\] border border-white\/15 flex items-center gap-6 shadow-2xl/g, 'bg-panel backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-gold-dim flex items-center gap-6 shadow-2xl shadow-black/50');

// Toggle Video
code = code.replace(/w-14 h-14 rounded-full flex items-center justify-center transition-all \${[\s\S]*?isVideoOff \? 'bg-white text-black' : 'bg-white\/15 text-white hover:bg-white\/25 border border-white\/20'[\s\S]*?}/, `w-[54px] h-[54px] rounded-full flex items-center justify-center transition-all border \${
              isVideoOff ? 'bg-cream text-black border-cream' : 'bg-transparent text-cream border-gold-dim hover:bg-white/10'
            }`);

// Toggle Mic
code = code.replace(/w-14 h-14 rounded-full flex items-center justify-center transition-all \${[\s\S]*?isMuted \? 'bg-white text-black' : 'bg-white\/15 text-white hover:bg-white\/25 border border-white\/20'[\s\S]*?}/, `w-[54px] h-[54px] rounded-full flex items-center justify-center transition-all border \${
              isMuted ? 'bg-cream text-black border-cream' : 'bg-transparent text-cream border-gold-dim hover:bg-white/10'
            }`);

// End Call
code = code.replace(/w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 hover:scale-105 transition-all shadow-\[0_0_20px_rgba\(239,68,68,0\.5\)\] cursor-pointer/g, 'w-[54px] h-[54px] rounded-full bg-red-600 border border-red-500/30 flex items-center justify-center text-white hover:bg-red-700 hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer');

fs.writeFileSync('src/components/CallInterface.tsx', code);
