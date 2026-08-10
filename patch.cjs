const fs = require('fs');
let content = fs.readFileSync('src/views/AdminView.tsx', 'utf8');

const target = `      {/* Header Info */}
      <div className="sticky top-0 md:top-4 z-40 mb-8 flex items-center justify-between px-4 sm:px-6 py-4 glass-strong rounded-[2rem] shadow-float-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors shrink-0 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 border border-accent/20 items-center justify-center text-accent shrink-0 hidden md:flex">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-foreground tracking-tight">{getTitle()}</h2>
            <p className="text-[9px] text-accent/50 uppercase tracking-[0.2em] font-bold">Acesso de Cartomante</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-popover transition-colors shrink-0 hidden md:flex"
          title="Menu"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>`;

const replacement = `      {/* Header Info */}
      <header className="sticky top-0 md:top-4 z-40 mb-10 flex flex-row items-center justify-between gap-4 glass-strong p-3 sm:p-4 rounded-[2rem] shadow-float-lg border-amber-500/30">
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center hover:bg-amber-400/25 transition-all group shrink-0 cursor-pointer shadow-sm md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 group-hover:scale-110 transition-transform" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 text-amber-300">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center hidden md:flex">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-amber-100">{getTitle()}</h2>
              <p className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">Acesso de Cartomante</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-right hidden xs:block">
             <p className="text-xs sm:text-sm font-semibold text-amber-100">{profile?.nome}</p>
             <p className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">{profile?.role}</p>
           </div>
           {profile?.fotoPerfil ? (
             <img src={profile.fotoPerfil} alt={profile.nome || ''} className="w-10 h-10 rounded-xl border border-amber-400/40 object-cover shadow-sm" />
           ) : (
             <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shadow-sm">
               <User className="w-5 h-5 text-amber-300" />
             </div>
           )}
        </div>
      </header>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/views/AdminView.tsx', content);
