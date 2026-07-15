export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "date"
  | "zipcode"
  | "select"
  | "searchable_select"
  | "textarea"
  | "checkbox"
  | "checkbox_group"
  | "radio"
  | "multi_select"
  | "file_upload"
  | "signature";

export interface RawField {
  id: string;
  label?: string;
  type: FieldType;
  required?: boolean;
  options?: string[] | string;
  accepted_types?: string[];
}

export interface RawSection {
  id: string;
  title: string;
  fields?: RawField[];
  inherits?: string;
}

export interface RawIntakeForm {
  form_name: string;
  version: string;
  sections: RawSection[];
}

export interface ResolvedField extends Omit<RawField, "options" | "label"> {
  label: string;
  options?: string[];
  namespace?: string;
  path: string;
}

export interface ResolvedSection {
  id: string;
  title: string;
  fields: ResolvedField[];
  inherits?: string;
}

export type WizardStepId =
  | "welcome"
  | "personal"
  | "contact"
  | "insurance"
  | "medical"
  | "dental"
  | "concerns"
  | "consent"
  | "review"
  | "completion";

export interface WizardStepMeta {
  id: WizardStepId;
  title: string;
  shortTitle: string;
  description: string;
  counted: boolean;
  etaMinutes: number;
}

export interface FileUploadValue {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface SignatureValue {
  mode: "draw" | "type";
  dataUrl?: string;
  typedName?: string;
  signedAt?: string;
}

export interface PersonalValues {
  first_name: string;
  last_name: string;
  middle_initial: string;
  preferred_name: string;
  gender: string;
  family_status: string;
  birth_date: string;
  employer_name: string;
  relationship_to_patient: string;
}

export interface ContactValues {
  email: string;
  phone_home: string;
  phone_work: string;
  phone_extension: string;
  phone_mobile: string;
  address_street: string;
  address_city: string;
  address_state: string;
  zip_code: string;
  referral_source: string;
  emergency_contact: string;
}

export interface InsuranceBlockValues {
  subscriber_first_name: string;
  subscriber_last_name: string;
  subscriber_birth_date: string;
  subscriber_id: string;
  group_number: string;
  subscriber_employer: string;
  patient_relationship_to_subscriber: string;
  insurance_plan: string;
  insurance_address_street: string;
  insurance_address_city: string;
  insurance_card_front: FileUploadValue | null;
  insurance_card_back: FileUploadValue | null;
  insurance_authorization: boolean;
}

export interface InsuranceValues {
  has_secondary: boolean;
  primary: InsuranceBlockValues;
  secondary: InsuranceBlockValues;
}

export interface MedicalValues {
  medical_conditions: string[];
  medical_conditions_other: string;
  allergy_list: string[];
  other_allergies: string;
  allergy_notes: string;
  medications: string[];
  other_medications: string;
  preferred_pharmacy: string;
  antibiotic_premedication: string;
  physician_name_phone: string;
}

export interface DentalValues {
  previous_dentist: string;
  last_exam_date: string;
  smile_changes: string;
  dental_history_checklist: string[];
  dental_history_notes: string;
}

export interface ConcernsValues {
  immediate_concern: string;
}

export interface ConsentValues {
  financial_policy: boolean;
  appointment_policy: boolean;
  hipaa_acknowledgement: boolean;
  hipaa_authorized_people: string;
  financial_signature: SignatureValue | null;
  medical_history_signature: SignatureValue | null;
  consent_to_treatment_signature: SignatureValue | null;
}

export interface IntakeFormValues {
  personal: PersonalValues;
  contact: ContactValues;
  insurance: InsuranceValues;
  medical: MedicalValues;
  dental: DentalValues;
  concerns: ConcernsValues;
  consent: ConsentValues;
}

export interface DraftPayload {
  version: string;
  updatedAt: string;
  stepId: WizardStepId;
  values: IntakeFormValues;
}
