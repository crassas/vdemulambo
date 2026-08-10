const fs = require('fs');
let code = fs.readFileSync('src/components/BottomNav.tsx', 'utf8');

code = code.replace(/<button\n\s+key=\{item\.id\}\n\s+onClick=\{\(\) => onTabChange\(item\.id\)\}\n\s+className="col-span-1 relative flex flex-col items-center justify-center py-1\.5 px-0\.5 group transition-all cursor-pointer select-none w-full min-w-0"/, '<button\n              key={item.id}\n              onClick={() => onTabChange(item.id)}\n              className={`col-span-1 relative flex flex-col items-center justify-center py-2 px-1 group transition-all cursor-pointer select-none w-full min-w-0 ${isActive ? "bottom-nav-active" : ""}`}');

// Remove AnimatePresence and the motion divs inside it since we are using CSS for the active state
let startIdx = code.indexOf('<AnimatePresence>');
let endIdx = code.indexOf('</AnimatePresence>') + '</AnimatePresence>'.length;
code = code.substring(0, startIdx) + code.substring(endIdx);

fs.writeFileSync('src/components/BottomNav.tsx', code);
