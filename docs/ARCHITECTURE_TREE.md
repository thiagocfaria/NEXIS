# Arquitetura Atual do NEXIS

Ultima atualizacao: 2026-05-28

## Visao Geral

O NEXIS e uma aplicacao Next.js App Router com paginas mobile-first, PWA basico, Server Actions, Prisma/SQLite local, motor financeiro deterministico, assistant por texto e testes unitarios/E2E.

Arquitetura atual:

```text
REGRAS_INVARIANTES.md     regras que agentes, skills, IA, parser, banco e UX critica nao podem quebrar
app/                      rotas, paginas e Server Actions
components/               UI mobile-first
lib/ai/                   parser, intents, respostas e provider externo seguro
lib/audio/                contrato de transcricao, mock e BetKol CPU stub
lib/dashboard/            periodos e resumo do dashboard
lib/db/                   Prisma Client singleton
lib/finance/              regras financeiras puras
lib/products/             regras compartilhadas de persistencia de produto
lib/reports/              carregadores deterministicos para perguntas do assistant
lib/validation/           schemas Zod de entrada e rascunhos
prisma/                   schema, migrations e seed
public/icons/             icones PWA temporarios do NEXIS
scripts/                  diagnosticos e reset de demo
tests/                    unitarios, validacao, audio, IA e E2E mobile
docs/                     documentacao canonica
```

## Rotas

- `app/manifest.ts`: manifest PWA do NEXIS em `/manifest.webmanifest`.
- `/`: dashboard dinamico com dados reais do SQLite.
- `/products`: cadastro, edicao, ativacao e desativacao de produtos.
- `/purchases`: compras/entradas de estoque de produto existente.
- `/sales`: vendas de produto existente com baixa de estoque.
- `/expenses`: despesas confirmadas ou pendentes.
- `/assistant`: chat texto mobile-first para perguntas e rascunhos, com historico rolavel interno e composer no rodape.
- `/api/audio/transcribe`: rota experimental de transcricao curta, isolada por flag.

## Arquivos Centrais

Produto e estoque:

- `prisma/schema.prisma`
- `app/products/actions.ts`
- `components/products/product-form.tsx`
- `lib/products/create-product.ts`
- `lib/validation/product.ts`
- `lib/finance/stock.ts`
- `tests/validation/product.test.ts`
- `tests/finance/stock.test.ts`

Compra:

- `app/purchases/actions.ts`
- `components/transactions/purchase-form.tsx`
- `lib/validation/purchase.ts`
- `lib/finance/transactions.ts`
- `tests/validation/purchase.test.ts`
- `tests/finance/transactions.test.ts`

Venda:

- `app/sales/actions.ts`
- `components/transactions/sale-form.tsx`
- `lib/validation/sale.ts`
- `lib/finance/sales.ts`
- `lib/finance/transactions.ts`
- `tests/validation/sale.test.ts`
- `tests/finance/sales.test.ts`

Despesa:

- `app/expenses/actions.ts`
- `components/transactions/expense-form.tsx`
- `lib/validation/expense.ts`
- `lib/finance/profit.ts`
- `tests/validation/expense.test.ts`
- `tests/finance/profit.test.ts`

Dashboard e relatorios:

- `app/page.tsx`
- `lib/dashboard/summary.ts`
- `lib/dashboard/periods.ts`
- `lib/finance/reports.ts`
- `lib/reports/assistant-question.ts`
- `components/dashboard/summary-card.tsx`
- `components/dashboard/low-stock-list.tsx`
- `tests/dashboard-summary.test.ts`
- `tests/finance/reports.test.ts`

Assistant/IA:

- `app/assistant/actions.ts`
- `components/assistant/chat-thread.tsx`
- `components/assistant/message-input.tsx`
- `components/assistant/draft-confirmation.tsx`
- `components/assistant/answer-card.tsx`
- `lib/ai/parse-message.ts`
- `lib/ai/conversation-engine.ts`
- `private assistant operational notes (not versioned)`
- `private assistant corpus (not versioned)`
- `lib/ai/intent-schema.ts`
- `lib/ai/answer-question.ts`
- `lib/ai/external-assistant.ts`
- `lib/ai/nexis-system-prompt.ts`
- `lib/products/create-product.ts`
- `lib/validation/assistant-draft.ts`
- `tests/ai/parse-message.test.ts`
- `private assistant business scenario tests (not versioned)`
- `tests/ai/answer-question.test.ts`
- `tests/ai/external-assistant.test.ts`
- `tests/validation/assistant-draft.test.ts`
- `private assistant required scenarios E2E (not versioned)`

Audio/STT:

- `app/api/audio/transcribe/route.ts`
- `components/assistant/audio-recorder.tsx`
- `lib/audio/transcribe.ts`
- `lib/audio/types.ts`
- `lib/audio/providers/betkol-cpu-provider.ts`
- `scripts/audio/check-betkol-contract.mjs`
- `tests/audio/transcribe.test.ts`
- `tests/audio/betkol-cpu-provider.test.ts`

Demo e qualidade:

- `app/manifest.ts`
- `app/layout.tsx`
- `app/globals.css`
- `public/icons/nexis-icon.svg`
- `public/icons/nexis-maskable.svg`
- `prisma/demo-seed-data.mjs`
- `prisma/seed.mjs`
- `scripts/db/reset-demo.mjs`
- `tests/e2e/full-flow.spec.ts`
- `tests/e2e/text-only-demo.spec.ts`
- `tests/e2e/mobile-smoke.spec.ts`

## Modelo Prisma Atual

Entidades:

- `Product`: produto fisico com nome, categoria opcional, unidade, custo atual, preco de venda, estoque atual, estoque minimo, status e timestamps.
- `Purchase`: compra de produto, quantidade, custo unitario, custo total, fornecedor opcional e data.
- `Sale`: venda confirmada com total e data.
- `SaleItem`: item de venda com produto, quantidade, preco usado, snapshot de custo, total da venda e total de custo.
- `Expense`: despesa com descricao, categoria, valor, data e `confirmed`.
- `StockMovement`: historico de compra, venda ou ajuste de estoque.

Enums:

- `ProductUnit`: `UNIT`, `KG`, `GRAM`, `LITER`, `METER`, `SQUARE_METER`, `CUBIC_METER`, `BOX`, `SACK`, `BALE`, `PACKAGE`, `DOZEN`.
- `ExpenseCategory`: categorias genericas, incluindo `MERCHANDISE_SUPPLIES`, `RENT`, `UTILITIES`, `TRANSPORT_LOGISTICS`, `PACKAGING_MATERIAL`, `MAINTENANCE`, `TAXES_FEES`, `LABOR`, `MARKETING`, `LOSS_WASTE`, `OTHER` e valores legados.
- `StockMovementType`: `PURCHASE`, `SALE`, `ADJUSTMENT`.

Nao existem ainda modelos para:

- servico sem estoque;
- perda/quebra persistente propria;
- pro-labore;
- despesa fixa recorrente;
- meta mensal;
- cancelamento/estorno;
- usuario/empresa/autenticacao;
- snapshot financeiro diario persistido.

## Fluxos de Persistencia

Produto:

- criado/alterado via Server Action;
- validado com Zod;
- criacao manual e via assistant usam `lib/products/create-product.ts`;
- duplicado por nome normalizado e bloqueado antes de criar outro produto;
- estoque inicial gera `StockMovement ADJUSTMENT`;
- desativacao usa `active=false`, sem exclusao fisica.

Compra:

- exige produto ativo;
- valida quantidade e custo;
- cria `Purchase`;
- aumenta `Product.currentStock`;
- atualiza `Product.unitCostCents`;
- cria `StockMovement PURCHASE`;
- executa em transacao Prisma.

Venda:

- exige produto ativo e estoque suficiente;
- usa preco informado ou preco cadastrado;
- grava `unitCostSnapshotCents`;
- cria `Sale` e `SaleItem`;
- reduz `Product.currentStock`;
- cria `StockMovement SALE`;
- executa em transacao Prisma.

Despesa:

- valida descricao, categoria, valor, data e confirmacao;
- cria `Expense`;
- entra no lucro liquido somente quando `confirmed=true`.

Assistant:

- interpreta texto;
- usa `lib/ai/conversation-engine.ts` para normalizacao, classificacao de intencao, extracao de entidades, resolucao de produto e planejamento de proxima pergunta;
- perguntas usam `getAssistantQuestionContext()`, `getDashboardSummary()` e `answerQuestionFromContext()`;
- carregadores do assistant consultam `Product.currentStock`, `Purchase` e `SaleItem` para estoque, compras e produtos mais vendidos;
- venda/compra/despesa/produto viram rascunho validado;
- cadastro de produto incompleto pede campos faltantes sem inventar valores;
- contexto pendente e abandonado quando a proxima frase for uma nova acao clara, sem consumir despesa/venda/compra como resposta de campo faltante;
- persistencia ocorre apenas por botao de confirmacao;
- confirmacao revalida rascunho no servidor.
- UI do chat mantem historico local em memoria, rolagem interna em `assistant-message-list` e composer fixo/sticky no rodape visual, sem persistir conversa no banco.

## Limites de Arquitetura

- Calculos financeiros nunca dependem da IA.
- Prompt nao e fonte de verdade.
- Audio nao confirma lancamento.
- IA externa fica server-side e desligada por padrao.
- SQLite e apenas desenvolvimento/demo local.
- PWA atual e demonstrativo; persistencia real em Vercel exige banco persistente fora do filesystem local.
- Telegram/n8n sao historicos e nao fazem parte da interface principal.
- Nao ha producao real sem Postgres/Supabase, auth, multiempresa e backup.
