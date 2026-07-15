"use client";

import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldShell } from "./field-shell";
import type { IntakeFormValues } from "@/types/intake";
import { US_STATES } from "@/lib/mocks/states";

type Path = FieldPath<IntakeFormValues>;

export function SelectField({
  name,
  label,
  required,
  options,
  placeholder = "Select…",
}: {
  name: Path;
  label: string;
  required?: boolean;
  options: string[];
  placeholder?: string;
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
          <Select
            value={(field.value as string) || null}
            onValueChange={(v) => field.onChange(v ?? "")}
          >
            <SelectTrigger
              id={name}
              className="w-full"
              aria-invalid={Boolean(fieldState.error)}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  );
}

export function StateSelectField({
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
        <FieldShell
          id={name}
          label={label}
          required={required}
          error={fieldState.error?.message}
        >
          <Select
            value={(field.value as string) || null}
            onValueChange={(v) => field.onChange(v ?? "")}
          >
            <SelectTrigger
              id={name}
              className="w-full"
              aria-invalid={Boolean(fieldState.error)}
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  );
}
