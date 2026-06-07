"use client";

import { useActionState, useEffect, useRef } from "react";
import { productUnitShortLabels, type ProductUnitValue } from "@/lib/validation/product";

type PurchaseFormActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

type PurchaseFormAction = (
  state: PurchaseFormActionState,
  formData: FormData,
) => Promise<PurchaseFormActionState>;

export type TransactionProductOption = {
  id: string;
  name: string;
  unit: ProductUnitValue;
  currentStock: number;
  unitCostCents: number;
  salePriceCents: number;
};

type PurchaseFormProps = {
  action: PurchaseFormAction;
  products: TransactionProductOption[];
};

const initialState: PurchaseFormActionState = {
  status: "idle",
  message: "",
};

export function PurchaseForm({ action, products }: PurchaseFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form action={formAction} className="mt-4 grid gap-4" ref={formRef}>
      <FieldMessage message={state.message} status={state.status} />

      <label className="grid gap-2 text-sm font-bold text-[var(--primary)]">
        Produto
        <select
          className="min-h-12 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-base font-semibold text-[var(--foreground)] shadow-sm focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/20"
          defaultValue=""
          name="productId"
        >
          <option value="">Escolha um produto</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - estoque {formatQuantity(product.currentStock)} {productUnitShortLabels[product.unit]}
            </option>
          ))}
        </select>
        <InlineError message={state.fieldErrors?.productId} />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          error={state.fieldErrors?.quantity}
          inputMode="decimal"
          label="Quantidade comprada"
          name="quantity"
          placeholder="5"
        />
        <TextInput
          error={state.fieldErrors?.unitCost}
          inputMode="decimal"
          label="Custo por unidade"
          name="unitCost"
          placeholder="2,50"
        />
      </div>

      <fieldset className="grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
        <legend className="px-1 text-sm font-bold text-[var(--primary)]">Compra por embalagem</legend>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput
            error={state.fieldErrors?.packageQuantity}
            inputMode="decimal"
            label="Quantidade de embalagens"
            name="packageQuantity"
            placeholder="2"
          />
          <TextInput
            error={state.fieldErrors?.unitsPerPackage}
            inputMode="decimal"
            label="Unidades por embalagem"
            name="unitsPerPackage"
            placeholder="12"
          />
          <TextInput
            error={state.fieldErrors?.packageCost}
            inputMode="decimal"
            label="Custo por embalagem"
            name="packageCost"
            placeholder="18,00"
          />
        </div>
      </fieldset>

      <TextInput
        autoComplete="off"
        error={state.fieldErrors?.supplier}
        label="Fornecedor"
        name="supplier"
        placeholder="Opcional"
      />

      {products.length === 0 ? (
        <p className="rounded-lg border border-[var(--warning)]/25 bg-[var(--warning-soft)] px-3 py-2 text-sm font-semibold text-[var(--warning)]">
          Cadastre um produto ativo antes de salvar compra.
        </p>
      ) : null}

      <button
        className="min-h-12 rounded-lg bg-[var(--primary)] px-4 py-3 text-base font-bold text-white shadow-[var(--card-shadow-strong)] transition hover:bg-[var(--primary-medium)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
        disabled={pending || products.length === 0}
        type="submit"
      >
        {pending ? "Confirmando..." : "Confirmar compra"}
      </button>
    </form>
  );
}

function TextInput({
  autoComplete,
  error,
  inputMode,
  label,
  name,
  placeholder,
}: {
  autoComplete?: string;
  error?: string;
  inputMode?: "decimal";
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[var(--primary)]">
      {label}
      <input
        autoComplete={autoComplete}
        className="min-h-12 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-base font-semibold text-[var(--foreground)] shadow-sm placeholder:text-[var(--muted)] focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/20"
        inputMode={inputMode}
        name={name}
        placeholder={placeholder}
        type="text"
      />
      <InlineError message={error} />
    </label>
  );
}

function FieldMessage({ message, status }: { message: string; status: PurchaseFormActionState["status"] }) {
  if (!message) {
    return null;
  }

  const tone =
    status === "success"
      ? "border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--success)]"
      : "border-[var(--danger)]/20 bg-[var(--danger-soft)] text-[var(--danger)]";

  return <p className={`rounded-lg border px-3 py-2 text-sm font-semibold ${tone}`}>{message}</p>;
}

function InlineError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <span className="text-sm font-medium text-[var(--danger)]">{message}</span>;
}

function formatQuantity(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toString().replace(".", ",");
}
