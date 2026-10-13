# Changelog

## Não lançado

- Dependências em dia, cada atualização testada no seu commit: versões menores
  e de correção de produção e desenvolvimento, TypeScript 7.0.2, Vitest 5.0.3,
  jsdom 30.1.2 e MSW 3.0.3. Ação do CodeQL na 4.38.2.
- Node mínimo sobe para 24.15 (`engines`), exigência do jsdom 30.
- MSW 3: `onUnhandledRequest` virou `onUnhandledFrame` em `src/main.tsx`,
  `src/mocks/browser.ts` e nos testes. Quem copiou o template e atualizar o
  MSW precisa da mesma troca.
- `pnpm-workspace.yaml` libera o MSW 3 para o `@vitest/mocker` 5.0.3, que só o
  declara como opcional; remover quando o Vitest chegar à 5.0.4.
- Dependabot ignora versão maior de `@types/node`, que acompanha o Node do
  projeto.
- README: como instalar o Chromium do Playwright em rede que inspeciona HTTPS.
- `criar-app` grava `.template-origin.json` com o commit do template de que a
  cópia nasceu (decisão 0010). `development.md`, "Evoluir o template", mostra
  como trazer as regras que mudaram desde então.
- `pnpm check` passa a barrar também NOM-03 (caminho relativo que sai do
  módulo), CMP-04 (`src/shared` importando `src/features`) e CMP-09
  (`<Toaster>` fora de `__root.tsx`). Arquivos de teste podem importar
  `@/mocks`; o teste de itens deixou os caminhos relativos que contornavam as
  regras, e `@/features/auth` passou a exportar `fetchSession`, `login` e
  `logout`.
- Início e edição de item mostram esqueleto enquanto carregam (CMP-07), e o
  início pré-carrega os itens no loader (ROT-08). Novo `ItemFormSkeleton`.
- `AppTable`: alinhada ao título da página (saiu o recuo lateral próprio),
  cabeçalho ordenável anuncia a ordem com `aria-sort`, e a opção `align` de
  `AppTableSortableHeader`, sem uso, saiu.
- Removidos de `src/styles.css` os tokens sem uso `brand*`,
  `--container-content` e `--transition-property-width`.
- Dependabot agrupa por família (TanStack, Tailwind, React) acima da divisão
  entre produção e desenvolvimento, para não repetir o descompasso entre
  `@tanstack/react-router` e `@tanstack/router-plugin`.
- O workflow do gerador roda também quando mudam `biome.json` e
  `biome-plugins/`.
- `pnpm check` passa a barrar NOM-02, COD-05, CMP-02, CMP-03, COR-01, COR-03,
  API-01 e ROT-08: regras do Biome e plugins GritQL em `biome-plugins/`,
  copiados para os projetos gerados. CMP-02, CMP-03, COR-01 e API-01 saíram da
  lista de regras que quebram em silêncio do `CLAUDE.md`, e a varredura da
  skill de revisão deixou de procurar o que o Biome já cobra.
- `criar-app` passa a ser registrado com `pnpm link --global`, que funciona
  também no Windows; o symlink manual em `~/.local/bin` saiu do README.
- `/login` com sessão ativa redireciona para o início em vez de mostrar o
  formulário de novo.
- Formulários de exemplo usam `Field`, `FieldLabel` e `FieldError` do shadcn;
  o campo "Situação" ganhou mensagem de erro e a descrição, `onBlur`.
- A edição de item pré-carrega o registro no loader (ROT-08).
- Removidos `AppTableCard`, `AppTableCardSkeleton`, a opção `embedded` de
  `AppTable` e as primitivas `card`, `input-group`, `popover` e `tooltip`, que
  não tinham consumidor (NOM-05, COD-04). Quem precisar reinstala com
  `pnpm exec shadcn add`.
- `@types/node` e `@playwright/test` fixados em versão exata, como o resto.
- MCP do shadcn configurado por projeto em `.mcp.json`, incluído nas cópias
  geradas.
- Regras do projeto em Markdown: `CLAUDE.md` com comandos, ordem de leitura e as
  regras que quebram em silêncio.
- `docs/standards.md` com 79 regras codificadas (NOM, COD, IDI, CMP, COR, ROT,
  API, EST, FRM, FMT, SEG, AMB, FER, TST), cada uma com nível e motivo.
- `docs/decisions/` com as nove decisões que sustentam essas regras, e
  `docs/README.md` como índice da documentação.
- `README.md` por módulo em `src/features/`, com as regras de negócio.
- Skill `app-review-standards` para Claude Code: revisa o código contra as
  regras e devolve relatório; só relata, não corrige.
- CMP-02 passa a ser obrigatória e detectada pela varredura: elemento nativo
  com primitiva instalada em `ui/` é defeito. O formulário de exemplo trocou o
  `<select>` nativo pelo `Select` do shadcn.
- O gerador de projetos passa a copiar `CLAUDE.md`, `.claude/` e `.mcp.json`.
- O gerador virou o comando global `criar-app`, registrado por um symlink em
  `~/.local/bin`, e passou a instalar as dependências e iniciar o git com o
  primeiro commit. `--no-install` e `--no-git` desligam cada passo.
- `README.en.md`, descrição do projeto em inglês, incluída nas cópias geradas.
- CI dividido: `Quality` classifica o diff e pula os jobs de código quando a
  PR só mexe em texto, roda lint, tipos, testes e build separados da jornada
  no navegador, cacheia o Chromium e resume tudo no check `verify`.
- `Generator round trip`: gera um projeto de verdade, instala e roda as
  conferências dentro dele, no Linux e no Windows.
- `Node next compatibility`: roda a suíte na versão mais recente do Node toda
  segunda, para a próxima LTS não chegar de surpresa.
- `.github/` ganhou guia de contribuição, modelo de PR e formulários de issue.
- O gerador passa a instalar as dependências também no Windows: `pnpm` lá é um
  `.cmd`, que o Node recusa executar sem shell, e a falha era silenciosa.
- `.gitattributes` fixa LF no clone, inclusive onde o git usa
  `core.autocrlf=true`, e vai junto nas cópias geradas.
- Segurança: `SECURITY.md` na raiz, fora da lista que o gerador copia;
  `.github/dependabot.yml` para npm e para as próprias actions; workflow do
  CodeQL, que se recolhe onde o repositório não é público; `pnpm audit` como
  passo do `Quality`; e `minimumReleaseAge` de um dia no pnpm, sem o modo
  estrito, que impediria o Dependabot de atualizar qualquer pacote.
- Toda action dos workflows presa por SHA de commit, com a versão em
  comentário, em vez de tag móvel.

## 0.1.0 — 2026-09-20

- Base React/TypeScript com Vite, TanStack Router/Query/Form/Table e shadcn/Base UI.
- Layout responsivo e identidade, tema, navegação e formatação configuráveis.
- Sessão por contrato HTTP, CSRF, login/logout e limpeza de cache.
- CRUD de referência com filtros na URL e paginação no servidor.
- MSW em desenvolvimento, testes de integração/componente e jornadas Playwright.
- CI, documentação e comando de criação de projetos independentes.
