"use client";

import { Progress } from "@/components/ui/progress";
import {
  COUNTED_STEPS,
  estimateMinutesLeft,
  getCountedIndex,
  getStepMeta,
} from "@/lib/schema";
import type { WizardStepId } from "@/types/intake";
import { cn } from "@/lib/utils";

export function WizardProgress({ stepId }: { stepId: WizardStepId }) {
  const meta = getStepMeta(stepId);
  const countedIndex = getCountedIndex(stepId);
  const total = COUNTED_STEPS.length;
  const isCounted = Boolean(meta?.counted);
  const currentDisplay = isCounted ? countedIndex + 1 : 0;
  const percent = isCounted
    ? Math.round(((countedIndex + 1) / total) * 100)
    : stepId === "completion"
      ? 100
      : 0;
  const minutesLeft = estimateMinutesLeft(stepId);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {isCounted
              ? `Step ${currentDisplay} of ${total}`
              : stepId === "welcome"
                ? "Getting started"
                : "Complete"}
            {isCounted && minutesLeft > 0 ? ` · ~${minutesLeft} min left` : null}
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-wide sm:text-3xl">
            {meta?.title}
          </h1>
          {meta?.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
          ) : null}
        </div>
        {isCounted || stepId === "completion" ? (
          <span className="hidden text-sm tabular-nums text-muted-foreground sm:inline">
            {percent}%
          </span>
        ) : null}
      </div>

      <Progress value={percent} className="w-full" />

      <nav aria-label="Form steps" className="hidden md:block">
        <ol className="flex flex-wrap gap-1.5">
          {COUNTED_STEPS.map((step, i) => {
            const done = isCounted && i < countedIndex;
            const current = step.id === stepId;
            return (
              <li key={step.id}>
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors",
                    current && "bg-brand text-brand-foreground",
                    done && !current && "bg-brand/15 text-brand",
                    !done && !current && "bg-muted text-muted-foreground",
                  )}
                >
                  {step.shortTitle}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
