"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BotMessageSquare,
  Home,
  Package,
  PackagePlus,
  Plus,
  ReceiptText,
  ShoppingCart,
  TrendingDown,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/products", label: "Produtos", icon: Package },
  { href: "/expenses", label: "Despesas", icon: TrendingDown },
  { href: "/assistant", label: "NEXIS", icon: BotMessageSquare },
] as const;

const quickActions = [
  { href: "/sales", label: "Registrar venda", icon: ShoppingCart, tone: "text-[var(--success)] bg-[var(--success-soft)]" },
  { href: "/purchases", label: "Registrar compra", icon: PackagePlus, tone: "text-[var(--primary-medium)] bg-[#eceeff]" },
  { href: "/expenses", label: "Nova despesa", icon: ReceiptText, tone: "text-[var(--warning)] bg-[var(--warning-soft)]" },
  { href: "/products", label: "Cadastrar produto", icon: Package, tone: "text-[var(--purple)] bg-[var(--purple-soft)]" },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-40 bg-[rgba(27,31,94,0.24)] backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <section
            aria-label="Acoes rapidas"
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-24 pt-3 shadow-[0_-8px_32px_rgba(27,31,94,0.14)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)]" />
            <div className="mx-auto max-w-md">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase text-[var(--muted)]">Acao rapida</h2>
                <button
                  type="button"
                  aria-label="Fechar acoes rapidas"
                  title="Fechar"
                  className="flex size-9 items-center justify-center rounded-lg bg-[var(--background)] text-[var(--primary)]"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="grid gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      className="flex min-h-14 items-center gap-3 rounded-lg bg-[var(--background)] px-3 py-2.5 font-semibold text-[var(--primary)]"
                      href={action.href}
                      key={action.href}
                      onClick={() => setOpen(false)}
                    >
                      <span className={`flex size-10 items-center justify-center rounded-lg ${action.tone}`}>
                        <Icon className="size-[18px]" />
                      </span>
                      {action.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto grid h-[72px] max-w-md grid-cols-5 items-center px-2">
          {navItems.slice(0, 2).map((item) => (
            <NavItem active={pathname === item.href} item={item} key={item.href} />
          ))}
          <button
            type="button"
            aria-label="Abrir acoes rapidas"
            title="Acoes rapidas"
            className="mx-auto flex size-13 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-[0_5px_18px_rgba(27,31,94,0.3)]"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-6" strokeWidth={2.5} />
          </button>
          {navItems.slice(2).map((item) => (
            <NavItem active={pathname === item.href} item={item} key={item.href} />
          ))}
        </div>
      </nav>
    </>
  );
}

type NavItemProps = {
  active: boolean;
  item: (typeof navItems)[number];
};

function NavItem({ active, item }: NavItemProps) {
  const Icon = item.icon;
  return (
    <Link
      className={`flex h-full min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
        active ? "text-[var(--primary)]" : "text-[var(--muted)]"
      }`}
      href={item.href}
    >
      <span className={`flex size-9 items-center justify-center rounded-lg ${active ? "bg-[#eceeff]" : ""}`}>
        <Icon className="size-5" strokeWidth={active ? 2.3 : 1.8} />
      </span>
      <span className="max-w-full truncate">{item.label}</span>
    </Link>
  );
}
