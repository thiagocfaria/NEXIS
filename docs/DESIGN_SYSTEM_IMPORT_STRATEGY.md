# Estrategia de Importacao do Design System

Ultima atualizacao: 2026-06-06

Este documento orienta como usar o arquivo `Design System Layout_atualizado.zip` no NEXIS sem substituir o app existente nem quebrar regras financeiras, IA, banco ou fluxos de confirmacao.

## Resumo Operacional

Contexto de migracao:

- origem visual: Figma exportado como projeto Vite;
- destino tecnico: NEXIS em Next.js App Router;
- objetivo: evoluir a interface mobile usando o zip atualizado como referencia visual;
- limite: preservar todas as regras de negocio existentes.

Regras criticas desta migracao:

1. Importacao cirurgica: importar por componente, nao o pacote inteiro. Adaptar o codigo do zip ao padrao do NEXIS.
2. Areas livres de UI: atuar apenas em `app/page.tsx`, `app/globals.css`, `components/` e criar `app/ux-preview/` para testes visuais.
3. Areas proibidas de core: nao alterar `lib/`, `prisma/`, `app/*/actions.ts` nem arquivos de validacao ou IA.
4. Sem mocks em producao: novos componentes devem receber dados reais por props. Nao substituir calculos do backend por dados estaticos do prototipo.
5. Dependencias controladas: nao copiar o `package.json` do zip. Usar preferencialmente o que ja existe no NEXIS, como Tailwind CSS e `lucide-react`.

## Objetivo

Usar o material gerado no Figma como base visual para evoluir a interface mobile do NEXIS, migrando componentes por partes e conectando cada tela ao codigo real ja existente.

O arquivo do Figma deve ser tratado como:

- referencia visual;
- biblioteca de componentes;
- prototipo navegavel;
- fonte de tokens de cor, espacamento e hierarquia visual.

Ele nao deve ser tratado como:

- novo app principal;
- substituto direto do `app/` atual;
- fonte de regra financeira;
- fonte de persistencia;
- fonte de calculo de lucro, estoque, despesa ou faturamento.

## Diagnostico do Arquivo Atualizado

O `Design System Layout_atualizado.zip` contem um projeto separado de prototipo, com estrutura aproximada:

```text
src/main.tsx
src/app/App.tsx
src/app/nexis/components/
src/app/nexis/screens/
src/app/nexis/tokens.ts
src/styles/
package.json
vite.config.ts
```

Isso indica que ele foi gerado como bundle Vite/Figma, nao como implementacao direta de Next.js App Router.

Ele cobre bem:

- Home;
- Falar com Nexis;
- Registrar venda;
- Cadastrar produto;
- Registrar compra;
- Produtos;
- Despesas;
- Estoque baixo;
- Relatorios;
- componentes visuais reutilizaveis;
- card de rascunho da IA com confirmacao.

Pontos que precisam de cuidado antes de virar app real:

- dados estao mockados;
- navegacao e feita por estado local, nao por rotas Next;
- dependencias extras podem aumentar o projeto sem necessidade;
- algumas telas podem estar incompletas, como Alertas, Perfil e bottom sheet real do botao `+`;
- nenhum calculo ou persistencia do prototipo deve substituir o backend atual.

## Regra Principal de Importacao

Importar por componente, nao por pacote inteiro.

O fluxo correto e:

1. identificar o componente visual no zip;
2. adaptar o componente ao padrao do NEXIS;
3. colocar o componente em `components/`;
4. conectar o componente a uma rota real em `app/`;
5. manter actions, validacoes, Prisma e regras financeiras existentes;
6. validar visualmente e tecnicamente antes de avancar para a proxima tela.

## Areas Seguras Para UX

Priorizar alteracoes nestes locais:

```text
app/page.tsx
app/globals.css
app/*/loading.tsx
components/
public/
```

Usar estes locais quando a mudanca for apenas visual, de layout, responsividade, hierarquia, cards, botoes, estados vazios ou loading.

## Areas Sensiveis

Evitar alterar sem necessidade:

```text
lib/finance/
lib/ai/
lib/validation/
lib/products/create-product.ts
lib/reports/
app/*/actions.ts
app/api/
prisma/schema.prisma
prisma/migrations/
tests/
```

Essas areas concentram regras de negocio, IA, validacao, banco e persistencia. So devem mudar quando o objetivo for tambem alterar comportamento funcional, nao apenas visual.

## Estrutura Recomendada Para Migracao

Criar uma area temporaria de preview visual:

```text
app/ux-preview/page.tsx
components/ux-preview/
```

Uso sugerido:

- testar visual novo sem depender do banco;
- comparar telas do Figma com o app real;
- ajustar cores, espacamentos e componentes;
- aprovar identidade visual antes de conectar tudo aos fluxos reais.

Depois da aprovacao visual, migrar componentes para pastas definitivas:

```text
components/dashboard/
components/assistant/
components/products/
components/transactions/
components/navigation/
components/ui/
```

## Ordem Recomendada de Importacao

### 1. Tokens Visuais

Adaptar primeiro cores, raios, sombras e espacamentos do `tokens.ts`.

Destino recomendado:

```text
app/globals.css
components/ui/
```

Evitar criar um sistema grande demais. Comecar apenas com:

- cores principais;
- cores semanticas;
- sombra de card;
- raio de borda;
- espacamento mobile;
- estilo base de botoes e cards.

### 2. Componentes Base

Migrar componentes pequenos antes das telas.

Componentes candidatos:

```text
Button
SummaryCard
ActivityItem
FormField
SelectField
AIDraftCard
SectionHeader
BottomNav
Header
```

Regra: cada componente deve receber dados por props e nao depender de mock fixo.

### 3. Home

Atualizar `app/page.tsx` e componentes de dashboard usando o visual novo.

Manter:

- dados vindos de `lib/dashboard/summary.ts`;
- calculos deterministos;
- links reais para rotas existentes;
- resumo financeiro atual do backend.

Nao trocar numeros reais por valores fixos do prototipo.

### 4. Assistant

Atualizar visual de:

```text
app/assistant/page.tsx
components/assistant/
```

Manter obrigatoriamente:

- historico real;
- rascunho revisavel;
- botao de confirmacao;
- bloqueios de produto inexistente, ambiguo ou estoque insuficiente;
- nenhuma persistencia por texto solto como `sim` ou `pode salvar`.

### 5. Produtos

Atualizar:

```text
app/products/page.tsx
components/products/
```

Manter:

- cadastro manual real;
- edicao real;
- validacoes;
- bloqueio de duplicidade;
- estoque inicial conforme regra atual.

### 6. Vendas, Compras e Despesas

Atualizar visual dos formularios em:

```text
app/sales/page.tsx
app/purchases/page.tsx
app/expenses/page.tsx
components/transactions/
```

Manter:

- Server Actions existentes;
- validacoes Zod;
- atualizacao de estoque por codigo;
- snapshot de custo na venda;
- despesa pendente sem entrar no lucro liquido;
- confirmacao clara antes de salvar.

### 7. Telas Novas

Criar telas novas somente quando fizerem sentido no MVP.

Possiveis rotas:

```text
app/reports/page.tsx
app/alerts/page.tsx
app/profile/page.tsx
```

Se forem apenas mock visual, deixar claro no codigo e no texto da tela que sao preview/estrutura inicial. Se usarem dados reais, conectar ao backend deterministico.

## Branch Recomendada

Usar uma branch especifica para esta frente:

```powershell
git checkout -b feature/ux-design-system-import
```

Se a branch `code_dfcl` for o fluxo atual do projeto, usar:

```powershell
git checkout code_dfcl
git checkout -b feature/ux-design-system-import
```

Nao trabalhar direto em `main`.

## Dependencias

Nao copiar automaticamente o `package.json` do zip.

Antes de instalar qualquer dependencia nova, verificar se ela e realmente necessaria.

Preferir o que o NEXIS ja usa:

- React;
- Next.js;
- Tailwind CSS;
- `lucide-react`.

Evitar adicionar apenas por causa do prototipo:

- MUI;
- Radix em massa;
- bibliotecas de animacao;
- carrosseis;
- bibliotecas grandes nao usadas no fluxo real.

Se uma animacao ou componente depender de pacote novo, primeiro tentar reproduzir com CSS/Tailwind simples.

## Checklist Por Componente

Antes de considerar um componente migrado:

- [ ] nao contem dado financeiro mockado quando usado em tela real;
- [ ] recebe dados por props;
- [ ] nao chama persistencia direta;
- [ ] nao calcula lucro, estoque ou faturamento;
- [ ] nao salva venda, compra, despesa ou produto sozinho;
- [ ] tem botao claro quando representar confirmacao;
- [ ] funciona em viewport mobile;
- [ ] nao causa scroll horizontal;
- [ ] preserva linguagem simples em portugues;
- [ ] nao expoe termos tecnicos ao usuario final.

## Checklist Por Tela

Antes de considerar uma tela migrada:

- [ ] rota real continua abrindo;
- [ ] botoes principais apontam para fluxos reais;
- [ ] estados de loading continuam acessiveis;
- [ ] formularios continuam usando actions/validacoes existentes;
- [ ] rascunhos criticos continuam exigindo confirmacao;
- [ ] dashboard continua usando dados reais;
- [ ] assistant continua respeitando regras de IA;
- [ ] layout funciona em 375px de largura;
- [ ] nao houve mudanca desnecessaria em `lib/`, `prisma/` ou `app/*/actions.ts`.

## Comandos de Validacao

Para preview visual simples:

```powershell
npm run dev
```

Para validar alteracao real de UI:

```powershell
npm run lint
npm run typecheck
npm run build
```

Quando mexer em fluxo critico de UI, assistant ou formularios:

```powershell
npm run test
npm run verify:e2e
```

Se a mudanca tocar banco, Prisma, regra financeira ou persistencia:

```powershell
npx prisma validate
npx prisma generate
npm run test
npm run build
```

Nunca registrar comando como aprovado se ele nao foi executado.

## Resultado Esperado

Ao final da importacao gradual, o NEXIS deve manter:

- visual alinhado ao design do Figma;
- app mobile-first mais polido;
- componentes reutilizaveis;
- fluxo de IA com rascunho e confirmacao;
- calculos financeiros vindos do backend;
- persistencia segura;
- regras invariantes preservadas.

O design deve melhorar a experiencia, nao substituir a fonte de verdade do sistema.
