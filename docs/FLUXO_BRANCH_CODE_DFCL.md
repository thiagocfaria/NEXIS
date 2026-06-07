# Fluxo de trabalho - branch code_dfcl

Este projeto deve seguir Feature Branching. Para os ajustes de UX e performance,
trabalhe sempre na branch `code_dfcl`, nunca diretamente na `main`.

## Situacao local

Esta pasta foi estruturada a partir da branch `main` do repositorio:

```text
https://github.com/thiagocfaria/NEXIS
```

O PowerShell atual nao tem `git` disponivel no PATH. Por isso, este workspace
esta com os arquivos do projeto, mas ainda precisa ser ligado ao fluxo Git em
um terminal com Git instalado.

## Preparar branch com Git

Quando o Git estiver disponivel, rode:

```powershell
cd C:\vscode\Faculdade\nexis
.\scripts\git\prepare-code-dfcl.ps1
```

O script:

- valida que voce esta dentro de um repositorio Git;
- busca as atualizacoes do remoto;
- atualiza a `main`;
- cria ou entra na branch `code_dfcl`;
- publica a branch no remoto, se ainda nao existir.

## Rotina antes de mudar tela

```powershell
git checkout main
git pull origin main
git checkout code_dfcl
git rebase main
```

Depois disso, faca as alteracoes de UX/performance.

## Rotina antes de commitar

```powershell
git branch --show-current
npm run lint
npm run typecheck
npm run test
git diff --check
```

O comando `git branch --show-current` deve mostrar:

```text
code_dfcl
```

Se aparecer `main`, pare e troque de branch antes de alterar ou commitar.

## Area recomendada para UX/performance

Preferir arquivos de interface:

- `app/page.tsx`
- `app/*/loading.tsx`
- `app/globals.css`
- `components/dashboard/*`
- `components/products/*`
- `components/transactions/*`
- `components/assistant/*`

Evitar mexer sem necessidade em regra de negocio:

- `lib/finance/*`
- `lib/ai/*`
- `lib/validation/*`
- `lib/products/create-product.ts`
- `prisma/schema.prisma`
- `app/*/actions.ts`

## Regra de seguranca do NEXIS

A UX pode facilitar revisao e confirmacao, mas nao pode salvar venda, compra,
despesa, perda, cancelamento ou produto sem acao explicita do usuario.

A fonte de verdade financeira fica no backend deterministico e no banco, nunca
em texto gerado pela IA.
