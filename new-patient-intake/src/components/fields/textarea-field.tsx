"use client";

import { useEffect, useRef } from "react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell } from "./field-shell";
import type { IntakeFormValues } from "@/types/intake";

type Path = FieldPath<IntakeFormValues>;

export function TextareaField({
  name,
  label,
  required,
  placeholder,
  rows = 3,
}: {
  name: Path;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  const { control } = useFormContext<IntakeFormValues>();
  const ref = useRef<HTMLTextAreaElement | null>(null);

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
          <AutoGrowTextarea
            id={name}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={Boolean(fieldState.error)}
            value={(field.value as string) ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            inputRef={(node) => {
              ref.current = node;
              field.ref(node);
            }}
          />
        </FieldShell>
      )}
    />
  );
}

function AutoGrowTextarea({
  value,
  onChange,
  inputRef,
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
  inputRef: (node: HTMLTextAreaElement | null) => void;
} & Omit<React.ComponentProps<typeof Textarea>, "value" | "onChange" | "ref">) {
  const localRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 280)}px`;
  }, [value]);

  return (
    <Textarea
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      ref={(node) => {
        localRef.current = node;
        inputRef(node);
      }}
      className="min-h-[80px] resize-none overflow-hidden"
    />
  );
}
