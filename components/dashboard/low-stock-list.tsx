import { AlertTriangle } from "lucide-react";
import type { DashboardLowStockProduct } from "@/lib/dashboard/summary";

type LowStockListProps = {
  products: readonly DashboardLowStockProduct[];
};

export function LowStockList({ products }: LowStockListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-white p-4 text-sm font-medium text-[var(--muted)] shadow-[var(--card-shadow)]">
        Nenhum produto acabando
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {products.map((product) => (
        <article className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-3.5 shadow-[var(--card-shadow)]" key={product.id}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--warning-soft)] text-[var(--warning)]">
            <AlertTriangle className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--primary)]">{product.name}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Estoque {formatQuantity(product.currentStock)} de minimo {formatQuantity(product.minimumStock)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(value);
}
