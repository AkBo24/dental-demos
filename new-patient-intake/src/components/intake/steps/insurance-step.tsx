"use client";

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { StepNav } from "../step-nav";
import {
  CheckboxField,
  DateField,
  FileUploadField,
  SearchableSelectField,
  SelectField,
  TextField,
} from "@/components/fields";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { INSURANCE_CARRIERS } from "@/lib/mocks/carriers";
import type { IntakeFormValues } from "@/types/intake";

function InsuranceBlock({
  prefix,
  title,
}: {
  prefix: "insurance.primary" | "insurance.secondary";
  title: string;
}) {
  const { setValue, getValues } = useFormContext<IntakeFormValues>();
  const relationship = useWatch({
    name: `${prefix}.patient_relationship_to_subscriber` as const,
  });

  useEffect(() => {
    if (relationship !== "Self") return;
    const personal = getValues("personal");
    setValue(`${prefix}.subscriber_first_name`, personal.first_name, {
      shouldDirty: true,
    });
    setValue(`${prefix}.subscriber_last_name`, personal.last_name, {
      shouldDirty: true,
    });
    setValue(`${prefix}.subscriber_birth_date`, personal.birth_date, {
      shouldDirty: true,
    });
  }, [relationship, prefix, setValue, getValues]);

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-background/50 p-4 sm:p-5">
      <h3 className="font-heading text-lg font-semibold tracking-wide">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          name={`${prefix}.patient_relationship_to_subscriber`}
          label="Patient Relationship to Subscriber"
          required={prefix === "insurance.primary"}
          options={["Self", "Spouse", "Child", "Other"]}
        />
        <SearchableSelectField
          name={`${prefix}.insurance_plan`}
          label="Insurance Plan / Carrier"
          required={prefix === "insurance.primary"}
          options={INSURANCE_CARRIERS}
          placeholder="Search carriers…"
        />
        <TextField
          name={`${prefix}.subscriber_first_name`}
          label="Subscriber First Name"
        />
        <TextField
          name={`${prefix}.subscriber_last_name`}
          label="Subscriber Last Name"
        />
        <DateField
          name={`${prefix}.subscriber_birth_date`}
          label="Subscriber Birth Date"
        />
        <TextField name={`${prefix}.subscriber_id`} label="Subscriber / Member ID" />
        <TextField name={`${prefix}.group_number`} label="Group Number" />
        <TextField
          name={`${prefix}.subscriber_employer`}
          label="Subscriber Employer"
        />
        <TextField
          name={`${prefix}.insurance_address_street`}
          label="Insurance Address"
        />
        <TextField
          name={`${prefix}.insurance_address_city`}
          label="Insurance City"
        />
        <FileUploadField
          name={`${prefix}.insurance_card_front`}
          label="Insurance Card (Front)"
        />
        <FileUploadField
          name={`${prefix}.insurance_card_back`}
          label="Insurance Card (Back)"
        />
        <div className="sm:col-span-2">
          <CheckboxField
            name={`${prefix}.insurance_authorization`}
            label="I authorize benefits to be paid directly to this practice"
            required={prefix === "insurance.primary"}
          />
        </div>
      </div>
    </div>
  );
}

export function InsuranceStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const { setValue, control } = useFormContext<IntakeFormValues>();
  const hasSecondary = useWatch({ control, name: "insurance.has_secondary" });

  return (
    <section className="space-y-5 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <InsuranceBlock prefix="insurance.primary" title="Primary Dental Insurance" />

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/50 px-4 py-3">
        <div>
          <Label htmlFor="has-secondary" className="text-sm font-medium">
            Add secondary insurance?
          </Label>
          <p className="text-xs text-muted-foreground">
            Optional — same fields as primary, namespaced separately
          </p>
        </div>
        <Switch
          id="has-secondary"
          checked={hasSecondary}
          onCheckedChange={(v) =>
            setValue("insurance.has_secondary", v === true, { shouldDirty: true })
          }
        />
      </div>

      {hasSecondary ? (
        <InsuranceBlock
          prefix="insurance.secondary"
          title="Secondary Dental Insurance"
        />
      ) : null}

      <StepNav onBack={onBack} onNext={onNext} />
    </section>
  );
}
