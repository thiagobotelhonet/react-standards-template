# Instruções do projeto

Template de aplicação interna: SPA em React com Vite, TanStack Router, Query,
Table e Form, shadcn/ui sobre Base UI, Tailwind v4, Zod, MSW e Playwright.
A API é separada e não faz parte deste repositório.

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | servidor na porta 3000, contra a API de `.env` |
| `pnpm dev:mock` | o mesmo, com API simulada (`src/mocks/`) |
| `pnpm build` | gera `dist/` e confere que a simulação ficou de fora |
| `pnpm preview` | serve o build na porta 4173 |
| `pnpm test` | testes de unidade, componente e contrato |
| `pnpm test:e2e` | jornadas no navegador; exige a porta 4300 livre |
| `pnpm typecheck` | tipos |
| `pnpm check` | Biome; `pnpm format` corrige o que der |
| `pnpm verify` | `check`, `typecheck`, `test`, gerador e `build` |
| `criar-app <destino>` | cria uma cópia independente, de qualquer pasta (registrado com `pnpm link --global`) |

- Rode `pnpm verify` antes de dar um trabalho por concluído. Mexeu em sessão,
  navegação ou gravação? Rode também `pnpm test:e2e`.
- Só pnpm, nunca npm ou yarn. Node 24.15 ou mais novo da linha 24.

## Leia antes de agir

| Antes de… | Leia |
|---|---|
| criar, mover ou apagar arquivo; começar módulo | `docs/architecture.md` |
| escrever componente, estilo, rota, chamada à API, estado, formulário ou teste | `docs/standards.md`, seção do assunto |
| mexer em sessão, login, permissão ou endpoint | `docs/api-contract.md` |
| criar ou remover uma funcionalidade | `docs/development.md` |
| mudar uma regra ou decisão | `docs/decisions/` |
| mexer num módulo | `README.md` do módulo |

- Cite regra com código e título: "API-02 — Toda resposta da API é conferida
  pelo Zod".
- Mudou algo que a documentação descreve? Atualize no mesmo trabalho
  (`docs/README.md`, "Como manter").

## Regras que quebram em silêncio

Não dão erro quando descumpridas. Quebrar qualquer uma bloqueia a revisão.

- **CMP-01** — `src/shared/components/ui/` não se edita à mão; use
  `pnpm exec shadcn add <componente>`.
- **COR-02** — Token de cor novo vai em `:root`, `.dark` e `@theme inline`.
- **ROT-01** — `__root.tsx` não busca dado de usuário; a guarda de sessão mora
  em `_app.tsx`.
- **ROT-02** — Arquivo de rota não tem regra de negócio.
- **ROT-04** — Filtro, página, ordenação e busca vão na URL.
- **ROT-05** — Todo parâmetro da URL tem `default` e `catch`.
- **API-02** — Toda resposta passa por `requestJson(schema, url)`.
- **API-03** — O serviço recebe e repassa o `AbortSignal` da consulta.
- **API-04** — Chave do cache só nasce em `*.queries.ts`.
- **API-05** — Gravação nunca é repetida automaticamente.
- **EST-01** — Dado vindo da API não é copiado para `useState` nem contexto.
- **SEG-01** — A sessão é do backend: cookie e CSRF em memória. Nunca um
  booleano ou token de sessão no `localStorage`.
- **SEG-02** — Guarda de rota é conveniência; quem autoriza é a API.
- **AMB-01** — Nada de segredo em variável de ambiente; `VITE_*` é público.
- **AMB-03** — MSW só no modo `mock` em desenvolvimento; o worker nunca vai
  para `public/` nem para o build.
- **FER-03** — `src/routeTree.gen.ts` é gerado; não se edita à mão.

Estas o `pnpm check` já barra, pelos plugins em `biome-plugins/` e por regras
do Biome: NOM-02, NOM-03, COD-05, CMP-02, CMP-03, CMP-04 (`src/shared` sem
`src/features`), CMP-09, COR-01, COR-03, API-01 e ROT-08.
Regra que dá para detectar sem ambiguidade vira plugin, não item desta lista.

## Antes de afirmar que algo está certo

- Varra o projeto inteiro antes de dizer "nada usa isto".
- Confira o resultado de cada comando na hora.
- Nunca responda prompt interativo no automático.

## TanStack, shadcn, ky e Zod mudam rápido

- Consulte a documentação antes de escrever o código, na versão instalada
  (`node_modules/<pacote>/package.json` diz qual é).
- **Antes de escrever qualquer interface, consulte o MCP do shadcn** — ele
  está em `.mcp.json` e roda a versão do lockfile. Veja o que já existe e o que
  dá para instalar antes de compor peça nova (CMP-02).
- Fora disso: Context7 ou documentação oficial da versão certa.
