# auth — Sessão, login e logout

Ponto de adaptação entre a aplicação e a identidade do backend. É o módulo que
fica depois que o exemplo `items` for removido.

## Telas

| Tela | Endereço |
|---|---|
| login | `/login` |
| sair | botão na casca, em toda tela privada |

Tudo que exige sessão fica sob `src/routes/_app/` (ROT-03). A guarda é o
`beforeLoad` de `_app.tsx`. O caminho inverso também é guardado: `/login` com
sessão ativa redireciona para o início, no `beforeLoad` de `login.tsx`.

## Regras de negócio

- **A sessão é do backend** (decisão 0005): cookie `HttpOnly` criado e validado
  pela API, token CSRF só em memória. Não existe booleano de "está logado" nem
  token em `localStorage` (SEG-01).
- **A guarda de rota é conveniência**: ela evita mostrar uma tela que vai
  falhar. Quem autoriza cada recurso e cada operação é a API (SEG-02).
- **`permissions` orienta a interface, não protege nada** (SEG-03). Esconder um
  botão é decisão de tela.
- **A consulta de sessão nunca é repetida** (`retry: false`) e nunca fica
  velha (`staleTime: 0`): uma falha aqui precisa aparecer na hora.
- **Senha errada vira mensagem no formulário, não redirecionamento**: o 401 do
  endpoint de sessão é o único que não dispara `app:session-expired` (API-10).
- **Falha de rede não é login inválido**: a mensagem distingue os dois casos,
  via `errorMessage`.
- **Sair cancela as leituras em andamento e limpa o cache** antes de navegar
  para o login (SEG-05), para que o próximo login não mostre por um instante os
  dados do anterior.
- **A sessão é recuperada por chamada, não por leitura local**: depois de uma
  recarga, o `GET /session` devolve o usuário e um token CSRF novo.

## Trocar por OIDC, SSO ou outro provedor

O que muda é este módulo: `auth.services.ts` (como a sessão é obtida) e
`auth.schemas.ts` (o formato do usuário). A guarda, a casca e o resto da
aplicação continuam iguais. O template não inventa refresh token nem fluxo de
renovação — isso é decisão do backend.

## Contrato da API

`docs/api-contract.md`, seção "Sessão".
