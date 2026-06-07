type RouteLoadingProps = {
  title: string;
  description: string;
  showBackAction?: boolean;
  listLabel?: string;
};

export function RouteLoading({ title, description, showBackAction = true, listLabel = "Carregando dados" }: RouteLoadingProps) {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <div
        aria-busy="true"
        aria-live="polite"
        className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8"
        role="status"
      >
        <header className="border-b border-[var(--border)] pb-5">
          {showBackAction ? <div className="h-10 w-10 rounded-lg border border-[var(--border)] bg-white shadow-sm" /> : null}
          <div className={`${showBackAction ? "mt-5" : ""} flex items-start gap-3`}>
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#eceeff]" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold uppercase text-[var(--primary-medium)]">Carregando</p>
              <h1 className="mt-1 text-xl font-extrabold text-[var(--primary)]">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
            </div>
          </div>
        </header>

        <section className="py-5">
          <div className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
            <div className="h-5 w-36 animate-pulse rounded bg-[var(--border)]" />
            <div className="mt-4 grid gap-3">
              <div className="h-12 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
              <div className="h-12 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
              <div className="h-12 animate-pulse rounded-lg bg-[var(--surface-soft)]" />
            </div>
          </div>
        </section>

        <section className="pb-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs font-extrabold uppercase text-[var(--muted)]">{listLabel}</h2>
            <div className="h-6 w-14 animate-pulse rounded-md bg-[var(--border)]" />
          </div>
          <div className="grid gap-3">
            <div className="h-28 animate-pulse rounded-lg border border-[var(--border)] bg-white shadow-[var(--card-shadow)]" />
            <div className="h-28 animate-pulse rounded-lg border border-[var(--border)] bg-white shadow-[var(--card-shadow)]" />
          </div>
        </section>
      </div>
    </main>
  );
}
