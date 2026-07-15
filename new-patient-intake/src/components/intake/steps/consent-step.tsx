"use client";

import { StepNav } from "../step-nav";
import { CheckboxField, SignatureField, TextField } from "@/components/fields";

export function ConsentStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <div className="space-y-3 rounded-xl border border-border/60 bg-background/50 p-4 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Financial Policy.</strong> Payment is
          due at the time of service unless other arrangements are made. Insurance
          estimates are not a guarantee of payment.
        </p>
        <p>
          <strong className="text-foreground">Appointment Policy.</strong> Please
          provide 24 hours notice for cancellations. Repeated late cancels may incur
          a fee.
        </p>
        <p>
          <strong className="text-foreground">HIPAA.</strong> We protect your health
          information according to federal privacy rules. You may authorize people
          below to discuss your care with us.
        </p>
      </div>

      <CheckboxField
        name="consent.financial_policy"
        label="I have read and agree to the Financial Policy"
        required
      />
      <CheckboxField
        name="consent.appointment_policy"
        label="I have read and agree to the Appointment Policy"
        required
      />
      <CheckboxField
        name="consent.hipaa_acknowledgement"
        label="I acknowledge receipt of the Notice of Privacy Practices (HIPAA)"
        required
      />

      <TextField
        name="consent.hipaa_authorized_people"
        label="People authorized to receive my health information"
        placeholder="Optional — names and relationships"
      />

      <SignatureField
        name="consent.financial_signature"
        label="Financial agreement signature"
        required
      />
      <SignatureField
        name="consent.medical_history_signature"
        label="Medical history attestation signature"
        required
      />
      <SignatureField
        name="consent.consent_to_treatment_signature"
        label="Consent to treatment signature"
        required
      />

      <StepNav onBack={onBack} onNext={onNext} nextLabel="Review answers" />
    </section>
  );
}
