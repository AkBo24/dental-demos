/** Format digits as (XXX) XXX-XXXX while typing */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function formatZipInput(value: string): string {
  const cleaned = value.replace(/[^\d-]/g, "");
  if (cleaned.includes("-")) {
    const [a, b = ""] = cleaned.split("-");
    return `${a.slice(0, 5)}-${b.replace(/\D/g, "").slice(0, 4)}`;
  }
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
}

export function formatDisplayDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(d);
}

export function patientFullName(personal: {
  first_name?: string;
  last_name?: string;
  preferred_name?: string;
}): string {
  const base = [personal.first_name, personal.last_name].filter(Boolean).join(" ");
  if (personal.preferred_name) return `${base} (“${personal.preferred_name}”)`;
  return base || "Patient";
}
