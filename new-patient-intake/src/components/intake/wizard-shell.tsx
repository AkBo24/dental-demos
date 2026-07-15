"use client";

import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { IntakeHeader } from "./intake-header";
import { WizardProgress } from "./wizard-progress";
import { WelcomeStep } from "./steps/welcome-step";
import { PersonalStep } from "./steps/personal-step";
import { ContactStep } from "./steps/contact-step";
import { InsuranceStep } from "./steps/insurance-step";
import { MedicalStep } from "./steps/medical-step";
import { DentalStep } from "./steps/dental-step";
import { ConcernsStep } from "./steps/concerns-step";
import { ConsentStep } from "./steps/consent-step";
import { ReviewStep } from "./steps/review-step";
import { CompletionStep } from "./steps/completion-step";
import { getDefaultValues } from "@/lib/schema/defaults";
import {
  clearDraft,
  formatDraftTimestamp,
  loadDraft,
  mergeWithDefaults,
  saveDraft,
} from "@/lib/storage/draft";
import { stepSchemas, type ValidatedStepId } from "@/lib/validation/schemas";
import type { IntakeFormValues, WizardStepId } from "@/types/intake";
import { WIZARD_STEPS } from "@/lib/schema";

const ORDER = WIZARD_STEPS.map((s) => s.id);

export function WizardShell() {
  const [stepId, setStepId] = useState<WizardStepId>("welcome");
  const [hydrated, setHydrated] = useState(false);
  const [draftInfo, setDraftInfo] = useState<{ updatedAt: string } | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const headingRef = useRef<HTMLDivElement>(null);

  const form = useForm<IntakeFormValues>({
    defaultValues: getDefaultValues(),
    mode: "onBlur",
    shouldUnregister: false,
  });

  useEffect(() => {
    const draft = loadDraft();
    if (draft) setDraftInfo({ updatedAt: draft.updatedAt });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (stepId === "welcome" || stepId === "completion") return;

    saveDraft(stepId, form.getValues());

    let timer: number | undefined;
    const subscription = form.watch((values) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        saveDraft(stepId, values as IntakeFormValues);
      }, 450);
    });

    return () => {
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [form, hydrated, stepId]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepId]);

  function goTo(next: WizardStepId) {
    setStepId(next);
    setAnimKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resumeDraft() {
    const draft = loadDraft();
    if (!draft) return;
    form.reset(mergeWithDefaults(draft.values));
    const resumeStep =
      draft.stepId === "completion" || draft.stepId === "welcome"
        ? "personal"
        : draft.stepId;
    goTo(resumeStep);
    setDraftInfo(null);
  }

  function startOver() {
    clearDraft();
    form.reset(getDefaultValues());
    setDraftInfo(null);
    goTo("personal");
  }

  async function validateAndNext(current: ValidatedStepId) {
    const schema = stepSchemas[current];
    const values = form.getValues();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      form.clearErrors();
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".") as FieldPath<IntakeFormValues>;
        form.setError(path, { type: "manual", message: issue.message });
      }
      const first = parsed.error.issues[0];
      if (first) {
        try {
          form.setFocus(first.path.join(".") as FieldPath<IntakeFormValues>);
        } catch {
          // Some fields (checkbox groups) may not register a focusable ref
        }
      }
      return;
    }

    form.clearErrors();
    const idx = ORDER.indexOf(current);
    const next = ORDER[idx + 1];
    if (next) goTo(next);
  }

  function goBack() {
    const idx = ORDER.indexOf(stepId);
    if (idx > 0) goTo(ORDER[idx - 1]);
  }

  function jumpTo(id: WizardStepId) {
    goTo(id);
  }

  function submitMock() {
    clearDraft();
    goTo("completion");
  }

  const quietHeader = stepId !== "welcome";

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading intake…
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="grain relative flex min-h-screen flex-col">
        <IntakeHeader quiet={quietHeader} />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {stepId !== "welcome" && stepId !== "completion" ? (
            <div ref={headingRef} tabIndex={-1} className="mb-6 outline-none">
              <WizardProgress stepId={stepId} />
            </div>
          ) : (
            <div ref={headingRef} tabIndex={-1} className="outline-none" />
          )}

          <div key={animKey} className="step-enter">
            {stepId === "welcome" && (
              <WelcomeStep
                hasDraft={Boolean(draftInfo)}
                draftUpdatedAt={
                  draftInfo
                    ? formatDraftTimestamp(draftInfo.updatedAt)
                    : undefined
                }
                onStart={startOver}
                onResume={resumeDraft}
              />
            )}
            {stepId === "personal" && (
              <PersonalStep
                onBack={() => goTo("welcome")}
                onNext={() => validateAndNext("personal")}
              />
            )}
            {stepId === "contact" && (
              <ContactStep
                onBack={goBack}
                onNext={() => validateAndNext("contact")}
              />
            )}
            {stepId === "insurance" && (
              <InsuranceStep
                onBack={goBack}
                onNext={() => validateAndNext("insurance")}
              />
            )}
            {stepId === "medical" && (
              <MedicalStep
                onBack={goBack}
                onNext={() => validateAndNext("medical")}
              />
            )}
            {stepId === "dental" && (
              <DentalStep
                onBack={goBack}
                onNext={() => validateAndNext("dental")}
              />
            )}
            {stepId === "concerns" && (
              <ConcernsStep
                onBack={goBack}
                onNext={() => validateAndNext("concerns")}
              />
            )}
            {stepId === "consent" && (
              <ConsentStep
                onBack={goBack}
                onNext={() => validateAndNext("consent")}
              />
            )}
            {stepId === "review" && (
              <ReviewStep onBack={goBack} onEdit={jumpTo} onSubmit={submitMock} />
            )}
            {stepId === "completion" && <CompletionStep />}
          </div>
        </main>
        <footer className="mx-auto w-full max-w-3xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          Demo intake for Randhawa Dental · Data stays in your browser · Not a live
          submission
        </footer>
      </div>
    </FormProvider>
  );
}
