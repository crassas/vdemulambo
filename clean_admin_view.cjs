const fs = require('fs');

let content = fs.readFileSync('src/views/AdminView.tsx', 'utf8');

// Replace the hardcoded header back to a cleaner look
const badHeaderRegex = /<header className="sticky top-0 md:top-4 z-40 mb-10 flex flex-row items-center justify-between gap-4 glass-strong p-3 sm:p-4 rounded-\[2rem\] shadow-float-lg border-amber-[0-9]+\/[0-9]+">[\s\S]*?<\/header>/;

const goodHeader = `<header className="sticky top-0 md:top-4 z-40 mb-10 flex flex-row items-center justify-between gap-4 glass-strong p-3 sm:p-4 rounded-[2rem] shadow-float-lg border-accent/20">
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center hover:bg-accent/20 transition-all group shrink-0 cursor-pointer shadow-sm md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-accent group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 text-accent">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center hidden md:flex">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-foreground">{getTitle()}</h2>
              <p className="text-[10px] text-accent/80 uppercase tracking-wider font-bold">Acesso de Cartomante</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-right hidden xs:block">
             <p className="text-xs sm:text-sm font-semibold text-foreground">{profile?.nome}</p>
             <p className="text-[10px] text-accent/80 uppercase tracking-wider font-bold">{profile?.role}</p>
           </div>
           {profile?.fotoPerfil ? (
             <img src={profile.fotoPerfil} alt={profile.nome || ''} className="w-10 h-10 rounded-xl border border-accent/40 object-cover shadow-sm" />
           ) : (
             <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-sm">
               <User className="w-5 h-5 text-accent" />
             </div>
           )}
        </div>
      </header>`;

content = content.replace(badHeaderRegex, goodHeader);

fs.writeFileSync('src/views/AdminView.tsx', content);
