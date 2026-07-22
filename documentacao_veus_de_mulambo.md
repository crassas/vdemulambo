# Documentação Oficial do Produto - Véus de Mulambo

> **Plataforma Digital de Acompanhamento Espiritual, Orientação e Comunicação**  
> *Versão do Documento:* 1.0.0  
> *Data:* Julho de 2026  
> *Formato:* Markdown (.md)

---

## 1. Visão Geral da Arquitetura

O **Véus de Mulambo** é uma aplicação web progressiva (PWA) de arquitetura moderna baseada em **React 18 + Vite + TypeScript + Tailwind CSS**, integrada com **Firebase (Auth & Firestore)**. Foi concebida com um design system místico, sofisticado e de altíssima performance, otimizado para dispositivos móveis (incluindo iOS Safari / iPhone) e desktop.

### 1.1 Stack Tecnológica
- **Frontend:** React 18, TypeScript, Tailwind CSS, Motion (AnimatePresence), Lucide React (Ícones), React Hot Toast.
- **Backend / Serviços:** Firebase Authentication (Google Auth + Email/Password + Fallback LocalPersistence para iOS), Cloud Firestore (Banco de dados em tempo real).
- **Build / Tooling:** Vite com otimização de pacotes e suporte a dispositivos móveis restritos.

---

## 2. Separação de Acessos: Área do Cliente vs. Área da Mentora

O sistema gere permissões baseadas no perfil do utilizador (`role: 'cliente' | 'admin'`), determinado automaticamente no primeiro login ou por correspondência de e-mail administrativo (`beentoowell@gmail.com` / `mentora@altar.com`).

```
                              [ Autenticação Firebase / Google ]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
             [ Perfil: 'admin' ]                             [ Perfil: 'cliente' ]
                      │                                               │
                      ▼                                               ▼
             [ Área da Mentora ]                             [ Área do Cliente ]
       • Métricas e Estatísticas                        • Início & Carta do Dia
       • Gestão de Atendimentos                         • Agendamento de Consultas
       • Publicações e Trabalhos                        • Publicações e Conteúdos
       • Galeria de Fotos                               • Perfil da Mentora
       • Agenda e Disponibilidade                       • Contactos Diretos
```

---

## 3. Fluxos de Navegação e Estrutura de Ecrãs

### 3.1 Área do Cliente (Navegação Inferior / BottomNav & Sidebar)
1. **Início (`inicio`)**: Ecrã principal com boas-vindas personalizadas, acesso rápido ao resumo diário e destaques.
2. **Carta do Dia (`carta_dia`)**: Retirada diária da carta de Tarot/Baralho Cigano com animações fluidas e reflexão personalizada.
3. **Serviços (`servicos`)**: Catálogo de consultas, orientações espirituais, limpezas energéticas e guias detalhados.
4. **Perfil da Mentora (`mentor_profile`)**: Biografia completa, especialidades, galeria de fotografias e canais de contacto diretos.
5. **Trabalhos (`trabalhos`)**: Publicações, artigos e atualizações espirituais partilhadas pela mentora.

### 3.2 Área da Mentora (AdminSidebar & Gestão Completa)
1. **Dashboard / Métricas (`metrics`)**: Estatísticas de acessos, consultas realizadas e atividade da comunidade.
2. **Atendimento (`attendance`)**: Gestão de pedidos de consulta em tempo real, estado de pagamentos MB Way (simulado/informativo) e abertura de sala de vídeo.
3. **Carta do Dia (`carta_dia`)**: Gestão e configuração das cartas diárias.
4. **Galeria (`galeria`)**: Gestão da galeria de imagens públicas.
5. **Publicações / Trabalhos (`trabalhos`)**: Criação e edição de publicações e artigos.
6. **Agenda (`agenda`)**: Controlo de horários e disponibilidade para marcações.
7. **Perfil (`profile`)**: Edição em tempo real da biografia, fotografia de perfil, contactos e especialidades.
8. **Definições (`settings`)**: Configurações da plataforma e **Download da Documentação Técnica (.md)**.

---

## 4. Componentes Reutilizáveis Principais

- `<BentoBox>`: Contentor com efeito glassmorphism, gradientes suaves e transições em mola (`motion`).
- `<BottomNav>`: Barra de navegação inferior flutuante para dispositivos móveis.
- `<Sidebar>`: Menu lateral deslizante para acesso rápido a todas as secções e perfil do utilizador.
- `<CallInterface>`: Interface imersiva de videochamada/áudio para consultas.
- `<DisclaimerModal>`: Aviso legal inicial esclarecendo que os pagamentos não ocorrem na plataforma.
- `<WelcomeTutorial>`: Guia interativo de boas-vindas para novos utilizadores.

---

## 5. Sistema de Autenticação e Suporte a iPhone (iOS)

Para garantir máxima fiabilidade em dispositivos iOS (iPhone / Safari) e modos de navegação privada onde cookies de terceiros ou storages restritos podem falhar:
1. **Autenticação Firebase:** Suporta Google Popup, Google Redirect e Email/Password.
2. **Persistência Robusta:** Configurado com `browserLocalPersistence` com fallback automático para `inMemoryPersistence`.
3. **Acesso Rápido / Mobile Fallback:** Inclui botões de login instantâneo ("Entrar Mentora" e "Entrar Cliente") no ecrã de autenticação para evitar bloqueios de popups em telemóveis.

---

## 6. Paleta de Cores e Guia de Design

- **Fundo Principal:** `#0a0812` (Noite mística profunda / Roxo escuro texturizado).
- **Superfícies (Bento Cards):** Glassmorphism escuro (`bg-white/5` com bordas subtis `border-white/10`).
- **Accent Primário:** Rosa místico e vermelho rubi (`from-pink-500 to-rose-600`).
- **Accent Secundário / Destaque:** Dourado/Amarelo místico (`#f59e0b`) para cartas e elementos espirituais.
- **Tipografia:** 
  - Títulos: Fontes com serifas elegantes (ex: *Playfair Display* / *Lora*).
  - Corpo: Sans-serif limpa e altamente legível (*Plus Jakarta Sans* / *Inter*).

---

## 7. Funcionalidades Já Implementadas

✅ Autenticação completa (Google + Email + Acesso Rápido para iOS).  
✅ Separação estrita entre Área do Cliente e Painel Administrativo da Mentora.  
✅ Sistema de Carta do Dia interativa com animações.  
✅ Gestão de perfil da mentora (biografia, especialidades, galeria de fotos e contactos editáveis).  
✅ Catálogo de serviços e sistema de pedidos de consulta com estados de pagamento MB Way.  
✅ Interface de videochamada integrada.  
✅ Suporte otimizado para dispositivos móveis (iPhone / Android) com tratamento de restrições de storage e popups.  
✅ Exportação da documentação técnica completa em formato Markdown (.md).  

---

## 8. Funcionalidades Futuras em Espera (Roadmap)

⏳ Integração com gateway de pagamentos real (opcional, mediante pedido).  
⏳ Notificações Push em tempo real para novas mensagens de atendimento.  
⏳ Histórico avançado de consultas com notas privadas da mentora por cliente.  
⏳ Suporte multilíngue (Espanhol e Inglês).  

---
*Documento gerado automaticamente para o projeto Véus de Mulambo.*
