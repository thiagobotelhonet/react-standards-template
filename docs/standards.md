# Padrões de código

Como se escreve código aqui. Onde cada coisa mora: `architecture.md`. Motivo
das decisões grandes: `decisions/`. Contrato com o backend: `api-contract.md`.

## Como ler

- Cada regra tem código (`API-02`), título e nível.
- **DEVE / NÃO DEVE:** obrigatório; descumprir é defeito.
- **DEVERIA / NÃO DEVERIA:** esperado; descumprir exige motivo dito na revisão.
- **PODE:** a critério de quem escreve.
- Quem cobra é a revisão, salvo quando a regra indica **Cobra:**.
- `src/shared/components/ui/` é gerado pelo shadcn e fica fora de quase todas
  as regras; veja CMP-01.

## Arquivos e nomes (NOM)

### NOM-01 — Nome de arquivo em minúsculas com hífen

**DEVE**

- Componentes inclusive: `items-table.tsx`, nunca `ItemsTable.tsx`.
- Exceção: `src/routes/` segue a convenção do TanStack Router — `__root.tsx`,
  `_app.tsx`, `$itemId/`.
- Por quê: padrão do shadcn; evita arquivo duplicado no histórico ao trocar de
  sistema operacional.

### NOM-02 — Exportação nomeada em todo arquivo de `src/`

**NÃO DEVE** · **Cobra:** Biome

- Nada de `export default` em `src/`.
- Por quê: o nome da coisa não muda de arquivo para arquivo, e a busca do
  editor encontra quem usa.
- Arquivo de configuração na raiz (`vite.config.ts`, `biome.json`) segue o
  formato que a ferramenta exige.

### NOM-03 — Atalho `@/` fora do módulo, caminho relativo dentro

**DEVE** · **Cobra:** Biome

- Dentro do módulo: `../types/items.schemas`. Fora: `@/shared/...`.
- Outro módulo só pelo `index.ts`: `@/features/items`. O Biome recusa
  `@/features/items/api/...` e caminho relativo que sai do módulo, como
  `../../auth/api/...`.
- Por quê: só assim o texto do import já diz quem é de dentro e quem é de fora.
  Detalhes em `architecture.md`, "Fronteiras e manutenção".

### NOM-04 — Nome do arquivo começa com o assunto

**DEVE**

- `items.services.ts`, `items.queries.ts`, `items.schemas.ts`,
  `items-table.tsx`, nunca `services.ts` ou `table.tsx`.
- Em `api/`: um arquivo por tipo (`<módulo>.services.ts`,
  `<módulo>.queries.ts`, `<módulo>.mutations.ts`), nunca um arquivo por
  operação.
- Por quê: o buscador do editor distingue os arquivos de quinze módulos; a
  lista de `api/` vira também a lista do que o módulo faz com a API.

### NOM-05 — Só existe o arquivo que o módulo usa

**NÃO DEVE** criar arquivo antecipado.

- `mutations.ts` nasce com a primeira gravação; `components/` nasce com o
  primeiro componente; `tests/` com o primeiro teste.
- Por quê: pasta vazia e arquivo de esqueleto viram manutenção sem consumidor.

### NOM-06 — O `index.ts` exporta só o que outro módulo usa

**DEVE**

- Componente interno, serviço e tipo auxiliar ficam de fora.
- Por quê: o `index.ts` é o contrato do módulo. Índice de tudo não é contrato;
  é permissão para qualquer um depender de qualquer coisa.

## Escrita de código (COD)

### COD-01 — O código se explica sozinho; comentário é evitado

**DEVERIA**

- Deu vontade de comentar? Renomeie a variável ou extraia uma função com o nome
  que você ia escrever no comentário.
- Comentário que sobrevive é o que explica *por quê*, não *o quê*.

### COD-02 — Comentário inevitável é em inglês

**DEVE**

- Uma linha, no formato `/* Storage can be unavailable in private browsing. */`.
- Por quê: comentário é para quem lê o código, e código aqui é em inglês
  (IDI-02).

### COD-03 — Conhecimento que não cabe no código vai para a documentação

**DEVE**

- Regra de negócio: `README.md` do módulo. Decisão grande: `decisions/`.
  Convenção: este arquivo.
- Por quê: comentário longo envelhece escondido; documentação é revisada.

### COD-04 — Sem abstração antes da necessidade

**NÃO DEVE**

- Nada de propriedade, variante, parâmetro ou camada sem um segundo uso real.
- Camada que só repassa a chamada é ruído: apague-a.
- Por quê: decisão 0009. O custo de generalizar cedo é pago em toda leitura.

### COD-05 — React importado por nome

**DEVE** · **Cobra:** Biome

- `import { useState } from "react"`, nunca `import * as React` em código do
  projeto. Arquivos de `ui/` são gerados e ficam de fora.
- O tipo global (`React.ReactNode`) é aceito; hook e função vêm sempre por
  nome.

### COD-06 — Função pura nasce no arquivo que a usa

**DEVERIA**

- Sobe para `src/shared/lib/` quando o segundo arquivo precisar dela.
- Por quê: `utils.ts` vira gaveta quando recebe função de um consumidor só.

## Idioma (IDI)

### IDI-01 — O que chega ao usuário é em português

**DEVE**

- Rótulo, botão, título, mensagem de erro, texto de vazio, nome acessível e
  texto de esqueleto.
- Mensagem de erro do Zod também: ela aparece no formulário.

### IDI-02 — O que só o programador lê é em inglês

**DEVE**

- Nome de arquivo, pasta, variável, função, tipo, chave de cache, evento,
  comentário e mensagem de regra do Biome.

### IDI-03 — O endereço fala português; o contrato da API fala inglês

**DEVE**

- Na URL da aplicação: `pagina`, `porPagina`, `ordenarPor`, `ordem`, `q`.
- No contrato HTTP: `page`, `pageSize`, `sort`, `order`, `q`.
- A tradução é feita no serviço, em um lugar só (`items.services.ts`).
- Por quê: o endereço é interface de usuário — ele é lido, copiado e
  compartilhado. O contrato é de máquina e acompanha o backend.

## Componentes e shadcn (CMP)

### CMP-01 — Componente do shadcn não é editado à mão

**DEVE**

- `src/shared/components/ui/` é gerado. Para instalar:
  `pnpm exec shadcn add <componente>`; confira o diff antes de commitar.
- Precisa de comportamento diferente? Componha por fora, em
  `src/shared/components/` ou no módulo.
- O MCP do shadcn está configurado em `.mcp.json` e roda a versão do lockfile,
  respeitando o preset Base UI de `components.json`.
- Por quê: a pasta é atualizável enquanto for gerada. Editada à mão, cada
  atualização vira conflito.
- Consequência: o Biome não analisa essa pasta (veja `biome.json`), e as regras
  de estilo deste documento não valem lá.

### CMP-02 — Toda peça visual sai do shadcn

**DEVE** · **Cobra:** Biome

- Elemento nativo que já tem primitiva instalada em
  `src/shared/components/ui/` é proibido fora dessa pasta: `<select>`,
  `<input>`, `<textarea>`, `<button>`, `<label>`, `<table>` e família, `<hr>`.
- A lista mora em `biome-plugins/no-native-elements.grit`. Instalou ou
  removeu uma primitiva dessas? Ajuste a lista no mesmo trabalho.
- A primitiva ainda não existe? Consulte o MCP do shadcn para achar o
  componente e instale: `pnpm exec shadcn add <componente>`.
- O shadcn não tem essa peça? Aí sim componha à mão, a partir das primitivas
  que existem, e diga o motivo no `README.md` do módulo.
- Estrutura continua nativa: `<div>`, `<span>`, `<p>`, `<form>`, título e lista
  não têm primitiva e não precisam.
- Por quê: foco, teclado, `aria-*`, comportamento de toque e tema escuro já vêm
  resolvidos e testados. Escrito à mão, cada peça resolve um pedaço e esquece
  outro — e o que esquece não dá erro.

### CMP-03 — Composição por `render`, nunca `asChild`

**NÃO DEVE** · **Cobra:** Biome

- Base UI usa `render`: `<DropdownMenuTrigger render={<Button />} />`.
- Por quê: `asChild` é a API do Radix. Aqui ela não existe e falha calada.

### CMP-04 — Peça usada por mais de um módulo mora em `src/shared/components/`

**DEVE** · **Cobra:** Biome, só o último item

- Enquanto só um módulo usa, ela fica dentro do módulo.
- O prefixo `app-` é para as peças que montam estrutura de tela inteira
  (`app-shell.tsx`, `app-table.tsx`). Peça de apoio não precisa do prefixo
  (`request-error.tsx`).
- `src/shared` nunca importa de `src/features`.

### CMP-05 — Toda tabela sai da fábrica `useAppTable`

**DEVE**

- `createTableHook` em `src/shared/components/app-table.tsx` já fixa as
  funcionalidades, a ordenação e a paginação no servidor.
- Para ligar a tabela à URL, use `bindAppTableToUrl`.
- Por quê: tabela montada à mão perde a ligação com a URL e diverge no visual.

### CMP-06 — Erro de requisição usa `RequestError`

**DEVE**

- Ele traduz o erro com `errorMessage` (API-07) e oferece nova tentativa.
- Por quê: mensagem de erro escrita caso a caso vaza detalhe técnico e some em
  telas novas.

### CMP-07 — Carregamento mostra esqueleto no formato da tela

**DEVERIA**

- `AppTableSkeleton` para listas; para o resto, um
  esqueleto com a mesma altura e o mesmo número de blocos da tela pronta.
- Marque a região com `aria-busy` e um texto "Carregando…" em `sr-only`.
- Por quê: esqueleto fora de escala faz a tela pular quando o dado chega.

### CMP-08 — A cor nunca é a única portadora do significado

**DEVE**

- Situação, erro e aviso vêm com texto ou ícone junto.
- Por quê: daltonismo, tema escuro e impressão.

### CMP-09 — Avisos usam o sonner, com um `<Toaster>` só

**DEVE** · **Cobra:** Biome

- O `<Toaster>` mora em `src/routes/__root.tsx`. Em qualquer outro lugar,
  `toast.success(...)` / `toast.error(...)`.
- Por quê: dois `Toaster` empilham dois avisos para o mesmo evento.

### CMP-10 — Todo controle tem nome acessível

**DEVE**

- Botão de ícone recebe `<span className="sr-only">`; campo recebe `<Label>`
  ligado por `htmlFor`; busca recebe `aria-label`.
- Por quê: sem isso o botão é anunciado como "botão" e o teste por papel
  (TST-03) não acha nada.

## Cores e estilo (COR)

### COR-01 — Componente nunca escreve cor pronta

**NÃO DEVE** · **Cobra:** Biome

- Nada de `bg-blue-500`, `text-green-700` ou `#0f172a` no `className`.
- Use os tokens: `bg-card`, `text-muted-foreground`, `text-destructive`,
  `ring-foreground/10`.
- Por quê: cor pronta ignora o tema escuro e o dia em que a marca mudar.

### COR-02 — Token novo em três lugares

**DEVE**

- `src/styles.css`: valor em `:root`, valor em `.dark` e registro
  `--color-<nome>` em `@theme inline`.
- Faltando um dos três, a classe não existe ou o tema escuro fica com a cor do
  claro — sem erro nenhum.

### COR-03 — Medida entre colchetes é proibida

**NÃO DEVE** · **Cobra:** Biome

- Nada de `w-[327px]` ou `text-[13px]`.
- Use a escala do Tailwind. Se a medida se repetir e não estiver na escala,
  vire token no tema (COR-02).

### COR-04 — O tema vem do `ThemeProvider`

**DEVE**

- Leia com `useTheme()`. Nenhum componente lê `localStorage` de tema direto nem
  escreve a classe `dark` na mão.
- Por quê: a escolha "sistema" depende de um `matchMedia` só, e o valor é lido
  antes da primeira pintura em `initializeTheme()`.

## Rotas e endereço (ROT)

### ROT-01 — `__root.tsx` não busca dado de usuário

**DEVE**

- A raiz monta a casca, o `<Toaster>` e o tratamento de sessão expirada.
  Quem exige sessão é `_app.tsx`, no `beforeLoad`.
- Por quê: o que roda na raiz roda para a tela de login também, e para a de
  erro.

### ROT-02 — Arquivo de rota valida o endereço e monta a tela

**DEVE**

- Na rota: `validateSearch`, `loaderDeps`, `loader`, `beforeLoad` e a
  composição dos componentes do módulo.
- Fora da rota: esquema, serviço, consulta, gravação e regra de negócio.
- Por quê: a rota é o mapa do endereço. Regra escondida ali não é encontrada
  por quem procura pelo módulo.

### ROT-03 — Tela privada fica sob `_app`

**DEVE**

- `src/routes/_app/...` para o que exige sessão; `src/routes/login.tsx` e
  irmãos para o que é público.
- Por quê: a guarda é herdada do layout; tela privada fora dele nasce aberta.

### ROT-04 — Filtro, página, ordenação e busca vão na URL

**DEVE**

- Nada de `useState` para `pagina`, `q`, `ordenarPor` ou `ordem`.
- Por quê: o endereço precisa reproduzir a tela — recarga, link compartilhado e
  botão voltar.

### ROT-05 — Todo parâmetro da URL tem `default` e `catch`

**DEVE**

- No esquema: `z.number().int().min(1).default(1).catch(1)`.
- Por quê: o usuário edita a URL. Sem `catch`, um valor estranho derruba a tela
  inteira em vez de cair no padrão.

### ROT-06 — Filtro no valor padrão sai do endereço

**DEVE** · usa `stripSearchParams`

- `?pagina=1&porPagina=10&q=` polui o link e não diz nada.

### ROT-07 — Busca que escreve no endereço usa `replace`

**DEVE**

- Digitar sete letras não pode render sete voltas no botão voltar. Trocar de
  página ou de ordenação, sim, empilha (`replace: false`).

### ROT-08 — O loader pré-carrega, não espera

**DEVE** · **Cobra:** Biome

- `void context.queryClient.prefetchQuery(...)`, sem `await` e sem
  `ensureQueryData`.
- A tela mostra esqueleto (CMP-07) enquanto a consulta chega.
- Exceção: as guardas de sessão em `_app.tsx` e `login.tsx` esperam de
  propósito, no `beforeLoad` — precisam da resposta para decidir entre a tela e
  o redirecionamento (SEG-02).
- Por quê: loader que espera segura a navegação e deixa a tela anterior
  congelada.

### ROT-09 — Entrada de menu vai em `config/navigation.ts`

**DEVE**

- Nenhum `<Link>` de navegação principal escrito solto na casca.

## Dados da API (API)

### API-01 — Caminho do cliente HTTP nunca começa com barra

**DEVE** · **Cobra:** Biome

- `requestJson(itemSchema, "items")`, nunca `"/items"`.
- Por quê: o `baseUrl` do ky é `/api/` ou o valor de `VITE_API_URL`. A barra no
  começo apaga o caminho da base e a chamada vai para a raiz do domínio.

### API-02 — Toda resposta da API é conferida pelo Zod

**DEVE**

- Só `requestJson(schema, url, options)` em `src/shared/api/client.ts` fala
  JSON. Nenhum módulo chama `fetch` ou o ky direto.
- Resposta sem corpo (204) usa `api.delete(...)` sem esquema.
- Por quê: sem conferência, um campo que o backend renomeou vira `undefined`
  lá na frente, numa tela que não tem nada a ver com a causa.

### API-03 — O serviço recebe e repassa o `AbortSignal`

**DEVE**

- Assinatura: `fetchItems(filters, signal?)`; a consulta entrega o sinal
  (`queryFn: ({ signal }) => fetchItems(filters, signal)`).
- Por quê: sem isso, sair da tela não cancela a chamada, e a resposta velha
  chega depois da nova.

### API-04 — Serviço, consulta e gravação separados; a chave tem um dono

**DEVE**

| Arquivo | Responsabilidade |
|---|---|
| `<módulo>.services.ts` | fala HTTP, traduz o filtro da URL para o contrato, confere o Zod |
| `<módulo>.queries.ts` | define o objeto de chaves e as `queryOptions` |
| `<módulo>.mutations.ts` | grava e decide o que invalidar |

- A chave nasce no objeto de chaves (`itemsKeys`) em `*.queries.ts`. Qualquer
  outro arquivo usa o objeto; nunca escreve `queryKey: ["items", ...]` à mão.
- Por quê: chave escrita duas vezes é chave que invalida metade do cache.

### API-05 — Gravação nunca é repetida automaticamente

**DEVE**

- `mutations: { retry: false }` no `QueryClient`; o ky também não repete
  (`retry: 0`).
- Leitura repete uma vez, e só em falha transitória (`isRetryableError`):
  resposta inválida e 4xx não são repetidos.
- Por quê: repetir um `POST` cria dois registros.

### API-06 — Listagem paginada mantém a página anterior

**DEVE** · `placeholderData: keepPreviousData`

- Por quê: sem isso a tabela pisca em branco a cada página.

### API-07 — Erro de chamada vira texto com `errorMessage`

**DEVE**

- Nenhuma tela lê `error.response.status` para montar a frase.
- Por quê: a tradução é uma só, e detalhe de exceção não aparece para o
  usuário.

### API-08 — Gravação invalida só o domínio afetado

**DEVE**

- `invalidateQueries({ queryKey: itemsKeys.lists() })`, nunca
  `invalidateQueries()` sem chave.
- O sucesso é anunciado depois da confirmação do servidor.

### API-09 — ID que entra no caminho passa por `encodeURIComponent`

**DEVE**

- `items/${encodeURIComponent(id)}`.
- Por quê: um id com barra ou `?` muda a rota chamada.

### API-10 — 401 de recurso privado derruba a sessão; o de login, não

**DEVE**

- O `afterResponse` do cliente dispara `app:session-expired`, menos no endpoint
  de sessão.
- Por quê: senha errada precisa virar mensagem no formulário, não um
  redirecionamento que apaga o que a pessoa digitou.

## Estado (EST)

### EST-01 — Dado remoto é do TanStack Query

**NÃO DEVE** copiar resposta da API para `useState`, contexto ou store.

- Precisa derivar? Derive na renderização. Precisa editar? O formulário recebe
  o valor como inicial (EST-02).
- Por quê: cópia é cache sem invalidação. Ela envelhece e ninguém percebe.

### EST-02 — Campo de formulário é do TanStack Form

**DEVE**

- Nada de um `useState` por campo.

### EST-03 — Estado efêmero fica no componente

**DEVERIA**

| Estado | Dono |
|---|---|
| dado que veio da API | TanStack Query |
| filtro, página, ordenação, busca | URL |
| valor de campo enquanto edita | TanStack Form |
| menu aberto, confirmação pendente, termo digitado | `useState` do componente |
| tema | `ThemeProvider` |

- Não há store global neste template, e nenhum é adicionado sem um estado que
  não caiba em nenhuma linha dessa tabela.

### EST-04 — Coluna escondida fica na tabela

**DEVE**

- Visibilidade de coluna é estado do `useAppTable`, não `useState` na página.

## Formulários (FRM)

### FRM-01 — O formulário valida pelo mesmo esquema da API

**DEVE**

- `validators: { onSubmit: itemInputSchema }`, com o esquema vindo de
  `types/<módulo>.schemas.ts`.
- Por quê: duas validações diferentes divergem, e a do cliente é a que mente.

### FRM-02 — O `<form>` usa `noValidate`

**DEVE**

- Quem valida é o Zod; a bolha do navegador tem outro texto e outro idioma.

### FRM-03 — Todo campo tem rótulo ligado, estado e mensagem

**DEVE**

- `Field` com `data-invalid`, `FieldLabel htmlFor`, `aria-invalid` no
  controle quando houver erro e `FieldError` apontado por `aria-describedby`.
- Por quê: sem isso o erro existe na tela e não existe para quem usa leitor.

### FRM-04 — Mensagem de erro em português, escrita no esquema

**DEVE**

- `.min(2, "Informe pelo menos 2 caracteres.")` — não a mensagem padrão do Zod,
  que é em inglês.

### FRM-05 — O formulário não conhece transporte

**DEVE**

- Ele recebe `initialValues`, `isPending`, `error` e `onSave`. Quem chama a
  gravação é a rota.
- Por quê: assim o mesmo formulário serve para criar e editar, e o teste dele
  não precisa de rede.

## Datas, dinheiro e números (FMT)

### FMT-01 — Formatação só por `@/shared/lib/format`

**DEVE**

- `formatDate`, `formatNumber`, `formatCurrency`. Nenhum `Intl.` ou
  `toLocaleDateString` espalhado pela tela.
- Data inválida vira `—`, não "Invalid Date".

### FMT-02 — Idioma, moeda e fuso vêm de `config/app.ts`

**DEVE**

- Nunca `"pt-BR"` escrito dentro de um componente.

## Sessão e autorização (SEG)

### SEG-01 — A sessão é do backend

**DEVE**

- Cookie `HttpOnly` criado e validado pela API; token CSRF só em memória
  (`setCsrfToken`), recuperado pelo `GET /session` depois da recarga.
- **NÃO DEVE** existir booleano de "está logado", token ou dado de usuário no
  `localStorage` ou `sessionStorage`.
- Por quê: o que o cliente guarda, o cliente edita.

### SEG-02 — Guarda de rota é conveniência; quem autoriza é a API

**DEVE**

- O `beforeLoad` de `_app.tsx` melhora a navegação. Cada recurso, operação e
  escopo de dado continua autorizado no servidor.

### SEG-03 — `permissions` orienta a tela, não protege nada

**DEVE**

- Esconder um botão pela lista de permissões é bom para a tela. A API recusa a
  ação de qualquer jeito.

### SEG-04 — Senha só vai ao endpoint de login

**DEVE**

- Não é guardada, não é logada, não entra em estado global.

### SEG-05 — Sair cancela leituras e limpa o cache

**DEVE**

- `cancelQueries`, `clear`, `setCsrfToken(null)` e navegação para `/login`.
- Por quê: sem limpar, o próximo login mostra por um instante os dados do
  anterior.

## Ambiente e publicação (AMB)

### AMB-01 — Nada de segredo em variável de ambiente

**NÃO DEVE**

- Tudo que começa com `VITE_` é substituído no build e fica legível no
  navegador. Chave, senha e token não entram ali.
- O front-end configura, no máximo, o endereço da API (`VITE_API_URL`).

### AMB-02 — `.env` é só de desenvolvimento

**DEVE**

- Versionados: `.env.example` e `.env.mock`. O `.env` pessoal fica fora do git
  e fora da cópia gerada por `pnpm create-project`.
- Em produção, o valor vem do ambiente de build.

### AMB-03 — A simulação nunca chega ao build

**DEVE**

- O MSW só liga em `import.meta.env.DEV` no modo `mock`, por `main.tsx`.
- O worker é servido por um plugin do Vite em desenvolvimento; ele **NÃO DEVE**
  ser copiado para `public/`.
- `pnpm build` roda `scripts/check-build.mjs`, que falha se o worker ou as
  credenciais de demonstração aparecerem em `dist/`.
- Teste pode importar de `src/mocks/`; código de aplicação, não (o Biome
  recusa).

### AMB-04 — O build é estático e assume a raiz do domínio

**DEVE**

- O servidor serve arquivo existente, encaminha `/api/*` ao backend quando for
  mesma origem e manda o resto para `index.html`.
- Publicar em subpasta exige ajustar `base` do Vite e `basepath` do Router
  juntos.

## Ferramentas e dependências (FER)

### FER-01 — O gerenciador é o pnpm

**DEVE**

- Declarado em `packageManager`, com Node 24.15 ou mais novo da linha 24
  (`.node-version`, `engines`): é o mínimo que o jsdom pede.
- `npm install` ou `yarn` criam outra trava, com outras versões. Decisão 0007.

### FER-02 — Dependência nova precisa de consumidor concreto

**DEVE**

- Versão exata no `package.json` (sem `^`), como as que já estão lá.
- Atualize famílias relacionadas juntas (TanStack, Testing Library), leia o
  guia de migração e registre no `CHANGELOG.md` o que muda para quem já copiou
  o template.
- Para descobrir a versão instalada: `node_modules/<pacote>/package.json`.

### FER-03 — `src/routeTree.gen.ts` é gerado

**NÃO DEVE** ser editado à mão.

- Ele nasce do plugin do Router ao rodar `pnpm dev` ou `pnpm build`, e está
  fora da análise do Biome.

## Testes (TST)

### TST-01 — Teste o que a funcionalidade promete, não cada arquivo

**DEVERIA**

- Vale testar: regra de validação, tradução de filtro para o contrato, estado
  de erro, autorização simulada, cancelamento e o caminho que o usuário
  percorre.
- Não vale: componente que só repassa propriedade, getter trivial, retrato
  extenso (`snapshot`) de HTML.

### TST-02 — Nome e lugar do teste

**DEVE**

| Alvo | Lugar |
|---|---|
| módulo | `src/features/<módulo>/tests/<assunto>.test.tsx` |
| peça compartilhada | ao lado do arquivo: `app-table.test.tsx` |
| jornada no navegador | `e2e/<assunto>.spec.ts` |

- O nome do arquivo repete o nome do que ele testa. O teste que percorre a
  jornada inteira do módulo, e não um arquivo, chama-se
  `<assunto>-flow.test.ts`.

### TST-03 — Busque pelo que o usuário vê

**DEVE**

- `getByRole`, `getByLabelText`, `findByText`. Nada de `container.querySelector`
  nem de classe CSS como seletor.
- Por quê: teste presa à marcação quebra em toda troca de componente e passa
  mesmo quando a tela está inacessível.

### TST-04 — Interação com `user-event`

**DEVE**

- `await userEvent.click(...)`, não `fireEvent`.

### TST-05 — Sem limpeza manual entre testes

**NÃO DEVE** escrever `cleanup()` ou `afterEach(cleanup)`.

- `globals: true` no `vitest.config.ts` já faz a Testing Library limpar sozinha.

### TST-06 — Contrato HTTP é testado com MSW

**DEVE**

- O teste troca a resposta do servidor, não a função do módulo. Assim o
  caminho `serviço → Zod → consulta → tela` roda de verdade.

### TST-07 — Playwright só para jornada crítica

**DEVERIA**

- Sessão, navegação, gravação e o que sobrevive a uma recarga. O resto é mais
  barato e mais estável em Vitest.
- O comando sobe e derruba o próprio servidor e exige a porta livre; ele não
  reaproveita uma aplicação já rodando.

### TST-08 — O prazo de espera é global

**DEVE**

- `asyncUtilTimeout` está no `vitest.setup.ts`. Nenhum teste passa `timeout`
  próprio para disfarçar lentidão.
