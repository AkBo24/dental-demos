"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Pencil, FileText } from "lucide-react";
import { StepNav } from "../step-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDisplayDate, patientFullName } from "@/lib/format";
import { getStateLabel } from "@/lib/mocks/states";
import type { IntakeFormValues, WizardStepId } from "@/types/intake";

function ReviewBlock({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-heading text-lg font-semibold tracking-wide">{title}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">{children}</dl>
    </div>
  );
}

function Row({
  label,
  value,
  wide,
}: {
  label: string;
  value?: React.ReactNode;
  wide?: boolean;
}) {
  const display =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
      ? "—"
      : Array.isArray(value)
        ? value.join(", ")
        : value;
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{display}</dd>
    </div>
  );
}

export function ReviewStep({
  onBack,
  onEdit,
  onSubmit,
}: {
  onBack: () => void;
  onEdit: (id: WizardStepId) => void;
  onSubmit: () => void;
}) {
  const { getValues } = useFormContext<IntakeFormValues>();
  const values = getValues();
  const [pdfOpen, setPdfOpen] = useState(false);
  const name = useMemo(() => patientFullName(values.personal), [values.personal]);

  return (
    <section className="space-y-4 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Double-check everything below. You can jump back to any section to edit.
        </p>
        <Button type="button" variant="outline" onClick={() => setPdfOpen(true)}>
          <FileText className="size-4" />
          Generate PDF preview
        </Button>
      </div>

      <ReviewBlock title="Personal" onEdit={() => onEdit("personal")}>
        <Row label="Name" value={name} />
        <Row label="Birth date" value={formatDisplayDate(values.personal.birth_date)} />
        <Row label="Gender" value={values.personal.gender} />
        <Row label="Family status" value={values.personal.family_status} />
        <Row label="Employer" value={values.personal.employer_name} />
        <Row
          label="Responsible party"
          value={values.personal.relationship_to_patient}
        />
      </ReviewBlock>

      <ReviewBlock title="Contact" onEdit={() => onEdit("contact")}>
        <Row label="Email" value={values.contact.email} />
        <Row label="Mobile" value={values.contact.phone_mobile} />
        <Row
          label="Address"
          wide
          value={[
            values.contact.address_street,
            values.contact.address_city,
            getStateLabel(values.contact.address_state),
            values.contact.zip_code,
          ]
            .filter(Boolean)
            .join(", ")}
        />
        <Row label="Referral" value={values.contact.referral_source} wide />
        <Row label="Emergency" value={values.contact.emergency_contact} wide />
      </ReviewBlock>

      <ReviewBlock title="Insurance" onEdit={() => onEdit("insurance")}>
        <Row label="Primary plan" value={values.insurance.primary.insurance_plan} />
        <Row
          label="Subscriber"
          value={[
            values.insurance.primary.subscriber_first_name,
            values.insurance.primary.subscriber_last_name,
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <Row
          label="Member ID"
          value={values.insurance.primary.subscriber_id}
        />
        <Row
          label="Relationship"
          value={values.insurance.primary.patient_relationship_to_subscriber}
        />
        {values.insurance.has_secondary ? (
          <>
            <Row
              label="Secondary plan"
              value={values.insurance.secondary.insurance_plan}
            />
            <Row
              label="Secondary member ID"
              value={values.insurance.secondary.subscriber_id}
            />
          </>
        ) : (
          <Row label="Secondary" value="Not added" />
        )}
      </ReviewBlock>

      <ReviewBlock title="Medical" onEdit={() => onEdit("medical")}>
        <Row
          label="Conditions"
          value={values.medical.medical_conditions}
          wide
        />
        <Row label="Food allergies" value={values.medical.allergy_list} wide />
        <Row label="Medications" value={values.medical.medications} wide />
        <Row label="Pharmacy" value={values.medical.preferred_pharmacy} />
        <Row label="Premedication" value={values.medical.antibiotic_premedication} />
      </ReviewBlock>

      <ReviewBlock title="Dental" onEdit={() => onEdit("dental")}>
        <Row label="Previous dentist" value={values.dental.previous_dentist} />
        <Row
          label="Last exam"
          value={formatDisplayDate(values.dental.last_exam_date)}
        />
        <Row
          label="History"
          value={values.dental.dental_history_checklist}
          wide
        />
        <Row label="Smile goals" value={values.dental.smile_changes} wide />
      </ReviewBlock>

      <ReviewBlock title="Current concerns" onEdit={() => onEdit("concerns")}>
        <Row label="Chief concern" value={values.concerns.immediate_concern} wide />
      </ReviewBlock>

      <ReviewBlock title="Consent" onEdit={() => onEdit("consent")}>
        <Row
          label="Policies"
          value={
            [
              values.consent.financial_policy && "Financial",
              values.consent.appointment_policy && "Appointment",
              values.consent.hipaa_acknowledgement && "HIPAA",
            ]
              .filter(Boolean)
              .join(" · ") || "—"
          }
          wide
        />
        <Row
          label="Authorized people"
          value={values.consent.hipaa_authorized_people}
          wide
        />
        <Row
          label="Signatures"
          value={
            [
              values.consent.financial_signature && "Financial",
              values.consent.medical_history_signature && "Medical history",
              values.consent.consent_to_treatment_signature && "Treatment",
            ]
              .filter(Boolean)
              .join(" · ") || "—"
          }
          wide
        />
      </ReviewBlock>

      <StepNav
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="Submit intake"
      />

      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-auto print:max-w-none">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              Intake summary — mock PDF
            </DialogTitle>
            <DialogDescription>
              Printable preview for demo purposes. No file is uploaded.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 border border-border bg-white p-6 text-sm text-stone-900 dark:bg-stone-950 dark:text-stone-100 print:border-0">
            <div className="border-b border-stone-300 pb-3">
              <p className="font-heading text-2xl font-semibold text-[#8B1E1E]">
                Randhawa Dental
              </p>
              <p className="text-stone-600 dark:text-stone-400">
                New Patient Intake · {name}
              </p>
              <p className="text-xs text-stone-500">
                Generated {new Date().toLocaleString()}
              </p>
            </div>
            <PdfSection title="Personal">
              {name} · DOB {formatDisplayDate(values.personal.birth_date)} ·{" "}
              {values.personal.gender}
            </PdfSection>
            <PdfSection title="Contact">
              {values.contact.email} · {values.contact.phone_mobile}
              <br />
              {values.contact.address_street}, {values.contact.address_city},{" "}
              {getStateLabel(values.contact.address_state)} {values.contact.zip_code}
            </PdfSection>
            <PdfSection title="Insurance">
              Primary: {values.insurance.primary.insurance_plan || "—"}
              {values.insurance.has_secondary
                ? ` · Secondary: ${values.insurance.secondary.insurance_plan || "—"}`
                : ""}
            </PdfSection>
            <PdfSection title="Chief concern">
              {values.concerns.immediate_concern || "—"}
            </PdfSection>
            <PdfSection title="Medical highlights">
              Conditions:{" "}
              {values.medical.medical_conditions.join(", ") || "None selected"}
              <br />
              Meds: {values.medical.medications.join(", ") || "None selected"}
            </PdfSection>
            <p className="pt-4 text-xs text-stone-500">
              Signatures captured digitally
              {values.consent.financial_signature?.signedAt
                ? ` · ${new Date(values.consent.financial_signature.signedAt).toLocaleString()}`
                : ""}
            </p>
            <div className="flex justify-end gap-2 print:hidden">
              <Button type="button" variant="outline" onClick={() => setPdfOpen(false)}>
                Close
              </Button>
              <Button
                type="button"
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                onClick={() => window.print()}
              >
                Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function PdfSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-heading text-base font-semibold text-[#8B1E1E]">{title}</p>
      <p className="mt-1 leading-relaxed">{children}</p>
    </div>
  );
}
