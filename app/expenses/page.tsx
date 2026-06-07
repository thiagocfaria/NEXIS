import { ReceiptText } from "lucide-react";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { PageHeader } from "@/components/navigation/page-header";
import { ExpenseForm } from "@/components/transactions/expense-form";
import { ExpenseList, type ExpenseListItem } from "@/components/transactions/expense-list";
import { prisma } from "@/lib/db/prisma";
import { type ExpenseCategoryValue } from "@/lib/validation/expense";
import { createExpenseAction } from "./actions";

export const dynamic = "force-dynamic";

const recentExpensesLimit = 30;

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { paidAt: "desc" },
    take: recentExpensesLimit,
    where: { cancelledAt: null },
  });

  const expenseItems: ExpenseListItem[] = expenses.map((expense) => ({
    amountCents: expense.amountCents,
    category: expense.category as ExpenseCategoryValue,
    confirmed: expense.confirmed,
    description: expense.description,
    id: expense.id,
    paidAt: expense.paidAt.toISOString(),
  }));
  const paidTotalCents = expenseItems
    .filter((expense) => expense.confirmed)
    .reduce((total, expense) => total + expense.amountCents, 0);
  const pendingTotalCents = expenseItems
    .filter((expense) => !expense.confirmed)
    .reduce((total, expense) => total + expense.amountCents, 0);

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        description="Acompanhe gastos pagos e pendentes"
        icon={ReceiptText}
        title="Despesas"
        tone="warning"
      />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <section aria-label="Resumo das despesas recentes" className="grid grid-cols-2 gap-2.5 pb-5">
          <ExpenseSummaryCard label="Confirmadas" tone="success" valueCents={paidTotalCents} />
          <ExpenseSummaryCard label="Pendentes" tone="warning" valueCents={pendingTotalCents} />
        </section>

        <section aria-labelledby="new-expense-heading" className="pb-6">
          <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
            <h2 id="new-expense-heading" className="text-lg font-extrabold text-[var(--primary)]">
              Nova despesa
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              Despesas pendentes nao entram no lucro liquido.
            </p>
            <ExpenseForm action={createExpenseAction} today={dateInputValue(new Date())} />
          </div>
        </section>

        <section aria-labelledby="expense-list-heading" className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="expense-list-heading" className="text-xs font-extrabold uppercase text-[var(--muted)]">
              Despesas recentes
            </h2>
            <span className="rounded-md bg-[var(--warning-soft)] px-2.5 py-1 text-xs font-bold text-[var(--warning)]">
              {expenseItems.length}/{recentExpensesLimit}
            </span>
          </div>
          <ExpenseList expenses={expenseItems} />
        </section>
      </div>
      <BottomNavigation />
    </main>
  );
}

function ExpenseSummaryCard({
  label,
  tone,
  valueCents,
}: {
  label: string;
  tone: "success" | "warning";
  valueCents: number;
}) {
  const toneClass =
    tone === "success"
      ? "bg-[var(--success-soft)] text-[var(--success)]"
      : "bg-[var(--warning-soft)] text-[var(--warning)]";

  return (
    <article className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
      <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-extrabold uppercase ${toneClass}`}>
        {label}
      </span>
      <p className="mt-3 text-lg font-extrabold text-[var(--primary)]">
        {(valueCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">Nas ultimas {recentExpensesLimit}</p>
    </article>
  );
}

function dateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
