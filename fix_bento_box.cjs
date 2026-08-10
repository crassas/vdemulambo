const fs = require('fs');
let code = fs.readFileSync('src/components/BentoBox.tsx', 'utf8');

code = code.replace(
  "export function BentoBox({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {",
  "export function BentoBox({ children, className, onClick, ...props }: { children: React.ReactNode; className?: string; onClick?: () => void } & React.HTMLAttributes<HTMLDivElement>) {"
);

code = code.replace(
  "      onClick={onClick}",
  "      onClick={onClick}\n      {...props}"
);

fs.writeFileSync('src/components/BentoBox.tsx', code);
