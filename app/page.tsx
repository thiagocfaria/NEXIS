import Link from "next/link";
import { ArrowRight, BotMessageSquare, Mic } from "lucide-react";
import { LowStockList } from "@/components/dashboard/low-stock-list";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SummaryCard, type SummaryCardData } from "@/components/dashboard/summary-card";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { NexisHeader } from "@/components/navigation/nexis-header";
import { getDashboardSummary } from "@/lib/dashboard/summary";
import { calculateProfitPercent, formatCentsToBRL } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dashboard = await getDashboardSummary();
  const todayCards = buildTodayCards(dashboard);
  const monthCards = buildMonthCards(dashboard);

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <NexisHeader />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section className="pb-5">
          <p className="text-sm font-semibold text-[var(--muted)]">Seu negocio em um so lugar</p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight text-[var(--primary)]">
            O que voce quer fazer hoje?
          </h1>
        </section>

        <Link
          className="relative mb-6 overflow-hidden rounded-lg bg-[var(--primary)] p-4 text-white shadow-[var(--card-shadow-strong)]"
          href="/assistant"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[rgba(200,255,71,0.16)] text-[var(--accent)]">
              <BotMessageSquare className="size-4" />
            </span>
            <span className="text-sm font-bold">Falar com NEXIS</span>
            <span className="ml-auto rounded-md border border-[rgba(200,255,71,0.28)] bg-[rgba(200,255,71,0.12)] px-2 py-1 text-[9px] font-extrabold uppercase text-[var(--accent)]">
              IA ativa
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm text-white/60">
              Digite uma pergunta ou registre um movimento
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)]">
              <Mic className="size-4" />
            </span>
          </div>
        </Link>

        <section aria-labelledby="actions-heading" className="pb-6">
          <h2 id="actions-heading" className="mb-3 text-xs font-extrabold uppercase text-[var(--muted)]">
            Acoes rapidas
          </h2>
          <QuickActions />
        </section>

        <section aria-labelledby="today-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="today-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Resumo de hoje
            </h2>
            <span className="text-xs font-semibold text-[var(--primary-medium)]">Dados reais</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {todayCards.map((card) => (
              <SummaryCard card={card} key={card.label} />
            ))}
          </div>
        </section>

        <section aria-labelledby="month-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="month-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Este mes
            </h2>
            <Link className="flex items-center gap-1 text-xs font-semibold text-[var(--primary-medium)]" href="/reports">
              Ver relatorios <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
            {monthCards.map((card) => (
              <SummaryCard card={card} key={card.label} />
            ))}
          </div>
        </section>

        <section aria-labelledby="low-stock-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="low-stock-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Produtos acabando
            </h2>
            <Link className="flex items-center gap-1 text-xs font-semibold text-[var(--primary-medium)]" href="/low-stock">
              Ver todos <ArrowRight className="size-3.5" />
            </Link>
            <span className="sr-only">{dashboard.month.lowStockCount} produtos abaixo do minimo</span>
          </div>
          <LowStockList products={dashboard.lowStockProducts} />
        </section>
      </div>
      <BottomNavigation />
    </main>
  );
}

function buildTodayCards(dashboard: Awaited<ReturnType<typeof getDashboardSummary>>): SummaryCardData[] {
  const profitPercent = calculateProfitPercent({
    profitCents: dashboard.today.netProfitCents,
    revenueCents: dashboard.today.revenueCents,
  });

  return [
    {
      label: "Vendas hoje",
      value: formatCentsToBRL(dashboard.today.revenueCents),
      tone: "revenue",
      helper: formatSalesCount(dashboard.today.salesCount),
    },
    {
      label: "Despesas",
      value: formatCentsToBRL(dashboard.today.confirmedExpensesCents),
      tone: "expense",
      helper: "Confirmadas",
    },
    {
      label: "Lucro liquido",
      value: formatCentsToBRL(dashboard.today.netProfitCents),
      tone: "profit",
      helper: profitPercent === null ? "Depois das despesas" : `${formatPercent(profitPercent)} das vendas`,
    },
  ];
}

function buildMonthCards(dashboard: Awaited<ReturnType<typeof getDashboardSummary>>): SummaryCardData[] {
  const profitPercent = calculateProfitPercent({
    profitCents: dashboard.month.netProfitCents,
    revenueCents: dashboard.month.revenueCents,
  });

  return [
    {
      label: "Vendas no mes",
      value: formatCentsToBRL(dashboard.month.revenueCents),
      tone: "revenue",
      helper: formatSalesCount(dashboard.month.salesCount),
    },
    {
      label: "Lucro bruto",
      value: formatCentsToBRL(dashboard.month.grossProfitCents),
      tone: "profit",
      helper: "Venda menos custo",
    },
    {
      label: "Despesas",
      value: formatCentsToBRL(dashboard.month.confirmedExpensesCents),
      tone: "expense",
      helper: "Confirmadas",
    },
    {
      label: "Lucro liquido",
      value: formatCentsToBRL(dashboard.month.netProfitCents),
      tone: "profit",
      helper: profitPercent === null ? "Lucro bruto menos despesas" : `${formatPercent(profitPercent)} das vendas`,
    },
    {
      label: "Produtos acabando",
      value: String(dashboard.month.lowStockCount),
      tone: "stock",
      helper: "Ativos abaixo do minimo",
    },
  ];
}

function formatSalesCount(value: number): string {
  return value === 1 ? "1 venda" : `${value} vendas`;
}

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value)}%`;
}
