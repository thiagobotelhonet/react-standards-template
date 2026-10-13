---
status: aceita
date: 2026-09-20
---

# Sem motor genérico de CRUD, injeção de dependência ou sistema de plugins

## Contexto

- Um template convida a generalizar: um formulário que se monta a partir de um
  esquema, um serviço que atende qualquer entidade, um registro de plugins.
- Toda generalização precisa prever as exceções, e elas chegam no segundo
  módulo real.

## Decisão

O módulo `items` é um exemplo para ler e copiar, não uma fábrica. Não há motor
de CRUD, contêiner de injeção, sistema de plugins, monorepo nem biblioteca de
componentes publicada. Abstração só nasce com o segundo uso concreto (COD-04).

"Sistema de plugins" aqui é da aplicação: um registro em que módulos se
encaixam em tempo de execução. Os plugins do Biome em `biome-plugins/` são
outra coisa, regras de lint que não entram no build, e não contrariam esta
decisão.

## Consequências

- Criar um módulo é escrever arquivos parecidos com os do exemplo, e isso é
  aceito: a repetição é mais barata que a abstração errada.
- A revisão procura ativamente abstração de uso único, propriedade que ninguém
  passa e camada que só repassa chamada.
- Pontos de configuração de verdade são poucos e explícitos: `config/app.ts`,
  `config/navigation.ts` e `src/styles.css`.
