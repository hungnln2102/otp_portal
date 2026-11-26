import type { ComponentPropsWithoutRef } from "react";

type SelectFieldProps = Omit<ComponentPropsWithoutRef<"select">, "className"> & {
  label: string;
};

export function SelectField({ label, children, ...props }: SelectFieldProps) {
  return (
    <label className="block space-y-1.5 text-xs font-semibold text-[var(--ink)]">
      <span>{label}</span>
      <select
        {...props}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--ground)] px-3 py-2 text-[var(--ink)] focus-visible:outline focus-visible:outline-[var(--accent)] disabled:opacity-60"
      >
        {children}
      </select>
    </label>
  );
}
