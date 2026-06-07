import { BotMessageSquare, Package, PackagePlus, ReceiptText, ShoppingCart, type LucideIcon } from "lucide-react";
import { QuickActionButton } from "./quick-action-button";

type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  className: string;
  iconClassName: string;
};

const quickActions: QuickAction[] = [
  {
    label: "Cadastrar produto",
    description: "Adicionar item ao estoque",
    href: "/products",
    icon: Package,
    className: "border-[var(--border)] bg-white hover:bg-[var(--surface-soft)]",
    iconClassName: "bg-[var(--purple-soft)] text-[var(--purple)]",
  },
  {
    label: "Registrar venda",
    description: "Dar baixa no estoque",
    href: "/sales",
    icon: ShoppingCart,
    className: "border-[var(--border)] bg-white hover:bg-[var(--surface-soft)]",
    iconClassName: "bg-[var(--success-soft)] text-[var(--success)]",
  },
  {
    label: "Registrar compra",
    description: "Aumentar o estoque",
    href: "/purchases",
    icon: PackagePlus,
    className: "border-[var(--border)] bg-white hover:bg-[var(--surface-soft)]",
    iconClassName: "bg-[#eceeff] text-[var(--primary-medium)]",
  },
  {
    label: "Registrar despesa",
    description: "Salvar gasto do negocio",
    href: "/expenses",
    icon: ReceiptText,
    className: "border-[var(--border)] bg-white hover:bg-[var(--surface-soft)]",
    iconClassName: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  {
    label: "Falar com NEXIS",
    description: "Chat por texto simples",
    href: "/assistant",
    icon: BotMessageSquare,
    className: "border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--primary-medium)]",
    iconClassName: "bg-[var(--accent)] text-[var(--primary)]",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
      {quickActions.map((action) => (
        <QuickActionButton
          className={action.className}
          description={action.description}
          href={action.href}
          icon={action.icon}
          iconClassName={action.iconClassName}
          key={action.label}
          label={action.label}
        />
      ))}
    </div>
  );
}
