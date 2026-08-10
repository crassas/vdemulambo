# Véus de Mulambo — Design System (referência obrigatória)

> Instrução para o modelo: usa **exatamente** estes valores — cores, fontes, tamanhos, raios,
> sombras e animações. Não aproximes, não "interpretes livremente", não troques por equivalentes
> do Material Design ou de outra biblioteca. Se um componente novo for necessário, deriva-o destes
> tokens em vez de inventar uma paleta nova. Esta app é mobile-first (ecrã de telemóvel).
>
> Se já existir trabalho feito nesta app dentro deste projeto (ecrãs, funções, integrações),
> **não apagues nem reescrevas o que já funciona** — adapta e alinha esse trabalho a este design
> system, em vez de recomeçar do zero.

## 1. Identidade

- Nome: **Véus de Mulambo**
- Natureza: espaço privado de atendimento espiritual/cartomancia (Kris Ty Oya), com Área do
  Consulente e Área da Mentora, ligadas pelo mesmo estado (o que a mentora publica, o cliente vê).
- Tom visual: sóbrio, quente, "confessionário elegante" — nunca corporativo, nunca clínico.
- **Nunca mostrar preços, valores monetários ou estados de pagamento em lado nenhum da app.**
  Se necessário, usar a frase: *"Os valores são combinados diretamente com a Kris, fora da app."*

## 2. Cor — tema escuro (default)

```css
--bg: #0F0A14;
--bg-gradient: radial-gradient(ellipse 80% 50% at 50% 0%, #2E1638 0%, #0F0A14 65%);
--panel: #17111D;               /* sidebar, modais, cartão de login */
--panel-border: rgba(212,169,78,0.16);
--card: #1B1420;                /* cartões de conteúdo */
--card-border: rgba(212,169,78,0.14);
--gold: #D4A94E;                /* accent principal — texto de destaque, ícones ativos */
--gold-light: #E8C36B;          /* topo dos gradientes de botão */
--gold-dim: rgba(212,169,78,0.55); /* bordas suaves, glows */
--cream: #F3E9D8;                /* texto principal — nunca branco puro */
--text-muted: #9C8FA0;           /* texto secundário, roxo-acinzentado */
--overlay: rgba(6,4,9,0.72);     /* fundo do backdrop da sidebar/modais */
```

## 3. Cor — tema claro (alternativa, mesmo espírito)

```css
--bg: #F6F0E4;
--bg-gradient: radial-gradient(ellipse 80% 50% at 50% 0%, #EFE1C8 0%, #F6F0E4 65%);
--panel: #FBF6EC;
--panel-border: rgba(122,84,20,0.18);
--card: #FFFDF7;
--card-border: rgba(122,84,20,0.16);
--gold: #A3781F;
--gold-light: #8C6415;
--gold-dim: rgba(163,120,31,0.6);
--cream: #241A2C;                /* aqui "cream" passa a ser o texto escuro principal */
--text-muted: #6E6072;
--overlay: rgba(40,30,20,0.4);
```

Regra: nunca misturar tokens dos dois temas. O botão dourado sólido usa sempre o mesmo gradiente
(`linear-gradient(180deg,#E8C36B,#D4A94E)`) com texto `#1B1305`, em ambos os temas.

## 4. Tipografia

- **Títulos** (nomes de ecrã, saudações, nome da app): `'Playfair Display', serif`, peso 600–800.
  Tamanhos típicos: 46px (splash), 34px (login), 28–30px (título de secção), 17–22px (subtítulos
  de cartão).
- **Corpo, labels, botões, navegação**: `'Inter', sans-serif`, pesos 400–700.
- **Eyebrow** (rótulo pequeno acima de um título): Inter, 11px, peso 700, \`letter-spacing: 2.2px\`,
  maiúsculas, cor \`--gold\`.
- Import: \`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');\`

## 5. Forma, espaço, sombra

- Raio de cartões/painéis: **18px** (cartões normais), **26–28px** (painéis de login/splash),
  **999px** (botões, pills, badges).
- Borda de cartão: 1px sólida em \`--card-border\` (nunca sombra pesada substituindo a borda).
- Glow de destaque (ex.: círculo do logótipo, carta do dia): \`box-shadow: 0 0 40–60px var(--gold-dim)\`.
- Botão primário (GoldButton): gradiente dourado, texto \`#1B1305\`, \`border-radius: 999px\`,
  padding \`13px 22px\`, peso 700.
- Botão secundário (OutlineButton): fundo transparente, borda 1px \`--gold-dim\`, texto \`--gold\`.
- Ícones em SVG inline (stroke, sem libs externas), \`stroke-width: 1.6\`, \`stroke-linecap: round\`.

## 6. Estrutura de navegação

- **Header** fixo no topo: botão de menu (hambúrguer) à esquerda, nome da app ao centro
  (Playfair Display 17px), ações à direita (tema, notificações).
- **Sidebar**: painel lateral esquerdo deslizante (overlay + backdrop), dividido em secções com
  título pequeno em maiúsculas (\`--text-muted\`, 10.5px, letter-spacing 1.6). Item ativo tem
  fundo \`rgba(212,169,78,0.12)\` + borda esquerda 2px dourada.
- **Bottom nav** (só no lado do Consulente e no lado da Mentora, nunca durante uma chamada):
  5 itens máx., ícone dentro de um "chip" com relevo quando ativo:
  \`\`\`css
  /* chip ativo */
  border-radius: 14px;
  background: linear-gradient(160deg,#2E1638,#1B1420);
  box-shadow: 0 3px 10px rgba(0,0,0,0.45), 0 0 0 1px var(--gold-dim), inset 0 1px 0 rgba(255,255,255,0.06);
  transform: translateY(-2px);
  \`\`\`
- Toque em qualquer botão/cartão dá feedback tátil: \`transform: scale(0.96)\` no \`:active\`.

## 7. Movimento (usar com moderação — nunca "IA a mais")

- Transição ao mudar de vista: fade + subida de 6px, 0.32s ease.
- Sidebar a abrir: slide-in de 16px + fade, 0.25s ease.
- Elemento em destaque à espera de interação (ex.: carta por tirar): flutuação suave vertical,
  amplitude 8px, 3.2s ease-in-out infinite.
- Pedido em tempo real / pulsar de atenção: anel de pulso dourado, 1.8s ease-in-out infinite.
- Sempre respeitar \`prefers-reduced-motion: reduce\` (desligar tudo).

## 8. Componentes-chave a replicar tal e qual

- **Splash**: círculo com "V" dourado, glow, eyebrow, título Playfair grande a duas linhas,
  subtítulo em maiúsculas espaçadas, botão dourado pill com seta.
- **Login/Idade/Escolha de perfil**: painel \`--panel\` com \`border-radius\` grande, mesmo padrão
  de eyebrow + título + descrição + inputs/checkboxes + botão.
- **Cartão genérico**: \`--card\` + borda 1px + \`border-radius:18px\` + \`padding:20px\`.
- **Perfil da mentora (lado do consulente)**: estilo "perfil social" — avatar grande com anel
  dourado, 3 estatísticas em coluna ao lado do avatar, nome + cargo, bio, tags de especialidade
  em pills, botões "Mensagem" / "Instagram", contactos com ícone, grelha 3 colunas de publicações
  recentes (sem legendas de preço, nunca).
- **Chamada de vídeo**: ecrã cheio quase preto, avatar remoto centrado com glow, janela local
  (PiP) arrastável, espelhada, canto arredondado 14px, controlos (mic/vídeo/desligar) em botões
  circulares 54px com borda \`--gold-dim\`.

## 9. Carta do Dia — regra obrigatória (não é conteúdo simulado)

A Carta do Dia **não é** escolhida de uma lista pré-definida de nomes/textos genéricos. É sempre
uma publicação real feita pela mentora:

1. No painel dela (Conteúdo → Carta do Dia), ela **tira uma foto real** (input de ficheiro com
   \`capture="environment"\`, ou carrega da galeria) da carta física que saiu naquele dia.
2. Escreve a explicação/legenda dessa carta em texto livre.
3. Publica — isto grava \`{ imageDataUrl, caption, publishedAt }\` em estado partilhado e dispara
   uma notificação real para os consulentes ("A Kris publicou uma nova Carta do Dia").
4. Do lado do consulente, a vista "Carta do Dia" mostra um estado vazio e honesto
   ("A Kris ainda não publicou a carta de hoje") até haver publicação. Depois de publicada, o
   consulente toca para revelar a **foto real** + legenda — nunca um nome de carta genérico
   nem texto gerado sem a foto correspondente.

**Nunca** reintroduzir uma lista estática de cartas (tipo "A Estrela", "O Sol"...) como
alternativa — isso é exatamente o que este fluxo substitui.

## 10. O que nunca fazer

- Não usar branco puro (\`#fff\`) em texto de corpo — usar sempre \`--cream\`.
- Não usar sombras genéricas tipo Bootstrap/Material (\`box-shadow: 0 2px 4px rgba(0,0,0,.2)\`).
- Não introduzir uma segunda família tipográfica além de Playfair Display + Inter.
- Não mostrar preços, valores, ou estados "pago/pendente" — usar linguagem neutra
  ("confirmado", "a confirmar", "concluído").
- Não substituir os ícones SVG inline por uma biblioteca de ícones externa com outro traço.
- Não substituir a Carta do Dia (foto real) por texto/ícone genérico — ver secção 9.
