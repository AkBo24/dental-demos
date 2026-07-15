import type { DraftPayload, IntakeFormValues, WizardStepId } from "@/types/intake";
import { getDefaultValues } from "@/lib/schema/defaults";

const STORAGE_KEY = "randhawa-intake-draft-v1";

export function loadDraft(): DraftPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftPayload;
    if (!parsed?.values || !parsed?.stepId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(stepId: WizardStepId, values: IntakeFormValues): void {
  if (typeof window === "undefined") return;
  const payload: DraftPayload = {
    version: "1.0",
    updatedAt: new Date().toISOString(),
    stepId,
    values,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota / private mode — ignore for demo
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasDraft(): boolean {
  return loadDraft() !== null;
}

export function mergeWithDefaults(
  partial?: Partial<IntakeFormValues> | IntakeFormValues,
): IntakeFormValues {
  const defaults = getDefaultValues();
  if (!partial) return defaults;
  return {
    personal: { ...defaults.personal, ...partial.personal },
    contact: { ...defaults.contact, ...partial.contact },
    insurance: {
      has_secondary:
        partial.insurance?.has_secondary ?? defaults.insurance.has_secondary,
      primary: {
        ...defaults.insurance.primary,
        ...partial.insurance?.primary,
      },
      secondary: {
        ...defaults.insurance.secondary,
        ...partial.insurance?.secondary,
      },
    },
    medical: { ...defaults.medical, ...partial.medical },
    dental: { ...defaults.dental, ...partial.dental },
    concerns: { ...defaults.concerns, ...partial.concerns },
    consent: { ...defaults.consent, ...partial.consent },
  };
}

export function formatDraftTimestamp(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
