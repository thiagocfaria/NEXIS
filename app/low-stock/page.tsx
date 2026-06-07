import Link from "next/link";
import { AlertTriangle, PackageCheck, ShoppingCart } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { PageHeader } from "@/components/navigation/page-header";
import { prisma } from "@/lib/db/prisma";
import { hasLowStock } from "@/lib/finance";
import { productUnitShortLabels } from "@/lib/validation/product";

export const dynamic = "force-dynamic";

export default async function LowStockPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      category: true,
      currentStock: true,
      id: true,
      minimumStock: true,
      name: true,
      unit: true,
    },
    where: { active: true },
  });
  const lowStockProducts = products
    .map((product) => ({
      ...product,
      currentStock: Number(product.currentStock),
      minimumStock: Number(product.minimumStock),
    }))
    .filter((product) => hasLowStock(product));

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        description="Itens que precisam de reposicao"
        icon={AlertTriangle}
        title="Estoque baixo"
        tone="warning"
      />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section className="mb-5 flex items-center gap-3 rounded-lg border border-[var(--warning)]/20 bg-[var(--warning-soft)] p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/70 text-[var(--warning)]">
            <AlertTriangle aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold text-[var(--warning)]">
              {formatProductCount(lowStockProducts.length)}
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Reponha antes de acabar para evitar perda de vendas.
            </p>
          </div>
        </section>

        <section aria-labelledby="low-stock-list-heading" className="pb-6">
          <h2 id="low-stock-list-heading" className="mb-3 text-xs font-extrabold uppercase text-[var(--muted)]">
            Produtos abaixo do minimo
          </h2>
          {lowStockProducts.length === 0 ? (
            <div className="rounded-lg border border-[var(--border)] bg-white p-6 text-center shadow-[var(--card-shadow)]">
              <PackageCheck aria-hidden="true" className="mx-auto size-10 text-[var(--success)]" />
              <p className="mt-3 text-sm font-bold text-[var(--primary)]">Estoque em dia</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Nenhum produto ativo esta abaixo do minimo.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {lowStockProducts.map((product) => {
                const status = stockStatus(product.currentStock, product.minimumStock);
                const percentage =
                  product.minimumStock > 0
                    ? Math.max(Math.min((product.currentStock / product.minimumStock) * 100, 100), 0)
                    : 0;

                return (
                  <article
                    className="rounded-lg border border-[var(--warning)]/20 bg-white p-4 shadow-[var(--card-shadow)]"
                    key={product.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-extrabold text-[var(--primary)]">{product.name}</h3>
                        <p className="mt-1 text-xs text-[var(--muted)]">{product.category ?? "Sem categoria"}</p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-extrabold uppercase ${status.className}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <StockMetric
                        label="Estoque atual"
                        unit={productUnitShortLabels[product.unit]}
                        value={product.currentStock}
                        warning
                      />
                      <StockMetric
                        label="Estoque minimo"
                        unit={productUnitShortLabels[product.unit]}
                        value={product.minimumStock}
                      />
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--background)]">
                      <div
                        className={`h-full rounded-full ${status.barClassName}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-[var(--muted)]">
                      {new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(percentage)}% do minimo
                    </p>

                    <Link
                      className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
                      href="/purchases"
                    >
                      <ShoppingCart aria-hidden="true" className="size-4" />
                      Comprar mais
                    </Link>
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

function StockMetric({
  label,
  unit,
  value,
  warning = false,
}: {
  label: string;
  unit: string;
  value: number;
  warning?: boolean;
}) {
  return (
    <div className="rounded-lg bg-[var(--surface-soft)] p-3">
      <p className="text-[10px] text-[var(--muted)]">{label}</p>
      <p className={`mt-1 text-xl font-extrabold ${warning ? "text-[var(--warning)]" : "text-[var(--primary)]"}`}>
        {formatQuantity(value)}
      </p>
      <p className="text-[10px] text-[var(--muted)]">{unit}</p>
    </div>
  );
}

function stockStatus(currentStock: number, minimumStock: number) {
  if (currentStock <= 0) {
    return {
      barClassName: "bg-[var(--danger)]",
      className: "bg-[var(--danger-soft)] text-[var(--danger)]",
      label: "Sem estoque",
    };
  }

  if (currentStock <= minimumStock / 2) {
    return {
      barClassName: "bg-[var(--danger)]",
      className: "bg-[var(--danger-soft)] text-[var(--danger)]",
      label: "Critico",
    };
  }

  return {
    barClassName: "bg-[var(--warning)]",
    className: "bg-[var(--warning-soft)] text-[var(--warning)]",
    label: "Baixo",
  };
}

function formatProductCount(value: number): string {
  return value === 1 ? "1 produto precisa de reposicao" : `${value} produtos precisam de reposicao`;
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(value);
}
