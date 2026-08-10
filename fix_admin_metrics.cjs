const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminMetrics.tsx', 'utf8');

code = code.replace(/<BentoBox className="p-8 relative overflow-hidden">[\s\S]*?<\/BentoBox>/, `<BentoBox className="p-8 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 blur-2xl rounded-full translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <h3 className="font-serif text-2xl text-foreground mb-6 flex items-center gap-3 relative z-10">
            <Flame className="w-5 h-5 text-accent" /> Troca Energética
          </h3>
          <div className="p-6 rounded-3xl bg-background border border-accent/30 mb-6 relative z-10">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Avisos</p>
            <p className="text-xl font-serif text-foreground">Os valores são combinados diretamente com a Kris, fora da app.</p>
          </div>
          <p className="text-xs text-muted-foreground italic relative z-10">
            Este é um espaço de acompanhamento privado.
          </p>
        </BentoBox>`);

fs.writeFileSync('src/components/admin/AdminMetrics.tsx', code);
