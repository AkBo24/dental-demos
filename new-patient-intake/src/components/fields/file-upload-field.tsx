"use client";

import { useRef } from "react";
import { FileUp, X } from "lucide-react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldShell } from "./field-shell";
import type { FileUploadValue, IntakeFormValues } from "@/types/intake";

type Path = FieldPath<IntakeFormValues>;

export function FileUploadField({
  name,
  label,
  required,
  accept = "image/*,application/pdf",
}: {
  name: Path;
  label: string;
  required?: boolean;
  accept?: string;
}) {
  const { control } = useFormContext<IntakeFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value as FileUploadValue | null;

        async function onPick(file: File | undefined) {
          if (!file) return;
          if (file.size > 4 * 1024 * 1024) {
            alert("Please choose a file under 4MB for this demo.");
            return;
          }
          const dataUrl = await readAsDataUrl(file);
          field.onChange({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl,
          } satisfies FileUploadValue);
        }

        return (
          <FieldShell
            id={name}
            label={label}
            required={required}
            error={fieldState.error?.message}
            hint="Mock upload — stored locally in your browser for this demo"
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => onPick(e.target.files?.[0])}
            />
            {value ? (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-card/70 p-3">
                {value.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={value.dataUrl}
                    alt=""
                    className="size-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-md bg-muted text-xs font-medium">
                    PDF
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{value.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(value.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove file"
                  onClick={() => {
                    field.onChange(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:bg-muted/30 hover:text-foreground"
              >
                <FileUp className="size-5 text-brand" />
                <span>Click to upload card image or PDF</span>
              </button>
            )}
          </FieldShell>
        );
      }}
    />
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
