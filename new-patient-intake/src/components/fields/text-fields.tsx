"use client";

import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldShell } from "./field-shell";
import type { IntakeFormValues } from "@/types/intake";
import { formatPhoneInput, formatZipInput } from "@/lib/format";

type Path = FieldPath<IntakeFormValues>;

export function TextField({
  name,
  label,
  required,
  placeholder,
  maxLength,
}: {
  name: Path;
  label: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const error = getError(errors, name);

  return (
    <FieldShell id={name} label={label} required={required} error={error}>
      <Input
        id={name}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name)}
      />
    </FieldShell>
  );
}

export function EmailField({
  name,
  label,
  required,
}: {
  name: Path;
  label: string;
  required?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const error = getError(errors, name);

  return (
    <FieldShell id={name} label={label} required={required} error={error}>
      <Input
        id={name}
        type="email"
        autoComplete="email"
        aria-invalid={Boolean(error)}
        {...register(name)}
      />
    </FieldShell>
  );
}

export function PhoneField({
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
          <Input
            id={name}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
            aria-invalid={Boolean(fieldState.error)}
            value={(field.value as string) ?? ""}
            onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        </FieldShell>
      )}
    />
  );
}

export function ZipField({
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
          <Input
            id={name}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="94102"
            aria-invalid={Boolean(fieldState.error)}
            value={(field.value as string) ?? ""}
            onChange={(e) => field.onChange(formatZipInput(e.target.value))}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        </FieldShell>
      )}
    />
  );
}

export function DateField({
  name,
  label,
  required,
}: {
  name: Path;
  label: string;
  required?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const error = getError(errors, name);

  return (
    <FieldShell id={name} label={label} required={required} error={error}>
      <Input
        id={name}
        type="date"
        aria-invalid={Boolean(error)}
        {...register(name)}
      />
    </FieldShell>
  );
}

function getError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any,
  name: string,
): string | undefined {
  const parts = name.split(".");
  let cur = errors;
  for (const p of parts) {
    if (!cur) return undefined;
    cur = cur[p];
  }
  return cur?.message as string | undefined;
}
