const fs = require('fs');

// Fix Header in App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /<header className="sticky top-0[\s\S]*?<\/header>/,
  `<header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16 bg-card/90 backdrop-blur-md border-b border-border">
          {/* Left: Hamburger */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:text-gold transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Center: App Name */}
          <h1 className="font-serif text-[17px] font-semibold text-cream absolute left-1/2 -translate-x-1/2">
            Véus de Mulambo
          </h1>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
             <ThemeSwitcher />
             {profile?.fotoPerfil ? (
               <img src={profile.fotoPerfil} alt={profile.nome || ''} className="w-8 h-8 rounded-full border border-gold-dim object-cover shadow-sm" />
             ) : (
               <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold-dim flex items-center justify-center">
                 <User className="w-4 h-4 text-gold" />
               </div>
             )}
          </div>
        </header>`
);
fs.writeFileSync('src/App.tsx', appContent);

// Fix Sidebar.tsx
let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebarContent = sidebarContent.replace(
  /className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3"/g,
  'className="text-[10.5px] uppercase tracking-[1.6px] text-muted mb-3 font-semibold"'
);
sidebarContent = sidebarContent.replace(
  /className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all cursor-pointer \${[\s\S]*?isActive\s*\?\s*'bg-accent\/10 text-accent font-bold'[\s\S]*?:\s*'text-foreground hover:bg-white\/5 hover:text-accent'[\s\S]*?}`}/g,
  'className={`flex items-center gap-3 w-full p-3 transition-all cursor-pointer ${isActive ? "bg-[rgba(212,169,78,0.12)] text-gold border-l-2 border-gold font-bold" : "text-cream hover:bg-white/5 border-l-2 border-transparent"}`}'
);
fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);

