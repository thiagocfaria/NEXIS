"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { calculateSaleItemProfitMetrics, formatCentsToBRL } from "@/lib/finance";
import { productUnitShortLabels } from "@/lib/validation/product";
import type { TransactionProductOption } from "./purchase-form";

type SaleFormActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

type SaleFormAction = (state: SaleFormActionState, formData: FormData) => Promise<SaleFormActionState>;

type SaleFormProps = {
  action: SaleFormAction;
  products: TransactionProductOption[];
};

const initialState: SaleFormActionState = {
  status: "idle",
  message: "",
};

export function SaleForm({ action, products }: SaleFormProps) {
  const router = useRouter();
  const [state, setState] = useState<SaleFormActionState>(initialState);
  const [pending, setPending] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );
  const salePreview = useMemo(() => buildSalePreview(selectedProduct, quantity, unitPrice), [
    quantity,
    selectedProduct,
    unitPrice,
  ]);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || products.length === 0) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    setPending(true);
    setState(initialState);

    try {
      const nextState = await action(state, formData);

      setState(nextState);

      if (nextState.status === "success") {
        setSelectedProductId("");
        setQuantity("");
        setUnitPrice("");
      }
    } catch {
      setState({ status: "error", message: "Nao foi possivel salvar a venda. Tente novamente." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
      <FieldMessage message={state.message} status={state.status} />

      <label className="grid gap-2 text-sm font-bold text-[var(--primary)]">
        Produto
        <select
          className="min-h-12 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-base font-semibold text-[var(--foreground)] shadow-sm focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/20"
          name="productId"
          onChange={(event) => {
            const productId = event.target.value;
            const product = products.find((item) => item.id === productId);

            setSelectedProductId(productId);
            setUnitPrice(product ? moneyInputValue(product.salePriceCents) : "");
            setQuantity("");
          }}
          value={selectedProductId}
        >
          <option value="">Escolha um produto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - estoque {formatQuantity(product.currentStock)} {productUnitShortLabels[product.unit]} - preço{" "}
              {moneyInputValue(product.salePriceCents)}
            </option>
          ))}
        </select>
        {selectedProduct ? (
          <span className="rounded-lg border border-[var(--success)]/20 bg-[var(--success-soft)] px-3 py-2 text-sm font-semibold text-[var(--success)]">
            Preço cadastrado: {moneyInputValue(selectedProduct.salePriceCents)}
          </span>
        ) : null}
        <InlineError message={state.fieldErrors?.productId} />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          error={state.fieldErrors?.quantity}
          inputMode="decimal"
          label="Quantidade vendida"
          name="quantity"
          placeholder="1"
          value={quantity}
          onChange={setQuantity}
        />
        <TextInput
          error={state.fieldErrors?.unitPrice}
          inputMode="decimal"
          label="Preço desta venda"
          name="unitPrice"
          placeholder="10,99"
          value={unitPrice}
          onChange={setUnitPrice}
        />
      </div>

      <p className="text-xs leading-5 text-[var(--muted)]">
        Se deixar como está, usamos o preço cadastrado do produto. Você pode alterar só para esta venda.
      </p>

      {salePreview ? (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <PreviewMetric label="Lucro estimado" value={formatCentsToBRL(salePreview.grossProfitCents)} />
            <PreviewMetric label="Margem estimada" value={formatPercent(salePreview.marginPercent)} />
          </dl>
          {salePreview.belowCost ? (
            <p className="mt-3 rounded-lg border border-[var(--warning)]/25 bg-[var(--warning-soft)] px-3 py-2 text-sm font-semibold text-[var(--warning)]">
              Atenção: preço abaixo do custo para você.
            </p>
          ) : null}
        </div>
      ) : null}

      {products.length === 0 ? (
        <p className="rounded-lg border border-[var(--warning)]/25 bg-[var(--warning-soft)] px-3 py-2 text-sm font-semibold text-[var(--warning)]">
          Cadastre um produto ativo antes de salvar venda.
        </p>
      ) : null}

      <button
        className="min-h-12 rounded-lg bg-[var(--primary)] px-4 py-3 text-base font-bold text-white shadow-[var(--card-shadow-strong)] transition hover:bg-[var(--primary-medium)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
        disabled={pending || products.length === 0}
        type="submit"
      >
        {pending ? "Confirmando..." : "Confirmar venda"}
      </button>
    </form>
  );
}

function TextInput({
  error,
  inputMode,
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  error?: string;
  inputMode?: "decimal";
  label: string;
  name: string;
  onChange?: (value: string) => void;
  placeholder: string;
  value?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[var(--primary)]">
      {label}
      <input
        className="min-h-12 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-base font-semibold text-[var(--foreground)] shadow-sm placeholder:text-[var(--muted)] focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/20"
        inputMode={inputMode}
        name={name}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <InlineError message={error} />
    </label>
  );
}

function FieldMessage({ message, status }: { message: string; status: SaleFormActionState["status"] }) {
  if (!message) {
    return null;
  }

  const tone =
    status === "success"
      ? "border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]"
      : "border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]";

  return (
    <p
      aria-live={status === "success" ? "polite" : "assertive"}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${tone}`}
      role={status === "success" ? "status" : "alert"}
    >
      {message}
    </p>
  );
}

function InlineError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <span className="text-sm font-medium text-[var(--danger)]">{message}</span>;
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--primary)]">{value}</dd>
    </div>
  );
}

function buildSalePreview(product: TransactionProductOption | null, quantityText: string, unitPriceText: string) {
  if (!product) {
    return null;
  }

  const parsedQuantity = parseQuantityInput(quantityText);
  const parsedUnitPrice = parseMoneyInputToCents(unitPriceText);

  if (parsedQuantity === null || parsedUnitPrice === null) {
    return null;
  }

  return calculateSaleItemProfitMetrics({
    quantity: parsedQuantity,
    unitPriceCents: parsedUnitPrice,
    unitCostSnapshotCents: product.unitCostCents,
  });
}

function parseQuantityInput(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const quantity = Number(normalized);

  return Number.isFinite(quantity) && quantity > 0 ? quantity : null;
}

function parseMoneyInputToCents(value: string): number | null {
  const normalized = value.trim().replace(",", ".");

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null;
  }

  const [reaisText, centsText = ""] = normalized.split(".");
  const cents = Number(reaisText) * 100 + Number(centsText.padEnd(2, "0"));

  return Number.isSafeInteger(cents) ? cents : null;
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "Sem referência";
  }

  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value)}%`;
}

function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toString().replace(".", ",");
}

function moneyInputValue(value: number): string {
  return (value / 100).toFixed(2).replace(".", ",");
}
