# App Architecture - Véus de Mulambo

> **Arquitetura Técnica, Fluxos de Dados e Estrutura de Diretórios**

## 🏗️ Visão Geral da Arquitetura
A aplicação adota uma arquitetura client-side SPA modular (Single Page Application) construída em **React 18** com **TypeScript**, empacotada através do **Vite**, com persistência em tempo real e autenticação geridas pelo **Firebase (Firestore & Auth)**.

---

## 📂 Estrutura de Diretórios (`src/`)

```text
src/
├── components/          # Componentes reutilizáveis e UI específica
│   ├── admin/           # Painel de controlo da mentora (Métricas, Agenda, Perfil, etc.)
│   ├── BentoBox.tsx     # Contentor base com glassmorphism e animações
│   ├── BottomNav.tsx    # Navegação inferior flutuante para clientes
│   ├── CallInterface.tsx# Ecrã de videochamada imersiva
│   ├── DisclaimerModal.tsx # Aviso legal sobre pagamentos
│   └── Sidebar.tsx      # Menu lateral de navegação
├── hooks/
│   └── useAuth.ts       # Hook de autenticação com Firebase e fallback para iOS
├── lib/
│   ├── firebase.ts      # Inicialização do Firebase e persistência segura
│   └── sounds.ts        # Sintetizador de efeitos sonoros para sessões
├── views/
│   ├── ClientView.tsx   # Gestão de abas da área do cliente
│   ├── AdminView.tsx    # Gestão de abas da área da mentora
│   └── ...              # Vistas específicas (Carta do Dia, Serviços, Trabalhos)
├── App.tsx              # Componente raiz com gestão de rotas e perfis
├── main.tsx             # Ponto de entrada React
└── index.css            # Estilos globais e Tailwind CSS
```

---

## 🔐 Camada de Dados & Autenticação
- **Firebase Auth:** Gere o início de sessão via Google (Popup/Redirect) e E-mail/Password.
- **iOS Safety Persistence:** Utiliza `browserLocalPersistence` com fallback automático para `inMemoryPersistence` e suporte a botões de acesso rápido em caso de restrições de popups em iPhones.
- **Cloud Firestore:** Armazena dados de perfis de utilizadores, estado de consultas e publicações em tempo real com regras de segurança robustas.
