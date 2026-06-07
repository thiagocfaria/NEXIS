import { ArrowLeft, PackagePlus } from "lucide-react";
import Link from "next/link";
import { ProductForm, type ProductFormInitialValues } from "@/components/products/product-form";
import { ProductList, type ProductListItem } from "@/components/products/product-list";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { prisma } from "@/lib/db/prisma";
import { productUnitValues, type ProductUnitValue } from "@/lib/validation/product";
import { createProductAction } from "./actions";

export const dynamic = "force-dynamic";

const productListLimit = 50;

type ProductsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const assistantInitialValues = parseAssistantProductInitialValues(resolvedSearchParams);
  const assistantSensitiveProductWarning = paramValue(resolvedSearchParams, "sensitiveProductWarning") === "1";
  const products = await prisma.product.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    take: productListLimit,
  });
  const productItems: ProductListItem[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    unit: product.unit,
    unitCostCents: product.unitCostCents,
    salePriceCents: product.salePriceCents,
    currentStock: Number(product.currentStock),
    minimumStock: Number(product.minimumStock),
    active: product.active,
  }));

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            aria-label="Voltar ao painel"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--primary)]"
            href="/"
            title="Voltar ao painel"
          >
            <ArrowLeft aria-hidden="true" className="size-[18px]" />
          </Link>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple-soft)] text-[var(--purple)]">
            <PackagePlus aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold text-[var(--primary)]">Produtos</h1>
            <p className="truncate text-xs text-[var(--muted)]">Cadastro, precos e estoque minimo</p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section aria-labelledby="new-product-heading" className="pb-6">
          <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
            <h2 id="new-product-heading" className="text-lg font-extrabold text-[var(--primary)]">Adicionar produto</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Preencha os dados e revise antes de salvar.
            </p>
            {assistantInitialValues ? (
              <p className="mt-3 rounded-lg border border-[var(--success)]/20 bg-[var(--success-soft)] px-3 py-2 text-sm font-semibold leading-6 text-[var(--primary)]">
                NEXIS preencheu o que conseguiu entender. Revise os campos antes de salvar.
                {assistantSensitiveProductWarning ? (
                  <> Registre apenas operacoes legais e autorizadas; este cadastro e somente financeiro/cadastral.</>
                ) : null}
              </p>
            ) : null}
            <ProductForm action={createProductAction} initialValues={assistantInitialValues} submitLabel="Salvar produto" />
          </div>
        </section>

        <section aria-labelledby="product-list-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="product-list-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Produtos cadastrados
            </h2>
            <span className="rounded-md bg-[#eceeff] px-2.5 py-1 text-xs font-bold text-[var(--primary-medium)]">
              {productItems.length}/{productListLimit}
            </span>
          </div>
          <ProductList products={productItems} />
        </section>
      </div>
      <BottomNavigation />
    </main>
  );
}

function parseAssistantProductInitialValues(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): ProductFormInitialValues | undefined {
  if (paramValue(searchParams, "assistantProduct") !== "1") {
    return undefined;
  }

  return {
    assistantProduct: true,
    category: paramValue(searchParams, "category") ?? null,
    initialPurchase: paramValue(searchParams, "initialPurchase") === "1",
    initialStock: numberParam(searchParams, "initialStock"),
    minimumStock: numberParam(searchParams, "minimumStock"),
    name: paramValue(searchParams, "name"),
    salePriceCents: integerParam(searchParams, "salePriceCents"),
    unit: unitParam(searchParams, "unit"),
    unitCostCents: integerParam(searchParams, "unitCostCents"),
  };
}

function paramValue(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
): string | undefined {
  const value = searchParams?.[key];
  const text = Array.isArray(value) ? value[0] : value;
  const trimmed = text?.trim();
  return trimmed ? trimmed : undefined;
}

function unitParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
): ProductUnitValue | undefined {
  const value = paramValue(searchParams, key);
  return value && productUnitValues.includes(value as ProductUnitValue) ? value as ProductUnitValue : undefined;
}

function integerParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
): number | undefined {
  const value = paramValue(searchParams, key);
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

function numberParam(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
): number | undefined {
  const value = paramValue(searchParams, key);
  if (!value || !/^\d+(\.\d+)?$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
