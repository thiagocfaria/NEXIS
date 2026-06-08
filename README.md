# NEXT — NEXIS

NEXIS e um gestor financeiro mobile-first com IA assistida para microempreendedores e pequenos comerciantes. O foco do MVP e registrar produtos, compras, vendas, estoque, despesas e lucro com linguagem simples, sem depender de planilhas ou ERP complexo.

**Repositorio:** https://github.com/thiagocfaria/NEXT

**Demo remota (Railway):** https://next-production-d7d8.up.railway.app

A demo remota esta ativa, acessivel por link publico e pode ser instalada como PWA pelo Chrome. Nao e producao real: sem autenticacao, sem multiempresa e sem backup. Use somente dados ficticios.

Estado atual em 2026-05-30: deploy demonstrativo Railway funcionando com SQLite em volume `/data`, IA externa Groq por texto e PWA instalavel. O assistant ja cobre cadastro, compra, venda, despesa, perda, cancelamento rastreavel, perguntas financeiras, embalagem comercial, kg/grama/litro, ambiguidade e confirmacao por botao em testes automatizados. Ele ainda nao esta pronto para producao real com usuarios finais porque faltam banco persistente de producao, autenticacao, multiempresa, correcao granular, servicos sem estoque, pro-labore, despesas fixas mensais, fluxo de caixa projetado seguro e voz/STT real.

## Rodar Localmente

```bash
npm install
cp .env.example .env
npm run db:reset-demo
npm run dev
```

Abra `http://localhost:3000`.

`npm run db:reset-demo` recria dados ficticios para apresentacao. Para teste manual matematico do zero, use `npm run db:reset-empty` antes de `npm run dev`; ele deixa produtos, compras, vendas, despesas e movimentos de estoque vazios no SQLite local.

Para testar no celular na mesma rede:

```bash
npm run dev -- --hostname 0.0.0.0
```

Depois abra no celular `http://IP_DO_SEU_COMPUTADOR:3000`. O celular e o computador precisam estar na mesma rede Wi-Fi.

Para testar no celular em modo producao local:

```bash
npm run build
npx next start --hostname 0.0.0.0 --port 3000
```

## Demo Mobile e PWA

O NEXIS tem manifest PWA, icones em `public/icons/`, `theme_color`, `display=standalone` e metadata mobile no App Router. Para instalar/adicionar a tela inicial:

1. Rode o app com `--hostname 0.0.0.0`.
2. Abra a URL pelo navegador do celular.
3. No Android/Chrome, use `Instalar app` ou `Adicionar a tela inicial`.
4. No iPhone/Safari, use `Compartilhar` e depois `Adicionar a Tela de Inicio`.
5. Abra pelo icone `NEXIS` e confirme que ele inicia em modo de app, sem depender de tela desktop.

## Deploy Railway (Demo Remota)

O Railway roda o NEXIS como container Docker com Node 24 e SQLite persistente em volume `/data`.

- **Repositorio:** https://github.com/thiagocfaria/NEXT
- **URL publica:** https://next-production-d7d8.up.railway.app
- **Projeto Railway:** `appealing-gratitude` / servico `NEXT` / ambiente `production` / regiao `US West`
- **Status:** deploy ativo e funcionando em 2026-05-30

Para recriar o deploy (caso necessario):

1. Criar novo projeto Railway → "Deploy from GitHub repo" → selecionar `thiagocfaria/NEXT`.
2. Railway detecta `railway.json` e usa o `Dockerfile` com `node:24-bookworm-slim`.
3. Em **Settings → Variables**, adicionar as variaveis abaixo.
4. Em **Settings → Volumes**, criar volume montado em **`/data`** (obrigatorio para persistencia).
5. Em **Settings → Networking**, configurar dominio publico apontando para porta **`8080`**.
6. Aguardar o redeploy automatico.
7. Acessar a URL publica e instalar como PWA no celular.

Variaveis obrigatorias no Railway:

```
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
AI_API_KEY=<sua_chave_groq>
AI_TIMEOUT_MS=15000
```

`AI_API_KEY` e server-side e nunca deve ser `NEXT_PUBLIC`. Se a chave falhar, o app continua com o parser rule-based.

Comportamento do startup:

- `npm run start:railway` roda `db:ensure-demo` antes de iniciar o Next.js.
- `db:ensure-demo` aplica migrations (`prisma migrate deploy`) e carrega seed somente se o banco estiver vazio.
- Reinicializacoes nao apagam dados — o seed e ignorado se ja houver produtos.

Limites da demo:

- Nao e producao real: falta autenticacao, multiempresa e backup.
- SQLite em volume Railway e adequado para demo; para producao real migrar para Postgres/Supabase.
- Dados ficticios sao carregados automaticamente no primeiro boot.

Preview na Vercel (alternativa sem SQLite persistente):

1. Crie/importa o projeto como `Next.js`.
2. Use build command `npm run build`.
3. Mantenha `AI_ASSISTANT_ENABLED=false` e nao configure chave real em preview publico.
4. Use o preview para validar UI/PWA; SQLite nao e persistente em Vercel serverless.
5. Para producao real, migrar para Postgres/Supabase, auth e separacao por usuario/empresa.

## Comandos

```bash
npx prisma validate
npx prisma generate
npm run db:reset-demo
npm run db:reset-empty
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
npm run verify
npm run verify:e2e
npm run ai:check-provider
npm run audio:check-betkol
```

`npm run verify` roda lint, typecheck, testes unitarios e build. `npm run verify:e2e` roda Playwright mobile com SQLite temporario.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma 7
- SQLite local no MVP demonstravel
- Zod
- Vitest
- Playwright
- IA externa server-side preparada, desativada por padrao
- Audio/STT experimental por flag, com mock por padrao
- PWA basico com manifest e icones locais

## O Que Funciona Hoje

- Dashboard com dados reais do SQLite.
- Cadastro manual de produtos fisicos.
- Compra manual de produto existente, aumentando estoque, inclusive por embalagem com conversao para unidade vendida.
- Venda manual de produto existente, baixando estoque.
- Despesa manual confirmada ou pendente.
- Motor financeiro deterministico para faturamento, custo, lucro bruto, despesas confirmadas, lucro liquido e estoque baixo.
- Chat texto em `/assistant` para perguntas financeiras, estoque, compras, produtos mais vendidos e rascunhos de venda, compra e despesa.
- Cadastro de produto por texto no assistant com formulario revisavel, campos faltantes e confirmacao explicita.
- Cadastro de produto vindo de compra por texto salva a primeira entrada como compra real no historico.
- Perda de estoque e cancelamento rastreavel por texto com confirmacao explicita.
- Manifest PWA basico, icone NEXIS e layout mobile sem scroll horizontal nas rotas principais.
- Confirmacao explicita antes de salvar rascunho critico vindo do assistant.
- Seed demo ficticia e E2E mobile com banco temporario.
- Camada de IA externa validada por contrato JSON/Zod, mas desligada por padrao.
- Ponte de audio curta isolada por flag; sem STT real conectado.

## O Que Ainda Nao Funciona

- Fluxo de caixa projetado seguro.
- Pro-labore, despesas fixas mensais e metas de margem/lucro.
- Receita de servico sem estoque.
- Correcao granular/edicao assistida alem do cancelamento rastreavel atual.
- Voz real preenchendo rascunhos.
- Persistencia de producao em Postgres/Supabase.
- Autenticacao, multiempresa, backup e deploy operacional.

## Regras Financeiras

A IA nao e fonte de verdade financeira.

```text
faturamento = soma das vendas confirmadas
custo_das_vendas = quantidade_vendida * custo_unitario_snapshot
lucro_bruto = faturamento - custo_das_vendas
lucro_liquido = lucro_bruto - despesas_confirmadas
estoque = estoque anterior + compras - vendas +/- ajustes confirmados
```

Produto fisico tem estoque. Servico sem estoque ainda nao tem fluxo persistente. Perda/quebra e cancelamento usam rascunho, confirmacao por botao e rastreabilidade.

As regras que nao podem ser quebradas ficam em `REGRAS_INVARIANTES.md`. Leia esse arquivo antes de mudar IA, parser, banco, validacao, assistant, testes ou fluxo financeiro.

## Demo Recomendada no Celular

1. Rode `npm run db:reset-demo`.
2. Rode `npm run dev -- --hostname 0.0.0.0`.
3. Abra o NEXIS no celular pelo IP do computador.
4. Adicione a tela inicial e abra pelo icone, se quiser demonstrar o PWA.
5. Mostre o dashboard, vendas, lucro, despesas e produtos acabando.
6. Digite no assistant `cadastrar Coca lata custo 3 venda 6 estoque 20 minimo 5`.
7. Mostre o formulario de revisao e salve apenas pelo botao `Salvar produto`.
8. Registre compra, venda e despesa.
9. Pergunte `qual meu lucro líquido hoje?`.
10. Pergunte `qual meu estoque atual?`.
11. Mostre que venda, compra, despesa e produto so salvam apos confirmacao por botao.

Use somente dados ficticios. Nunca exponha `.env`, chaves, tokens ou dados reais de cliente.

## Teste Manual Limpo

Para testar as contas do zero:

```bash
npm run db:reset-empty
npm run dev
```

Esse reset e destrutivo e opera somente no SQLite local/demo. Depois dele o dashboard deve abrir zerado e o assistant deve responder perguntas financeiras com R$ 0,00 ou mensagem segura quando nao houver produto cadastrado.

## Documentacao Canonica

- `REGRAS_INVARIANTES.md`: regras que nao podem ser quebradas.
- `AGENTS.md`: leitura obrigatoria e limites para agentes/skills.
- `docs/PROJECT_STATE.md`: fonte de verdade do estado atual.
- `docs/ARCHITECTURE_TREE.md`: arquitetura, arquivos centrais e limites.
- `docs/AI_OPERATING_RULES.md`: regras obrigatorias de IA, voz e confirmacao.
- `private assistant corpus (not versioned)`: corpus de frases para parser, dialogo e E2E do assistant.
- `docs/ACCEPTANCE_CRITERIA.md`: criterio de aceite do MVP atual e do MVP operacional.
- `docs/ROADMAP.md`: etapas de correcao e evolucao para MVP funcional real.
- `docs/RUNBOOK.md`: demo, ambiente, deploy/preview, IA externa e diagnosticos.

## Proxima Prioridade

Seguir `docs/ROADMAP.md`, nesta ordem:

1. Implementar pro-labore, despesas fixas mensais e metas.
2. Implementar servicos, perdas, cancelamento/correcao e voz real.
3. Implementar fluxo de caixa projetado seguro.
