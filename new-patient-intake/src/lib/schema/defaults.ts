import type {
  IntakeFormValues,
  InsuranceBlockValues,
  SignatureValue,
} from "@/types/intake";

export function emptyInsuranceBlock(): InsuranceBlockValues {
  return {
    subscriber_first_name: "",
    subscriber_last_name: "",
    subscriber_birth_date: "",
    subscriber_id: "",
    group_number: "",
    subscriber_employer: "",
    patient_relationship_to_subscriber: "",
    insurance_plan: "",
    insurance_address_street: "",
    insurance_address_city: "",
    insurance_card_front: null,
    insurance_card_back: null,
    insurance_authorization: false,
  };
}

export function emptySignature(): SignatureValue {
  return { mode: "draw" };
}

export function getDefaultValues(): IntakeFormValues {
  return {
    personal: {
      first_name: "",
      last_name: "",
      middle_initial: "",
      preferred_name: "",
      gender: "",
      family_status: "",
      birth_date: "",
      employer_name: "",
      relationship_to_patient: "Self",
    },
    contact: {
      email: "",
      phone_home: "",
      phone_work: "",
      phone_extension: "",
      phone_mobile: "",
      address_street: "",
      address_city: "",
      address_state: "",
      zip_code: "",
      referral_source: "",
      emergency_contact: "",
    },
    insurance: {
      has_secondary: false,
      primary: emptyInsuranceBlock(),
      secondary: emptyInsuranceBlock(),
    },
    medical: {
      medical_conditions: [],
      medical_conditions_other: "",
      allergy_list: [],
      other_allergies: "",
      allergy_notes: "",
      medications: [],
      other_medications: "",
      preferred_pharmacy: "",
      antibiotic_premedication: "",
      physician_name_phone: "",
    },
    dental: {
      previous_dentist: "",
      last_exam_date: "",
      smile_changes: "",
      dental_history_checklist: [],
      dental_history_notes: "",
    },
    concerns: {
      immediate_concern: "",
    },
    consent: {
      financial_policy: false,
      appointment_policy: false,
      hipaa_acknowledgement: false,
      hipaa_authorized_people: "",
      financial_signature: null,
      medical_history_signature: null,
      consent_to_treatment_signature: null,
    },
  };
}
