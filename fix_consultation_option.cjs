const fs = require('fs');
let code = fs.readFileSync('src/views/ClientView.tsx', 'utf8');

// Replace ConsultationOption
let startIdx = code.indexOf('function ConsultationOption({');
let endIdx = code.indexOf('}', code.indexOf('</BentoBox>', startIdx)) + 1;

let newFunc = `function ConsultationOption({ title, desc, icon, className = '', onClick }: { title: string, desc: string, icon: React.ReactNode, className?: string, onClick?: () => void }) {
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
}`;

if (startIdx !== -1) {
  code = code.substring(0, startIdx) + newFunc + code.substring(endIdx);
}

// Same for ProductCard and SimpleProductCard
code = code.replace(/function ProductCard[\s\S]*?<\/BentoBox>\n\}/, `function ProductCard({ title, shippingMethod, setShippingMethod }: { title: string, shippingMethod: string, setShippingMethod: (method: 'mao' | 'ctt') => void }) {
  return (
    <BentoBox className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-serif text-lg text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Banhos e rituais preparados
          </p>
        </div>
        <p className="text-accent text-sm font-bold uppercase tracking-wider">A combinar</p>
      </div>
      
      <div className="space-y-3 mb-6">
        <label className="flex items-center justify-between p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className={\`w-4 h-4 rounded-full border flex items-center justify-center \${shippingMethod === 'mao' ? 'border-accent bg-accent' : 'border-muted-foreground'}\`}>
              {shippingMethod === 'mao' && <div className="w-2 h-2 rounded-full bg-background" />}
            </div>
            <span className="text-sm text-foreground">Entrega em mãos</span>
          </div>
        </label>
        
        <label className="flex items-center justify-between p-3 rounded-xl border border-border bg-background cursor-pointer hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className={\`w-4 h-4 rounded-full border flex items-center justify-center \${shippingMethod === 'ctt' ? 'border-accent bg-accent' : 'border-muted-foreground'}\`}>
              {shippingMethod === 'ctt' && <div className="w-2 h-2 rounded-full bg-background" />}
            </div>
            <span className="text-sm text-foreground">Envio</span>
          </div>
          <span className="text-sm text-muted-foreground">CTT</span>
        </label>
      </div>

      <button className="w-full py-3 rounded-xl bg-accent/10 text-accent font-bold text-sm hover:bg-accent hover:text-background transition-colors uppercase tracking-wider">
        Pedir informações
      </button>
    </BentoBox>
  );
}`);

code = code.replace(/function SimpleProductCard[\s\S]*?<\/BentoBox>\n\}/, `function SimpleProductCard({ title, onClick }: { title: string, onClick?: () => void }) {
  return (
    <BentoBox onClick={onClick} className="p-5 flex items-center justify-between cursor-pointer hover:border-accent/40 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="font-medium text-foreground">{title}</h4>
      </div>
    </BentoBox>
  );
}`);

// Remove price="15€" where it's called
code = code.replace(/price="[^"]*"\s*/g, ''); 
code = code.replace(/price=\{[^\}]*\}\s*/g, '');
code = code.replace(/finalPrice=\{[^\}]*\}\s*/g, '');

fs.writeFileSync('src/views/ClientView.tsx', code);
