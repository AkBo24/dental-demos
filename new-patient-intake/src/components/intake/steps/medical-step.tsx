"use client";

import { useWatch } from "react-hook-form";
import { StepNav } from "../step-nav";
import {
  CheckboxGroupField,
  ChipGroupField,
  MultiSelectField,
  RadioField,
  TextareaField,
  TextField,
} from "@/components/fields";
import { MEDICAL_CONDITION_GROUPS } from "@/lib/schema";
import { COMMON_MEDICATIONS } from "@/lib/mocks/medications";
import type { IntakeFormValues } from "@/types/intake";

export function MedicalStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const conditions = useWatch<IntakeFormValues, "medical.medical_conditions">({
    name: "medical.medical_conditions",
  });
  const allergyList = useWatch<IntakeFormValues, "medical.allergy_list">({
    name: "medical.allergy_list",
  });
  const showOther = (conditions ?? []).includes("Other");
  const showAllergyDetail =
    (allergyList ?? []).length > 0 ||
    (conditions ?? []).some((c) => c.startsWith("Allergy") || c === "Allergies");

  return (
    <section className="space-y-6 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <ChipGroupField
        name="medical.medical_conditions"
        label="Medical Conditions"
        groups={MEDICAL_CONDITION_GROUPS}
      />

      {showOther ? (
        <TextareaField
          name="medical.medical_conditions_other"
          label="Please describe other medical conditions"
          placeholder="Share anything else we should know"
        />
      ) : null}

      <CheckboxGroupField
        name="medical.allergy_list"
        label="Food & other allergies"
        options={["Banana", "Egg", "Lavender", "Melon", "Miconazole", "Nut"]}
        columns={2}
      />

      {showAllergyDetail ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextareaField
            name="medical.other_allergies"
            label="Other allergies"
            placeholder="List any additional allergies"
          />
          <TextareaField
            name="medical.allergy_notes"
            label="Allergy notes"
            placeholder="Reactions, severity, etc."
          />
        </div>
      ) : null}

      <MultiSelectField
        name="medical.medications"
        label="Current medications"
        options={COMMON_MEDICATIONS}
      />
      <TextareaField
        name="medical.other_medications"
        label="Other medications"
        placeholder="Anything not in the list"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="medical.preferred_pharmacy"
          label="Preferred pharmacy"
          placeholder="Name and location"
        />
        <TextField
          name="medical.physician_name_phone"
          label="Primary physician (name & phone)"
        />
      </div>

      <RadioField
        name="medical.antibiotic_premedication"
        label="Do you require antibiotic premedication?"
        options={["Yes", "No"]}
      />

      <StepNav onBack={onBack} onNext={onNext} />
    </section>
  );
}
