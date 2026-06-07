# Estado do Projeto NEXIS

Ultima atualizacao: 2026-05-29

Este documento e a fonte de verdade curta do projeto. Regras invariantes ficam em `REGRAS_INVARIANTES.md`. Planos historicos, auditorias intermediarias e roteiros antigos foram consolidados em `docs/ROADMAP.md`, `docs/RUNBOOK.md`, `docs/ARCHITECTURE_TREE.md`, `docs/AI_OPERATING_RULES.md` e `docs/ACCEPTANCE_CRITERIA.md`.

## Resumo Executivo

O NEXIS e um app Next.js mobile-first para gestao financeira simples de microempreendedores. O sistema atual esta demonstravel localmente em modo texto-only e PWA basico com dados ficticios, Prisma/SQLite, dashboard dinamico, produtos, compras, vendas, despesas, perda de estoque, cancelamento rastreavel, motor financeiro deterministico e assistant por texto com perguntas financeiras ampliadas, conversa com intencao parcial, rascunho/confirmacao.

Nao esta pronto para producao real. Ainda faltam banco persistente de producao, autenticacao, multiempresa, backup, correcao granular/edicao assistida, pro-labore, despesas fixas mensais, metas, servicos sem estoque, fluxo de caixa projetado seguro e voz/STT real.

## Estado Atual Verificado no Codigo

- App Next.js App Router na raiz.
- `REGRAS_INVARIANTES.md` na raiz define o que agentes, skills, IA, parser, banco e UX critica nao podem quebrar.
- Prisma com SQLite local.
- Modelos atuais: `Product`, `ProductAlias`, `Purchase`, `Sale`, `SaleItem`, `Expense`, `StockLoss`, `CancellationEvent`, `StockMovement`.
- Enums atuais: `ProductUnit`, `ExpenseCategory`, `StockMovementType`, `EntryOrigin`, `ProductAliasSource`, `CancellationTargetType`.
- Motor financeiro puro em `lib/finance/`.
- Dashboard real em `lib/dashboard/summary.ts` e `app/page.tsx`.
- Produtos manuais em `/products`.
- Compras manuais em `/purchases`.
- Vendas manuais em `/sales`.
- Despesas manuais em `/expenses`.
- Assistant texto em `/assistant`.
- Interface do assistant em `/assistant` com layout de chat mobile-first: header compacto, historico rolavel interno e composer no rodape.
- Motor conversacional v2 em `lib/ai/conversation-engine.ts`, com normalizacao, classificacao de intencao, extracao de entidades, resolucao de produto e planejamento de proxima pergunta.
- Parser rule-based em `lib/ai/parse-message.ts`.
- Respostas financeiras em `lib/ai/answer-question.ts`, usando `getAssistantQuestionContext()` e `getDashboardSummary()`.
- Carregadores deterministicos do assistant em `lib/reports/assistant-question.ts`.
- Persistencia compartilhada de produto em `lib/products/create-product.ts`.
- IA externa server-side preparada em `lib/ai/external-assistant.ts`, desligada por padrao.
- Audio curto experimental por flag em `components/assistant/audio-recorder.tsx` e `app/api/audio/transcribe/route.ts`.
- Provider BetKol CPU existe apenas como stub/diagnostico; STT real nao esta conectado.
- Seed demo ficticia em `prisma/demo-seed-data.mjs`.
- Reset vazio local em `scripts/db/reset-empty.mjs` para teste manual limpo sem seed.
- Playwright E2E mobile com SQLite temporario em `tests/e2e/`.
- Rotas principais agora tem feedback de carregamento via `loading.tsx`.
- PWA basico em `app/manifest.ts`, metadata mobile em `app/layout.tsx` e icones em `public/icons/`.
- Rotas principais auditadas em viewport mobile sem scroll horizontal indevido.

## Funcionalidades Atuais

Funciona:

- cadastrar, editar, ativar e desativar produto fisico; edicao de cadastro nao altera estoque diretamente;
- cadastrar produto manualmente com entrada por embalagem, convertendo caixa/fardo/pacote com unidades internas para estoque e custo unitario da unidade vendida;
- registrar compra de produto existente por quantidade unitaria ou por embalagem, convertendo para quantidade/custo da unidade vendida;
- registrar venda de produto existente;
- registrar despesa confirmada ou pendente;
- atualizar estoque em compra/venda;
- gravar snapshot de custo no item de venda;
- calcular faturamento, custo das vendas, lucro bruto, despesas confirmadas, lucro liquido e estoque baixo;
- responder perguntas por texto: vendas, lucro bruto, lucro liquido, despesas, estoque atual, compras, produtos mais vendidos, resumo financeiro e produtos acabando;
- gerar rascunho por texto para venda, compra e despesa;
- abrir `/products` com cadastro de produto pre-preenchido a partir de texto, mantendo campos faltantes em branco para revisao;
- gerar rascunho por texto para perda/quebra/desperdicio de estoque, baixando somente apos confirmacao;
- gerar rascunho por texto para cancelamento/estorno/correcao de venda, compra ou despesa, registrando evento rastreavel em vez de apagar dado;
- pedir mais detalhe quando mais de uma venda, compra ou despesa parecida pode ser cancelada, sem escolher o alvo sozinho;
- responder conversa social simples sem gerar rascunho nem relatorio;
- priorizar acoes de cadastro/compra/venda/despesa antes de relatorios quando a frase contem verbos como `cadastrar`, `lancar`, `comprei`, `vendi` ou `gastei`;
- preservar variantes de produto em linguagem natural, como `refrigerante lata 350 ml`, `Agua 500ml` e `queijo mussarela kg`;
- converter frases como `comprei 2 caixas de refrigerante com 12 unidades cada a 36 a caixa`, `fardo com 6 aguas de 500 ml por 18 reais`, `bandeja com 30 ovos por 24 reais` e `cartela com 12 doces por 30 reais` para produto vendido por unidade, com custo unitario calculado;
- interpretar cadastros humanos com produto antes da compra, como `cadastra coca lata 350 ml, comprei uma caixa com 12 unidades por 37 reais`, preservando o nome do produto e calculando estoque/custo por codigo;
- interpretar caixa, fardo, pacote, bandeja e cartela por regras genericas de embalagem, incluindo valor por embalagem, valor total da compra e quantidade de embalagens;
- manter medidas como `350 ml` e `500 ml` como caracteristica do nome quando o produto e vendido por unidade;
- preencher cadastro de produto por kg, grama e litro em frases naturais, convertendo gramas para kg quando a base de venda informada for por kg;
- perguntar quando `pacote` pode ser produto vendido ou embalagem operacional, sem escolher sozinho;
- converter custo por embalagem para custo unitario pela formula `preco da embalagem / unidades de venda`, arredondando para duas casas decimais quando a divisao nao fecha em centavos exatos;
- converter venda em gramas para produto cadastrado em kg, por exemplo `vendi 500 gramas de maca` baixa 0,5 kg;
- preservar variantes de produto em frases mais soltas, sem expandir marca por hardcode;
- reconhecer intencao parcial de compra/entrada de estoque em frases naturais como `coloca 5 refrigerantes que eu comprei no estoque`;
- extrair custo unitario de entrada de estoque quando o usuario diz `cada`, `cada uma`, `cada unidade`, `por unidade`, `paguei X em cada`, `X em cada`, `a X reais` ou `por X a unidade`;
- perguntar se o valor e total ou unitario quando uma compra como `comprei 5 refrigerantes por 20 reais` for ambigua;
- pedir desambiguacao quando a venda/compra cita um produto que bate com varios cadastros parecidos;
- aceitar resposta de desambiguacao por numero, ordinal simples ou trecho/volume, como `1`, `a 1`, `opcao 2`, `a de 600`, `coca lata`, `primeira` e `a de 2 litros`;
- manter no `pendingContext` as opcoes de produto ambiguo com `id` e nome, tratando a proxima mensagem como escolha antes de nova classificacao;
- continuar venda/compra ambigua com o produto escolhido por `id`, sem reabrir busca aproximada que possa repetir a mesma ambiguidade;
- pedir numero quando a resposta textual ainda nao for segura, como `a lata` entre `Coca Cola lata` e `Coca Cola lata 350 ml`;
- testar conversas humanas sequenciais em `tests/e2e/assistant-human-conversation.spec.ts`;
- manter contexto curto no assistant para perguntar custo unitario, preco de venda e estoque minimo antes de montar rascunho;
- bloquear frases com multiplas acoes misturadas, como `comprei coca, vendi agua e gastei 10`, pedindo uma acao por vez;
- classificar confidence simples (`HIGH`, `MEDIUM`, `LOW`) para orientar rascunho, pergunta de campo faltante ou modo seguro;
- manter conversa em historico visual com bolhas de usuario, respostas do NEXIS, pending, erros e cards de rascunho dentro da lista rolavel;
- abrir a tela de cadastro quando o produto por texto estiver incompleto, preenchendo o que foi entendido e deixando campos faltantes em branco;
- salvar a primeira entrada de estoque vinda de compra/cadastro por texto como `Purchase` e movimento `PURCHASE`, em vez de ajuste generico de estoque inicial;
- manter contexto curto de cadastro incompleto e completar rascunho somente quando a proxima mensagem trouxer campos faltantes, como custo, venda, estoque e minimo;
- tratar `sim`, `pode salvar` e confirmacoes soltas como insuficientes para persistir produto ou completar rascunho;
- tratar uma nova acao reconhecida apos pergunta pendente de produto/compra como nova mensagem, em vez de forcar como resposta ao contexto antigo;
- registrar perda confirmada como `StockLoss`, movimento `LOSS` e despesa confirmada `LOSS_WASTE`, sem aumentar faturamento;
- cancelar venda confirmada criando `CancellationEvent`, movimento `REVERSAL`, restaurando estoque e excluindo a venda cancelada dos relatorios deterministicos;
- cancelar compra confirmada criando `CancellationEvent`, movimento `REVERSAL`, removendo estoque apenas se houver saldo suficiente e excluindo a compra cancelada dos relatorios;
- cancelar despesa confirmada criando `CancellationEvent` e excluindo a despesa cancelada do lucro liquido;
- bloquear produto duplicado por nome normalizado no rascunho e na confirmacao;
- salvar produto e rascunhos criticos somente apos botao de confirmacao;
- bloquear produto inexistente/ambiguo, estoque insuficiente, valores zerados/invalidos e comandos destrutivos sem fluxo seguro.
- mostrar loading acessivel ao navegar para rotas dinamicas principais;
- limitar listas iniciais de produtos, vendas, compras e despesas.
- abrir como demo mobile instalavel/PWA basico com manifest, icone, `theme_color` e `display=standalone`;
- manter `/`, `/products`, `/sales`, `/purchases`, `/expenses` e `/assistant` dentro da largura mobile.
- usar `npm run db:reset-demo` para demo populada e `npm run db:reset-empty` para banco local vazio de teste manual.

Parcial:

- IA externa: infraestrutura existe, mas fica desligada por padrao e so pode retornar JSON validado; nao ha chave real versionada.
- Audio: UI/rota/provider mock existem por flag; STT real nao esta ligado.
- Relatorios: dashboard e assistant cobrem indicadores centrais, estoque atual, compras por periodo, produtos mais vendidos e resumo diario; fluxo de caixa projetado ainda responde como consulta nao implementada com seguranca.
- Perda/cancelamento por assistant: implementados para texto com rascunho, botao, Zod, Prisma e eventos rastreaveis; ainda nao ha tela manual dedicada de historico/correcao avancada.

Nao implementado:

- fluxo de caixa projetado;
- servico sem estoque;
- pro-labore;
- despesas fixas mensais planejadas;
- metas de margem/lucro;
- ponto de equilibrio;
- correcao granular/edicao assistida;
- multiempresa;
- autenticacao;
- banco Postgres/Supabase;
- backup/exportacao;
- TTS;
- voz real em producao.

## Fonte de Verdade Financeira

Calculos financeiros ficam em codigo deterministico, nao em prompt:

- `lib/finance/money.ts`
- `lib/finance/sales.ts`
- `lib/finance/stock.ts`
- `lib/finance/profit.ts`
- `lib/finance/reports.ts`
- `lib/finance/transactions.ts`

Regras atuais:

- `faturamento = soma das vendas confirmadas`;
- `custo_das_vendas = quantidade_vendida * unitCostSnapshotCents`;
- `lucro_bruto = faturamento - custo_das_vendas`;
- `lucro_liquido = lucro_bruto - despesas_confirmadas`;
- compra aumenta estoque;
- venda reduz estoque;
- primeira entrada de estoque interpretada como compra cria registro em `Purchase` e movimento `PURCHASE`;
- embalagem com unidades internas e convertida antes de persistir, mantendo estoque/custo na unidade de venda base;
- custo unitario calculado por embalagem usa arredondamento deterministico em centavos: `preco da embalagem / unidades de venda`, arredondado para duas casas decimais;
- KG e GRAM sao convertidos deterministicamente quando a venda/compra usa unidade compativel com a unidade cadastrada do produto;
- venda bloqueia estoque insuficiente;
- despesa pendente nao entra no lucro liquido;
- produto abaixo do estoque minimo aparece como estoque baixo.

## IA e Persistencia

O assistant pode:

- interpretar texto;
- normalizar caixa, acentos, plural simples, dinheiro, numeros e unidades comuns antes de classificar a intencao;
- separar intencoes `social`, `dangerous`, `product_registration`, `purchase_entry`, `sale_exit`, `expense`, `financial_question` e `unknown`;
- detectar multiplas acoes e recusar execucao combinada;
- atribuir confidence simples para a interpretacao conversacional;
- responder perguntas simples com dados reais do dashboard;
- responder perguntas de estoque, compras e produtos mais vendidos com dados reais do banco;
- gerar rascunhos de venda, compra e despesa;
- abrir cadastro de produto pre-preenchido em `/products` quando o texto indicar produto novo ou entrada de produto ainda inexistente;
- marcar cadastro pre-preenchido vindo de compra para que o estoque inicial entre no historico de compras;
- gerar rascunhos de perda de estoque e cancelamento rastreavel;
- converter embalagem com unidades internas para unidade base antes de preencher cadastro de produto ou montar rascunho de compra;
- interpretar embalagem operacional por padroes gerais, sem regra por marca/produto/frase literal;
- preservar `ml` como variante textual quando a unidade operacional e unidade, e usar kg/litro como unidade operacional quando a frase informa compra/venda por medida;
- converter venda em gramas para estoque cadastrado em kg antes de montar rascunho de venda;
- reconhecer intencao parcial e pedir campos faltantes em conversa curta quando a acao nao puder ir para formulario seguro;
- preencher somente os campos entendidos no cadastro de produto por texto, sem inventar valores;
- abandonar contexto pendente quando a proxima mensagem for uma nova acao clara, como despesa apos pergunta de preco de venda de produto novo;
- pedir correcao quando produto nao existe ou esta ambiguo;
- bloquear comandos destrutivos sem fluxo seguro antes de classificar como pergunta financeira;
- usar IA externa server-side quando explicitamente habilitada, com fallback seguro.
- receber da IA externa opcional `entities`, `missingFields`, `ambiguity`, `nextQuestion` e `draftCandidate`, sempre revalidando no servidor.
- rejeitar sugestao de IA externa quando ela trocar produto, unidade comercial, quantidade ou valor que o parser deterministico extraiu com seguranca.

O assistant nao pode:

- calcular lucro como fonte de verdade;
- salvar sem botao de confirmacao;
- inventar produto inexistente;
- criar produto duplicado silenciosamente;
- registrar receita de servico;
- apagar dados ou corrigir lancamento silenciosamente;
- assumir audio como confirmacao.

## Banco Atual

Persistencia atual:

- SQLite local para desenvolvimento e demo.
- Migration inicial em `prisma/migrations/20260522211659_init/`.
- Migration `prisma/migrations/20260528233000_stock_loss_cancellation/` adiciona `StockLoss`, `CancellationEvent`, `LOSS`, `REVERSAL` e campos `cancelledAt`/`cancellationReason`.
- `npm run db:reset-demo` aplica migrations e carrega dados ficticios de apresentacao.
- `npm run db:reset-empty` remove o SQLite local validado, reaplica migrations e nao carrega seed.
- `.env.example` contem apenas placeholders.
- `.env`, `.env.local`, bancos locais e artefatos de teste devem ficar fora do Git.

Limite de producao:

- SQLite local nao deve ser usado como persistencia real em Vercel/serverless.
- Producao real exige Postgres/Supabase ou outro banco persistente, autenticacao e separacao por usuario/empresa.

## Comandos Reais

Scripts existentes em `package.json`:

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run e2e`
- `npm run build`
- `npm run verify`
- `npm run verify:e2e`
- `npm run ai:check-provider`
- `npm run audio:check-betkol`
- `npm run db:validate`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run db:reset-demo`
- `npm run db:reset-empty`

Verificacao da rodada de compras, estoque inicial e cancelamento seguro em 2026-05-29:

- cadastro de produto pre-preenchido pelo assistant a partir de compra agora envia `initialPurchase=1`; ao salvar, cria `Purchase` com origem `ASSISTANT_TEXT` e `StockMovement` do tipo `PURCHASE` com motivo `INITIAL_PURCHASE`;
- cadastro manual de produto continua podendo usar estoque inicial como ajuste `INITIAL_STOCK` quando nao veio de compra;
- compra manual em `/purchases` agora aceita entrada por embalagem (`Quantidade de embalagens`, `Unidades por embalagem`, `Custo por embalagem`) e converte para quantidade/custo unitario antes de persistir;
- edicao de produto nao altera mais estoque diretamente; alteracoes de estoque ficam em compras, vendas, perdas e cancelamentos;
- cancelamento por texto nao escolhe automaticamente quando encontra mais de uma venda, compra ou despesa parecida;
- IA externa opcional agora volta ao parser deterministico quando troca produto ou campos comerciais relevantes extraidos com seguranca;
- `npx vitest run tests/products/create-product.test.ts tests/validation/purchase.test.ts tests/ai/external-assistant.test.ts`: passou com 3 arquivos e 31 testes;
- `npm run typecheck`: passou;
- `npx playwright test tests/e2e/manual-packaged-product.spec.ts tests/e2e/assistant-required-business-scenarios.spec.ts`: passou com 7 testes mobile Chromium;
- `npx playwright test tests/e2e/ai-demo-flow.spec.ts tests/e2e/assistant-commercial-units.spec.ts tests/e2e/assistant-human-business-flow.spec.ts tests/e2e/assistant-human-conversation.spec.ts tests/e2e/text-only-demo.spec.ts`: passou com 30 testes mobile Chromium;
- `npm run verify`: passou; executou `lint`, `typecheck`, `test` com 33 arquivos e 481 testes, e `build`;
- `npm run verify:e2e`: passou com 44 testes mobile Chromium;
- `git diff --check`: passou.

Verificacao da rodada de cadastro de produto por formulario pre-preenchido em 2026-05-29:

- assistant texto agora abre `/products` com `assistantProduct=1` quando entende cadastro de produto ou entrada de produto ainda inexistente com dados suficientes para prefill;
- o formulario recebe nome, unidade, custo, preco, estoque inicial e estoque minimo quando extraidos; campos faltantes ficam em branco para o usuario completar;
- produto sensivel ficticio mantem aviso financeiro/cadastral na tela de cadastro;
- produto continua sem persistir ate clique no botao `Salvar produto`; venda, compra, despesa, perda e cancelamento continuam usando rascunho/confirmacao no chat;
- `npx prisma validate`: passou;
- `npx prisma generate`: passou e gerou Prisma Client v7.8.0;
- `npm run typecheck`: passou;
- `npx playwright test tests/e2e/ai-demo-flow.spec.ts tests/e2e/assistant-commercial-units.spec.ts tests/e2e/assistant-human-business-flow.spec.ts tests/e2e/assistant-human-conversation.spec.ts`: passou com 28 testes mobile Chromium;
- `npm run verify`: passou; executou `lint`, `typecheck`, `test` com 33 arquivos e 478 testes, e `build`;
- `npm run verify:e2e`: passou com 42 testes mobile Chromium;
- `git diff --check`: passou.

Verificacao da rodada de perda/cancelamento rastreavel em 2026-05-28:

- schema Prisma ampliado com `StockLoss`, `CancellationEvent`, `StockMovementType.LOSS`, `StockMovementType.REVERSAL`, `CancellationTargetType` e campos `cancelledAt`/`cancellationReason` em venda, compra e despesa;
- assistant texto agora monta rascunho de perda de estoque e cancelamento/correcao rastreavel, mas persiste somente apos botao;
- relatorios determinismos de dashboard/perguntas ignoram venda, compra e despesa canceladas;
- `npx prisma validate`: passou;
- `npx prisma generate`: passou e gerou Prisma Client v7.8.0;
- `npx vitest run tests/ai/assistant-required-business-scenarios.test.ts tests/validation/assistant-draft.test.ts`: passou com 2 arquivos e 23 testes;
- `npx vitest run tests/ai/parse-message.test.ts tests/ai/assistant-required-business-scenarios.test.ts`: passou com 2 arquivos e 51 testes;
- `npx vitest run tests/ai/assistant-required-business-scenarios.test.ts tests/validation/assistant-draft.test.ts tests/prisma-schema.test.ts tests/db/reset-empty.test.ts`: passou com 4 arquivos e 30 testes;
- `npx playwright test tests/e2e/assistant-required-business-scenarios.spec.ts`: primeira execucao falhou por expectativa textual antiga do teste; apos ajuste, passou com 4 testes mobile Chromium;
- `npm run verify`: primeira execucao falhou porque testes antigos ainda esperavam bloqueio de perda/cancelamento; apos atualizar parser/testes para o novo fluxo rastreavel, passou `lint`, `typecheck`, `test` com 33 arquivos e 478 testes, e `build`;
- `npm run verify:e2e`: primeira execucao falhou em 2 testes com expectativa antiga de bloqueio de cancelamento; apos ajuste, passou com 42 testes mobile Chromium;
- `git diff --check`: passou;
- `npm run db:reset-demo`: passou, aplicou 3 migrations e carregou seed ficticia com 4 produtos, 4 compras, 3 vendas e 4 despesas.

Verificacao da rodada de invariantes e contexto pendente em 2026-05-28:

- `REGRAS_INVARIANTES.md`: criado na raiz com regra central, bloqueios, invariantes financeiras, invariantes do assistant, implementacao e qualidade;
- `AGENTS.md`: atualizado para exigir leitura de `REGRAS_INVARIANTES.md`, `docs/PROJECT_STATE.md`, `docs/AI_OPERATING_RULES.md` e `docs/ACCEPTANCE_CRITERIA.md` antes de alterar o projeto;
- `tests/e2e/assistant-required-business-scenarios.spec.ts`: ampliado de 3 para 4 testes, cobrindo tambem frase baguncada, compra/cadastro incompleto, despesa, perda e cancelamento;
- primeira execucao do E2E ampliado revelou falha real: apos `comprei uma caixa com 12 coca lata 350 por 37 reais`, o contexto pendente de preco de venda consumia `gastei 37 reais com sacolinha e embalagem` como continuacao do produto e perguntava estoque minimo, em vez de abrir rascunho de despesa;
- correcao aplicada em `app/assistant/actions.ts`: contexto pendente agora deixa uma nova intencao clara voltar ao parser normal; respostas curtas de custo continuam podendo completar custo pendente;
- `npx vitest run tests/ai/assistant-required-business-scenarios.test.ts`: passou com 1 arquivo e 9 testes;
- `npx playwright test tests/e2e/assistant-required-business-scenarios.spec.ts`: apos a correcao, passou com 4 testes mobile Chromium;
- `npx prisma validate`: passou;
- `npx prisma generate`: passou e gerou Prisma Client v7.8.0;
- `npm run db:reset-demo`: passou, aplicou migrations e carregou seed ficticia com 4 produtos, 4 compras, 3 vendas e 4 despesas;
- `npm run verify`: passou; executou `lint`, `typecheck`, `test` com 33 arquivos e 476 testes, e `build`;
- `npm run verify:e2e`: passou com 42 testes mobile Chromium;
- `git diff --check`: passou.

Verificacao da rodada de IA embarcada para cadastro, compra e venda em linguagem natural em 2026-05-28:

- `npm run db:reset-demo`: passou e carregou dados ficticios locais para simulacao;
- `npm run dev -- --hostname 127.0.0.1 --port 3000`: iniciou localmente; `/` e `/assistant` responderam HTTP 200;
- `npx prisma validate`: passou;
- `npx prisma generate`: passou e gerou Prisma Client v7.8.0;
- `npx playwright test tests/e2e/assistant-required-business-scenarios.spec.ts`: passou com 3 testes focados dos cenarios obrigatorios de conversa humana;
- `npx playwright test tests/e2e/ai-demo-flow.spec.ts tests/e2e/assistant-human-conversation.spec.ts tests/e2e/text-only-demo.spec.ts`: passou com 17 testes apos ajuste de contexto pendente;
- `npm run verify`: passou; executou `lint`, `typecheck`, `test` com 33 arquivos e 476 testes, e `build`;
- `npm run verify:e2e`: passou com 41 testes mobile Chromium;
- `git diff --check`: passou;
- a primeira execucao da bateria obrigatoria nova falhou em RED antes da correcao, cobrindo interpretacao de embalagem/medida, contexto incompleto e desambiguacao; apos os ajustes, a bateria nova passou.

Verificacao da conversao de embalagem e kg/grama em 2026-05-27:

- cadastro manual em `/products` com `2` embalagens, `12` unidades por embalagem e custo por embalagem `R$ 36,00` salvou produto por unidade com estoque 24 e custo unitario R$ 3,00 no SQLite temporario de reteste;
- assistant em `/assistant` com `comprei 2 caixas de refrigerante lata com 12 unidades cada a 36 a caixa` gerou rascunho de `Refrigerante lata` por unidade, estoque inicial 24 e custo R$ 3,00, salvando somente apos botao;
- venda posterior `vendi 1 refrigerante lata` baixou estoque de 24 para 23, com custo e receita de R$ 3,00;
- assistant com produto `Maca` cadastrado em kg aceitou `vendi 500 gramas de maca`, gerando rascunho de venda de 0,5 kg e baixando estoque de 2 para 1,5;
- `npm run ai:check-provider`: passou com provider configurado e smoke test executado, sem imprimir chave;
- `npx prisma validate`: passou;
- `npx prisma generate`: passou;
- `npm run lint`: passou;
- `npm run typecheck`: passou;
- `npm run test`: passou com 30 arquivos e 456 testes;
- `npm run build`: passou;
- `npm run e2e`: passou com 38 testes mobile Chromium;
- `git diff --check`: passou.

Verificacao do arredondamento de custo unitario por embalagem em 2026-05-28:

- cadastro manual com `1` embalagem, `12` unidades por embalagem e custo por embalagem `R$ 37,00` passou a calcular custo unitario de R$ 3,08;
- parser do assistant com `comprei uma caixa de refrigerante lata 350 ml com 12 unidades cada a 37 a caixa` passou a gerar compra/entrada com quantidade 12 e custo unitario de 308 centavos;
- `npm run test`: falhou nesta rodada em `tests/db/reset-empty.test.ts` por timeout de 15000 ms no caso `applies migrations and leaves critical tables empty`; a falha nao veio das validacoes de produto/assistant alteradas;
- `npx prisma validate`: passou;
- `npm run lint`: passou;
- `npm run typecheck`: passou;
- `npx vitest run tests/validation/product.test.ts`: passou com 1 arquivo e 12 testes;
- `npx vitest run tests/ai/parse-message.test.ts`: passou com 1 arquivo e 38 testes;
- `npx vitest run tests/validation/product.test.ts tests/ai/parse-message.test.ts`: passou com 2 arquivos e 50 testes;
- `npm run build`: passou;
- `git diff --check`: passou.

Verificacao da inteligencia operacional do assistant em 2026-05-25:

- motor v2 criado em `lib/ai/conversation-engine.ts`;
- parser rule-based passou a responder `ola boa tarde`, `tudo bem?` e `o que voce faz?` como conversa social sem relatorio;
- conversa social tambem cobre `voce pode me ajudar?`;
- frase longa `quero cadastrar a compra que eu fiz de 10 coca cola em lata 350 ml, comprei por 3.5 cada unidade dela cadastra para mim por favor este produto` agora vira entrada/cadastro seguro, preserva `Coca Cola lata 350 ml`, quantidade 10 e custo unitario R$ 3,50, e pergunta preco de venda;
- frase real `quero cadastrar 10 coca cola em lata que eu comprei por 4.20 cada uma` agora vira entrada/cadastro seguro, preserva `Coca Cola lata`, quantidade 10 e custo unitario R$ 4,20, e pergunta preco de venda sem pedir custo novamente;
- prioridade de intencao impede que `quero lancar uma compra...` vire relatorio de compras;
- `quero cadastrar a compra que fiz de 10 refrigerantes` nao vira relatorio de compras e pergunta campo faltante;
- `comprei 5 refrigerantes por 20 reais total` converte deterministamente custo unitario para R$ 4,00;
- corpus criado/reforcado em `docs/ASSISTANT_INTELLIGENCE_CORPUS.md` com 80 frases agrupadas por intencao e expectativa;
- parser rule-based passou a entender custo unitario por `cada`, `cada uma`, `cada unidade`, `em cada`, `4,20 em cada`, `a X reais` e `por X a unidade`;
- parser passou a reconhecer venda por `cliente levou 2 aguas` e `saiu uma coca 600`;
- parser passou a tratar `comprei embalagem por 30` como despesa de embalagem, nao compra de estoque;
- compra com valor ambiguo agora pergunta se o valor informado e total ou unitario;
- parser nao expande `coca` para `coca cola`, nao normaliza `cocacola` e nao infere unidade por nome especifico de produto; usa padroes explicitos de unidade/embalagem;
- motor expoe `assessConversationConfidence` e `detectMultipleActions`; frases como `comprei coca, vendi agua e gastei 10` pedem uma acao por vez e nao geram rascunho;
- resolvedor de produto do assistant agora diferencia produto inexistente, produto unico e produto ambiguo;
- produto ambiguo gera pergunta com lista curta e conversa pendente para escolha por numero, ordinal simples ou trecho;
- desambiguacao humana foi reforcada: `vendi 5 coca cola para meu cliente aqui` seguido de `1` ou `coca lata` gera rascunho para `Coca Cola lata`, sem loop com `Coca Cola lata 350 ml`;
- mensagem isolada `1` sem `pendingContext` continua desconhecida e nao executa acao critica;
- E2E cobre `coloca 5 cocas que eu comprei no estoque paguei 4 reais em cada uma delas` sem pedir custo novamente;
- E2E cobre `vendi uma coca` com tres produtos Coca-Cola parecidos e continua com `a de 600`;
- E2E cobre venda ambigua com resposta numerica `1` e resposta textual `coca lata`, baixando estoque somente apos `Confirmar venda`;
- E2E cobre `comprei 5 coca por 20 reais` seguido de `total`;
- E2E cobre frase real do print, bloqueio de relatorio indevido e multiplas acoes;
- documentacao operacional criada em `docs/ASSISTANT_OPERATIONAL_KNOWLEDGE.md`.
- `npx vitest run tests/ai/product-disambiguation.test.ts tests/ai/parse-message.test.ts tests/ai/conversation-engine-corpus.test.ts tests/ai/nexis-system-prompt.test.ts`: passou com 4 arquivos e 128 testes na auditoria de desambiguacao humana.
- `npx vitest run tests/ai/product-disambiguation.test.ts tests/ai/parse-message.test.ts`: passou com 2 arquivos e 40 testes apos reforco de seletores de produto ambiguo.
- `npx playwright test tests/e2e/ai-demo-flow.spec.ts -g "continues a human sale|asks for product disambiguation"`: passou com 3 testes mobile Chromium na auditoria de desambiguacao humana.
- `npx playwright test tests/e2e/assistant-human-conversation.spec.ts`: passou com 5 testes mobile Chromium cobrindo conversas humanas A-E.
- `npm run test -- tests/ai/parse-message.test.ts tests/ai/external-assistant.test.ts tests/ai/nexis-system-prompt.test.ts tests/ai/provider.test.ts`: passou com 4 arquivos e 57 testes.
- `npx playwright test tests/e2e/ai-demo-flow.spec.ts`: passou com 5 testes mobile Chromium.
- `npx prisma validate`: passou.
- `npx prisma generate`: passou.
- `npm run db:reset-empty`: passou.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 29 arquivos e 289 testes.
- `npm run build`: passou.
- `npm run e2e`: passou com 24 testes mobile Chromium.
- `npm run verify:e2e`: passou com 24 testes mobile Chromium.
- `npm run ai:check-provider`: passou com `status: "passed"`; havia provider privado configurado e nenhuma chave foi impressa.
- `npm run verify`: passou.
- `git diff --check`: passou.

Verificacao do parser de compras compostas em 2026-05-28:

- auditoria encontrou overfitting anterior em normalizacao/seletores especificos de Coca-Cola e inferencia de unidade por nome de produto; a regra atual nao expande marca, nao normaliza `cocacola` e nao infere unidade por produto especifico;
- parser agora usa padroes genericos para embalagem composta: `caixa`, `fardo`, `pacote`, `bandeja` e `cartela` com quantidade interna e custo unitario calculado por codigo deterministico;
- parser trata peso e volume explicitos: `kg`, `quilo`, `grama`, `g`, `litro` e `ml` quando forem unidade da quantidade; medidas como `350 ml` e `500 ml` continuam no nome quando forem variante do produto vendido por unidade;
- campos ausentes em compra/cadastro continuam gerando `unknown` ou ambiguidade estruturada, sem inventar produto, quantidade, custo ou preco de venda;
- busca final `rg` em `app` e `lib` para hardcodes como `coca`, `cocacola`, `queryHasCoca`, `canonicalizeKnownProductAlias` e `isCocaCola` nao encontrou ocorrencias;
- `npm run test -- tests/ai/parse-message.test.ts`: passou com 1 arquivo e 41 testes apos o reforco dos casos de linguagem natural;
- `npm run test -- tests/ai/parse-message.test.ts tests/ai/conversation-engine-corpus.test.ts tests/ai/assistant-human-fuzz-corpus.test.ts tests/ai/product-disambiguation.test.ts tests/ai/external-assistant.test.ts tests/ai/nexis-system-prompt.test.ts`: passou com 6 arquivos e 314 testes;
- `npm run verify`: passou; executou lint, typecheck, test com 32 arquivos/467 testes e build;
- `npm run verify:e2e`: passou com 38 testes mobile Chromium;
- `npm run ai:check-provider`: passou com `status: "passed"`, smoke test executado e sem imprimir chave;
- `git diff --check`: passou.

Verificacao da implementacao do chat profissional em 2026-05-25:

- `npx prisma validate`: passou.
- `npx prisma generate`: passou.
- `npm run db:reset-empty`: passou e recriou SQLite local vazio.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 27 arquivos e 183 testes.
- `npm run build`: passou.
- `npm run e2e`: passou com 11 testes mobile Chromium.
- `npm run verify:e2e`: passou com 11 testes mobile Chromium.
- `npm run verify`: passou.
- `git diff --check`: passou.

Verificacao P0 executada em 2026-05-24 apos a padronizacao segura dos atalhos Codex:

- `npx prisma validate`: passou.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou, 25 arquivos de teste e 152 testes.
- `npm run build`: passou com Next.js 16.2.6; rotas dinamicas `/`, `/api/audio/transcribe`, `/assistant`, `/expenses`, `/products`, `/purchases` e `/sales`.
- `npm run verify:e2e`: passou; executou `npm run e2e` com 4 testes mobile Chromium em 35,4s.
- `gitleaks detect --redact --source .`: passou; 21 commits escaneados e nenhum leak encontrado.
- `git diff --check`: passou sem apontar whitespace.
- `codebase-memory-mcp`: projeto `srv-DocumentosCompartilhados-PROJETO - NEXT` estava `ready` com 817 nos e 1373 arestas; `detect_changes since=HEAD` mostrou 31 arquivos alterados, entao foi reindexado em modo `fast` e terminou `ready` com 628 nos e 1088 arestas.

Comando com falha documentada:

- `npm audit`: falhou com 5 vulnerabilidades moderadas. Pacotes afetados: `@hono/node-server` via `@prisma/dev`/`prisma`, e `postcss` interno de `next`. O npm sugere `npm audit fix --force`, mas isso instalaria versoes potencialmente quebraveis (`prisma@6.19.3` e `next@9.3.3`), entao nao foi aplicado nesta rodada P0.

Nao foram executados nesta rodada P0:

- `npm run db:reset-demo`, porque o E2E ja usa SQLite temporario e a rodada nao pediu reset do banco demo local.
- `npm run ai:check-provider`, para evitar chamada real caso `.env.local` esteja habilitado.
- `npm run audio:check-betkol`, porque BetKol real segue sem comando configurado.

Observacao documental:

- `docs/CODEX_SHORTCUTS_STANDARD.md` foi solicitado para leitura, mas nao existe no checkout atual. A padronizacao Codex esta parcialmente representada por `scripts/audit-codex-shortcuts.sh`; se a documentacao de atalhos voltar a ser obrigatoria, recriar esse arquivo deve ser tratado como ajuste documental, nao como feature do app.

## Etapa P1 - Tooling de Senioridade

Implementada parcialmente em 2026-05-25, sem alterar regras financeiras ou fluxos de IA.

Adicionado:

- `npm run test:coverage` com Vitest/V8 e relatorios em `coverage/`.
- `npm run performance:mobile` com Lighthouse local em build/start, SQLite temporario e relatorios em `test-results/lighthouse/`.
- `npm run analyze` com `@next/bundle-analyzer`, Webpack e saida isolada em `.next-analyze/`.
- `npm run test:a11y` com Playwright + axe em config separada `playwright.a11y.config.ts`.
- `.gitleaks.toml` minima usando regras padrao.
- workflow preparado em `.github/workflows/p1-quality.yml`; nao ha remote Git configurado neste checkout.

Resultados reais desta rodada:

- `npx prisma validate`: passou; schema valido.
- `npm run lint`: passou apos ignorar `.next-analyze/**` no ESLint.
- `npm run typecheck`: passou.
- `npm run test`: falhou com 3 arquivos e 11 testes falhando em contratos de IA/relatorios (`tests/ai/answer-question.test.ts`, `tests/ai/parse-message.test.ts`, `tests/finance/reports.test.ts`). Essas falhas exigem mudancas de regra financeira/IA e nao foram corrigidas nesta etapa P1.
- `npm run test:coverage`: falhou pelos mesmos 11 testes; coverage esta configurado, mas nao ha numero final confiavel enquanto `npm run test` falhar.
- `npm run build`: passou.
- `npm run verify:e2e`: passou uma vez com 4 testes apos estabilizar navegacao do full-flow, mas a ultima execucao voltou a falhar de forma intermitente esperando `Venda confirmada.` apos a segunda venda. A trace mostra a acao server-side salvando e retornando sucesso, mas a UI permanece em `Confirmando...`; isso e bloqueador real de fluxo e nao foi mascarado.
- `npm run test:a11y`: passou com 6 testes mobile Chromium nas rotas `/`, `/products`, `/sales`, `/purchases`, `/expenses` e `/assistant`.
- `npm run performance:mobile`: passou; Lighthouse mobile local mediu dashboard `performance=96`, FCP `0.8s`, LCP `1.7s`, TBT `230ms`, CLS `0`, SpeedIndex `1.1s`; assistant `performance=93`, FCP `0.8s`, LCP `1.7s`, TBT `310ms`, CLS `0`, SpeedIndex `0.8s`.
- `npm run analyze`: passou e gerou `.next-analyze/analyze/nodejs.html`, `.next-analyze/analyze/edge.html` e `.next-analyze/analyze/client.html`.
- `npm audit`: falhou com 5 vulnerabilidades moderadas; fix automatico exige `--force` e downgrade/quebra potencial de `next`/`prisma`, entao nao foi aplicado.
- `gitleaks detect --redact --source .`: passou; 21 commits escaneados e nenhum leak encontrado.
- `git diff --check`: passou.

Estado da etapa P1:

- Tooling P1 foi configurado.
- Este bloco acima registra o estado historico da instalacao inicial P1. A rodada P0.5 abaixo supersede o status vermelho de testes e E2E.

## Rodada P0.5 - Recuperacao da Base Verde

Executada em 2026-05-25 para recuperar a base apos a configuracao P1.

Estado inicial encontrado:

- Worktree ja estava sujo antes da rodada, com varias mudancas anteriores em app, libs, docs, testes, Prisma e tooling P1.
- `git remote -v` segue sem remote configurado neste checkout.
- `docs/CODEX_SHORTCUTS_STANDARD.md` segue ausente.
- Na reproducao atual, `npm run test -- --reporter=verbose` ja passou com 26 arquivos e 167 testes; os 11 testes quebrados reportados nao estavam mais quebrando no checkout sujo atual.
- `npm run test:coverage` tambem ja passou na reproducao atual.
- A falha real reproduzida foi no `full-flow.spec.ts`: o teste esperava `Venda confirmada.` no fluxo manual de venda, mas a UI/App Router podia ficar em estado pendente ou nao refletir a segunda venda antes de recarregar, apesar da Server Action concluir.

Correcoes aplicadas inicialmente nesta rodada:

- O E2E de venda manual chegou a ser ajustado para depender de POST `/sales` com `response.ok()` e reload.
- Esse ajuste foi revisado na auditoria UX/E2E abaixo, porque aceitar POST 200 e persistencia no banco sem feedback visual nao atende o aceite mobile do NEXIS.
- `tests/e2e/full-flow.spec.ts` agora exige `Venda confirmada.`, saida de `Confirmando...`, botao novamente utilizavel e persistencia apos reload.
- `tests/e2e/helpers/e2e-database.ts` ganhou leitura controlada do SQLite temporario do Playwright para provar `SaleItem`, `StockMovement SALE`, faturamento, custo snapshot, quantidade vendida e estoque final apos cada venda.
- Nenhuma regra financeira foi enfraquecida.
- Nenhum fluxo de IA passou a persistir dado critico sem confirmacao.
- Nenhuma ferramenta P1 foi removida.

Resultados reais finais desta rodada:

- `npx prisma validate`: passou; schema valido.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 26 arquivos e 167 testes.
- `npm run test:coverage`: passou com 26 arquivos e 167 testes; cobertura total reportada: statements 62,55%, branches 61,06%, functions 68,61%, lines 62,47%.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run verify:e2e`: passou com 4 testes mobile Chromium em 57,4s.
- `npm run test:a11y`: passou com 6 testes mobile Chromium em 54,2s.
- `npm run performance:mobile`: passou; Lighthouse mobile mediu dashboard `performance=91`, FCP `0.8s`, LCP `1.8s`, TBT `370ms`, CLS `0`, SpeedIndex `0.8s`; assistant `performance=93`, FCP `0.8s`, LCP `1.8s`, TBT `300ms`, CLS `0`, SpeedIndex `0.8s`.
- `npm run analyze`: passou e gerou `.next-analyze/analyze/nodejs.html`, `.next-analyze/analyze/edge.html` e `.next-analyze/analyze/client.html`.
- `npm audit`: continua falhando com 5 vulnerabilidades moderadas em `@hono/node-server` via `prisma` e `postcss` interno de `next`; o fix sugerido exige `npm audit fix --force` e instalaria versoes potencialmente quebraveis (`prisma@6.19.3` e `next@9.3.3`), entao nao foi aplicado.
- `gitleaks detect --redact --source .`: passou; 21 commits escaneados e nenhum leak encontrado.
- `git diff --check`: passou apos as alteracoes documentais desta rodada.

Riscos pendentes:

- `npm audit` continua pendente sem fix automatico seguro.
- O worktree permanece sujo com mudancas anteriores fora do escopo desta rodada.
- O checkout segue sem remote Git configurado.
- `docs/CODEX_SHORTCUTS_STANDARD.md` segue ausente.

Sempre atualize esta secao com resultados reais apos mudar codigo, schema, IA, fluxos ou aceite. Nao invente resultado.

## Etapa 0 - Lentidao dos Botoes

Implementada em 2026-05-25.

Problema relatado pelo usuario: alguns botoes demoram para abrir telas.

Diagnostico:

- paginas principais sao dinamicas e consultam Prisma/SQLite antes de renderizar;
- em `next dev`, o primeiro clique em rota nova compila/renderiza sob demanda e nao representa producao;
- vendas e compras ja carregavam apenas 20 registros recentes;
- despesas ja carregavam 30 registros recentes;
- produtos carregavam todos os produtos cadastrados.

Alterado:

- criado `components/route-loading.tsx`;
- criado `app/loading.tsx`;
- criado `app/products/loading.tsx`;
- criado `app/sales/loading.tsx`;
- criado `app/purchases/loading.tsx`;
- criado `app/expenses/loading.tsx`;
- criado `app/assistant/loading.tsx`;
- botoes principais do dashboard ganharam `touch-manipulation`, estado `active` e `prefetch` explicito;
- `/products` passou a carregar ate 50 produtos na lista inicial;
- `/sales` manteve limite de 20 vendas recentes, agora explicitado na UI;
- `/purchases` manteve limite de 20 compras recentes, agora explicitado na UI;
- `/expenses` manteve limite de 30 despesas recentes, agora explicitado na UI.

Medicao em `npm run dev` antes da implementacao, com `curl` em `127.0.0.1:3300`:

- `/`: primeiro 1,285s; segundo 0,143s.
- `/products`: primeiro 0,459s; segundo 0,187s.
- `/sales`: primeiro 0,313s; segundo 0,195s.
- `/purchases`: primeiro 0,194s; segundo 0,122s.
- `/expenses`: primeiro 0,346s; segundo 0,111s.
- `/assistant`: primeiro 0,164s; segundo 0,063s.

Medicao em `npm run dev` apos a implementacao:

- `/`: primeiro 2,526s; segundo 0,458s.
- `/products`: primeiro 0,681s; segundo 0,263s.
- `/sales`: primeiro 0,601s; segundo 0,305s.
- `/purchases`: primeiro 0,424s; segundo 0,217s.
- `/expenses`: primeiro 0,614s; segundo 0,239s.
- `/assistant`: primeiro 0,217s; segundo 0,089s.

Leitura: `next dev` ficou mais lento nesta rodada por compilacao/renderizacao de desenvolvimento; isso nao deve ser vendido como metrica de producao.

Medicao apos `npm run build` com `npx next start --hostname 127.0.0.1 --port 3301`:

- `/`: primeiro 0,509s; segundo 0,054s.
- `/products`: primeiro 0,115s; segundo 0,039s.
- `/sales`: primeiro 0,081s; segundo 0,038s.
- `/purchases`: primeiro 0,042s; segundo 0,031s.
- `/expenses`: primeiro 0,077s; segundo 0,029s.
- `/assistant`: primeiro 0,025s; segundo 0,018s.

Observacao de gate: a primeira sequencia de validacao parou em `npm run typecheck` porque `.next/dev/types/validator.ts`, arquivo gerado pelo `next dev`, ficou corrompido/incompleto. O diretorio gerado `.next/dev/types` foi removido e os gates foram repetidos.

Validacao desta etapa:

- `npm run test -- tests/route-loading.test.ts`: primeiro falhou como esperado antes dos `loading.tsx`; depois passou com 1 arquivo e 7 testes.
- `npx prisma validate`: passou.
- `npx prisma generate`: passou, Prisma Client 7.8.0 gerado.
- `npm run lint`: passou.
- `npm run typecheck`: passou apos limpeza de `.next/dev/types`.
- `npm run test`: passou com 26 arquivos e 159 testes.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run e2e -- tests/e2e/full-flow.spec.ts tests/e2e/text-only-demo.spec.ts`: passou com 2 testes depois de uma falha transiente de confirmacao em execucao completa sob carga.
- `npm run verify:e2e`: primeira repeticao encontrou lock de outro `next build`; apos aguardar o processo terminar, passou com 10 testes mobile Chromium em 1,2 min.
- `git diff --check`: passou.

Comandos nao executados nesta etapa:

- `npm run db:reset-demo`, porque o E2E usa SQLite temporario e a etapa nao exigiu reset do banco demo local.
- `npm run ai:check-provider`, porque a etapa nao mexeu na IA e esse diagnostico pode fazer smoke real se `.env.local` estiver habilitado.
- `npm run audio:check-betkol`, porque BetKol real segue sem comando configurado e a etapa nao mexeu em audio.

## Etapas 1 e 2 - Assistant e Relatorios Deterministicos

Implementadas parcialmente em 2026-05-25.

Escopo entregue:

- assistant separa `grossProfit` e `netProfit`;
- perguntas de estoque atual usam `Product.currentStock`;
- perguntas de compras usam `Purchase`;
- perguntas de produtos mais vendidos usam `SaleItem`;
- resumo financeiro combina vendas, custo das vendas, lucro bruto, despesas confirmadas, lucro liquido, compras, despesas pendentes e estoque baixo quando disponivel;
- `cashFlow` nao foi implementado como numero porque ainda nao existe fluxo deterministico seguro para projecao de caixa; a resposta segura e `Ainda não tenho essa consulta implementada com segurança.`;
- comandos de apagar/excluir/deletar/remover seguem bloqueados; comandos de cancelar/corrigir/estornar/desfazer viram rascunho rastreavel quando ha alvo seguro;
- nenhuma pergunta nova salva venda, compra, despesa, produto, estoque, perda, cancelamento ou correcao sem confirmacao.

Arquitetura adicionada:

- `lib/finance/reports.ts`: funcoes puras para inventario, compras por periodo, produtos mais vendidos e despesas pendentes no resumo financeiro;
- `lib/reports/assistant-question.ts`: carregador Prisma especifico para perguntas do assistant;
- `lib/ai/answer-question.ts`: respostas em linguagem simples para usuario leigo.

Validacao desta etapa:

- `npm run test -- tests/ai/parse-message.test.ts tests/ai/answer-question.test.ts tests/finance/reports.test.ts`: primeiro falhou como esperado antes da implementacao; depois passou com 3 arquivos e 33 testes.
- `npm run test -- tests/ai/parse-message.test.ts tests/ai/answer-question.test.ts tests/ai/external-assistant.test.ts tests/ai/nexis-system-prompt.test.ts tests/finance/reports.test.ts tests/dashboard-summary.test.ts`: passou com 6 arquivos e 50 testes.
- `npm run e2e -- tests/e2e/text-only-demo.spec.ts`: passou com 1 teste mobile Chromium.
- `npm run test`: passou com 26 arquivos e 167 testes.
- `npx prisma validate`: passou.
- `npx prisma generate`: passou, Prisma Client 7.8.0 gerado.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run e2e`: primeiro falhou no `full-flow.spec.ts` porque o POST da Server Action de venda retornava sucesso e persistia dados, mas a DOM do teste ficava presa em `Confirmando...`; o contorno por POST + reload foi substituido depois pela auditoria UX/E2E abaixo.
- `npm run db:reset-demo`: passou e recriou o SQLite demo com 4 produtos, 4 compras, 3 vendas e 4 despesas ficticias.
- `npm run verify`: passou, rodando lint, typecheck, 167 testes unitarios e build.
- `npm run verify:e2e`: passou com 4 testes mobile Chromium em 41,0s.
- `git diff --check`: passou.

## Auditoria UX/E2E - Confirmando em Vendas

Executada em 2026-05-25.

Diagnostico:

- o bug era real no fluxo mobile de venda manual;
- o trace mostrou `POST /sales` com HTTP 200, retorno `{ status: "success", message: "Venda confirmada." }` e dados persistidos, mas a UI podia permanecer com o botao desabilitado em `Confirmando...`;
- persistir no banco nao era suficiente para aceite de UX, porque o usuario precisa ver sucesso, erro ou conclusao;
- o fluxo de rascunho de venda pelo assistant ja exibia sucesso no E2E, mas usava o mesmo padrao de pending e foi endurecido preventivamente.

Alterado:

- `components/transactions/sale-form.tsx` deixou de depender do `pending` de `useActionState` para feedback visual critico e passou a usar submit controlado no cliente com `try/finally`, mensagem local, reset do formulario apos sucesso e `router.refresh()` apos estado de sucesso;
- `components/assistant/draft-confirmation.tsx` recebeu o mesmo tratamento para confirmacao de rascunhos, mantendo o botao desabilitado apos sucesso para evitar dupla confirmacao do mesmo rascunho;
- mensagens de sucesso/erro dos fluxos alterados agora usam `role="status"` ou `role="alert"` com `aria-live`;
- `tests/e2e/full-flow.spec.ts` valida que a venda manual mostra `Venda confirmada.`, sai de `Confirmando...`, reabilita o botao e continua persistida apos reload;
- `tests/e2e/text-only-demo.spec.ts` valida que a venda do assistant mostra sucesso, nao fica em `Confirmando...`, bloqueia nova confirmacao do mesmo rascunho e permanece no painel apos reload.

E2E atual:

- `npm run e2e` e `npm run verify:e2e` executam o mesmo script de `package.json`: `playwright test`;
- `playwright.config.ts` aponta para `tests/e2e` e hoje lista 4 testes mobile Chromium em 4 arquivos;
- os 10 testes citados anteriormente vieram da soma observada de 4 E2E comuns com 6 testes de acessibilidade de `tests/a11y`, que rodam por `npm run test:a11y` usando `playwright.a11y.config.ts`, nao por `verify:e2e` no estado atual.

Validacao desta auditoria:

- `npx prisma validate`: passou.
- `npx prisma generate`: passou, Prisma Client 7.8.0 gerado.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 26 arquivos e 167 testes.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run e2e`: passou com 4 testes mobile Chromium em 41,9s.
- `npm run verify:e2e`: passou com 4 testes mobile Chromium em 41,5s.

## Etapa 3 - Cadastro de Produto por IA

Implementada em 2026-05-25.

Atualizacao em 2026-05-28: o produto deixou de aparecer como card de rascunho dentro do chat. O assistant agora navega para `/products` com `assistantProduct=1` e campos pre-preenchidos; o usuario revisa, completa o que faltar e salva pelo botao `Salvar produto`.

Escopo entregue:

- parser rule-based reconhece cadastro de produto por texto, incluindo `cadastrar produto refrigerante`, `cadastrar Coca lata custo 3 venda 6 estoque 20 mínimo 5` e `adicionar produto água mineral preço 3 custo 1 estoque 50`;
- frases incompletas abrem o formulario com campos entendidos e deixam em branco custo, preco, estoque inicial ou estoque minimo que nao foram informados;
- formulario de produto mostra nome, unidade, custo, preco de venda, estoque inicial, estoque minimo e aviso de revisao;
- persistencia ocorre somente apos clique no botao `Salvar produto`;
- confirmacao revalida o rascunho com Zod no servidor;
- cadastro manual e assistant usam `lib/products/create-product.ts`, preservando `StockMovement ADJUSTMENT` com razao `INITIAL_STOCK` para estoque inicial;
- nomes equivalentes por normalizacao simples, como `Coca lata`, `coca lata`, `COCA LATA` e `Coca   lata`, sao bloqueados antes do rascunho e antes da persistencia;
- mensagens `sim`, `pode salvar` ou similares continuam sem salvar produto;
- venda de produto inexistente continua sendo erro de venda, nao cadastro automatico;
- contrato da IA externa server-side aceita `product_draft` completo, convertido para prefill de formulario, e continua sem persistir nada.

Validacao inicial desta etapa:

- `npm run test -- tests/ai/parse-message.test.ts tests/validation/assistant-draft.test.ts tests/ai/external-assistant.test.ts`: primeiro falhou como esperado antes da implementacao; depois passou com 3 arquivos e 50 testes.
- `npm run e2e -- tests/e2e/text-only-demo.spec.ts --grep "drafts and saves a product"`: primeiro falhou antes da implementacao; depois passou com 1 teste mobile Chromium.
- `npm run lint`: passou.
- `npm run typecheck`: passou.

Validacao completa desta etapa:

- `npx prisma validate`: passou; schema valido.
- `npx prisma generate`: passou; Prisma Client 7.8.0 gerado.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 26 arquivos e 175 testes.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run e2e`: passou com 5 testes mobile Chromium em 54,0s.
- `npm run verify:e2e`: passou com 5 testes mobile Chromium em 52,8s.
- `npm run db:reset-demo`: passou e recriou o SQLite demo com 4 produtos, 4 compras, 3 vendas e 4 despesas ficticias.
- `npm run verify`: passou, rodando lint, typecheck, 175 testes unitarios e build.
- `git diff --check`: passou.

## Auditoria IA - Demo Real por Assistant

Executada em 2026-05-25 para validar, antes do teste manual, os fluxos texto-only do assistant com dados ficticios e banco temporario.

Escopo validado:

- E2E novo `tests/e2e/ai-demo-flow.spec.ts`;
- banco temporario do Playwright com `AI_ASSISTANT_ENABLED=false`;
- cadastro de produto por IA com rascunho e confirmacao;
- produto ausente em `/products` antes da confirmacao;
- `StockMovement ADJUSTMENT` com razao `INITIAL_STOCK` para estoque inicial;
- bloqueio de duplicado por nome normalizado;
- cadastro incompleto pedindo campos faltantes;
- compra por IA aumentando estoque;
- venda por IA reduzindo estoque;
- despesa por IA entrando no lucro liquido;
- perguntas financeiras respondidas por backend/banco;
- dashboard concordando com o backend;
- comandos destrutivos e venda acima do estoque bloqueados;
- `sim`, `pode salvar` e `confirma aí` sem persistir nada;
- `Confirmando...` nao ficou preso em produto, compra, venda ou despesa por assistant.

Dados ficticios da auditoria:

- produto `Coca lata`;
- custo R$ 3,00;
- venda R$ 6,00;
- estoque inicial 20;
- estoque minimo 5;
- compra de 10 unidades a R$ 3,00;
- venda de 5 unidades a R$ 6,00;
- despesa confirmada de R$ 10,00 com embalagem.

Resultado financeiro validado no banco temporario e na UI:

- estoque final: 25;
- faturamento: R$ 30,00;
- custo da venda: R$ 15,00;
- lucro bruto: R$ 15,00;
- despesas confirmadas: R$ 10,00;
- lucro liquido: R$ 5,00.

Correcoes de produto nesta auditoria:

- nenhuma regra financeira, schema Prisma ou componente de producao precisou ser alterado;
- foi criado o E2E pesado de auditoria e reforcado o helper de leitura do SQLite temporario para provar estado financeiro deterministico.

Validacao completa desta auditoria:

- `npm run e2e -- tests/e2e/ai-demo-flow.spec.ts`: passou com 1 teste mobile Chromium.
- `npm run lint -- tests/e2e/ai-demo-flow.spec.ts tests/e2e/helpers/e2e-database.ts`: passou.
- `npx prisma validate`: passou; schema valido.
- `npx prisma generate`: passou; Prisma Client 7.8.0 gerado.
- `npm run db:reset-demo`: passou e recriou o SQLite demo com 4 produtos, 4 compras, 3 vendas e 4 despesas ficticias.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 26 arquivos e 176 testes.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run e2e`: passou com 8 testes mobile Chromium em 1,1 min.
- `npm run verify`: passou, rodando lint, typecheck, 176 testes unitarios e build.
- `npm run verify:e2e`: passou com 8 testes mobile Chromium em 1,1 min.
- `npm run ai:check-provider`: passou com `status: "passed"`; havia configuracao privada de IA externa no ambiente, o smoke test foi executado e nenhuma chave foi impressa.
- `git diff --check`: passou.

Relatorio detalhado:

- `docs/AI_FLOW_VALIDATION_REPORT.md`

## Reset Vazio Local para Teste Manual

Implementado em 2026-05-25, sem alterar regra financeira, IA/assistant, schema Prisma ou seed demo.

Objetivo:

- manter `npm run db:reset-demo` como reset populado para apresentacao;
- criar `npm run db:reset-empty` para deixar o SQLite local/demo sem produtos, compras, vendas, itens de venda, despesas e movimentos de estoque;
- permitir teste manual matematico do zero.

Arquitetura:

- `scripts/db/reset-empty.mjs` valida o ambiente e opera somente em SQLite local `file:`;
- o comando de package usa `NEXIS_EMPTY_RESET=1 DATABASE_URL=file:./dev.db`;
- o script bloqueia execucao direta sem sentinela, bloqueia `NODE_ENV=production`, bloqueia `DATABASE_URL` que nao comece com `file:` e bloqueia arquivo fora do diretorio do projeto;
- a estrategia e remover apenas o arquivo SQLite local validado e rodar `prisma migrate deploy`, evitando carregar seed;
- `scripts/db/reset-demo.mjs` nao foi alterado e continua chamando `prisma migrate reset --force` seguido de seed.

Testes adicionados ou reforcados:

- `tests/db/reset-empty.test.ts`: prova que o reset vazio aplica migrations e deixa tabelas criticas zeradas; tambem prova bloqueio de URL remota e ambiente production;
- `tests/ai/answer-question.test.ts`: cobre perguntas basicas com banco vazio, incluindo vendas R$ 0,00, lucro liquido R$ 0,00 e estoque sem produtos;
- `tests/demo-seed-data.test.ts`: explicita que a seed demo continua populada com dados ficticios para apresentacao.

Validacao inicial desta etapa:

- `npm run test -- tests/db/reset-empty.test.ts`: primeiro falhou porque `scripts/db/reset-empty.mjs` nao existia; depois passou com 1 arquivo e 3 testes.
- `npm run test -- tests/db/reset-empty.test.ts tests/ai/answer-question.test.ts tests/demo-seed-data.test.ts`: passou com 3 arquivos e 16 testes.

Validacao completa desta etapa:

- `npx prisma validate`: passou; schema valido.
- `npx prisma generate`: passou; Prisma Client 7.8.0 gerado.
- `npm run db:reset-empty`: passou; aplicou migration sem seed em `file:./dev.db`.
- contagem apos `db:reset-empty`: `Product=0`, `Purchase=0`, `Sale=0`, `SaleItem=0`, `Expense=0`, `StockMovement=0`.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 27 arquivos e 181 testes.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run e2e`: passou com 8 testes mobile Chromium em 51,5s.
- `npm run verify:e2e`: passou com 8 testes mobile Chromium em 52,4s.
- `npm run db:reset-demo`: passou e recriou o SQLite demo com 4 produtos, 4 compras, 3 vendas e 4 despesas ficticias.
- contagem apos `db:reset-demo`: `Product=4`, `Purchase=4`, `Sale=3`, `SaleItem=8`, `Expense=4`, `StockMovement=12`.
- `npm run verify`: passou, rodando lint, typecheck, 181 testes unitarios e build.
- `git diff --check`: passou.

## Assistant Conversacional com Intencao Parcial

Implementado em 2026-05-25, sem alterar schema Prisma, regra financeira, voz/STT, pro-labore, servicos, perdas, cancelamento, auth ou Postgres.

Problema real corrigido:

- a frase `coloca 5 coca cola que eu comprei no estoque` caia no erro generico `Nao consegui entender com seguranca`;
- o parser local aceitava compra apenas quando o custo unitario vinha na mesma frase, como `comprei 10 refrigerantes por 4 reais`.

Comportamento atual:

- o chat limpa o campo de texto apos envio bem-sucedido;
- a mensagem enviada aparece como bolha do usuario e a resposta aparece como bolha/card do assistant;
- o assistant rola para a resposta mais recente;
- o fallback rule-based reconhece entrada parcial de estoque em frases como `coloca 5 coca cola no estoque`, `entrou 10 agua no estoque` e `comprei 5 coca cola`;
- quando falta custo unitario, o assistant pergunta o custo e mantem contexto curto para a proxima resposta;
- se o produto existe, a resposta `paguei 3 reais` monta rascunho de compra e ainda exige botao `Confirmar compra`;
- se o produto nao existe, a conversa abre `/products` com quantidade inicial e custo entendidos, deixando preco de venda e estoque minimo para o usuario completar;
- produto, compra, venda e despesa continuam sem persistir sem botao;
- o contrato da IA externa aceita `partial_purchase`, mas o E2E continua independente de Groq/IA externa.

Testes adicionados ou reforcados:

- `tests/ai/parse-message.test.ts`: cobre compra parcial, entrada de estoque natural, `quanto ganhei hoje` como pergunta financeira e bloqueio perigoso;
- `tests/ai/external-assistant.test.ts`: cobre `partial_purchase` vindo de IA externa como intencao de continuacao, nao persistencia;
- `tests/ai/nexis-system-prompt.test.ts`: exige contrato de campos faltantes no prompt;
- `tests/e2e/ai-demo-flow.spec.ts`: cobre conversa em banco vazio ate formulario de produto pre-preenchido, sem salvar antes do botao e com estoque final correto apos confirmacao.

Validacao direcionada desta etapa:

- `npm run test -- tests/ai/parse-message.test.ts tests/ai/external-assistant.test.ts tests/ai/nexis-system-prompt.test.ts`: primeiro falhou como esperado antes da implementacao; depois passou com 3 arquivos e 40 testes.
- `npm run typecheck`: passou.
- `npm run e2e -- tests/e2e/ai-demo-flow.spec.ts`: primeiro falhou por seletores globais ambiguos apos manter historico de conversa; depois passou com 2 testes mobile Chromium.

Validacao completa desta etapa:

- `npx prisma validate`: passou; schema valido.
- `npx prisma generate`: passou; Prisma Client 7.8.0 gerado.
- `npm run db:reset-empty`: passou; aplicou migration sem seed em `file:./dev.db`.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 27 arquivos e 183 testes.
- `npm run build`: passou com Next.js 16.2.6.
- `npm run e2e`: primeira execucao completa falhou porque `tests/e2e/text-only-demo.spec.ts` usava seletores globais incompatíveis com historico de chat; apos escopar as expectativas para a ultima resposta do assistant, passou com 9 testes mobile Chromium.
- `npm run verify:e2e`: passou com 9 testes mobile Chromium.
- `npm run ai:check-provider`: passou com `status: "passed"`; havia configuracao privada de IA externa no ambiente, o smoke test foi executado e nenhuma chave foi impressa.
- `npm run verify`: passou, rodando lint, typecheck, 183 testes unitarios e build.
- `git diff --check`: passou.

## Etapa 4 - Demo Mobile Instalavel/PWA

Implementada em 2026-05-25, sem alterar regra financeira, schema Prisma, voz/STT, auth, Postgres, pro-labore, servicos, perdas ou cancelamento.

Escopo entregue:

- criado `app/manifest.ts` com `name=NEXIS`, `short_name=NEXIS`, `display=standalone`, `theme_color=#064e3b`, `background_color=#f6f7f4`, `start_url=/`, `scope=/` e orientacao `portrait`;
- criados icones temporarios simples em `public/icons/nexis-icon.svg` e `public/icons/nexis-maskable.svg`;
- `app/layout.tsx` passou a declarar `applicationName`, `manifest`, icones em `public/icons`, `appleWebApp`, `formatDetection` e viewport mobile com `themeColor`;
- removido o antigo `app/icon.svg` automatico porque o Next/Turbopack gerou `ReferenceError: require is not defined` em `/assistant` ao transformar esse SVG em metadata no servidor dev; os icones PWA agora ficam em `public/icons`;
- `app/globals.css` ganhou protecao geral contra overflow horizontal e `select`/inputs com largura maxima para evitar estouro em mobile;
- teste E2E mobile cobre metadata PWA, manifest, icones e ausencia de scroll horizontal nas rotas principais;
- seed demo e seed E2E usam `createDemoTimestamp()` para manter registros ficticios dentro do dia atual mesmo quando a demo e resetada logo apos meia-noite;
- README e Runbook explicam teste no celular, modo producao local, preview na Vercel, instalacao/adicao a tela inicial e roteiro curto de demonstracao.

Auditoria manual desta etapa:

- em `npm run dev -- --hostname 127.0.0.1 --port 3302`, antes da correcao de CSS, `/sales` em viewport `390x844` tinha `scrollWidth=420` por `select` com texto longo;
- apos a correcao, `/`, `/products`, `/sales`, `/purchases`, `/expenses` e `/assistant` ficaram com `scrollWidth=390` em viewport `390x844`;
- apos remover o `app/icon.svg` automatico e limpar `.next/dev`, `/`, `/products`, `/sales`, `/purchases`, `/expenses`, `/assistant` e `/manifest.webmanifest` responderam HTTP 200 no servidor dev.

Validacao completa desta etapa:

- `npm run e2e -- tests/e2e/mobile-smoke.spec.ts --grep "PWA|inside the mobile"`: passou com 2 testes mobile Chromium em 36,8s.
- `npm run test -- tests/demo-seed-data.test.ts`: passou com 1 arquivo e 5 testes.
- `npm run e2e -- tests/e2e/text-only-demo.spec.ts --grep "answers questions"`: primeiro reproduziu a falha de meia-noite com dashboard zerado; depois da correcao do seed, passou com 1 teste mobile Chromium em 30,3s.
- `npx prisma validate`: passou; schema valido.
- `npx prisma generate`: passou; Prisma Client 7.8.0 gerado.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 26 arquivos e 176 testes.
- `npm run build`: passou com Next.js 16.2.6; `/manifest.webmanifest` aparece como rota estatica.
- `npm run e2e`: primeira execucao completa reproduziu a falha de seed perto da meia-noite; apos correcao, passou com 7 testes mobile Chromium em 50,5s.
- `npm run verify:e2e`: passou com 7 testes mobile Chromium em 51,2s.
- `npm run db:reset-demo`: passou e recriou o SQLite demo com 4 produtos, 4 compras, 3 vendas e 4 despesas ficticias.
- `npm run verify`: passou, rodando lint, typecheck, 176 testes unitarios e build.
- `git diff --check`: passou.

## Documentacao Atual

Arquivos canonicos:

- `README.md`
- `docs/PROJECT_STATE.md`
- `docs/ARCHITECTURE_TREE.md`
- `docs/AI_OPERATING_RULES.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/AI_FLOW_VALIDATION_REPORT.md`
- `docs/ROADMAP.md`
- `docs/RUNBOOK.md`

Evidencias P0 desta rodada:

- `docs/SENIOR_TOOLING_AUDIT.md`
- `docs/SENIOR_READINESS_GAPS.md`
- `docs/ASSISTANT_HUMAN_FUZZ_REPORT.md`
- `docs/ASSISTANT_BUSINESS_SCENARIOS.md`

Docs antigos de auditoria, planos executados, checklist duplicado, setup/deploy/demo isolados e auditorias de ambiente foram consolidados para reduzir ruido antes de enviar o estado para a equipe.

## Atualizacao - Laboratorio Conversacional Multi-Negocio

Data: 2026-05-25.

Estado novo:

- corpus documentado expandido para mais de 120 frases humanas variadas;
- teste unitario `tests/ai/assistant-human-fuzz-corpus.test.ts` cobre 122 frases deterministicas;
- E2E `tests/e2e/assistant-human-business-flow.spec.ts` cobre 7 conversas completas;
- motor entende casos de espetinho, areia, cimento, agua ambigua, queijo kg, piso caixa, agro ficticio, produto sensivel ficticio, despesas e relatorios;
- typos conservadores (`cadatra`, `conprei`, `vedi`, `pego`) foram normalizados;
- servico sem estoque segue fora de escopo persistente e responde de forma segura;
- produtos sensiveis ficticios geram apenas rascunho financeiro/cadastral com aviso de legalidade;
- IA externa continua opcional e o fallback rule-based passa nos testes com `AI_ASSISTANT_ENABLED=false`.

Validacao direcionada ja executada nesta rodada:

- `npx vitest run tests/ai/assistant-human-fuzz-corpus.test.ts`: passou com 132 testes.
- `npx playwright test tests/e2e/assistant-human-business-flow.spec.ts`: passou com 7 testes mobile Chromium.

## Atualizacao - Deploy Railway Demo

Data: 2026-05-30.

Estado novo:

- repositorio GitHub criado e publicado em https://github.com/thiagocfaria/NEXT;
- deploy Railway ativo em https://next-production-d7d8.up.railway.app;
- projeto Railway `appealing-gratitude`, servico `NEXT`, ambiente `production`, regiao `US West`;
- builder trocado de Nixpacks para Dockerfile com `node:24-bookworm-slim` (Nixpacks nao suportava nodejs_24);
- `Dockerfile` criado com `python3`, `make`, `g++`, `libsqlite3-dev` para compilar `better-sqlite3` nativo;
- `railway.json` atualizado para `builder: DOCKERFILE`;
- `.dockerignore` criado excluindo `node_modules`, `.next`, `.env*`, `*.db`, `ARQUIVOS_MORTOS`;
- `.node-version` e `.nvmrc` com `24` criados; `engines.node >=24.0.0` adicionado ao `package.json`;
- script `db:ensure-demo` criado: aplica `prisma migrate deploy` e carrega seed somente se banco vazio;
- script `start:railway` criado: roda `db:ensure-demo` e `next start -H 0.0.0.0 -p $PORT`;
- `postinstall: prisma generate` adicionado ao `package.json`;
- dominio publico Railway configurado na porta `8080`;
- volume Railway montado em `/data` para persistencia do SQLite;
- banco inicializado como `file:/data/nexis-demo.db` com 4 produtos, 4 compras, 3 vendas e 4 despesas ficticias;
- IA externa Groq (llama-3.1-8b-instant) configurada via painel Railway; fallback rule-based continua ativo;
- chat `Falar com NEXIS` testado e funcionando na URL publica;
- PWA instalavel via Chrome na URL publica (botao "Instalar" apareceu no teste);
- `.env.example` atualizado com placeholders Railway/Groq;
- `README.md` e `docs/RUNBOOK.md` documentam URL publica, variaveis, volume e roteiro de validacao;
- nenhuma regra financeira, schema Prisma, logica de IA ou tela foi alterada.

Limites do deploy atual:

- sem autenticacao: qualquer pessoa com o link acessa;
- sem multiempresa: banco unico compartilhado na demo;
- sem backup automatico: volume Railway e suficiente para demo, nao para producao real;
- icones PWA somente em SVG: iOS Safari pode nao exibir icone corretamente na tela inicial;
- SQLite em `/data` adequado para demo; producao real exige Postgres/Supabase.

Nao executado nesta rodada (apenas docs/config):

- `npm run test` nao foi executado; codigo de negocio nao foi alterado; ultima execucao passou com 481 testes.
- `npm run e2e` nao foi executado; UI nao foi alterada.

## Atualizacao - Migracao Visual de Transacoes, Relatorios e Estoque Baixo

Data: 2026-06-07.

Escopo visual concluido:

- `/sales` migrada para os tokens e componentes visuais atuais do NEXIS;
- `/purchases` migrada mantendo compra por unidade e por embalagem;
- `/expenses` migrada com resumo visual de despesas confirmadas e pendentes;
- `/reports` criada com indicadores reais de hoje e do mes, alem de ranking real de produtos;
- `/low-stock` criada com produtos ativos abaixo do minimo, nivel de criticidade e atalho para reposicao;
- dashboard passou a ligar diretamente para Relatorios e Estoque baixo;
- novo `PageHeader` compartilhado em `components/navigation/page-header.tsx`;
- formularios e listas transacionais foram reestilizados sem alterar Server Actions, Zod, Prisma ou regras financeiras;
- o bundle `Design System Layout_atualizado/` foi excluido de ESLint e TypeScript por ser somente referencia Vite, nao parte do app Next.js.

Regras preservadas:

- venda continua baixando estoque somente pela action existente;
- compra continua aumentando estoque somente pela action existente;
- despesa pendente continua fora do lucro liquido;
- relatorios usam `getDashboardSummary()` e `summarizeTopProducts()`;
- estoque baixo usa a regra deterministica `hasLowStock()`;
- nenhum dado mockado do bundle visual foi levado para as rotas reais.

Validacao executada nesta etapa:

- `npm run lint`: passou;
- lint direcionado das rotas e componentes alterados: passou;
- `git diff --check`: passou;
- `npm run test`: 31 arquivos e 475 testes passaram; 2 suites nao iniciaram porque o Prisma Client local nao existe;
- `npm run db:generate`: bloqueado por certificado local, com erro `self-signed certificate in certificate chain` ao acessar `binaries.prisma.sh`;
- `npm run typecheck`: bloqueado pela ausencia de `.prisma/client`;
- `npm run build`: bloqueado porque um processo local manteve `.next/ux-dev.stderr.log` aberto (`EBUSY`);
- smoke HTTP em `/sales`, `/purchases`, `/expenses`, `/reports` e `/low-stock`: rotas reconhecidas, mas responderam 500 porque o servidor tambem nao encontrou `.prisma/client/default`;
- E2E nao executado porque a geracao do Prisma Client e requisito do servidor de teste.

## Proxima Ordem Recomendada

1. Validar demo no celular real pelo link publico e instalar como PWA.
2. Implementar pro-labore, despesas fixas mensais e metas.
3. Implementar servicos sem estoque.
4. Criar tela/manual de historico e auditoria para perdas e cancelamentos ja persistidos.
5. Conectar voz/STT real ao mesmo fluxo de rascunho.
6. Implementar fluxo de caixa projetado seguro.
7. Migrar para Postgres/Supabase com auth, multiempresa e backup.

## Atualizacao - Unidades Comerciais no Assistant

Data: 2026-05-25.

Estado novo:

- bug real `eu comprei hoje 2 kg de macan a 25,50 o kg` corrigido no parser rule-based;
- criada camada `lib/ai/commercial-units.ts` para extrair quantidade, unidade, produto, custo unitario e `priceBasis` de frases com kg, gramas, litro, ml, metro, m2, m3, caixa, saco, fardo, pacote, duzia, peca e unidade;
- perguntas de continuacao carregam `unit`, `unitLabel` e `priceBasis` pelo `pendingContext`;
- produto novo por kg/metro/embalagem pergunta preco de venda e estoque minimo na unidade correta;
- typo como `macan` nao e corrigido silenciosamente para `maçã`; no MVP, o nome informado segue para rascunho revisavel;
- `ProductUnit` foi expandido para `METER`, `SQUARE_METER`, `CUBIC_METER`, `SACK`, `BALE`, `PACKAGE` e `DOZEN`;
- schema Prisma ja usava `Decimal` em `Product.currentStock`, `Product.minimumStock`, `Purchase.quantity`, `SaleItem.quantity` e `StockMovement.quantity`; portanto estoque decimal e suportado sem mudar tipo de coluna;
- validacao Zod e calculos financeiros continuam determinísticos, sem IA como fonte de verdade;
- corpus/fuzz recebeu 30+ frases de unidade comercial e E2E novo cobre banco vazio por kg, metro e saco.

Validacao direcionada ja executada nesta rodada:

- `npx vitest run tests/ai/parse-message.test.ts tests/ai/conversation-engine-corpus.test.ts tests/ai/assistant-human-fuzz-corpus.test.ts tests/validation/product.test.ts`: passou com 292 testes.
- `npm run typecheck`: passou na checagem intermediaria apos alinhar tipos de unidade.

Validacao completa obrigatoria desta rodada:

- `npx prisma validate`: passou; schema valido.
- `npx prisma generate`: passou; Prisma Client 7.8.0 gerado.
- `npm run db:reset-empty`: passou; SQLite local recriado vazio.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: primeira execucao falhou por timeout de 5s no teste que roda `prisma migrate deploy`; o timeout do teste de infraestrutura foi ajustado para 15s e a execucao final passou com 30 arquivos e 452 testes.
- `npm run build`: passou; Next.js 16.2.6.
- `npx playwright test tests/e2e/assistant-commercial-units.spec.ts`: passou com 3 testes mobile Chromium.
- `npm run e2e`: primeira execucao encontrou expectativa antiga `areia fina metro`; apos alinhar o E2E para produto `Areia fina` + unidade `METER`, passou com 34 testes mobile Chromium.
- `npm run verify:e2e`: passou com 34 testes mobile Chromium.
- `npm run ai:check-provider`: passou; smoke test externo executado sem imprimir chave.
- `git diff --check`: passou.
- `npm run verify`: passou; lint, typecheck, 452 testes e build.

## Atualizacao - Unidade Grama no Cadastro e Venda por IA

Data: 2026-05-26.

Estado novo:

- cadastro manual de produto agora deve expor `Grama` como unidade propria `GRAM`, alem das unidades ja existentes;
- parser de unidade comercial preserva `GRAM` quando o usuario diz `a grama`/`por grama`;
- conversao `gramas -> kg` continua apenas quando a base informada for kg, como `500 gramas ... o kg`;
- parser de cadastro remove marcadores como `unidade grama`, `por saco` e `por dúzia` do nome do produto e grava a unidade no campo estruturado;
- quando a unidade nao vem explicita em cadastro, o assistant usa `UNIT`; unidade por kg/grama/litro/embalagem precisa vir da frase do usuario;
- assistant rule-based entende `cadastre tempero unidade grama custo 0,04 venda 0,08 estoque 500 mínimo 100`;
- E2E de assistant deve salvar o produto por botao, depois aceitar `vendi 125 gramas de tempero` e baixar estoque de 500 para 375 somente apos `Confirmar venda`.

Validacao direcionada e final desta rodada:

- `npx vitest run tests/validation/product.test.ts tests/ai/parse-message.test.ts`: primeiro falhou porque `GRAM` ainda nao existia e porque `unidade grama` entrava no nome; depois passou com 2 arquivos e 47 testes.
- `npx vitest run tests/ai/parse-message.test.ts`: primeiro falhou na inferencia por tipo comum de produto; depois passou com 38 testes.
- `npx vitest run tests/ai/assistant-human-fuzz-corpus.test.ts`: depois de estreitar a inferencia de kg para nao classificar `espetinho de carne` como peso, passou com 158 testes.
- `npx prisma validate`: passou; schema valido.
- `npx prisma generate`: passou; Prisma Client 7.8.0 gerado.
- `npm run db:reset-empty`: passou; SQLite local recriado vazio.
- `npx vitest run tests/validation/product.test.ts tests/ai/parse-message.test.ts tests/ai/external-assistant.test.ts tests/ai/nexis-system-prompt.test.ts tests/ai/provider.test.ts`: passou com 5 arquivos e 72 testes.
- `npx playwright test tests/e2e/assistant-commercial-units.spec.ts`: passou com 4 testes mobile Chromium; o fluxo D cadastra `Tempero` por `GRAM`, salva por botao, vende 125 gramas e confirma estoque 375.
- `npm run verify`: passou; lint, typecheck, 455 testes unitarios e build.
- `npm run e2e`: passou com 35 testes mobile Chromium.
- `npm run verify:e2e`: passou com 35 testes mobile Chromium.
- `npm run ai:check-provider`: passou; configuracao valida e smoke test externo executado sem imprimir chave.

## Atualizacao - Identidade de Produto e IA Embarcada

Data: 2026-05-28.

Estado novo:

- plano raiz `PLANO_CADASTRO_PRODUTOS_IA.md` foi atualizado com a implementacao executada;
- `Product.id` foi mantido como chave primaria tecnica e segue sendo a referencia de compra, venda e estoque;
- `Product.normalizedName` foi adicionado com unicidade para cadastro e edicao;
- `ProductAlias` foi criado para aliases confirmados, com `normalizedAlias` unico e `source`;
- `EntryOrigin` foi criado para auditar origem manual/assistant/import/voz futura em produtos e lancamentos criticos;
- migracao `20260528220500_product_ai_identity` aplica os campos novos, backfill de nome normalizado e alias inicial;
- `createProductRecord` grava nome normalizado, alias, origem e movimento inicial com origem;
- assistant usa `lib/products/resolve-product-for-ai.ts` para resolver produto por nome/alias antes de montar rascunho;
- vendas, compras, despesas e produtos confirmados via assistant gravam `ASSISTANT_TEXT`;
- parser passou a entender o caso real da Coca Cola em caixa de 12 por R$ 37, convertendo para custo unitario arredondado de R$ 3,08;
- reanalise opcional por segunda chamada de IA externa foi adicionada via `AI_ASSISTANT_REVIEW_PASS_ENABLED=true`, desligada por padrao;
- `.env.example` recebeu `AI_ASSISTANT_REVIEW_PASS_ENABLED="false"`;
- teste de `db:reset-empty` teve timeout ajustado para 45s porque `prisma migrate deploy` levou cerca de 18s em ambiente frio com duas migracoes.
- `playwright.config.ts` teve timeout do `webServer` ajustado para 300s, porque o servidor E2E executa `prisma migrate deploy` e `next build` antes do `next start`.

Validacao desta rodada:

- `npx prisma validate`: passou.
- `npx prisma generate`: passou.
- `npm run db:reset-empty`: passou; aplicou as 2 migracoes no SQLite local vazio.
- `npx vitest run tests/products/create-product.test.ts tests/products/resolve-product-for-ai.test.ts tests/ai/parse-message.test.ts tests/ai/ai-config.test.ts tests/ai/external-assistant.test.ts tests/prisma-schema.test.ts`: passou com 6 arquivos e 70 testes.
- `npx vitest run tests/db/reset-empty.test.ts`: passou com 3 testes.
- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test`: passou com 32 arquivos e 464 testes.
- `npm run build`: passou.
- `git diff --check`: passou.
- `npm run e2e`: primeira tentativa falhou por timeout do `webServer` em 120s antes de iniciar testes; apos ajustar para 300s, passou com 38 testes mobile Chromium.
