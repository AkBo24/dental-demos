import rawForm from "./intake-form.json";
import type {
  RawField,
  RawIntakeForm,
  RawSection,
  ResolvedField,
  ResolvedSection,
  WizardStepMeta,
} from "@/types/intake";
import { US_STATES } from "@/lib/mocks/states";
import { INSURANCE_CARRIERS } from "@/lib/mocks/carriers";

const FIELD_LABELS: Record<string, string> = {
  subscriber_first_name: "Subscriber First Name",
  subscriber_last_name: "Subscriber Last Name",
  subscriber_birth_date: "Subscriber Birth Date",
  subscriber_id: "Subscriber ID / Member ID",
  group_number: "Group Number",
  subscriber_employer: "Subscriber Employer",
  patient_relationship_to_subscriber: "Patient Relationship to Subscriber",
  insurance_plan: "Insurance Plan / Carrier",
  insurance_address_street: "Insurance Address",
  insurance_address_city: "Insurance City",
  insurance_card_front: "Insurance Card (Front)",
  insurance_card_back: "Insurance Card (Back)",
  insurance_authorization: "I authorize benefits to be paid directly to this practice",
  medical_conditions_other: "Please describe other medical conditions",
  allergy_list: "Food & other allergies",
  other_allergies: "Other allergies",
  allergy_notes: "Allergy notes",
  medications: "Current medications",
  other_medications: "Other medications",
  preferred_pharmacy: "Preferred pharmacy",
  antibiotic_premedication: "Do you require antibiotic premedication?",
  physician_name_phone: "Primary physician (name & phone)",
  immediate_concern: "What brings you in today?",
  previous_dentist: "Previous dentist",
  last_exam_date: "Date of last dental exam",
  smile_changes: "Are there any changes you would like to make to your smile?",
  dental_history_checklist: "Dental history",
  dental_history_notes: "Additional dental history notes",
  financial_policy: "I have read and agree to the Financial Policy",
  appointment_policy: "I have read and agree to the Appointment Policy",
  hipaa_acknowledgement: "I acknowledge receipt of the Notice of Privacy Practices (HIPAA)",
  hipaa_authorized_people: "People authorized to receive my health information",
  financial_signature: "Financial agreement signature",
  medical_history_signature: "Medical history attestation signature",
  consent_to_treatment_signature: "Consent to treatment signature",
};

function humanizeId(id: string): string {
  return id
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveOptions(options?: string[] | string): string[] | undefined {
  if (!options) return undefined;
  if (Array.isArray(options)) return options;
  if (options === "US_STATES") return US_STATES.map((s) => s.value);
  if (options.toLowerCase().includes("insurance")) return [...INSURANCE_CARRIERS];
  return [];
}

function resolveField(field: RawField, namespace?: string): ResolvedField {
  const label = field.label ?? FIELD_LABELS[field.id] ?? humanizeId(field.id);
  const path = namespace ? `${namespace}.${field.id}` : field.id;
  return {
    id: field.id,
    type: field.type,
    required: field.required ?? false,
    accepted_types: field.accepted_types,
    label: namespace?.includes("secondary")
      ? `${label} (Secondary)`
      : label,
    options: resolveOptions(field.options),
    namespace,
    path,
  };
}

function resolveSection(section: RawSection, all: RawSection[]): ResolvedSection {
  if (section.inherits) {
    const parent = all.find((s) => s.id === section.inherits);
    if (!parent?.fields) {
      return { id: section.id, title: section.title, fields: [], inherits: section.inherits };
    }
    const namespace =
      section.id === "secondary_insurance" ? "insurance.secondary" : section.id;
    return {
      id: section.id,
      title: section.title,
      inherits: section.inherits,
      fields: parent.fields.map((f) => resolveField(f, namespace)),
    };
  }

  const namespace =
    section.id === "primary_insurance"
      ? "insurance.primary"
      : section.id === "patient_demographics" ||
          section.id === "employment" ||
          section.id === "responsible_party"
        ? "personal"
        : section.id === "medical_history" ||
            section.id === "allergies" ||
            section.id === "medications"
          ? "medical"
          : section.id === "dental_history"
            ? "dental"
            : section.id === "consents"
              ? "consent"
              : section.id;

  return {
    id: section.id,
    title: section.title,
    fields: (section.fields ?? []).map((f) => resolveField(f, namespace)),
  };
}

export function loadIntakeForm(): {
  form: RawIntakeForm;
  sections: ResolvedSection[];
} {
  const form = rawForm as RawIntakeForm;
  const sections = form.sections.map((section) =>
    resolveSection(section, form.sections),
  );
  return { form, sections };
}

export function getSection(id: string): ResolvedSection | undefined {
  return loadIntakeForm().sections.find((s) => s.id === id);
}

export function getFieldsByIds(
  sectionId: string,
  fieldIds: string[],
): ResolvedField[] {
  const section = getSection(sectionId);
  if (!section) return [];
  return fieldIds
    .map((id) => section.fields.find((f) => f.id === id))
    .filter((f): f is ResolvedField => Boolean(f));
}

/** Form steps counted in progress (excludes Welcome + Completion). */
export const WIZARD_STEPS: WizardStepMeta[] = [
  {
    id: "welcome",
    title: "Welcome",
    shortTitle: "Welcome",
    description: "Start your new patient intake",
    counted: false,
    etaMinutes: 0,
  },
  {
    id: "personal",
    title: "Personal Information",
    shortTitle: "Personal",
    description: "Tell us a bit about yourself",
    counted: true,
    etaMinutes: 2,
  },
  {
    id: "contact",
    title: "Contact Information",
    shortTitle: "Contact",
    description: "How can we reach you?",
    counted: true,
    etaMinutes: 2,
  },
  {
    id: "insurance",
    title: "Insurance",
    shortTitle: "Insurance",
    description: "Primary and optional secondary coverage",
    counted: true,
    etaMinutes: 2,
  },
  {
    id: "medical",
    title: "Medical History",
    shortTitle: "Medical",
    description: "Conditions, allergies, and medications",
    counted: true,
    etaMinutes: 3,
  },
  {
    id: "dental",
    title: "Dental History",
    shortTitle: "Dental",
    description: "Your dental background",
    counted: true,
    etaMinutes: 2,
  },
  {
    id: "concerns",
    title: "Current Concerns",
    shortTitle: "Concerns",
    description: "What should we focus on today?",
    counted: true,
    etaMinutes: 1,
  },
  {
    id: "consent",
    title: "Policies & Consent",
    shortTitle: "Consent",
    description: "Review policies and sign",
    counted: true,
    etaMinutes: 2,
  },
  {
    id: "review",
    title: "Review",
    shortTitle: "Review",
    description: "Confirm your answers before submitting",
    counted: true,
    etaMinutes: 1,
  },
  {
    id: "completion",
    title: "You're all set",
    shortTitle: "Done",
    description: "What happens next",
    counted: false,
    etaMinutes: 0,
  },
];

export const COUNTED_STEPS = WIZARD_STEPS.filter((s) => s.counted);

export function getStepMeta(id: string): WizardStepMeta | undefined {
  return WIZARD_STEPS.find((s) => s.id === id);
}

export function getCountedIndex(stepId: string): number {
  return COUNTED_STEPS.findIndex((s) => s.id === stepId);
}

export function estimateMinutesLeft(stepId: string): number {
  const idx = WIZARD_STEPS.findIndex((s) => s.id === stepId);
  if (idx < 0) return 0;
  return WIZARD_STEPS.slice(idx + 1).reduce((sum, s) => sum + s.etaMinutes, 0);
}

/** Medical condition options categorized for chip UX */
export const MEDICAL_CONDITION_GROUPS = {
  "Pre-medication": [
    "Pre-Med - Amoxicillin",
    "Pre-Med - Clindamycin",
    "Pre-Med - Other",
  ],
  "Drug allergies": [
    "Allergies",
    "Allergy - Aspirin",
    "Allergy - Codeine",
    "Allergy - Erythromycin",
    "Allergy - Hay Fever",
    "Allergy - Latex",
    "Allergy - Other",
    "Allergy - Penicillin",
    "Allergy - Sulfa",
  ],
  Conditions: [
    "Anemia",
    "Arthritis",
    "Artificial Joints",
    "Asthma",
    "Blood Disease",
    "Cancer",
    "Diabetes",
    "Dizziness",
    "Epilepsy",
    "Excessive Bleeding",
    "Fainting",
    "Glaucoma",
    "HIV",
    "Head Injuries",
    "Heart Disease",
    "Heart Murmur",
    "Hepatitis",
    "High Blood Pressure",
    "Hypertrophic Cardiomyopathy",
    "Jaundice",
    "Kidney Disease",
    "Liver Disease",
    "Mental Disorders",
    "Nervous Disorders",
    "Pacemaker",
    "Pregnancy",
    "Radiation Treatment",
    "Respiratory Problems",
    "Rheumatic Fever",
    "Rheumatism",
    "Sinus Problems",
    "Stomach Problems",
    "Stroke",
    "Tuberculosis",
    "Tumors",
    "Ulcers",
    "Venereal Disease",
    "Other",
  ],
} as const;
