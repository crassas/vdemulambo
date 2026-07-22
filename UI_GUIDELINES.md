# UI Guidelines - Véus de Mulambo

> **Regras de Design, Cores, Tipografia e Padrões Visuais**

## 🎨 Paleta de Cores e Atmosfera
O design system do **Véus de Mulambo** inspira-se no misticismo elegante, priorizando tons escuros profundos e contrastes calorosos que transmitem serenidade, respeito e exclusividade.

- **Fundo Principal (`bg-mystic-bg`):** `#0a0812` (Noite mística profunda / Roxo escuro texturizado).
- **Cartões e Contentores (Bento Grid):** Superfícies translúcidas em vidro fosco (`bg-white/5` com bordas subtis `border-white/10`).
- **Accent Primário (Rosa Místico / Rubi):** Gradientes de `from-pink-500 to-rose-600` para botões de destaque, CTAs e distintivos.
- **Accent Secundário (Dourado Místico):** Tonalidades `#f59e0b` para elementos espirituais, cartas e ícones de destaque.
- **Texto Principal:** `#f8fafc` (Slate 50) para máxima legibilidade.
- **Texto Secundário:** `#94a3b8` (Slate 400).

---

## ✒️ Tipografia
- **Títulos e Cabeçalhos:** Fontes com serifas elegantes (ex: *Playfair Display* / *Lora*), transmitindo autoridade, tradição e sofisticação espiritual.
- **Corpo de Texto e Menus:** Sans-serif limpa e altamente legível (*Plus Jakarta Sans* / *Inter*).
- **Hierarquia:** Escala matemática rigorosa (H1 para títulos principais, H2 para secções, rótulos em uppercase com letter-spacing amplo para metadados).

---

## 📐 Padrões de Layout e Componentes
1. **Bento Grid:** Organização modular em grelha assimétrica com cantos arredondados (`rounded-3xl`), proporcionando uma experiência visual moderna e organizada.
2. **Glassmorphism:** Efeito de desfoque de fundo (`backdrop-blur-md`) combinado com bordas translúcidas finas para profundidade sem poluição visual.
3. **Touch Targets em Mobile:** Elementos interativos com altura e largura mínimas de 44px, assegurando precisão em ecrãs táteis (especialmente iOS / iPhones).
4. **Animações Fluidas:** Transições suaves com `motion/react` (AnimatePresence) para abertura de menus, troca de separadores e modais de aviso.
