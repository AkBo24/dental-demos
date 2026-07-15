import { z } from "zod";

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const zipRegex = /^\d{5}(-\d{4})?$/;

const optionalPhone = z
  .string()
  .refine((v) => !v || phoneRegex.test(v), "Use format (XXX) XXX-XXXX");

const requiredPhone = z
  .string()
  .min(1, "Mobile phone is required")
  .regex(phoneRegex, "Use format (XXX) XXX-XXXX");

const fileUploadSchema = z
  .object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    dataUrl: z.string(),
  })
  .nullable();

const signatureSchema = z
  .object({
    mode: z.enum(["draw", "type"]),
    dataUrl: z.string().optional(),
    typedName: z.string().optional(),
    signedAt: z.string().optional(),
  })
  .nullable()
  .refine(
    (v) => {
      if (!v) return false;
      if (v.mode === "draw") return Boolean(v.dataUrl);
      return Boolean(v.typedName && v.typedName.trim().length > 1);
    },
    { message: "Signature is required" },
  );

const insuranceBlockSchema = z.object({
  subscriber_first_name: z.string(),
  subscriber_last_name: z.string(),
  subscriber_birth_date: z.string(),
  subscriber_id: z.string(),
  group_number: z.string(),
  subscriber_employer: z.string(),
  patient_relationship_to_subscriber: z.string(),
  insurance_plan: z.string(),
  insurance_address_street: z.string(),
  insurance_address_city: z.string(),
  insurance_card_front: fileUploadSchema,
  insurance_card_back: fileUploadSchema,
  insurance_authorization: z.boolean(),
});

export const personalStepSchema = z.object({
  personal: z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    middle_initial: z.string().max(1).optional().or(z.literal("")),
    preferred_name: z.string(),
    gender: z.string().min(1, "Please select gender"),
    family_status: z.string().min(1, "Please select family status"),
    birth_date: z.string().min(1, "Birth date is required"),
    employer_name: z.string(),
    relationship_to_patient: z.string().min(1, "Required"),
  }),
});

export const contactStepSchema = z.object({
  contact: z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone_home: optionalPhone,
    phone_work: optionalPhone,
    phone_extension: z.string(),
    phone_mobile: requiredPhone,
    address_street: z.string().min(1, "Street address is required"),
    address_city: z.string().min(1, "City is required"),
    address_state: z.string().min(1, "State is required"),
    zip_code: z
      .string()
      .min(1, "ZIP is required")
      .regex(zipRegex, "Enter a 5-digit ZIP"),
    referral_source: z.string(),
    emergency_contact: z.string(),
  }),
});

export const insuranceStepSchema = z
  .object({
    insurance: z.object({
      has_secondary: z.boolean(),
      primary: insuranceBlockSchema,
      secondary: insuranceBlockSchema,
    }),
  })
  .superRefine((data, ctx) => {
    const p = data.insurance.primary;
    if (!p.patient_relationship_to_subscriber) {
      ctx.addIssue({
        code: "custom",
        message: "Relationship to subscriber is required",
        path: ["insurance", "primary", "patient_relationship_to_subscriber"],
      });
    }
    if (!p.insurance_plan) {
      ctx.addIssue({
        code: "custom",
        message: "Please select an insurance plan",
        path: ["insurance", "primary", "insurance_plan"],
      });
    }
    if (!p.insurance_authorization) {
      ctx.addIssue({
        code: "custom",
        message: "Authorization is required",
        path: ["insurance", "primary", "insurance_authorization"],
      });
    }
    if (data.insurance.has_secondary) {
      const s = data.insurance.secondary;
      if (!s.insurance_plan) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a secondary plan",
          path: ["insurance", "secondary", "insurance_plan"],
        });
      }
    }
  });

export const medicalStepSchema = z.object({
  medical: z.object({
    medical_conditions: z.array(z.string()),
    medical_conditions_other: z.string(),
    allergy_list: z.array(z.string()),
    other_allergies: z.string(),
    allergy_notes: z.string(),
    medications: z.array(z.string()),
    other_medications: z.string(),
    preferred_pharmacy: z.string(),
    antibiotic_premedication: z.string(),
    physician_name_phone: z.string(),
  }),
});

export const dentalStepSchema = z.object({
  dental: z.object({
    previous_dentist: z.string(),
    last_exam_date: z.string(),
    smile_changes: z.string(),
    dental_history_checklist: z.array(z.string()),
    dental_history_notes: z.string(),
  }),
});

export const concernsStepSchema = z.object({
  concerns: z.object({
    immediate_concern: z.string().min(1, "Please share what brings you in"),
  }),
});

export const consentStepSchema = z.object({
  consent: z.object({
    financial_policy: z.literal(true, {
      error: "You must agree to the Financial Policy",
    }),
    appointment_policy: z.literal(true, {
      error: "You must agree to the Appointment Policy",
    }),
    hipaa_acknowledgement: z.literal(true, {
      error: "HIPAA acknowledgement is required",
    }),
    hipaa_authorized_people: z.string(),
    financial_signature: signatureSchema,
    medical_history_signature: signatureSchema,
    consent_to_treatment_signature: signatureSchema,
  }),
});

export const stepSchemas = {
  personal: personalStepSchema,
  contact: contactStepSchema,
  insurance: insuranceStepSchema,
  medical: medicalStepSchema,
  dental: dentalStepSchema,
  concerns: concernsStepSchema,
  consent: consentStepSchema,
} as const;

export type ValidatedStepId = keyof typeof stepSchemas;
