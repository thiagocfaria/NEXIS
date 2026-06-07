import { ShoppingCart } from "lucide-react";
import { calculateSaleItemProfitMetrics, formatCentsToBRL } from "@/lib/finance";
import { productUnitShortLabels, type ProductUnitValue } from "@/lib/validation/product";

export type SaleListItem = {
  id: string;
  soldAt: string;
  totalAmountCents: number;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unit: ProductUnitValue;
    unitPriceCents: number;
    unitCostSnapshotCents: number;
    totalCostCents: number;
  }[];
};

type SaleListProps = {
  sales: SaleListItem[];
};

export function SaleList({ sales }: SaleListProps) {
  if (sales.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-white p-6 text-center text-[var(--muted)]">
        <ShoppingCart aria-hidden="true" className="mx-auto size-9 text-[var(--success)]" />
        <p className="mt-3 text-sm font-bold text-[var(--primary)]">Nenhuma venda cadastrada</p>
        <p className="mt-1 text-sm">As vendas salvas aparecem aqui com produto, quantidade e total.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {sales.map((sale) => (
        <article className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]" key={sale.id}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-lg font-extrabold text-[var(--primary)]">
                {formatCentsToBRL(sale.totalAmountCents)}
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">{formatDate(sale.soldAt)}</p>
            </div>
            <span className="shrink-0 rounded-md bg-[var(--success-soft)] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[var(--success)]">
              Venda
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {sale.items.map((item) => (
              <SaleItemRow item={item} key={item.id} />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function SaleItemRow({ item }: { item: SaleListItem["items"][number] }) {
  const profitMetrics = calculateSaleItemProfitMetrics({
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    unitCostSnapshotCents: item.unitCostSnapshotCents,
    totalCostCents: item.totalCostCents,
  });

  return (
    <div className="rounded-lg bg-[var(--surface-soft)] px-3 py-3">
      <p className="break-words text-sm font-bold text-[var(--primary)]">{item.productName}</p>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Metric label="Quantidade" value={`${formatQuantity(item.quantity)} ${productUnitShortLabels[item.unit]}`} />
        <Metric label="Preço desta venda" value={formatCentsToBRL(item.unitPriceCents)} />
        <Metric label="Custo para você" value={formatCentsToBRL(item.unitCostSnapshotCents)} />
        <Metric label="Custo total" value={formatCentsToBRL(item.totalCostCents)} />
        <Metric label="Lucro estimado" value={formatCentsToBRL(profitMetrics.grossProfitCents)} />
        <Metric label="Margem" value={formatPercent(profitMetrics.marginPercent)} />
      </div>
      {profitMetrics.belowCost ? (
        <p className="mt-3 rounded-lg border border-[var(--warning)]/25 bg-[var(--warning-soft)] px-3 py-2 text-sm font-semibold text-[var(--warning)]">
          Atenção: venda abaixo do custo.
        </p>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toString().replace(".", ",");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(value));
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "Sem referência";
  }

  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value)}%`;
}
