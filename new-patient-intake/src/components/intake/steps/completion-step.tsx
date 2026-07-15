"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, CalendarDays, Phone, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import type { IntakeFormValues } from "@/types/intake";
import { patientFullName } from "@/lib/format";

export function CompletionStep() {
  const { getValues } = useFormContext<IntakeFormValues>();
  const name = patientFullName(getValues("personal"));

  useEffect(() => {
    const end = Date.now() + 800;
    const colors = ["#8B1E1E", "#E8C547", "#1C1917", "#FFFFFF"];
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 text-center shadow-sm sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 via-transparent to-gold/10"
      />
      <div className="relative mx-auto max-w-lg space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand text-brand-foreground check-pop">
          <CheckCircle2 className="size-9" />
        </div>
        <BrandMark size="md" />
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-wide sm:text-4xl">
            You&apos;re all set{name !== "Patient" ? `, ${getValues("personal").first_name}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Your intake was submitted successfully in this demo. In production, our
            team would receive it before your appointment.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/60 p-5 text-left">
          <p className="font-heading text-lg font-semibold">What happens next</p>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-brand" />
              Arrive a few minutes early — paperwork is already done.
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
              We may confirm insurance benefits ahead of your visit.
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
              Watch for a reminder with office details and parking tips.
            </li>
          </ul>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.assign("/intake")}
        >
          Start another demo intake
        </Button>
      </div>
    </section>
  );
}
