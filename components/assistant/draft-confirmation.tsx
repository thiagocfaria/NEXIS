"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  confirmCancellationDraft,
  confirmExpenseDraft,
  confirmProductDraft,
  confirmPurchaseDraft,
  confirmSaleDraft,
  confirmStockLossDraft,
  type ConfirmDraftState,
} from "@/app/assistant/actions";
import { calculateSaleItemProfitMetrics, formatCentsToBRL } from "@/lib/finance";
import type { AssistantDraft } from "@/lib/validation/assistant-draft";
import { expenseCategoryLabels } from "@/lib/validation/expense";
import { productUnitLabels, type ProductUnitValue } from "@/lib/validation/product";

type DraftConfirmationProps = {
  draft: AssistantDraft;
};

const initialState: ConfirmDraftState = {
  status: "idle",
  message: "",
};

export function DraftConfirmation({ draft }: DraftConfirmationProps) {
  const router = useRouter();
  const action =
    draft.type === "sale"
      ? confirmSaleDraft
      : draft.type === "purchase"
        ? confirmPurchaseDraft
        : draft.type === "product"
          ? confirmProductDraft
          : draft.type === "stock_loss"
            ? confirmStockLossDraft
            : draft.type === "cancellation"
              ? confirmCancellationDraft
              : confirmExpenseDraft;
  const [state, setState] = useState<ConfirmDraftState>(initialState);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending || state.status === "success") {
      return;
    }

    const formData = new FormData(event.currentTarget);

    setPending(true);
    setState(initialState);

    try {
      const nextState = await action(state, formData);

      setState(nextState);
    } catch {
      setState({ status: "error", message: "Nao foi possivel confirmar o rascunho. Tente novamente." });
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
      <div className="mb-4">{renderDraftSummary(draft)}</div>

      {state.message ? (
        <p
          aria-live={state.status === "success" ? "polite" : "assertive"}
          className={`mb-3 rounded-lg border px-3 py-2 text-sm font-semibold ${messageTone(state.status)}`}
          role={state.status === "success" ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}

      <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
        <input name="draft" type="hidden" value={JSON.stringify(draft)} />
        <p className="text-sm leading-6 text-[var(--muted)]">
          Nada será salvo antes de clicar no botão de confirmação.
        </p>
        <button
          className="min-h-12 rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white shadow-[var(--card-shadow)] transition hover:bg-[var(--primary-medium)] disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={pending || state.status === "success"}
          type="submit"
        >
          {pending ? "Confirmando..." : confirmationLabel(draft)}
        </button>
      </form>
    </article>
  );
}

function renderDraftSummary(draft: AssistantDraft) {
  if (draft.type === "sale") {
    const priceChanged = draft.unitPriceCents !== draft.registeredSalePriceCents;
    const profitMetrics = calculateSaleItemProfitMetrics({
      quantity: draft.quantity,
      unitPriceCents: draft.unitPriceCents,
      unitCostSnapshotCents: draft.unitCostSnapshotCents,
      totalAmountCents: draft.totalAmountCents,
      totalCostCents: draft.totalCostCents,
    });

    return (
      <>
        <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Rascunho de venda</p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950">{draft.productName}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
          <Metric label="Quantidade" value={formatQuantity(draft.quantity)} />
          <Metric label="Preço cadastrado" value={formatCentsToBRL(draft.registeredSalePriceCents)} />
          <Metric label="Preço desta venda" value={formatCentsToBRL(draft.unitPriceCents)} />
          <Metric label="Total da venda" value={formatCentsToBRL(draft.totalAmountCents)} />
          <Metric label="Custo estimado" value={formatCentsToBRL(draft.totalCostCents)} />
          <Metric label="Lucro estimado" value={formatCentsToBRL(draft.estimatedGrossProfitCents)} />
          <Metric label="Margem estimada" value={formatPercent(profitMetrics.marginPercent)} />
          <Metric
            label="Estoque"
            value={`${formatQuantity(draft.stockBefore)} -> ${formatQuantity(draft.stockAfter)}`}
          />
          <Metric label="Estoque vai diminuir" value={formatQuantity(Math.abs(draft.stockImpact))} />
        </dl>
        {priceChanged ? (
          <p className="mt-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900">
            Preço desta venda diferente do preço cadastrado.
          </p>
        ) : null}
        {profitMetrics.belowCost ? (
          <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
            Atenção: venda abaixo do custo.
          </p>
        ) : null}
      </>
    );
  }

  if (draft.type === "purchase") {
    return (
      <>
        <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Rascunho de compra</p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950">{draft.productName}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <Metric label="Quantidade" value={formatQuantity(draft.quantity)} />
          <Metric label="Custo unitario" value={formatCentsToBRL(draft.unitCostCents)} />
          <Metric label="Total" value={formatCentsToBRL(draft.totalCostCents)} />
          <Metric label="Estoque" value={`aumenta ${formatQuantity(draft.stockImpact)}`} />
        </dl>
      </>
    );
  }

  if (draft.type === "product") {
    return (
      <>
        <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Rascunho de produto</p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950">{draft.name}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-3">
          <Metric label="Unidade" value={unitLabel(draft.unit)} />
          <Metric label="Custo" value={formatCentsToBRL(draft.unitCostCents)} />
          <Metric label="Preço de venda" value={formatCentsToBRL(draft.salePriceCents)} />
          <Metric label="Estoque inicial" value={formatQuantity(draft.initialStock)} />
          <Metric label="Estoque mínimo" value={formatQuantity(draft.minimumStock)} />
          <Metric label="Categoria" value={draft.category ?? "Sem categoria"} />
        </dl>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
          Revise os dados antes de salvar o produto.
        </p>
      </>
    );
  }

  if (draft.type === "stock_loss") {
    return (
      <>
        <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Rascunho de perda</p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950">{draft.productName}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-3">
          <Metric label="Quantidade perdida" value={formatQuantity(draft.quantity)} />
          <Metric label="Custo estimado" value={formatCentsToBRL(draft.totalCostCents)} />
          <Metric
            label="Estoque"
            value={`${formatQuantity(draft.stockBefore)} -> ${formatQuantity(draft.stockAfter)}`}
          />
          <Metric label="Motivo" value={draft.reason} />
          <Metric label="Estoque vai diminuir" value={formatQuantity(Math.abs(draft.stockImpact))} />
        </dl>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
          A perda será registrada com rastreabilidade e entrará como perda/desperdício.
        </p>
      </>
    );
  }

  if (draft.type === "cancellation") {
    return (
      <>
        <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Rascunho de cancelamento</p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950">{draft.targetLabel}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-3">
          <Metric label="Tipo" value={cancellationTypeLabel(draft.targetType)} />
          <Metric label="Impacto no estoque" value={formatSignedQuantity(draft.stockImpact)} />
          <Metric label="Impacto financeiro" value={formatSignedMoney(draft.amountImpactCents)} />
          <Metric label="Motivo" value={draft.reason} />
        </dl>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
          O registro original não será apagado; o sistema criará um evento de cancelamento rastreável.
        </p>
      </>
    );
  }

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-normal text-emerald-700">Rascunho de despesa</p>
      <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950">{draft.description}</h2>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <Metric label="Valor" value={formatCentsToBRL(draft.amountCents)} />
        <Metric label="Categoria" value={expenseCategoryLabels[draft.category]} />
        <Metric label="Status" value="sera confirmada" />
      </dl>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--background)] p-3">
      <dt className="text-xs font-medium text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-[var(--primary)]">{value}</dd>
    </div>
  );
}

function confirmationLabel(draft: AssistantDraft): string {
  if (draft.type === "sale") {
    return "Confirmar venda";
  }

  if (draft.type === "purchase") {
    return "Confirmar compra";
  }

  if (draft.type === "product") {
    return "Salvar produto";
  }

  if (draft.type === "stock_loss") {
    return "Confirmar perda";
  }

  if (draft.type === "cancellation") {
    return "Confirmar cancelamento";
  }

  return "Confirmar despesa";
}

function messageTone(status: ConfirmDraftState["status"]): string {
  return status === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-rose-200 bg-rose-50 text-rose-800";
}

function formatQuantity(value: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(value);
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "Sem referência";
  }

  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value)}%`;
}

function formatSignedQuantity(value: number): string {
  if (value === 0) {
    return "sem impacto";
  }

  return `${value > 0 ? "+" : "-"}${formatQuantity(Math.abs(value))}`;
}

function formatSignedMoney(value: number): string {
  if (value === 0) {
    return "sem impacto";
  }

  return `${value > 0 ? "+" : "-"}${formatCentsToBRL(Math.abs(value))}`;
}

function cancellationTypeLabel(type: "expense" | "purchase" | "sale" | "stock_loss"): string {
  if (type === "sale") {
    return "Venda";
  }

  if (type === "purchase") {
    return "Compra";
  }

  if (type === "stock_loss") {
    return "Perda";
  }

  return "Despesa";
}

function unitLabel(unit: ProductUnitValue): string {
  return productUnitLabels[unit];
}
