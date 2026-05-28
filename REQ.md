To do List
Este projeto é um aplicativo de lista de tarefas desenvolvido em NextJS, estruturado com as práticas que utilizamos em outros projetos na Cervantes.

💿 Instalação
1. Instalando o projeto:
git clone https://github.com/dev-cervantes/todo_list_web.git todo_list_web
2. Instalando as dependências:
npm install
3. Configure o arquivo .env
3.1. Copie o arquivo .env.example e renomeie para .env
3.2. Configure as variáveis de ambiente conforme necessário
4. Iniciando o projeto:
npm run dev
📝 Nomenclatura de arquivos/pastas
Componentes	Padrão de nomenclatura	Exemplos
Arquivos e pastas	kebab-case	nome-do-arquivo.tsx
Hooks	iniciam com use	useCreateTarefa
Variáveis, métodos e funções	camelCase	authorizationToken
Constantes	UPPER_SNAKE_CASE	API_BASE_URL
📂 Estruturação do projeto
Aqui está a descrição de algumas pastas do projeto e suas funcionalidades:

todo_list_web/
├── actions/                # Server Actions (funções assíncronas chamadas do cliente)
├── api/                    # Comunicação com APIs externas
├── app/                    # Rotas do projeto (cada pasta/arquivo = uma rota)
│   └── HomePage.tsx        # Exemplo de página (deve chamar apenas componentes)
├── features/               # Lógica de negócio organizada por módulos
│   ├── tarefa/             # Exemplo de módulo (tarefa)
│   │   ├── components/     # Componentes específicos
│   │   ├── enums/          # Enumeradores
│   │   ├── form-schemas/   # Schemas de validação (Zod)
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── providers/      # Providers de contexto
│   │   ├── services/       # Serviços (ex.: chamadas de API)
│   │   └── types/          # Tipos TypeScript
├── lib/                    # Recursos compartilhados no projeto
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Hooks reutilizáveis
│   ├── providers/          # Providers globais
│   ├── types/              # Tipos globais
│   └── utils/              # Funções utilitárias
└── public/                 # Arquivos estáticos (imagens, ícones, etc.)
💻 Tecnologias
React: Biblioteca JavaScript para construir interfaces de usuário.
Next.js: Framework React para aplicações web.
Tailwind: Framework CSS utilitário para estilização rápida.
TanStack: Biblioteca para gerenciamento de estado e dados.
Shadcn: Biblioteca de componentes UI.
Zod: Biblioteca para validação de formulários.
Tabler Icons: Biblioteca de ícones.
Axios: Biblioteca para fazer requisições HTTP.
ESLint: Ferramenta para análise estática de código.