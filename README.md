# React App Template

<sub><a href="README.en.md">English</a></sub>

Base reutilizável para sistemas internos com React e API separada. Inclui uma jornada funcional de sessão e CRUD, layout responsivo, tema claro/escuro/sistema, pesquisa e paginação na URL, validação de contratos e testes de integração e navegador.

## Rodar a demonstração

Requisitos: Node 24 e pnpm 10.33.0.

```bash
pnpm install --frozen-lockfile
pnpm dev:mock
```

Abra `http://localhost:3000`. O formulário vem preenchido com `demo@example.com` / `demo12345`. Os dados demonstrativos ficam no navegador e sobrevivem à recarga. Para reiniciar, remova a chave `react-app-template.demo` do armazenamento local. O mock não integra o build de produção.

## Criar outro projeto

Registre o comando uma vez, a partir da pasta do template:

```bash
pnpm link --global
```

Funciona em Linux, macOS e Windows. Se o pnpm reclamar do diretório global,
rode `pnpm setup` uma vez e abra um terminal novo. Depois disso `criar-app`
funciona de qualquer pasta da máquina e sempre usa o estado atual do template,
porque é um link para a pasta viva. Para remover:
`pnpm remove --global react-app-template`. O diretório pai do destino deve
existir; o destino precisa ser novo.

```bash
criar-app ~/dev/meu-sistema --title "Meu Sistema"
cd ~/dev/meu-sistema
pnpm dev:mock
```

O comando copia os arquivos do template, ajusta pacote, título HTML, nome da
aplicação e namespace do armazenamento, instala as dependências e inicia o git
com o primeiro commit. Não publica nada nem cria repositório remoto.

| Opção | Efeito |
|---|---|
| `--title "Meu Sistema"` | nome exibido na aplicação e no `<title>` |
| `--name meu-sistema` | nome do pacote e do armazenamento; por padrão, o nome da pasta |
| `--no-install` | não roda `pnpm install` |
| `--no-git` | não inicia o git nem commita |

O que fica para trás: histórico do git do template, `node_modules`, builds e
`.env` pessoal. O que vai junto: `CLAUDE.md`, `docs/`, `.claude/` e `.mcp.json`
— o projeto novo nasce com as regras e a revisão.

Dentro da pasta do template o comando também responde por
`pnpm create-project`. E o repositório pode servir como GitHub Template
Repository depois de publicado pelo proprietário.

## Personalizar

| O que mudar | Onde |
|---|---|
| Nome, descrição, idioma de formatação, moeda, fuso e armazenamento | `src/config/app.ts` |
| Navegação tipada | `src/config/navigation.ts` |
| Cores, fonte, bordas e temas | `src/styles.css` |
| Marca/ícone | `src/shared/components/app-shell.tsx` e `public/favicon.svg` |
| Endereço público da API | `.env`, a partir de `.env.example` |
| Login e contrato de sessão | `src/features/auth/` |
| Funcionalidade de referência | `src/features/items/` |

Os textos da interface estão em português. `locale` controla formatação; tradução completa exige adotar um catálogo de mensagens quando houver necessidade real.

## MCP do shadcn

O servidor MCP está configurado no escopo deste projeto em `.mcp.json`. Ele
executa `pnpm exec shadcn mcp`, usando a versão instalada e fixada no lockfile,
e lê o preset Base UI e os aliases de `components.json`.

Depois de instalar as dependências, abra ou reinicie o Claude Code dentro desta
pasta e aprove o servidor na primeira vez. Use `/mcp` para conferir a conexão.

Exemplos: “Busque um componente de calendário no shadcn” ou “Adicione um dialog
respeitando o components.json deste projeto”. Novos projetos gerados com
`pnpm create-project` também recebem essa configuração, sem caminho absoluto
para a máquina de origem.

Referência: [MCP do shadcn](https://ui.shadcn.com/docs/mcp).

## Conectar uma API

```bash
cp .env.example .env
pnpm dev
```

Sem `:mock`, todas as chamadas vão à API configurada. O backend precisa implementar o [contrato de sessão e itens](docs/api-contract.md). A base usa cookies de sessão e um token CSRF entregue pela API; não inclui backend, provedor de identidade, cadastro de contas ou recuperação de senha. Para OIDC/SSO, substitua o módulo `auth` conforme o seu backend.

## Verificação

```bash
pnpm verify
pnpm exec playwright install chromium
pnpm test:e2e
```

`verify` executa Biome, TypeScript, testes, verificação do gerador e build. O build verifica também a exclusão dos mocks. Os testes MSW atravessam os serviços HTTP e as regras simuladas; Playwright verifica a jornada no navegador. O CI executa os dois grupos, pula os jobs de código quando a mudança é só de texto e gera um projeto do zero para conferir o gerador; o que cada workflow cobra está em [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md).

## Publicar

```bash
pnpm build
pnpm preview
```

Publique `dist/` em um servidor estático. Configure arquivos existentes primeiro, `/api/*` para o backend quando usar a mesma origem e as demais rotas para `index.html`. Este template assume hospedagem na raiz do domínio. Para uma subpasta, ajuste `base` do Vite e `basepath` do Router em conjunto.

Variáveis `VITE_*` são públicas e substituídas no build. Configure `VITE_API_URL` no ambiente de build; não coloque segredos no front-end. O comando `pnpm exec vite build --mode mock` também produz uma aplicação sem simulação.

## Documentação

- [Índice da documentação](docs/README.md)
- [Padrões de código, com código e nível](docs/standards.md)
- [Arquitetura](docs/architecture.md)
- [Contrato da API e autenticação](docs/api-contract.md)
- [Como criar e remover funcionalidades](docs/development.md)
- [Decisões, uma por arquivo](docs/decisions/)
- [Evolução do template](CHANGELOG.md)

## Trabalhar com agentes de IA

As regras do projeto são texto em Markdown:

| Arquivo | Para quê |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | comandos, o que ler antes de agir e as regras que quebram em silêncio |
| [`docs/standards.md`](docs/standards.md) | as regras em si, cada uma com código (`API-02`), nível e motivo |
| [`docs/decisions/`](docs/decisions/) | por que cada regra grande existe |
| `src/features/<módulo>/README.md` | regras de negócio do módulo |

Regra tem código para ser citada: "API-02 — Toda resposta da API é conferida
pelo Zod" localiza a regra, o motivo e a consequência sem depender de memória.

No Claude Code, a skill `app-review-standards` revisa o que ainda não foi
commitado contra essas regras — ela roda `pnpm check`, `typecheck` e `test`,
varre o código atrás de suspeitas e devolve um relatório com nível de
severidade. Ela só relata; não corrige nada.

O exemplo deve ser removido quando a primeira funcionalidade real estiver pronta; o procedimento está no guia de desenvolvimento. As cópias são independentes: alterações futuras no template não são propagadas automaticamente.
