import { Archive, ArchiveRestore, Pencil } from "lucide-react";
import { ProductForm } from "@/components/products/product-form";
import { formatCentsToBRL, hasLowStock } from "@/lib/finance";
import { setProductActiveAction, updateProductAction } from "@/app/products/actions";
import { productUnitShortLabels } from "@/lib/validation/product";
import type { ProductListItem } from "./product-list";

type ProductCardProps = {
  product: ProductListItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const lowStock = hasLowStock({
    currentStock: product.currentStock,
    minimumStock: product.minimumStock,
    active: product.active,
  });

  return (
    <article
      className={`rounded-lg border bg-white p-4 shadow-[var(--card-shadow)] ${
        lowStock ? "border-[var(--warning)]/30" : "border-[var(--border)]"
      } ${product.active ? "" : "opacity-70"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-extrabold text-[var(--primary)]">{product.name}</h3>
            {!product.active ? (
              <span className="rounded-md bg-[var(--surface-soft)] px-2 py-1 text-[10px] font-bold text-[var(--muted)]">Inativo</span>
            ) : null}
            {lowStock ? (
              <span className="rounded-md bg-[var(--warning-soft)] px-2 py-1 text-[10px] font-bold text-[var(--warning)]">
                Produto acabando
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">{product.category ?? "Sem categoria"}</p>
        </div>
        <form action={setProductActiveAction}>
          <input name="productId" type="hidden" value={product.id} />
          <input name="active" type="hidden" value={product.active ? "false" : "true"} />
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-semibold text-[var(--primary)]"
            type="submit"
          >
            {product.active ? (
              <Archive aria-hidden="true" className="h-4 w-4" />
            ) : (
              <ArchiveRestore aria-hidden="true" className="h-4 w-4" />
            )}
            {product.active ? "Desativar" : "Ativar"}
          </button>
        </form>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Metric label="Custo" value={formatCentsToBRL(product.unitCostCents)} />
        <Metric label="Preço cadastrado" value={formatCentsToBRL(product.salePriceCents)} />
        <Metric label="Estoque atual" value={`${formatQuantity(product.currentStock)} ${productUnitShortLabels[product.unit]}`} />
        <Metric label="Estoque minimo" value={`${formatQuantity(product.minimumStock)} ${productUnitShortLabels[product.unit]}`} />
      </div>

      <details className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-[var(--primary)]">
          <Pencil aria-hidden="true" className="h-4 w-4 text-[var(--purple)]" />
          Editar produto
        </summary>
        <ProductForm action={updateProductAction} product={product} submitLabel="Salvar alteracoes" />
      </details>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--background)] px-3 py-2">
      <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--primary)]">{value}</p>
    </div>
  );
}

function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toString().replace(".", ",");
}
