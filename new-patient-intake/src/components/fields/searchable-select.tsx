"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldShell } from "./field-shell";
import { cn } from "@/lib/utils";
import type { IntakeFormValues } from "@/types/intake";

type Path = FieldPath<IntakeFormValues>;

export function SearchableSelectField({
  name,
  label,
  required,
  options,
  placeholder = "Search…",
}: {
  name: Path;
  label: string;
  required?: boolean;
  options: readonly string[] | string[];
  placeholder?: string;
}) {
  const { control } = useFormContext<IntakeFormValues>();
  const [open, setOpen] = useState(false);

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              type="button"
              aria-expanded={open}
              aria-invalid={Boolean(fieldState.error)}
              className={cn(
                "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
              )}
            >
              <span
                className={cn(
                  "truncate text-left",
                  !(field.value as string) && "text-muted-foreground",
                )}
              >
                {(field.value as string) || placeholder}
              </span>
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0"
              align="start"
            >
              <Command>
                <CommandInput placeholder={placeholder} />
                <CommandList>
                  <CommandEmpty>No match found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt}
                        value={opt}
                        onSelect={() => {
                          field.onChange(opt);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            field.value === opt ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {opt}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FieldShell>
      )}
    />
  );
}

export function MultiSelectField({
  name,
  label,
  required,
  options,
  placeholder = "Search medications…",
}: {
  name: Path;
  label: string;
  required?: boolean;
  options: readonly string[] | string[];
  placeholder?: string;
}) {
  const { control } = useFormContext<IntakeFormValues>();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...options];
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

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
            hint={selected.length ? `${selected.length} selected` : undefined}
          >
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                type="button"
                className={cn(
                  "flex min-h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors",
                  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                )}
              >
                <span className="flex flex-wrap gap-1 text-left">
                  {selected.length === 0 ? (
                    <span className="text-muted-foreground">{placeholder}</span>
                  ) : (
                    selected.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={placeholder}
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No medication found.</CommandEmpty>
                    <CommandGroup>
                      {filtered.map((opt) => {
                        const isOn = selected.includes(opt);
                        return (
                          <CommandItem
                            key={opt}
                            value={opt}
                            onSelect={() => {
                              field.onChange(
                                isOn
                                  ? selected.filter((x) => x !== opt)
                                  : [...selected, opt],
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                isOn ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {opt}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FieldShell>
        );
      }}
    />
  );
}
