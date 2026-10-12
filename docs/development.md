# Desenvolver a partir do template

## Nova funcionalidade

1. Defina a entrada/saída da API e seus estados de erro. O exemplo `items` demonstra o caminho inteiro.
2. Crie esquemas Zod e infira os tipos em `features/<assunto>/types`.
3. Implemente serviços HTTP, depois consultas/chaves e mutações em `api`.
4. Monte componentes sem conhecimento do transporte. Exporte o necessário no `index.ts`.
5. Crie rotas, defina o esquema dos filtros e acrescente o menu em `config/navigation.ts`.
6. Acrescente mocks para a jornada de desenvolvimento e testes das regras/contratos relevantes.

Evite duplicar um módulo inteiro para depois manter abstrações vazias. Preserve apenas arquivos que tenham consumidores. Compartilhe componentes quando o mesmo comportamento aparecer em módulos distintos.

## Remover o exemplo

- Substitua a visão geral em `routes/_app/index.tsx`.
- Remova `features/items`, `routes/_app/items` e a entrada de menu correspondente.
- Remova os handlers de itens em `mocks/handlers.ts`, preservando ou adaptando os de sessão.
- Substitua a jornada `e2e/app.spec.ts` pela primeira jornada real.
- Rode `pnpm build` para regenerar a árvore de rotas e depois `pnpm verify`.

## Temas e componentes

Altere tokens semânticos em `:root`, `.dark` e `@theme inline`. A cor não deve ser a única indicação de estado. Nomeie botões de ícone, conecte rótulos aos campos e mantenha acesso por teclado.

Para instalar uma primitiva, use `pnpm exec shadcn add <componente>`, confira o diff e mantenha Base UI e o preset em `components.json`. Reutilize as primitivas de `shared/components/ui` em componentes da aplicação.

## Qualidade

- Unitários para validações ou funções com decisões relevantes.
- Integração HTTP com MSW para contratos, autorização simulada, cancelamento e erros.
- Componentes com Testing Library, testando o que a pessoa vê e faz.
- Playwright para as poucas jornadas críticas: sessão, navegação, escrita e persistência após recarga.
- `pnpm verify` em cada entrega; teste de navegador nas mudanças de fluxo.

Os testes de navegador usam a porta 4300 e exigem que esteja livre. O comando inicia e encerra seu próprio servidor. Não reutiliza uma aplicação existente nessa porta.

## Atualizar dependências

O lockfile é versionado. Atualize famílias relacionadas juntas, consulte os guias de migração, execute os checks e registre mudanças de contrato no changelog. Não atualize versões automaticamente ao gerar um projeto novo.

## Evoluir o template

Uma cópia não acompanha automaticamente a origem. Corrija o template, descreva a mudança no changelog e leve o patch às aplicações afetadas. Uma biblioteca compartilhada só se justifica quando o custo de propagar correções superar o custo de versionar e distribuir essa biblioteca.

Cada cópia guarda em `.template-origin.json` o commit do template de que nasceu (decisão 0010). Para trazer a ela as regras que mudaram desde então, rode na pasta do template, trocando `<commit>` pelo valor do arquivo:

```bash
git log --oneline <commit>..HEAD -- CLAUDE.md docs .claude biome.json biome-plugins
git diff <commit> HEAD -- CLAUDE.md docs .claude biome.json biome-plugins > regras.patch
```

Na cópia, aplique com `git apply --3way regras.patch`, resolva o que conflitar com mudanças locais, rode `pnpm verify` e corrija o que as regras novas apontarem. Depois, atualize o `commit` de `.template-origin.json` para o do template. O mesmo vale para código: troque a lista de caminhos pelos arquivos da correção.
