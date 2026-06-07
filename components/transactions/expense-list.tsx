import { ReceiptText } from "lucide-react";
import { formatCentsToBRL } from "@/lib/finance";
import { expenseCategoryLabels, type ExpenseCategoryValue } from "@/lib/validation/expense";

export type ExpenseListItem = {
  id: string;
  description: string;
  category: ExpenseCategoryValue;
  amountCents: number;
  paidAt: string;
  confirmed: boolean;
};

type ExpenseListProps = {
  expenses: ExpenseListItem[];
};

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-white p-6 text-center text-[var(--muted)]">
        <ReceiptText aria-hidden="true" className="mx-auto size-9 text-[var(--warning)]" />
        <p className="mt-3 text-sm font-bold text-[var(--primary)]">Nenhuma despesa cadastrada</p>
        <p className="mt-1 text-sm">As despesas salvas aparecem aqui com valor, categoria e confirmacao.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {expenses.map((expense) => (
        <article
          className={`rounded-lg border bg-white p-4 shadow-[var(--card-shadow)] ${
            expense.confirmed ? "border-[var(--border)]" : "border-[var(--warning)]/30"
          }`}
          key={expense.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-base font-extrabold text-[var(--primary)]">
                {expense.description}
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">{expenseCategoryLabels[expense.category]}</p>
            </div>
            <span
              className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase ${
                expense.confirmed
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : "bg-[var(--warning-soft)] text-[var(--warning)]"
              }`}
            >
              {expense.confirmed ? "Confirmada" : "Pendente"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <Metric label="Valor" value={formatCentsToBRL(expense.amountCents)} />
            <Metric label="Data" value={formatDate(expense.paidAt)} />
            <Metric label="Categoria" value={expenseCategoryLabels[expense.category]} />
          </div>
        </article>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--surface-soft)] px-3 py-2">
      <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(value));
}
