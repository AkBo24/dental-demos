"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldShell } from "./field-shell";
import { cn } from "@/lib/utils";
import type { IntakeFormValues, SignatureValue } from "@/types/intake";

type Path = FieldPath<IntakeFormValues>;

export function SignatureField({
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
          <SignaturePad
            value={(field.value as SignatureValue | null) ?? null}
            onChange={field.onChange}
          />
        </FieldShell>
      )}
    />
  );
}

function SignaturePad({
  value,
  onChange,
}: {
  value: SignatureValue | null;
  onChange: (v: SignatureValue | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [mode, setMode] = useState<"draw" | "type">(value?.mode ?? "draw");
  const [typedName, setTypedName] = useState(value?.typedName ?? "");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== "draw") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--foreground")
      .trim() || "#1c1917";

    if (value?.mode === "draw" && value.dataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = value.dataUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function commitDraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange({
      mode: "draw",
      dataUrl: canvas.toDataURL("image/png"),
      signedAt: new Date().toISOString(),
    });
  }

  function clear() {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTypedName("");
    onChange(null);
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/60 p-3">
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "draw" ? "default" : "outline"}
          onClick={() => setMode("draw")}
        >
          Draw
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "type" ? "default" : "outline"}
          onClick={() => setMode("type")}
        >
          Type name
        </Button>
        <Button type="button" size="sm" variant="ghost" className="ml-auto" onClick={clear}>
          Clear
        </Button>
      </div>

      {mode === "draw" ? (
        <canvas
          ref={canvasRef}
          className={cn(
            "h-36 w-full touch-none rounded-md border border-dashed border-border bg-background",
            "cursor-crosshair",
          )}
          onPointerDown={(e) => {
            drawing.current = true;
            const ctx = canvasRef.current?.getContext("2d");
            const p = pos(e);
            ctx?.beginPath();
            ctx?.moveTo(p.x, p.y);
            (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = canvasRef.current?.getContext("2d");
            const p = pos(e);
            ctx?.lineTo(p.x, p.y);
            ctx?.stroke();
          }}
          onPointerUp={() => {
            drawing.current = false;
            commitDraw();
          }}
        />
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="Type your full legal name"
            value={typedName}
            onChange={(e) => {
              const next = e.target.value;
              setTypedName(next);
              onChange(
                next.trim().length > 1
                  ? {
                      mode: "type",
                      typedName: next,
                      signedAt: new Date().toISOString(),
                    }
                  : null,
              );
            }}
          />
          {typedName.trim().length > 1 ? (
            <p
              className="flex h-20 items-center justify-center rounded-md border border-dashed border-border bg-background font-heading text-3xl italic text-foreground/80"
              aria-hidden
            >
              {typedName}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
