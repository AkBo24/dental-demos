"use client";

import { StepNav } from "../step-nav";
import {
  AddressAutocompleteField,
  EmailField,
  PhoneField,
  StateSelectField,
  TextareaField,
  TextField,
  ZipField,
} from "@/components/fields";

export function ContactStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <EmailField name="contact.email" label="Email Address" required />
        </div>
        <PhoneField name="contact.phone_mobile" label="Mobile Phone" required />
        <PhoneField name="contact.phone_home" label="Home Phone" />
        <PhoneField name="contact.phone_work" label="Work Phone" />
        <TextField name="contact.phone_extension" label="Phone Extension" />
        <div className="sm:col-span-2">
          <AddressAutocompleteField />
        </div>
        <TextField name="contact.address_city" label="City" required />
        <StateSelectField name="contact.address_state" label="State" required />
        <ZipField name="contact.zip_code" label="ZIP Code" required />
        <div className="sm:col-span-2">
          <TextareaField
            name="contact.referral_source"
            label="Whom may we thank for referring you?"
            placeholder="Friend, Google, insurance, etc."
          />
        </div>
        <div className="sm:col-span-2">
          <TextareaField
            name="contact.emergency_contact"
            label="Emergency Contact"
            placeholder="Name, relationship, and phone number"
          />
        </div>
      </div>
      <StepNav onBack={onBack} onNext={onNext} />
    </section>
  );
}
