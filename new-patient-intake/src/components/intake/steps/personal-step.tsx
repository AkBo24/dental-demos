"use client";

import { StepNav } from "../step-nav";
import { DateField, SelectField, TextField } from "@/components/fields";

export function PersonalStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="personal.first_name" label="First Name" required />
        <TextField name="personal.last_name" label="Last Name" required />
        <TextField
          name="personal.middle_initial"
          label="Middle Initial"
          maxLength={1}
        />
        <TextField name="personal.preferred_name" label="Preferred Name" />
        <SelectField
          name="personal.gender"
          label="Gender"
          required
          options={["Male", "Female", "Non-binary", "Other", "Prefer not to answer"]}
        />
        <SelectField
          name="personal.family_status"
          label="Family Status"
          required
          options={["Single", "Married", "Divorced", "Widowed", "Partnered", "Other"]}
        />
        <DateField name="personal.birth_date" label="Birth Date" required />
        <TextField name="personal.employer_name" label="Employer Name" />
        <div className="sm:col-span-2">
          <SelectField
            name="personal.relationship_to_patient"
            label="Responsible Party Relationship"
            required
            options={["Self", "Spouse", "Child", "Other"]}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            If you are the responsible party (Self), no extra paperwork is needed here.
          </p>
        </div>
      </div>
      <StepNav onBack={onBack} onNext={onNext} />
    </section>
  );
}
