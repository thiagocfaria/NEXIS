import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

type QuickActionButtonProps = {
  href?: string;
  icon: LucideIcon;
  label: string;
  description: string;
  className: string;
  iconClassName: string;
  disabled?: boolean;
};

const buttonClassName =
  "group flex min-h-20 touch-manipulation items-center gap-3 rounded-lg border px-3 py-3 text-left shadow-[var(--card-shadow)] transition active:translate-y-px";

export function QuickActionButton({
  href,
  icon: Icon,
  label,
  description,
  className,
  iconClassName,
  disabled = false,
}: QuickActionButtonProps) {
  if (disabled || !href) {
    return (
      <button
        aria-label={`${label} indisponivel`}
        className={`${buttonClassName} cursor-not-allowed border-zinc-200 bg-white text-zinc-500 opacity-60`}
        disabled
        type="button"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
          <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-500" />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-semibold">{label}</span>
          <span className="mt-1 block text-sm font-medium">{description}</span>
        </span>
      </button>
    );
  }

  return (
    <Link
      aria-label={label}
      className={`${buttonClassName} cursor-pointer text-[var(--primary)] ${className}`}
      href={href}
      prefetch
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
        <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-5">{label}</span>
        <span className="mt-1 hidden text-xs font-medium leading-4 opacity-70 sm:block">{description}</span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="hidden h-4 w-4 shrink-0 opacity-50 transition group-hover:translate-x-0.5 lg:block"
      />
    </Link>
  );
}
