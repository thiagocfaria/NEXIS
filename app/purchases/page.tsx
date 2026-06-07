import { PackagePlus } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { PageHeader } from "@/components/navigation/page-header";
import { PurchaseForm, type TransactionProductOption } from "@/components/transactions/purchase-form";
import { PurchaseList, type PurchaseListItem } from "@/components/transactions/purchase-list";
import { prisma } from "@/lib/db/prisma";
import { createPurchaseAction } from "./actions";

export const dynamic = "force-dynamic";

const recentPurchasesLimit = 20;

export default async function PurchasesPage() {
  const [products, purchases] = await Promise.all([
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
    prisma.purchase.findMany({
      include: {
        product: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
      orderBy: { purchasedAt: "desc" },
      take: recentPurchasesLimit,
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

  const purchaseItems: PurchaseListItem[] = purchases.map((purchase) => ({
    id: purchase.id,
    productName: purchase.product.name,
    purchasedAt: purchase.purchasedAt.toISOString(),
    quantity: Number(purchase.quantity),
    supplier: purchase.supplier,
    totalCostCents: purchase.totalCostCents,
    unit: purchase.product.unit,
    unitCostCents: purchase.unitCostCents,
  }));

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        description="Registre entradas e atualize o estoque"
        icon={PackagePlus}
        title="Registrar compra"
      />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section aria-labelledby="new-purchase-heading" className="pb-6">
          <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
            <h2 id="new-purchase-heading" className="text-lg font-extrabold text-[var(--primary)]">
              Dados da compra
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Informe por unidade ou use os campos de embalagem.
            </p>
            <PurchaseForm action={createPurchaseAction} products={productOptions} />
          </div>
        </section>

        <section aria-labelledby="purchase-list-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="purchase-list-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Compras recentes
            </h2>
            <span className="rounded-md bg-[#eceeff] px-2.5 py-1 text-xs font-bold text-[var(--primary-medium)]">
              {purchaseItems.length}/{recentPurchasesLimit}
            </span>
          </div>
          <PurchaseList purchases={purchaseItems} />
        </section>
      </div>
      <BottomNavigation />
    </main>
  );
}
