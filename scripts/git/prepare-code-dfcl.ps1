param(
  [string]$BranchName = "code_dfcl",
  [string]$MainBranch = "main",
  [string]$RemoteName = "origin"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git nao foi encontrado no PATH. Instale o Git ou abra um terminal onde git funcione."
}

$insideWorkTree = git rev-parse --is-inside-work-tree 2>$null
if ($insideWorkTree -ne "true") {
  Write-Error "Esta pasta ainda nao e um repositorio Git. Clone o repositorio ou inicialize corretamente antes de rodar este script."
}

$remoteUrl = git remote get-url $RemoteName 2>$null
if (-not $remoteUrl) {
  Write-Error "Remote '$RemoteName' nao encontrado. Configure com: git remote add origin https://github.com/thiagocfaria/NEXIS.git"
}

Write-Host "Buscando atualizacoes do remoto..."
git fetch $RemoteName --prune

Write-Host "Atualizando $MainBranch..."
git checkout $MainBranch
git pull $RemoteName $MainBranch

$localBranchExists = git branch --list $BranchName
if ($localBranchExists) {
  Write-Host "Entrando na branch local $BranchName..."
  git checkout $BranchName
  git rebase $MainBranch
} else {
  Write-Host "Criando branch local $BranchName a partir de $MainBranch..."
  git checkout -b $BranchName $MainBranch
}

$remoteBranchExists = git ls-remote --heads $RemoteName $BranchName
if ($remoteBranchExists) {
  Write-Host "Branch remota ja existe. Configurando tracking..."
  git branch --set-upstream-to="$RemoteName/$BranchName" $BranchName
} else {
  Write-Host "Publicando branch $BranchName no remoto..."
  git push -u $RemoteName $BranchName
}

$currentBranch = git branch --show-current
if ($currentBranch -ne $BranchName) {
  Write-Error "Branch atual inesperada: $currentBranch. Esperado: $BranchName."
}

Write-Host "Pronto. Trabalhe somente na branch $BranchName."
