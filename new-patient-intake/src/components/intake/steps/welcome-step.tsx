"use client";

import { Clock, ShieldCheck, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function WelcomeStep({
  hasDraft,
  draftUpdatedAt,
  onStart,
  onResume,
}: {
  hasDraft: boolean;
  draftUpdatedAt?: string;
  onStart: () => void;
  onResume: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand/10 to-transparent"
      />
      <div className="relative space-y-8">
        <div className="space-y-4">
          <BrandMark size="lg" />
          <h1 className="max-w-xl font-heading text-3xl font-semibold tracking-wide text-foreground sm:text-4xl">
            Patient intake
          </h1>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "~8–10 minutes",
              body: "Guided steps with progress and autosave",
            },
            {
              icon: ShieldCheck,
              title: "Private on this device",
              body: "Demo stores answers in localStorage only",
            },
            {
              icon: Sparkles,
              title: "Skip the paper stack",
              body: "Same clinical questions, clearer experience",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-border/50 bg-background/60 p-4"
            >
              <item.icon className="mb-2 size-5 text-brand" />
              <p className="font-heading text-base font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>

        {hasDraft ? (
          <div className="rounded-xl border border-gold/40 bg-gold/10 p-4 sm:p-5">
            <p className="font-heading text-lg font-semibold">Resume where you left off?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We found a saved draft
              {draftUpdatedAt ? ` from ${draftUpdatedAt}` : ""}.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={onResume}
              >
                Resume intake
              </Button>
              <Button type="button" size="lg" variant="outline" onClick={onStart}>
                Start over
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="lg"
              className="bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={onStart}
            >
              Begin intake
            </Button>
            <p className="text-sm text-muted-foreground">
              Your progress saves automatically as you go.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
