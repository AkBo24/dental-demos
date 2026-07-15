"use client";

import { StepNav } from "../step-nav";
import { TextareaField } from "@/components/fields";

export function ConcernsStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <div className="mb-5 rounded-xl border border-brand/20 bg-brand/5 p-4">
        <p className="font-heading text-lg font-semibold tracking-wide">
          What should we focus on today?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sharing your main concern helps the doctor prepare before you arrive.
        </p>
      </div>
      <TextareaField
        name="concerns.immediate_concern"
        label="What brings you in today?"
        required
        placeholder="Pain, checkup, cosmetic goals, second opinion…"
        rows={5}
      />
      <StepNav onBack={onBack} onNext={onNext} />
    </section>
  );
}
