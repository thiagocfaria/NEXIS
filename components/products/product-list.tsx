import { PackageOpen } from "lucide-react";
import type { ProductUnitValue } from "@/lib/validation/product";
import { ProductCard } from "./product-card";

export type ProductListItem = {
  id: string;
  name: string;
  category: string | null;
  unit: ProductUnitValue;
  unitCostCents: number;
  salePriceCents: number;
  currentStock: number;
  minimumStock: number;
  active: boolean;
};

type ProductListProps = {
  products: ProductListItem[];
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-white p-6 text-center text-[var(--muted)]">
        <PackageOpen aria-hidden="true" className="mx-auto h-9 w-9 text-[var(--purple)]" />
        <p className="mt-3 text-sm font-bold text-[var(--primary)]">Nenhum produto cadastrado</p>
        <p className="mt-1 text-sm">Salve o primeiro produto para comecar a controlar seu estoque.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
