const fs = require('fs');
let code = fs.readFileSync('src/views/ClientView.tsx', 'utf8');

// Replace ConsultationOption
code = code.replace(/function ConsultationOption\(\{ title, price, desc, icon, className = '', onClick \}: \{ title: string, price: string, desc: string, icon: React\.ReactNode, className\?: string, onClick\?: \(\) => void \}\) \{[\s\S]*?<\/BentoBox>\n\}/, `function ConsultationOption({ title, desc, icon, className = '', onClick }: { title: string, desc: string, icon: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <BentoBox onClick={onClick} className={\`p-6 flex items-center gap-6 cursor-pointer transition-colors group border-accent/20 hover:border-accent/40 \${className}\`}>
      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-serif text-lg text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </BentoBox>
  );
}`);

// Remove price="15€" where it's called
code = code.replace(/price="15€"\s*/g, '');
code = code.replace(/price="[^"]*"\s*/g, ''); // just in case

// Fix other places in ClientView that use €
code = code.replace(/<p className="text-accent text-xl font-bold">\{price\.toFixed\(2\)\} €<\/p>/g, '<p className="text-accent text-sm font-bold uppercase tracking-wider">A combinar</p>');
code = code.replace(/CTT \(\+4\.50€\)/g, 'CTT');
code = code.replace(/Comprar • \{finalPrice\.toFixed\(2\)\} €/g, 'Pedir informações');

// Also remove setSessionStatus('payment_pending') since we shouldn't show payment status
code = code.replace(/onClick=\{\(\) => setSessionStatus\('payment_pending'\)\}/g, 'onClick={() => setActiveTab("mensagens")}');

fs.writeFileSync('src/views/ClientView.tsx', code);
