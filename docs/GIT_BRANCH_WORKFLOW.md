# Guia de Branches Git para o NEXIS

Este guia descreve um fluxo simples para desenvolver novas features e correcoes sem enviar alteracoes direto para a branch `main`.

## Objetivo do Fluxo

- `main`: branch principal e mais estavel do projeto.
- `develop`: branch de validacao antes de integrar na `main`.
- `feature/minha-correcao`: branch isolada para uma tarefa, correcao ou melhoria especifica.

Regra principal: nao trabalhe direto na `main`. Crie uma branch de feature, valide localmente, envie para o GitHub e abra um Pull Request para revisao.

## Separacao de Responsabilidades no Projeto

Como voce ficou responsavel pela parte de UX e tambem vai apoiar regras de negocio, use esta separacao para organizar suas branches, commits e Pull Requests.

### Parte Visual, UX e Interface

Normalmente envolve arquivos ligados a tela, experiencia do usuario, estilos e navegacao:

- `app/`: paginas, rotas, layouts, loading states e telas principais do Next.js.
- `components/`: componentes visuais reutilizaveis, como botoes, cards, formularios, chat, campos e navegacao.
- `app/globals.css`: estilos globais, ajustes responsivos e comportamento visual base.
- `public/`: icones, imagens e assets estaticos.
- Textos visiveis para o usuario em telas, formularios, botoes, mensagens e feedbacks.
- Ajustes mobile-first, acessibilidade, responsividade, estados de carregamento, erro e sucesso.

Exemplos de branches para UX:

```powershell
git checkout -b feature/ux-dashboard-mobile
git checkout -b feature/ux-formulario-produtos
git checkout -b fix/ux-chat-overflow
```

Ao mexer em UX, valide pelo menos:

```powershell
npm run lint
npm run typecheck
npm run build
```

Se mudou fluxo de tela, formulario, navegacao ou comportamento visual importante, rode tambem:

```powershell
npm run e2e
npm run verify:e2e
```

### Regra de Negocio e Logica do Sistema

Normalmente envolve arquivos que calculam, validam, persistem ou decidem o comportamento financeiro do sistema:

- `lib/finance/`: calculos de faturamento, custo, lucro, estoque e relatorios.
- `lib/ai/`: interpretacao de mensagens, assistant, classificacao de intencao e rascunhos.
- `lib/products/`: criacao, validacao e resolucao de produtos.
- `lib/reports/`: consultas e dados usados em respostas e relatorios.
- `app/api/`: rotas de API e integracoes server-side.
- `prisma/schema.prisma`: modelos de banco, enums e relacionamentos.
- `prisma/migrations/`: alteracoes estruturais no banco.
- `tests/`: testes de validacao, regras financeiras, assistant e fluxos criticos.

Exemplos de branches para regra de negocio:

```powershell
git checkout -b feature/regra-lucro-liquido
git checkout -b feature/regra-estoque-minimo
git checkout -b fix/regra-venda-estoque-insuficiente
```

Ao mexer em regra de negocio, banco, assistant ou calculos financeiros, valide com mais rigor:

```powershell
npx prisma validate
npx prisma generate
npm run lint
npm run typecheck
npm run test
npm run build
git diff --check
```

Se a regra alterar comportamento visivel para o usuario, rode tambem:

```powershell
npm run e2e
npm run verify:e2e
```

### Quando a Mudanca Mistura UX e Regra de Negocio

Algumas tarefas misturam tela e comportamento, por exemplo:

- mudar formulario de venda e tambem a validacao de estoque;
- alterar tela do assistant e tambem o parser de mensagens;
- ajustar cadastro de produto e tambem a regra de produto duplicado;
- mudar dashboard e tambem o calculo de lucro exibido.

Nesses casos, prefira uma branch com nome claro:

```powershell
git checkout -b feature/ux-regra-cadastro-produto
git checkout -b feature/ux-regra-dashboard-lucro
```

No Pull Request, explique separadamente:

- o que mudou na UX;
- o que mudou na regra de negocio;
- quais testes foram executados;
- quais pontos precisam de revisao do parceiro.

## 1. Clonar o Repositorio

Se voce ainda nao clonou o projeto:

```powershell
git clone URL_DO_REPOSITORIO
cd NEXIS
```

Exemplo:

```powershell
git clone https://github.com/usuario/NEXIS.git
cd NEXIS
```

O que faz:

- `git clone URL_DO_REPOSITORIO`: baixa o projeto do GitHub para sua maquina.
- `cd NEXIS`: entra na pasta do projeto.

Se o projeto ja estiver clonado, entre na pasta local:

```powershell
cd C:\Users\diego.cabral\Documents\GitHub\NEXIS
```

## 2. Atualizar a Branch Principal

Antes de criar qualquer branch nova, garanta que sua `main` local esta atualizada:

```powershell
git checkout main
git pull origin main
```

O que faz:

- `git checkout main`: muda para a branch `main`.
- `git pull origin main`: baixa e aplica as atualizacoes mais recentes da `main` no GitHub.

## 3. Criar a Branch `develop`

Crie a `develop` a partir da `main` atualizada:

```powershell
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

O que faz:

- `git checkout -b develop`: cria a branch `develop` e ja muda para ela.
- `git push -u origin develop`: envia a `develop` para o GitHub e vincula sua branch local ao remoto.

Depois disso, use este fluxo:

```text
main     -> branch estavel
develop  -> branch de validacao
feature  -> branch de trabalho isolado
```

Se a `develop` ja existir no GitHub e voce so precisar baixa-la:

```powershell
git fetch origin
git checkout develop
git pull origin develop
```

## 4. Criar uma Feature a Partir da `develop`

Sempre crie a feature a partir da `develop` atualizada:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/minha-correcao
```

O que faz:

- `git checkout develop`: muda para a branch de validacao.
- `git pull origin develop`: atualiza sua `develop` local.
- `git checkout -b feature/minha-correcao`: cria uma branch isolada para sua correcao.

## 5. Trabalhar, Commitar e Enviar a Feature

Depois de alterar arquivos, confira o estado:

```powershell
git status
```

Adicione os arquivos alterados:

```powershell
git add .
```

Crie o commit:

```powershell
git commit -m "Corrige problema X"
```

Envie a branch para o GitHub:

```powershell
git push -u origin feature/minha-correcao
```

O que faz:

- `git status`: mostra arquivos alterados, adicionados ou pendentes.
- `git add .`: prepara todas as alteracoes para commit.
- `git commit -m "Corrige problema X"`: salva um ponto de versao local com uma mensagem clara.
- `git push -u origin feature/minha-correcao`: envia sua branch para o GitHub.

Depois disso, abra um Pull Request no GitHub:

```text
feature/minha-correcao -> develop
```

Seu parceiro revisa a PR antes da alteracao chegar na branch de validacao.

Quando a `develop` estiver validada, abra outro Pull Request:

```text
develop -> main
```

Assim, nenhuma alteracao entra direto na `main` sem revisao.

## 6. Testar Localmente Antes de Enviar

Antes de fazer push ou abrir Pull Request, rode os comandos de qualidade do projeto:

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

Se voce alterou banco, Prisma, regras financeiras, assistant ou fluxo critico, rode tambem os comandos exigidos pelos criterios do projeto:

```powershell
npx prisma validate
npx prisma generate
git diff --check
```

Se houve mudanca de tela ou fluxo de usuario:

```powershell
npm run e2e
npm run verify:e2e
```

Nao registre resultado de teste que nao foi executado.

## 7. Manter sua Branch Atualizada

Boa pratica para comecar o dia:

```powershell
git checkout main
git pull origin main

git checkout develop
git pull origin develop
```

Se voce ja estiver trabalhando em uma feature e quiser trazer as mudancas mais recentes da `develop`:

```powershell
git checkout feature/minha-correcao
git pull origin develop
```

Alternativa mais organizada, quando voce ja conhece `rebase`:

```powershell
git checkout feature/minha-correcao
git fetch origin
git rebase origin/develop
```

Use `rebase` com cuidado se a branch ja tiver sido compartilhada com outras pessoas. Para o fluxo mais simples, `git pull origin develop` e suficiente.

## 8. Resumo do Fluxo Recomendado

```powershell
git checkout main
git pull origin main

git checkout develop
git pull origin develop

git checkout -b feature/nome-da-tarefa

# faca suas alteracoes

git status
git add .
git commit -m "Descreve a alteracao feita"
git push -u origin feature/nome-da-tarefa
```

Depois, abra o Pull Request:

```text
feature/nome-da-tarefa -> develop
```

Quando estiver revisado e validado:

```text
develop -> main
```
