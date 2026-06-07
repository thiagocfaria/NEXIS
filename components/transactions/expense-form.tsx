"use client";

import { useActionState, useEffect, useRef } from "react";
import { expenseCategoryLabels, expenseCategoryValues } from "@/lib/validation/expense";

type ExpenseFormActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<string, string>>;
};

type ExpenseFormAction = (
  state: ExpenseFormActionState,
  formData: FormData,
) => Promise<ExpenseFormActionState>;

type ExpenseFormProps = {
  action: ExpenseFormAction;
  today: string;
};

const initialState: ExpenseFormActionState = {
  status: "idle",
  message: "",
};

export function ExpenseForm({ action, today }: ExpenseFormProps) {
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

      <TextInput
        autoComplete="off"
        error={state.fieldErrors?.description}
        label="Descricao"
        name="description"
        placeholder="Ex: Energia do ponto"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[var(--primary)]">
          Categoria
          <select
            className="min-h-12 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-base font-semibold text-[var(--foreground)] shadow-sm focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/20"
            defaultValue="OTHER"
            name="category"
          >
            {expenseCategoryValues.map((category) => (
              <option key={category} value={category}>
                {expenseCategoryLabels[category]}
              </option>
            ))}
          </select>
          <InlineError message={state.fieldErrors?.category} />
        </label>

        <TextInput
          error={state.fieldErrors?.amount}
          inputMode="decimal"
          label="Valor"
          name="amount"
          placeholder="50,00"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[var(--primary)]">
          Data
          <input
            className="min-h-12 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-base font-semibold text-[var(--foreground)] shadow-sm focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/20"
            defaultValue={today}
            name="paidAt"
            type="date"
          />
          <InlineError message={state.fieldErrors?.paidAt} />
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-sm font-bold text-[var(--primary)] shadow-sm">
          <input
            className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary-light)]"
            defaultChecked
            name="confirmed"
            type="checkbox"
            value="true"
          />
          Confirmada
        </label>
      </div>

      <button
        className="min-h-12 rounded-lg bg-[var(--primary)] px-4 py-3 text-base font-bold text-white shadow-[var(--card-shadow-strong)] transition hover:bg-[var(--primary-medium)] disabled:cursor-not-allowed disabled:bg-[var(--muted)]"
        disabled={pending}
        type="submit"
      >
        {pending ? "Confirmando..." : "Confirmar despesa"}
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
        className="min-h-12 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-base font-semibold text-[var(--foreground)] shadow-sm placeholder:text-[var(--muted)] focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/20"
        inputMode={inputMode}
        name={name}
        placeholder={placeholder}
        type="text"
      />
      <InlineError message={error} />
    </label>
  );
}

function FieldMessage({ message, status }: { message: string; status: ExpenseFormActionState["status"] }) {
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
