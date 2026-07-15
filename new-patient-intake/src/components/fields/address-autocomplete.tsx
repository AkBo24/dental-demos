"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldShell } from "./field-shell";
import { searchAddresses } from "@/lib/mocks/address";
import type { IntakeFormValues } from "@/types/intake";

export function AddressAutocompleteField() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<IntakeFormValues>();
  const street = watch("contact.address_street");
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => searchAddresses(street ?? ""), [street]);
  const error = errors.contact?.address_street?.message;

  return (
    <FieldShell
      id="contact.address_street"
      label="Street Address"
      required
      error={error}
      hint="Start typing for mock address suggestions"
    >
      <div className="relative">
        <Input
          id="contact.address_street"
          autoComplete="street-address"
          aria-invalid={Boolean(error)}
          aria-autocomplete="list"
          {...register("contact.address_street", {
            onChange: () => setOpen(true),
          })}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Delay so click on suggestion registers
            window.setTimeout(() => setOpen(false), 150);
          }}
        />
        {open && suggestions.length > 0 ? (
          <ul
            role="listbox"
            className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-border bg-popover p-1 shadow-md"
          >
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setValue("contact.address_street", s.street, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue("contact.address_city", s.city, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue("contact.address_state", s.state, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setValue("contact.zip_code", s.zip, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setOpen(false);
                  }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </FieldShell>
  );
}
