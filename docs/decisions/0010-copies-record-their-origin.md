---
status: aceita
date: 2026-10-12
---

# A cópia gerada registra de que versão do template nasceu

## Contexto

- A decisão 0008 mantém as cópias independentes, e continua valendo.
- Cada cópia leva junto as regras: `CLAUDE.md`, `docs/`, `.claude/`,
  `biome.json` e `biome-plugins/`. Sem saber de que versão nasceu, quem mantém
  a cópia não tem como descobrir quais regras mudaram desde então, e as cópias
  divergem em silêncio.
- Publicar as regras como pacote resolveria, ao custo de versionar,
  distribuir e migrar, que a decisão 0008 já recusou para o código.

## Decisão

`criar-app` grava `.template-origin.json` na cópia: nome do template, commit
de origem, se havia alteração não commitada e a data. Nada é publicado; quem
quiser trazer uma melhoria compara o template a partir daquele commit, com o
procedimento de `development.md`, "Evoluir o template".

## Consequências

- Saber o que uma cópia perdeu vira um `git log` no template, não memória.
- O arquivo é só informação: nada no build ou nos testes da cópia depende dele.
- `localChanges: true` avisa que a cópia nasceu de um template com mudança não
  commitada; o commit registrado é então só uma aproximação.
- Se trazer melhorias à mão ficar caro com muitas cópias, a reavaliação
  prevista na decisão 0008 continua de pé.
