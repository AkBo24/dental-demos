"use client";

import { StepNav } from "../step-nav";
import {
  CheckboxGroupField,
  DateField,
  TextareaField,
  TextField,
} from "@/components/fields";

const DENTAL_CHECKLIST = [
  "Complications from past dental treatment",
  "Reaction to local anesthetic",
  "Dry mouth",
  "Food gets trapped between teeth",
  "Jaw popping/clicking",
  "Clenching or grinding",
  "Bleeding gums",
  "Bad taste or odor",
  "Loose teeth",
  "Snoring",
  "Difficulty getting numb",
  "Orthodontic treatment",
  "Sensitive teeth",
  "Teeth whitening",
  "Difficulty chewing",
  "Bite appliance",
  "Gum disease",
  "Gum recession",
  "Burning mouth",
];

export function DentalStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="dental.previous_dentist" label="Previous dentist" />
        <DateField name="dental.last_exam_date" label="Date of last dental exam" />
      </div>

      <CheckboxGroupField
        name="dental.dental_history_checklist"
        label="Dental history"
        options={DENTAL_CHECKLIST}
        columns={2}
      />

      <TextareaField
        name="dental.smile_changes"
        label="Are there any changes you would like to make to your smile?"
        placeholder="Whitening, alignment, restorations…"
      />
      <TextareaField
        name="dental.dental_history_notes"
        label="Additional dental history notes"
      />

      <StepNav onBack={onBack} onNext={onNext} />
    </section>
  );
}
