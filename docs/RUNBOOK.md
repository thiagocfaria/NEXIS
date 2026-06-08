# Runbook do NEXIS

Ultima atualizacao: 2026-05-30

## Demo Local

Use apenas dados ficticios.

```bash
npm install
cp .env.example .env
npm run db:reset-demo
npm run dev
```

Abra `http://localhost:3000`.

`npm run db:reset-demo` carrega dados ficticios para apresentacao. Para teste manual limpo de matematica e fluxos do zero, use `npm run db:reset-empty` antes de iniciar o app.

Para celular na mesma rede:

```bash
npm run dev -- --hostname 0.0.0.0
```

Abra no celular `http://IP_DO_SEU_COMPUTADOR:3000`. O computador e o celular precisam estar na mesma rede Wi-Fi.

## Demo Mobile/PWA

Teste local no celular em desenvolvimento:

```bash
npm run dev -- --hostname 0.0.0.0
```

Teste local no celular em modo producao:

```bash
npm run build
npx next start --hostname 0.0.0.0 --port 3000
```

Publicar preview demonstrativo na Vercel:

1. Criar/importar o projeto como `Next.js`.
2. Usar build command `npm run build`.
3. Manter `AI_ASSISTANT_ENABLED=false` no preview publico.
4. Nao configurar `AI_API_KEY` real em ambiente publico de demo.
5. Usar o preview para demonstrar UI/PWA; SQLite local nao e persistencia real em Vercel/serverless.

Abrir e instalar no celular:

1. Abrir a URL local ou preview no navegador do celular.
2. No Android/Chrome, escolher `Instalar app` ou `Adicionar a tela inicial`.
3. No iPhone/Safari, escolher `Compartilhar` e `Adicionar a Tela de Inicio`.
4. Abrir pelo icone `NEXIS`.
5. Conferir que a abertura fica em modo de app e que as rotas principais nao geram scroll horizontal.

## Variaveis de Ambiente

Demo local texto-only (sem IA):

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_AUDIO_INPUT_ENABLED="false"
AUDIO_TRANSCRIPTION_PROVIDER="mock"
BETKOL_CPU_COMMAND=""
BETKOL_CPU_TIMEOUT_MS="10000"
AI_ASSISTANT_ENABLED="false"
AI_ASSISTANT_REVIEW_PASS_ENABLED="false"
AI_PROVIDER="openai-compatible"
AI_BASE_URL="https://api.groq.com/openai/v1"
AI_MODEL="llama-3.1-8b-instant"
AI_API_KEY=""
AI_TIMEOUT_MS="15000"
```

Railway demo com IA (via painel, nunca versionar):

```env
DATABASE_URL=file:/data/nexis-demo.db
AI_ASSISTANT_ENABLED=true
AI_API_KEY=<chave_real_groq>
```

(as demais variaveis seguem o mesmo padrao do exemplo local)

Regras:

- `.env` e `.env.local` nao devem ser versionados.
- `AI_API_KEY` e server-side; nunca usar `NEXT_PUBLIC`.
- nao usar dados reais de cliente em demo.
- nao colar chave real em chat, docs ou logs.
- com `AI_API_KEY` vazio, o assistant usa parser rule-based sem erro.

## Roteiro de Demonstracao

1. Abrir o NEXIS no celular, de preferencia pelo icone instalado.
2. Mostrar o dashboard e os cards de vendas, lucro, despesas e produtos acabando.
3. Abrir `Falar com NEXIS`.
4. Digitar `cadastrar Coca lata custo 3 venda 6 estoque 20 minimo 5`.
5. Mostrar o card de revisao e salvar somente pelo botao `Salvar produto`.
6. Registrar uma compra.
7. Registrar uma venda.
8. Registrar uma despesa confirmada.
9. Voltar ao dashboard e mostrar que os numeros mudaram.
10. Perguntar `qual meu lucro líquido hoje?`.
11. Perguntar `qual meu estoque atual?`.
12. Mostrar que produto, venda, compra e despesa nao salvam so com `sim` ou `pode salvar`; precisam do botao de confirmacao.

## Laboratorio Humanizado Obrigatorio do Assistant

Use somente dados ficticios. Antes de mexer no assistant, leia `REGRAS_INVARIANTES.md`.
As baterias humanizadas privadas do assistant ficam fora do GitHub e devem ser rodadas apenas em ambiente local que tenha esses arquivos.

Essa bateria cobre caixas, fardos, bandeja, cartela, pacote ambiguo, kg, gramas, litro, ml como variante, cadastro incompleto, compra/venda com confirmacao, produto ambiguo, produto inexistente, despesa, perda, cancelamento, pergunta de estoque e resumo de lucro.

Para validar manualmente no celular:

1. Rode `npm run db:reset-empty`.
2. Rode `npm run dev -- --hostname 0.0.0.0 --port 3000`.
3. Abra `/assistant` no celular pelo IP da maquina.
4. Envie uma frase por vez.
5. Se o NEXIS pedir dado faltante, responda como usuario comum.
6. Clique em salvar/confirmar somente quando o card de rascunho estiver correto.
7. Confira estoque, banco/dashboard ou resposta de consulta depois da confirmacao.
8. Registre falhas reais em `docs/PROJECT_STATE.md`; nao aceite teste que passe por frase decorada.

Teste de conversa com campos faltantes em banco vazio:

1. Rodar `npm run db:reset-empty`.
2. Abrir `/assistant`.
3. Digitar `coloca 5 coca cola que eu comprei no estoque`.
4. Confirmar que o NEXIS pergunta quanto foi pago por unidade.
5. Responder `paguei 3 reais`.
6. Como o produto nao existe no banco vazio, confirmar que o NEXIS pede preco de venda.
7. Responder `vendo por 6 reais`.
8. Responder `minimo 5`.
9. Conferir o rascunho de produto e salvar apenas pelo botao.
10. Conferir que o estoque final fica 5 e nada foi salvo antes do botao.

Teste da frase longa real em banco vazio:

1. Rodar `npm run db:reset-empty`.
2. Abrir `/assistant`.
3. Digitar `quero cadastrar 10 coca cola em lata que eu comprei por 4.20 cada uma`.
4. Confirmar que nao aparece relatorio de compras.
5. Confirmar que o NEXIS pergunta preco de venda e nao pergunta custo.
6. Responder `vou vender a 10 reais cada unidade`.
7. Responder `estoque minimo sera 5 unidades`.
8. Conferir rascunho `Coca Cola lata`, custo R$ 4,20, preco R$ 10,00, estoque inicial 10 e minimo 5.
9. Salvar apenas pelo botao `Salvar produto`.
10. Conferir em `/products` que o produto so aparece depois do botao.

Teste de frase longa com volume:

1. Rodar `npm run db:reset-empty`.
2. Abrir `/assistant`.
3. Digitar `quero cadastrar a compra que eu fiz de 10 coca cola em lata 350 ml, comprei por 3.5 cada unidade dela cadastra para mim por favor este produto`.
4. Confirmar que nao aparece relatorio de compras.
5. Confirmar que o NEXIS pergunta preco de venda.
6. Responder `vendo por 6 reais`.
7. Responder `minimo 5`.
8. Conferir rascunho `Coca Cola lata 350 ml`, custo R$ 3,50, estoque inicial 10 e minimo 5.

Teste de valor total vs unitario:

1. Rodar `npm run db:reset-empty`.
2. Abrir `/assistant`.
3. Digitar `comprei 5 coca por 20 reais`.
4. Confirmar que o NEXIS pergunta se R$ 20,00 foi total ou valor de cada unidade.
5. Responder `total`.
6. Confirmar que o fluxo segue com custo unitario R$ 4,00 e pede preco de venda se o produto nao existir.

Teste de custo unitario ja informado:

1. Rodar `npm run db:reset-empty`.
2. Abrir `/assistant`.
3. Digitar `coloca 5 cocas que eu comprei no estoque paguei 4 reais em cada uma delas`.
4. Confirmar que o NEXIS nao pergunta custo novamente.
5. Confirmar que ele pede preco de venda porque o produto nao existe.
6. Responder `vendo por 7 reais`.
7. Responder `minimo 5`.
8. Conferir rascunho com custo R$ 4,00, venda R$ 7,00, estoque inicial 5 e minimo 5.
9. Salvar apenas pelo botao.

Teste de produto ambiguo:

1. Cadastrar produtos ficticios parecidos: `Coca-Cola lata 350ml`, `Coca-Cola 600ml` e `Coca-Cola 2L`.
2. Abrir `/assistant`.
3. Digitar `vendi uma coca`.
4. Confirmar que o NEXIS pergunta qual Coca e lista as opcoes.
5. Responder `a de 600`.
6. Confirmar que o rascunho e para `Coca-Cola 600ml`.
7. Confirmar que o estoque so baixa apos clicar em `Confirmar venda`.

Teste de produto muito parecido:

1. Cadastrar `Coca Cola lata` e `Coca Cola lata 350 ml`, ambos com estoque ficticio.
2. Abrir `/assistant`.
3. Digitar `vendi 5 coca cola para meu cliente aqui`.
4. Confirmar que o NEXIS pergunta qual produto e lista as duas opcoes.
5. Responder `1`.
6. Confirmar que aparece rascunho de venda para `Coca Cola lata`, com quantidade 5.
7. Repetir o fluxo respondendo `coca lata`.
8. Confirmar que o NEXIS nao volta para a mesma pergunta de ambiguidade.
9. Confirmar que o estoque so baixa no produto escolhido apos clicar em `Confirmar venda`.

Teste de multiplas acoes:

1. Rodar `npm run db:reset-empty`.
2. Abrir `/assistant`.
3. Digitar `comprei coca, vendi água e gastei 10`.
4. Confirmar que o NEXIS pede para registrar uma coisa por vez.
5. Confirmar que nenhum card de rascunho aparece e nada e salvo.

Teste rapido de UX do chat mobile:

1. Abrir `/assistant` em viewport de celular ou no celular real.
2. Confirmar que o composer fica no rodape e o historico fica acima dele.
3. Enviar 6 a 10 mensagens de pergunta, por exemplo `quanto vendi hoje?` e `qual meu estoque atual?`.
4. Confirmar que as mensagens novas aparecem no fim do historico.
5. Confirmar que apenas a lista de mensagens rola e o composer continua visivel.
6. Confirmar que nao ha scroll horizontal.
7. Criar um rascunho de produto e confirmar que ele aparece dentro da conversa e so salva pelo botao.

Frases uteis:

- `quanto vendi hoje?`
- `quanto vendi no mes?`
- `qual foi meu lucro hoje?`
- `qual foi meu lucro no mes?`
- `quais produtos estao acabando?`
- `quanto tive de despesa?`
- `vendi 2 águas por 3 reais`
- `comprei 10 refrigerantes por 4 reais`
- `comprei 5 coca cola`
- `coloca 5 coca cola que eu comprei no estoque`
- `quero cadastrar 10 coca cola em lata que eu comprei por 4.20 cada uma`
- `entrou 10 água no estoque`
- `cliente levou 2 águas`
- `comprei embalagem por 30`
- `comprei coca, vendi água e gastei 10`
- `gastei 35 com embalagem`
- `cadastrar Coca lata custo 3 venda 6 estoque 20 minimo 5`
- `qual meu lucro líquido hoje?`
- `qual meu estoque atual?`

## Gates

Antes de apresentar:

```bash
npx prisma validate
npx prisma generate
npm run db:reset-demo
npm run db:reset-empty
npm run verify
npm run verify:e2e
git diff --check
```

Gates individuais:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
```

Gates P1 de apoio:

```bash
npm run test:coverage
npm run test:a11y
npm run performance:mobile
npm run analyze
gitleaks detect --redact --source .
npm audit
```

Notas:

- `npm run performance:mobile` usa SQLite temporario em `tests/e2e/.tmp/performance` e grava JSON em `test-results/lighthouse/`.
- `npm run analyze` usa Webpack por limitacao do bundle analyzer com Turbopack e grava HTML em `.next-analyze/analyze/`.
- `npm run test:a11y` usa Playwright + axe em config separada para manter o E2E funcional isolado.
- `npm audit` pode falhar por vulnerabilidades transitivas sem fix seguro; nao usar `npm audit fix --force` sem decisao explicita.

## IA Externa

Estado atual:

- preparada no backend;
- desligada por padrao;
- fallback rule-based continua funcionando sem chave;
- respostas precisam ser JSON estruturado validado com Zod;
- perguntas financeiras usam numeros calculados pelo backend.

Configuracao local privada:

```env
AI_ASSISTANT_ENABLED="true"
AI_PROVIDER="openai-compatible"
AI_BASE_URL="https://SEU_ENDPOINT_COMPATIVEL/v1"
AI_MODEL="SEU_MODELO"
AI_API_KEY="SUA_CHAVE_SERVER_SIDE"
AI_TIMEOUT_MS="12000"
```

Diagnostico seguro:

```bash
npm run ai:check-provider
```

Saidas esperadas:

- `status: "skipped"`: IA desligada ou configuracao incompleta.
- `status: "passed"`: smoke test minimo validado.
- `status: "failed"`: provider falhou; erro deve estar sanitizado.

O smoke test nao envia dados reais do banco.

## Auditoria de Conversas do Assistant

Para validar rapidamente contexto pendente, produto ambiguo e conversa humana sequencial:

```bash
npx vitest run tests/ai/product-disambiguation.test.ts tests/ai/parse-message.test.ts
```

O E2E privado de conversa humana fica fora do GitHub; rode-o apenas em ambiente local que tenha esse arquivo.

## Audio e BetKol CPU

Estado atual:

- audio oculto por padrao;
- `AUDIO_TRANSCRIPTION_PROVIDER=mock`;
- BetKol CPU real nao conectado;
- provider BetKol CPU existe como stub;
- diagnostico de contrato existe, mas precisa de comando real.

Diagnostico:

```bash
npm run audio:check-betkol
```

Sem `BETKOL_CPU_COMMAND`, o comando deve falhar de forma controlada informando que o comando nao esta configurado.

Para ligar STT real futuramente:

1. obter comando real do provider;
2. validar entrada/saida, timeout e limpeza de arquivo temporario;
3. garantir `needsReview=true`;
4. manter confirmacao manual antes de persistir;
5. criar testes e atualizar `docs/PROJECT_STATE.md`.

## Deploy Railway (Demo Remota com SQLite)

Deploy demonstrativo ativo em 2026-05-30.

- **Repositorio:** https://github.com/thiagocfaria/NEXT
- **URL publica:** https://next-production-d7d8.up.railway.app
- **Projeto Railway:** `appealing-gratitude` / servico `NEXT` / ambiente `production` / regiao `US West`
- **Builder:** Dockerfile com `node:24-bookworm-slim` (Nixpacks foi descartado — nao suportava nodejs_24)
- **Porta publica:** dominio Railway configurado para porta `8080`
- **Banco:** SQLite em volume `/data` como `nexis-demo.db`
- **IA:** Groq (llama-3.1-8b-instant) por texto, com fallback rule-based automatico

Para recriar o deploy do zero:

1. Acessar railway.app → "New Project" → "Deploy from GitHub repo".
2. Selecionar `thiagocfaria/NEXT` — Railway le `railway.json` e usa o `Dockerfile`.
3. Em **Settings → Variables**, adicionar as variaveis abaixo (sem valor real de AI_API_KEY no versionamento).
4. Em **Settings → Volumes**, criar volume montado em **`/data`** — obrigatorio para persistencia do SQLite.
5. Em **Settings → Networking**, gerar dominio publico e configurar para porta **`8080`**.
6. Aguardar redeploy automatico apos salvar variaveis.
7. Acessar a URL publica e validar no celular.

Variaveis configuradas no Railway (AI_API_KEY configurada via painel, sem versionar):

```env
DATABASE_URL=file:/data/nexis-demo.db
NEXT_PUBLIC_AUDIO_INPUT_ENABLED=false
AUDIO_TRANSCRIPTION_PROVIDER=mock
BETKOL_CPU_COMMAND=
BETKOL_CPU_TIMEOUT_MS=10000
AI_ASSISTANT_ENABLED=true
AI_ASSISTANT_REVIEW_PASS_ENABLED=false
AI_PROVIDER=openai-compatible
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.1-8b-instant
AI_API_KEY=<configurar_via_painel_railway>
AI_TIMEOUT_MS=15000
NIXPACKS_NODE_VERSION=24
```

Chave Groq gratuita: https://console.groq.com

Regras de seguranca:

- `AI_API_KEY` e server-side; nunca usar `NEXT_PUBLIC_AI_API_KEY`.
- `.env` e `.env.local` nao devem ser versionados.
- Volume `/data` contem o banco SQLite; nao expor publicamente.
- Se `AI_API_KEY` falhar ou estiver vazio, o assistant usa parser rule-based automaticamente.

Startup (automatico, via `npm run start:railway`):

1. `db:ensure-demo`: cria `/data` se necessario, aplica `prisma migrate deploy`, conta produtos.
2. Se banco vazio: carrega seed de 4 produtos, 4 compras, 3 vendas e 4 despesas ficticias.
3. Se banco nao vazio: ignora seed — dados existentes sao preservados.
4. `next start -H 0.0.0.0 -p $PORT`: inicia o servidor na porta injetada pelo Railway.

Validacao no celular apos deploy:

1. Abrir https://next-production-d7d8.up.railway.app no Chrome (Android) ou Safari (iOS).
2. No Android/Chrome: tocar em `Instalar app` ou `Adicionar a tela inicial`.
3. No iOS/Safari: `Compartilhar` → `Adicionar a Tela de Inicio`.
4. Abrir pelo icone NEXT e confirmar que abre sem barra do navegador (modo standalone).
5. Navegar por `/`, `/products`, `/sales`, `/purchases`, `/expenses`, `/assistant`.
6. Digitar no assistant: `quanto vendi hoje?` e `qual meu estoque atual?`.
7. Confirmar que rascunhos de venda/compra/despesa exigem botao de confirmacao.

Testar startup localmente (banco temporario):

```bash
DATABASE_URL=file:/tmp/nexis-test.db npm run db:ensure-demo
```

Build local:

```bash
npm run build
```

Producao real exige:

- Postgres/Supabase;
- autenticacao;
- separacao por usuario/empresa;
- backup/exportacao;
- logs sanitizados;
- politica de ambiente.

## Reset de Demo

```bash
npm run db:reset-demo
```

Esse comando e destrutivo e deve ser usado somente em desenvolvimento/demo local. Ele deve operar apenas em `file:./dev.db`.

Resultado esperado:

- recria o schema local;
- carrega produtos, compras, vendas, despesas e movimentos ficticios;
- deixa o dashboard pronto para apresentacao.

## Reset Vazio

```bash
npm run db:reset-empty
```

Esse comando e destrutivo e deve ser usado somente em desenvolvimento/demo local. Ele deve operar apenas em SQLite `file:` local, nao roda com `NODE_ENV=production` e nao toca em banco remoto.

Resultado esperado:

- recria o schema local;
- nao carrega seed;
- deixa `Product`, `Purchase`, `Sale`, `SaleItem`, `Expense` e `StockMovement` com 0 registros;
- deixa o dashboard zerado para teste manual matematico;
- permite abrir `/assistant` e fazer perguntas como `quanto vendi hoje?` sem erro.

## Laboratorio Conversacional Humano

As baterias privadas de corpus multi-negocio e conversas completas ficam fora do GitHub; rode-as apenas em ambiente local que tenha esses arquivos.

E2E de unidades comerciais com banco vazio:

```bash
npx playwright test tests/e2e/assistant-commercial-units.spec.ts
```

O laboratorio cobre:

- espetinho;
- areia fina/grossa;
- cimento com valor total ambiguo;
- kg/gramas, litro/ml, metro/m2/m3, caixa/saco/fardo/pacote/duzia;
- produto sensivel ficticio;
- servico sem estoque;
- agua ambigua;
- multiplas acoes.

Esses testes devem passar com `AI_ASSISTANT_ENABLED=false`.

Fluxo manual minimo para validar unidade por kg:

1. rodar `npm run db:reset-empty`;
2. abrir `/assistant`;
3. enviar `eu comprei hoje 2 kg de macan a 25,50 o kg`;
4. confirmar que o assistant nao pede produto, quantidade nem custo, e pergunta preco de venda por kg;
5. enviar `vendo por 35 o kg`;
6. confirmar pergunta de estoque minimo em kg;
7. enviar `mínimo 1 kg`;
8. confirmar rascunho com produto `Macan`, unidade `Kg`, custo R$ 25,50, preco R$ 35,00, estoque inicial 2 e minimo 1;
9. validar que nada foi salvo antes do botao `Salvar produto`.

Fluxo manual minimo para validar cadastro e venda por grama:

1. rodar `npm run db:reset-empty`;
2. abrir `/assistant`;
3. enviar `cadastre tempero unidade grama custo 0,04 venda 0,08 estoque 500 mínimo 100`;
4. confirmar rascunho com produto `Tempero`, unidade `Grama`, custo R$ 0,04, preco R$ 0,08, estoque 500 e minimo 100;
5. clicar `Salvar produto`;
6. enviar `vendi 125 gramas de tempero`;
7. confirmar rascunho de venda;
8. clicar `Confirmar venda`;
9. validar que o estoque do produto cai de 500 para 375.
