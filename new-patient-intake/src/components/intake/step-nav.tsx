"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  backLabel = "Back",
  showBack = true,
  nextDisabled,
  busy,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  nextDisabled?: boolean;
  busy?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
      {showBack && onBack ? (
        <Button type="button" variant="ghost" onClick={onBack} disabled={busy}>
          <ArrowLeft data-icon="inline-start" />
          {backLabel}
        </Button>
      ) : (
        <span />
      )}
      {onNext ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || busy}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          size="lg"
        >
          {nextLabel}
          <ArrowRight data-icon="inline-end" />
        </Button>
      ) : null}
    </div>
  );
}
