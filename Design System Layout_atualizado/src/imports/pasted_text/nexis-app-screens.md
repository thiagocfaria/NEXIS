Contexto do projeto:
NEXIS é um gestor financeiro com IA para microempreendedores e pequenos comerciantes com pouca familiaridade técnica. O objetivo é permitir controle simples de produtos, compras, vendas, estoque, despesas, lucro e perguntas em linguagem natural.

Stack técnico do projeto:
- Next.js com App Router
- JavaScript e TypeScript
- Tailwind CSS
- Prisma
- SQLite local no MVP
- Zod para validação
- PWA mobile-first
- Vitest e Playwright para testes
- IA apenas como assistente de interpretação, nunca como fonte final dos cálculos financeiros

Direção visual:
Manter o mesmo estilo da tela principal enviada:
- Layout mobile em 375px de largura
- Fundo claro azul acinzentado
- Azul escuro como cor principal
- Cards brancos com sombra suave
- Cantos arredondados modernos
- Botão central inferior com “+”
- Navegação inferior fixa
- Tipografia forte para títulos e valores financeiros
- Visual simples, limpo, amigável e acessível
- Interface pensada para toque no celular
- Ícones simples e consistentes
- Não criar uma landing page. Criar as telas reais do aplicativo.

Identidade visual:
- Nome do app: Nexis
- Tom: simples, confiável, moderno e acolhedor
- Usuário exemplo: Lucas
- Status da IA: “IA ONLINE” ou “IA ATIVA”
- Manter linguagem em português brasileiro

Tela principal:
Manter o mesmo modelo da referência:
- Header com logo Nexis, status da IA, sino de notificações e alternância de tema
- Saudação: “Olá, Lucas”
- Título: “O que você quer fazer hoje?”
- Card principal “Falar com Nexis”
- Campo de comando: “Digite um comando ou pergunta”
- Botão de microfone
- Sugestões rápidas:
  - “Quanto vendi hoje?”
  - “Produtos com estoque baixo”
  - “Registrar venda”
  - “Cadastrar produto”
- Cards de resumo:
  - Vendas: R$ 4.280
  - Lucro líquido: R$ 3.140
  - Despesas: R$ 1.140
  - Estoque: 247 itens
- Atividade recente:
  - Venda registrada
  - Estoque crítico
  - Meta atingida
- Bottom navigation com:
  - Início
  - Produtos
  - Botão central “+”
  - Alertas
  - Perfil

Criar também as telas extras ligadas aos botões de chamada:

1. Tela “Falar com Nexis”
Criar uma tela de chat mobile:
- Header com botão voltar, logo Nexis e status “IA ATIVA”
- Histórico de conversa com bolhas
- Exemplos de mensagens:
  - Usuário: “Quanto vendi hoje?”
  - Nexis: “Hoje você vendeu R$ 4.280. Seu lucro líquido está em R$ 3.140.”
  - Usuário: “Vendi 3 águas 500ml”
  - Nexis mostra um card de rascunho de venda com produto, quantidade, valor e botão “Confirmar venda”
- Campo inferior para digitar mensagem
- Botão de microfone
- Botão enviar
- Importante: qualquer venda, compra, despesa, perda ou cancelamento deve aparecer como rascunho revisável antes de salvar

2. Tela “Registrar venda”
Criar formulário simples:
- Produto
- Quantidade
- Preço unitário
- Total calculado
- Estoque disponível
- Botão principal: “Confirmar venda”
- Botão secundário: “Cancelar”
- Mostrar aviso se estoque for baixo
- Não parecer uma tela técnica. Deve ser fácil para comerciante usar rapidamente

3. Tela “Cadastrar produto”
Criar formulário:
- Nome do produto
- Categoria opcional
- Unidade: unidade, kg, grama, litro, caixa, pacote
- Custo unitário
- Preço de venda
- Estoque atual
- Estoque mínimo
- Botão: “Salvar produto”
- Card de ajuda discreto: “O Nexis usa esses dados para calcular lucro e estoque com segurança.”

4. Tela “Produtos”
Criar lista de produtos:
- Barra de busca
- Filtros: Todos, Estoque baixo, Inativos
- Cards de produto com:
  - Nome
  - Estoque atual
  - Preço de venda
  - Custo
  - Status de estoque
- Botão flutuante ou CTA: “Novo produto”

5. Tela “Compras / Entrada de estoque”
Criar formulário:
- Produto
- Quantidade comprada
- Custo unitário ou custo por embalagem
- Unidades por embalagem
- Total da compra
- Botão: “Confirmar entrada”
- Mostrar prévia: “O estoque será aumentado após confirmação”

6. Tela “Despesas”
Criar tela com:
- Resumo de despesas do mês
- Lista de despesas recentes
- Botão “Nova despesa”
- Formulário de nova despesa com:
  - Descrição
  - Valor
  - Categoria
  - Data
  - Status: paga ou pendente
  - Botão “Confirmar despesa”

7. Tela “Estoque baixo”
Criar tela de alerta:
- Lista de produtos abaixo do estoque mínimo
- Cada item deve mostrar:
  - Produto
  - Estoque atual
  - Estoque mínimo
  - Botão “Comprar mais”
- Usar cores de alerta com moderação, sem assustar o usuário

8. Tela “Relatórios / Ver tudo”
Criar tela de relatório simples:
- Cards de indicadores:
  - Vendas
  - Lucro bruto
  - Lucro líquido
  - Despesas
  - Produtos mais vendidos
- Filtros por período:
  - Hoje
  - Semana
  - Mês
- Gráfico simples de vendas por dia
- Lista de produtos mais vendidos

9. Tela aberta pelo botão central “+”
Criar menu de ações rápidas:
- Registrar venda
- Registrar compra
- Nova despesa
- Cadastrar produto
- Falar com Nexis
Esse menu deve abrir como bottom sheet, mantendo a navegação inferior.

10. Tela “Alertas”
Criar tela com notificações:
- Estoque crítico
- Despesa alta
- Meta atingida
- Produto sem movimentação
- Cada alerta deve ter horário, descrição curta e CTA quando necessário

11. Tela “Perfil”
Criar tela simples:
- Nome do usuário
- Nome do negócio
- Configurações básicas
- Preferência de tema
- Dados da empresa
- Botão “Sair” apenas como visual, sem fluxo complexo

Regras importantes de UX e negócio:
- A IA pode interpretar texto e criar rascunhos, mas nunca deve salvar automaticamente ações financeiras.
- Toda ação crítica precisa de botão claro de confirmação.
- Cálculos de lucro, estoque, faturamento e despesas devem parecer vindos do sistema, não da IA.
- Evitar linguagem técnica como “Prisma”, “Zod”, “backend” dentro das telas.
- O usuário final deve entender tudo sem conhecimento técnico.
- Usar microcopy simples e direta.
- Priorizar botões grandes, legíveis e confortáveis para celular.
- Manter consistência visual com a tela principal enviada.

Entregáveis no Figma:
- Criar frames mobile 375x812 para todas as telas
- Criar componentes reutilizáveis:
  - Header
  - Bottom navigation
  - Card de resumo
  - Card de atividade
  - Botão principal
  - Botão secundário
  - Campo de formulário
  - Card de rascunho da IA
  - Bottom sheet de ação rápida
- Criar protótipo navegável:
  - Home → Falar com Nexis
  - Home → Produtos
  - Home → Alertas
  - Home → Perfil
  - Botão “+” → Bottom sheet
  - Bottom sheet → Registrar venda / compra / despesa / produto
  - “Ver tudo” → Relatórios
- Manter espaçamento, cores e hierarquia visual próximos da referência.

Não criar novas regras de negócio além das descritas. O Figma deve representar a experiência visual e os fluxos de confirmação, mas cálculos financeiros, estoque, lucro, custo e persistência serão tratados pelo código determinístico do sistema.