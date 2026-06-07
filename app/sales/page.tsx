import { ShoppingCart } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { PageHeader } from "@/components/navigation/page-header";
import { SaleForm } from "@/components/transactions/sale-form";
import { type TransactionProductOption } from "@/components/transactions/purchase-form";
import { SaleList, type SaleListItem } from "@/components/transactions/sale-list";
import { prisma } from "@/lib/db/prisma";
import { createSaleAction } from "./actions";

export const dynamic = "force-dynamic";

const recentSalesLimit = 20;

export default async function SalesPage() {
  const [products, sales] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        currentStock: true,
        id: true,
        name: true,
        salePriceCents: true,
        unit: true,
        unitCostCents: true,
      },
      where: { active: true },
    }),
    prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: { soldAt: "desc" },
      take: recentSalesLimit,
      where: { cancelledAt: null },
    }),
  ]);

  const productOptions: TransactionProductOption[] = products.map((product) => ({
    currentStock: Number(product.currentStock),
    id: product.id,
    name: product.name,
    salePriceCents: product.salePriceCents,
    unit: product.unit,
    unitCostCents: product.unitCostCents,
  }));

  const saleItems: SaleListItem[] = sales.map((sale) => ({
    id: sale.id,
    items: sale.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      quantity: Number(item.quantity),
      totalCostCents: item.totalCostCents,
      unit: item.product.unit,
      unitCostSnapshotCents: item.unitCostSnapshotCents,
      unitPriceCents: item.unitPriceCents,
    })),
    soldAt: sale.soldAt.toISOString(),
    totalAmountCents: sale.totalAmountCents,
  }));

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        description="Baixe o estoque com confirmacao segura"
        icon={ShoppingCart}
        title="Registrar venda"
        tone="success"
      />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section aria-labelledby="new-sale-heading" className="pb-6">
          <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
            <h2 id="new-sale-heading" className="text-lg font-extrabold text-[var(--primary)]">
              Dados da venda
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Confira produto, quantidade e valor antes de confirmar.
            </p>
            <SaleForm action={createSaleAction} products={productOptions} />
          </div>
        </section>

        <section aria-labelledby="sale-list-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="sale-list-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Vendas recentes
            </h2>
            <span className="rounded-md bg-[var(--success-soft)] px-2.5 py-1 text-xs font-bold text-[var(--success)]">
              {saleItems.length}/{recentSalesLimit}
            </span>
          </div>
          <SaleList sales={saleItems} />
        </section>
      </div>
      <BottomNavigation />
    </main>
  );
}
