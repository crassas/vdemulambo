const fs = require('fs');
let code = fs.readFileSync('src/components/LoginPage.tsx', 'utf8');

const target = `<div className="relative my-8">`;

const replacement = `
          {/* TEST ACCOUNTS INFO */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-2">
             <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 border-b border-white/5 pb-2">Contas de Teste</p>
             <div className="flex justify-between items-center text-xs">
                <span className="text-pink-400">Mentora:</span>
                <span className="text-slate-300 font-mono">mentora@altar.com / mentora123</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400">Cliente:</span>
                <span className="text-slate-300 font-mono">cliente@altar.com / cliente123</span>
             </div>
          </div>

          <div className="relative my-8">`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/LoginPage.tsx', code);
console.log('Login hint patched');
