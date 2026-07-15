"use client";

import * as React from "react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldShell } from "./field-shell";
import { cn } from "@/lib/utils";
import type { IntakeFormValues } from "@/types/intake";

type Path = FieldPath<IntakeFormValues>;

export function CheckboxField({
  name,
  label,
  required,
}: {
  name: Path;
  label: string;
  required?: boolean;
}) {
  const { control } = useFormContext<IntakeFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1.5">
          <label className="flex items-start gap-3 rounded-lg border border-border/80 bg-card/60 p-3 transition-colors hover:bg-muted/40">
            <Checkbox
              checked={Boolean(field.value)}
              onCheckedChange={(v) => field.onChange(v === true)}
              aria-invalid={Boolean(fieldState.error)}
              className="mt-0.5"
            />
            <span className="text-sm leading-snug">
              {label}
              {required ? <span className="ml-0.5 text-brand">*</span> : null}
            </span>
          </label>
          {fieldState.error?.message ? (
            <p role="alert" className="text-xs text-destructive">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}

export function CheckboxGroupField({
  name,
  label,
  required,
  options,
  columns = 2,
}: {
  name: Path;
  label: string;
  required?: boolean;
  options: string[];
  columns?: 1 | 2 | 3;
}) {
  const { control } = useFormContext<IntakeFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected = (field.value as string[]) ?? [];
        return (
          <FieldShell
            id={name}
            label={label}
            required={required}
            error={fieldState.error?.message}
          >
            <div
              className={cn(
                "grid gap-2",
                columns === 1 && "grid-cols-1",
                columns === 2 && "grid-cols-1 sm:grid-cols-2",
                columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {options.map((opt) => {
                const checked = selected.includes(opt);
                return (
                  <label
                    key={opt}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors",
                      checked
                        ? "border-brand/40 bg-brand/5"
                        : "border-border/70 bg-card/50 hover:bg-muted/40",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        if (v === true) field.onChange([...selected, opt]);
                        else field.onChange(selected.filter((x) => x !== opt));
                      }}
                      className="mt-0.5"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </FieldShell>
        );
      }}
    />
  );
}

export function ChipGroupField({
  name,
  label,
  required,
  groups,
  searchPlaceholder = "Search conditions…",
}: {
  name: Path;
  label: string;
  required?: boolean;
  groups: Record<string, readonly string[] | string[]>;
  searchPlaceholder?: string;
}) {
  const { control } = useFormContext<IntakeFormValues>();
  const [query, setQuery] = React.useState("");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected = (field.value as string[]) ?? [];
        const q = query.trim().toLowerCase();

        return (
          <FieldShell
            id={name}
            label={label}
            required={required}
            error={fieldState.error?.message}
            hint={
              selected.length
                ? `${selected.length} selected`
                : "Tap chips to select — same options as the paper form, easier to scan"
            }
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="mb-3 flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <div className="space-y-4">
              {Object.entries(groups).map(([group, opts]) => {
                const visible = opts.filter((o) =>
                  q ? o.toLowerCase().includes(q) : true,
                );
                if (visible.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {visible.map((opt) => {
                        const on = selected.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              field.onChange(
                                on
                                  ? selected.filter((x) => x !== opt)
                                  : [...selected, opt],
                              )
                            }
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-left text-sm transition-all",
                              on
                                ? "border-brand bg-brand text-brand-foreground shadow-sm"
                                : "border-border bg-card/80 text-foreground hover:border-brand/40 hover:bg-muted/50",
                            )}
                          >
                            {opt.replace(/^(Pre-Med|Allergy) - /, "")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </FieldShell>
        );
      }}
    />
  );
}

export function RadioField({
  name,
  label,
  required,
  options,
}: {
  name: Path;
  label: string;
  required?: boolean;
  options: string[];
}) {
  const { control } = useFormContext<IntakeFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FieldShell
          id={name}
          label={label}
          required={required}
          error={fieldState.error?.message}
        >
          <RadioGroup
            value={(field.value as string) || undefined}
            onValueChange={field.onChange}
            className="flex flex-wrap gap-3"
          >
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-sm"
              >
                <RadioGroupItem value={opt} id={`${name}-${opt}`} />
                <Label htmlFor={`${name}-${opt}`} className="font-normal">
                  {opt}
                </Label>
              </label>
            ))}
          </RadioGroup>
        </FieldShell>
      )}
    />
  );
}
