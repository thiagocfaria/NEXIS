import { BarChart3, CircleDollarSign, ShoppingCart, TrendingDown } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { PageHeader } from "@/components/navigation/page-header";
import { getDashboardSummary } from "@/lib/dashboard/summary";
import { prisma } from "@/lib/db/prisma";
import { formatCentsToBRL, summarizeTopProducts } from "@/lib/finance";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const dashboard = await getDashboardSummary();
  const saleItems = await prisma.saleItem.findMany({
    include: {
      product: { select: { name: true } },
      sale: { select: { soldAt: true } },
    },
    where: {
      sale: {
        cancelledAt: null,
        soldAt: {
          gte: dashboard.periods.month.start,
          lte: dashboard.periods.month.end,
        },
      },
    },
  });
  const topProducts = summarizeTopProducts({
    period: dashboard.periods.month,
    saleItems: saleItems.map((item) => ({
      occurredAt: item.sale.soldAt,
      productId: item.productId,
      productName: item.product.name,
      quantity: Number(item.quantity),
      totalAmountCents: item.totalAmountCents,
      totalCostCents: item.totalCostCents,
      unitCostSnapshotCents: item.unitCostSnapshotCents,
      unitPriceCents: item.unitPriceCents,
    })),
  }).items;
  const highestQuantity = topProducts[0]?.quantity ?? 0;

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        description="Resultados calculados com dados reais"
        icon={BarChart3}
        title="Relatorios"
        tone="purple"
      />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section aria-labelledby="today-report-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="today-report-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Hoje
            </h2>
            <span className="text-xs font-semibold text-[var(--primary-medium)]">
              {formatPeriod(dashboard.periods.today.start)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            <ReportMetric label="Vendas" tone="primary" value={formatCentsToBRL(dashboard.today.revenueCents)} />
            <ReportMetric label="Lucro bruto" tone="success" value={formatCentsToBRL(dashboard.today.grossProfitCents)} />
            <ReportMetric label="Despesas" tone="warning" value={formatCentsToBRL(dashboard.today.confirmedExpensesCents)} />
            <ReportMetric label="Lucro liquido" tone="success" value={formatCentsToBRL(dashboard.today.netProfitCents)} />
          </div>
        </section>

        <section aria-labelledby="month-report-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="month-report-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Este mes
            </h2>
            <span className="text-xs font-semibold text-[var(--primary-medium)]">
              {formatMonth(dashboard.periods.month.start)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            <ReportMetric label="Vendas" tone="primary" value={formatCentsToBRL(dashboard.month.revenueCents)} />
            <ReportMetric label="Lucro bruto" tone="success" value={formatCentsToBRL(dashboard.month.grossProfitCents)} />
            <ReportMetric label="Despesas" tone="warning" value={formatCentsToBRL(dashboard.month.confirmedExpensesCents)} />
            <ReportMetric label="Lucro liquido" tone="success" value={formatCentsToBRL(dashboard.month.netProfitCents)} />
          </div>
        </section>

        <section aria-labelledby="top-products-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="top-products-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Mais vendidos no mes
            </h2>
            <span className="rounded-md bg-[var(--purple-soft)] px-2.5 py-1 text-xs font-bold text-[var(--purple)]">
              {topProducts.length}
            </span>
          </div>
          {topProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-white p-6 text-center text-sm text-[var(--muted)]">
              Ainda nao ha vendas confirmadas neste mes.
            </div>
          ) : (
            <div className="grid gap-2.5">
              {topProducts.map((product, index) => {
                const width = highestQuantity > 0 ? Math.max((product.quantity / highestQuantity) * 100, 4) : 0;
                return (
                  <article
                    className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]"
                    key={product.productId}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#eceeff] text-xs font-extrabold text-[var(--primary-medium)]">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="truncate text-sm font-bold text-[var(--primary)]">{product.productName}</p>
                          <p className="shrink-0 text-sm font-extrabold text-[var(--primary)]">
                            {formatCentsToBRL(product.revenueCents)}
                          </p>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--background)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between gap-3 text-[11px] text-[var(--muted)]">
                          <span>{formatQuantity(product.quantity)} vendidos</span>
                          <span>Lucro bruto {formatCentsToBRL(product.grossProfitCents)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
      <BottomNavigation />
    </main>
  );
}

function ReportMetric({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "primary" | "success" | "warning";
  value: string;
}) {
  const config = {
    primary: { icon: ShoppingCart, className: "bg-[#eceeff] text-[var(--primary-medium)]" },
    success: { icon: CircleDollarSign, className: "bg-[var(--success-soft)] text-[var(--success)]" },
    warning: { icon: TrendingDown, className: "bg-[var(--warning-soft)] text-[var(--warning)]" },
  }[tone];
  const Icon = config.icon;

  return (
    <article className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
      <span className={`flex size-8 items-center justify-center rounded-lg ${config.className}`}>
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <p className="mt-3 break-words text-lg font-extrabold text-[var(--primary)]">{value}</p>
      <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{label}</p>
    </article>
  );
}

function formatPeriod(value: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(value);
}

function formatMonth(value: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(value);
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(value);
}
