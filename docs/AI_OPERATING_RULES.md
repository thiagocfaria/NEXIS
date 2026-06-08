# Regras de Operacao da IA

Ultima atualizacao: 2026-05-29

## Regra Principal

A IA pode ajudar a entender a fala/texto do usuario e preencher rascunhos. A fonte de verdade de dinheiro, estoque, lucro, despesa e faturamento e sempre codigo deterministico no backend.

As invariantes permanentes do projeto ficam em `REGRAS_INVARIANTES.md`. Qualquer mudanca de parser, prompt, provider externo, fluxo de confirmacao, schema, banco ou interface critica precisa respeitar esse arquivo.

## Permitido

A IA pode:

- interpretar texto livre;
- transcrever audio para texto quando houver STT real;
- sugerir classificacao de despesa;
- gerar rascunho de venda, compra, despesa, perda de estoque ou cancelamento rastreavel;
- abrir o formulario de cadastro de produto com campos pre-preenchidos pelo texto interpretado;
- responder perguntas usando dados ja calculados pelo sistema;
- explicar numeros em linguagem simples;
- pedir campos faltantes antes de gerar rascunho;
- manter contexto curto de continuacao para completar campos faltantes;
- futuramente preencher formularios, desde que o usuario revise e confirme.

## Proibido

A IA nao pode:

- calcular lucro, estoque, custo, faturamento ou despesa como fonte de verdade;
- salvar venda, compra, despesa, produto, estoque ou configuracao critica sem confirmacao explicita;
- tratar audio como confirmacao automatica;
- inventar produto, preco, custo, quantidade, estoque ou lucro;
- apagar, corrigir, estornar ou cancelar dados sem fluxo rastreavel e confirmacao;
- expor `.env`, tokens, cookies, chaves ou credenciais;
- usar chave de IA no frontend;
- depender de resposta natural de modelo para persistir dados.

## Fluxo Obrigatorio

Texto ou voz seguem o mesmo caminho:

1. Usuario digita ou fala.
2. Audio, quando habilitado, vira texto revisavel.
3. Parser/IA normaliza texto, classifica intencao e extrai entidades.
4. Zod valida a estrutura.
5. Sistema consulta banco quando precisar de dados reais.
6. Se faltarem campos, sistema pergunta a proxima informacao necessaria.
7. Sistema mostra resposta ou rascunho.
8. Usuario confirma por botao claro.
9. Server Action revalida e persiste.
10. Numeros sao recalculados por codigo deterministico.

Mensagens como `sim`, `pode salvar`, `confirma ai` ou audio ambiguo nao devem salvar por si so.

## Estado Atual do Assistant

Implementado:

- camada v2 em `lib/ai/conversation-engine.ts` com `normalizeUserMessage`, `classifyIntent`, `extractEntities`, `resolveProduct`, `nextQuestionPlanner` e helpers de nome/variante;
- confidence simples em `assessConversationConfidence`, com `HIGH`, `MEDIUM` e `LOW`;
- detector de multiplas acoes em `detectMultipleActions`, bloqueando frases como `comprei coca, vendi agua e gastei 10`;
- prioridade de intencao: perigoso, social, acao/transacao, pergunta financeira, desconhecido;
- conversa social minima para cumprimentos e pergunta `o que voce faz?`, sem rascunho e sem relatorio;
- conversa social tambem cobre `voce pode me ajudar?`, sem rascunho e sem relatorio;
- perguntas por texto: vendas, lucro bruto, lucro liquido, despesas, estoque atual, compras, produtos mais vendidos, resumo financeiro e produtos acabando;
- rascunho de venda para produto existente;
- rascunho de compra para produto existente;
- frase longa de cadastro/compra como `quero cadastrar a compra que eu fiz de 10 coca cola em lata 350 ml...` tratada como entrada/cadastro seguro, nao como relatorio de compras;
- intencao parcial de compra/entrada de estoque para frases como `coloca 5 refrigerantes no estoque`, `entrou 10 agua no estoque` e `comprei 5 produtos`;
- extracao de custo unitario em frases como `paguei 4 reais em cada uma`, `comprei 5 refrigerantes por 4 reais cada`, `4,20 em cada`, `por 4.20 a unidade`, `a 25,50 o kg` e `entrou 10 agua no estoque, paguei 2 em cada`;
- extracao de unidades comerciais em compras, vendas e cadastros: `kg`, `quilo`, `grama`, `litro`, `ml`, `metro`, `m2`, `m3`, `caixa`, `saco`, `fardo`, `pacote`, `bandeja`, `cartela`, `duzia`, `peca` e `unidade`;
- conversao de embalagem com unidades internas para unidade vendida, como `2 caixas ... com 12 unidades cada a 36 a caixa` ou `fardo com 6 aguas de 500 ml por 18 reais` virando unidades vendidas com custo unitario calculado;
- conversao de custo por embalagem para custo unitario usando `preco da embalagem / unidades de venda`, arredondando para centavos quando a divisao nao fecha em duas casas decimais;
- conversao deterministica entre `kg` e `grama` quando a unidade cadastrada do produto e compativel;
- `grama` e unidade propria no cadastro (`GRAM`); converter para `KG` somente quando a base de preco dita pelo usuario for kg;
- pergunta de continuacao deve preservar unidade extraida, por exemplo `Por quanto você vende o kg?` e `Qual estoque mínimo em kg?`;
- typos de produto como `macan` nao sao corrigidos silenciosamente para outro produto;
- frase real `quero cadastrar 10 coca cola em lata que eu comprei por 4.20 cada uma` extrai produto, quantidade e custo unitario sem pedir custo novamente;
- pergunta de esclarecimento quando `comprei 5 refrigerantes por 20 reais` puder significar total da compra ou valor unitario;
- sem unidade explicita em cadastro de produto, o assistant usa `UNIT`; nao infere unidade por marca ou nome especifico;
- desambiguacao de produto quando existem varios produtos parecidos, sem escolher sozinho;
- continuacao de produto ambiguo guarda opcoes no `pendingContext` e aceita numero, ordinal simples (`primeira`, `segunda`) ou trecho/volume (`1`, `opcao 2`, `a de 600`, `coca lata`, `a de 2 litros`);
- escolha de produto ambiguo usa o `id` da opcao escolhida para continuar venda/compra, sem reabrir busca aproximada por nome;
- resposta ainda ambigua, como `a lata` entre `lata` e `lata 350 ml`, pede numero e nao executa sozinha;
- conversa de continuacao para custo unitario, preco de venda e estoque minimo quando a entrada cita produto ainda nao cadastrado;
- nova acao clara depois de contexto pendente, como `gastei...` apos pergunta de preco de venda de produto novo, volta ao parser normal e nao e consumida como continuacao;
- rascunho de despesa;
- cadastro de produto por texto abre `/products` com nome, unidade, custo, preco de venda, estoque inicial e estoque minimo quando entendidos;
- quando o cadastro de produto por texto nasceu de uma compra, o estoque inicial salvo vira compra real no historico, nao ajuste generico;
- campos faltantes no cadastro de produto ficam em branco na tela para o usuario completar, sem resposta textual bloqueando o fluxo;
- bloqueio de produto duplicado por nome normalizado antes de salvar;
- rascunho de perda/quebra/desperdicio de estoque com produto, quantidade, motivo, custo snapshot e impacto de estoque, persistindo apenas por botao;
- rascunho de cancelamento/estorno/correcao para venda, compra ou despesa com evento rastreavel, sem delete fisico;
- cancelamento por texto pede mais detalhe quando existe mais de um alvo parecido, sem escolher o registro mais recente sozinho;
- bloqueio de comandos destrutivos sem fluxo seguro, incluindo apagar, excluir, deletar e remover;
- fallback rule-based quando IA externa esta desligada;
- IA externa server-side opcional com JSON validado por Zod;
- confirmacao por botao para persistir rascunho.

## Matriz Operacional de Intencoes

O fallback rule-based deve cobrir o basico mesmo com `AI_ASSISTANT_ENABLED=false`.

| Intencao | Frases de entrada | Campos obrigatorios | Comportamento seguro |
| --- | --- | --- | --- |
| Cadastro de produto | cadastrar produto, criar produto, adicionar produto, coloca produto no sistema | nome, custo, preco de venda, estoque inicial, estoque minimo, unidade | abre `/products` pre-preenchido; campos faltantes ficam vazios; salva somente por botao |
| Compra/entrada de estoque | comprei, entrou no estoque, coloca no estoque, abastece estoque, chegou mercadoria, dei entrada, entrou mais | produto existente, quantidade, custo unitario | se faltar custo de produto existente, pergunta; se produto nao existir, abre cadastro seguro com os dados entendidos |
| Venda/saida de estoque | vendi, saiu, cliente comprou, baixou, dei saida | produto existente, quantidade, preco de venda ou preco cadastrado | produto inexistente nao e criado automaticamente |
| Despesa | gastei, paguei, despesa, custo com, conta de, aluguel, energia, embalagem | descricao, valor, categoria inferida quando possivel | gera rascunho de despesa e exige confirmacao |
| Pergunta financeira | quanto vendi, quanto ganhei, lucro bruto, lucro liquido, estoque atual, produto mais vendido, resumo do dia, resumo do mes | periodo quando aplicavel | responde com backend/banco; IA externa nao calcula numero final |
| Social | ola, bom dia, boa tarde, tudo bem, o que voce faz | nao aplicavel | responde curto e util; nao gera relatorio nem rascunho |
| Multiplas acoes | comprei coca, vendi agua e gastei 10 | uma acao por mensagem | pede para escolher compra, venda ou despesa; nao gera rascunho |
| Perda/quebra/desperdicio | perdi, quebrou, estourou, estragou, venceu, joguei fora | produto existente, quantidade, motivo | gera rascunho de perda; baixa estoque e registra `LOSS_WASTE` somente apos confirmacao |
| Cancelamento/correcao | cancelar, corrigir, estornar, desfazer venda/compra/despesa | alvo rastreavel seguro, motivo | gera rascunho de cancelamento; cria evento rastreavel e reversao somente apos confirmacao |
| Bloqueio perigoso | apagar, excluir, deletar, remover | nao aplicavel | bloqueia; nunca apaga fisicamente dados criticos por texto |

Detalhamento operacional:

- `private assistant operational notes (not versioned)`
- `private assistant corpus (not versioned)`

Nao implementado:

- fluxo de caixa projetado seguro;
- pro-labore e metas;
- servico sem estoque;
- voz/STT real.

## Perguntas Financeiras

Quando o usuario pergunta `quanto vendi hoje?`, `qual meu lucro bruto?`, `qual meu estoque atual?` ou `quais produtos vendi mais?`, a resposta deve vir de:

- `getDashboardSummary()`;
- `getAssistantQuestionContext()`;
- `answerQuestionFromSummary()`;
- `answerQuestionFromContext()`;
- funcoes puras em `lib/finance/`.

A IA externa pode ajudar a classificar a intencao da pergunta, mas nao pode inventar numero. Se nao houver funcao deterministica para responder, o sistema deve dizer que ainda nao implementou aquela consulta.

## Rascunhos Criticos

Rascunhos de venda, compra, despesa, recorrencia, pro-labore, servico, perda ou cancelamento e formularios pre-preenchidos de produto devem ter:

- tipo explicito;
- campos estruturados;
- `needsReview=true` quando vier de IA externa ou voz;
- validacao Zod;
- resumo visual ou formulario revisavel antes de salvar;
- botao especifico de confirmacao;
- revalidacao no servidor antes de persistir.

## Identidade de Produto

Produto deve ser resolvido por codigo deterministico antes de virar rascunho critico:

- `Product.id` e a unica chave tecnica para compra, venda e estoque;
- a IA pode sugerir nome e entidades, mas nunca inventar `productId`;
- `Product.normalizedName` bloqueia duplicidade de cadastro;
- `ProductAlias` permite nomes alternativos confirmados como `coca 350` ou `latinha coca`;
- `resolveProductForAi()` deve retornar produto unico, ambiguidade, produto nao encontrado ou candidato a novo produto;
- venda por IA sem produto unico deve perguntar ou bloquear, nunca criar venda por palpite;
- compra/cadastro por IA sem produto unico pode abrir cadastro de novo produto pre-preenchido, mas so persiste por botao;
- lancamentos vindos do assistant devem marcar origem `ASSISTANT_TEXT` enquanto voz/IA externa persistida nao tiver auditoria propria.

## Categorias Genericas

A IA deve mapear exemplos concretos para categorias genericas:

- gasolina, uber, onibus, frete: `TRANSPORT_LOGISTICS`;
- energia, agua, internet, telefone: `UTILITIES`;
- carne, queijo, pao, ingrediente, mercadoria, insumo: `MERCHANDISE_SUPPLIES`;
- embalagem, sacola, caixa, isopor: `PACKAGING_MATERIAL`;
- imposto, taxa, maquininha, tarifa: `TAXES_FEES`;
- salario, diaria, ajudante, funcionario, mao de obra: `LABOR`;
- aluguel: `RENT`;
- marketing, anuncio, publicidade: `MARKETING`.

Perda/quebra confirmada usa categoria financeira `LOSS_WASTE`, cria `StockLoss`, registra movimento `LOSS` e entra como despesa confirmada sem aumentar faturamento.

## IA Externa

Estado atual:

- variaveis server-side existem em `.env.example`;
- `AI_ASSISTANT_ENABLED=false` por padrao;
- `AI_API_KEY` nunca deve ser `NEXT_PUBLIC`;
- `npm run ai:check-provider` diagnostica configuracao sem imprimir chave;
- timeout, JSON invalido, erro HTTP ou configuracao ausente voltam para fallback rule-based;
- se a IA externa conflitar com uma interpretacao deterministica conhecida, o rule-based prevalece.
- conflitos de IA externa incluem troca de produto, unidade comercial, quantidade, custo/preco e intencao financeira conhecida.
- contrato v2 da IA externa aceita `entities`, `missingFields`, `ambiguity`, `nextQuestion` e `draftCandidate`, mas E2E continua passando com `AI_ASSISTANT_ENABLED=false`.
- contrato multi-negocio tambem aceita `sensitiveProductWarning` e `serviceUnsupported`.
- contrato do provider externo tambem aceita `stock_loss_draft` e `cancellation_draft`, sempre como rascunho validado e nunca como persistencia direta.
- `AI_ASSISTANT_REVIEW_PASS_ENABLED=false` por padrao; quando `true`, o backend faz uma segunda chamada com a primeira resposta para reanalise antes de aceitar o JSON final.

## Laboratorio Humano

O assistant deve continuar passando no laboratorio humano antes de novas features:

- `private assistant fuzz tests (not versioned)`: frases de bebidas, espetinho, construcao, agro ficticio, produtos sensiveis ficticios, servicos, despesas, relatorios, ambiguidade e linguagem informal;
- `private assistant business flow E2E (not versioned)`: conversas completas A-G descritas em `private assistant business scenarios (not versioned)`.
- `tests/e2e/assistant-commercial-units.spec.ts`: conversoes comerciais de kg/grama, grama, caixa com unidades internas e confirmacao antes de salvar.
- `private assistant required scenarios E2E (not versioned)`: conversa humanizada com perda e cancelamento por rascunho, confirmacao e conferencia em banco.

Regras especificas:

- produto sensivel ficticio pode ser cadastro financeiro/cadastral, mas sem instrucao de uso, dose, aplicacao, mistura ou venda ilegal;
- servico sem estoque continua fora do fluxo de persistencia e deve responder com bloqueio seguro;
- erro de portugues previsivel pode ser normalizado, mas nunca deve inventar produto, custo, preco, estoque ou quantidade.

## Voz

Estado atual:

- audio fica oculto por padrao com `NEXT_PUBLIC_AUDIO_INPUT_ENABLED=false`;
- provider mock e padrao;
- BetKol CPU real nao esta conectado;
- STT real nao esta conectado;
- TTS nao esta implementado.

Regra futura:

- voz so preenche texto/rascunho;
- transcricao deve ser revisavel;
- salvar continua exigindo botao de confirmacao;
- nenhum audio deve ser salvo permanentemente sem decisao explicita de produto e seguranca.
