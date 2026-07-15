# Randhawa Dental — New Patient Intake Demo

A production-quality, schema-driven multi-step intake wizard for **Randhawa Dental**. Built to demo how patients can complete paperwork before their visit — reducing front-desk time, cutting transcription errors, and matching the practice’s brand (not a generic blue portal).

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/intake`.

```bash
npm run build   # production build (webpack; required on some darwin/x64 setups)
npm start       # serve production build
```

## Demo narrative (dentist meeting)

1. **Welcome** — Brand-first landing with ~8–10 minute estimate and resume CTA if a draft exists.
2. Walk through **Personal → Contact → Insurance → Medical → Dental → Concerns → Consent**.
3. Call out **autosave** (refresh mid-flow and resume), **address autocomplete**, **carrier search**, **medical chips**, and **signatures** (draw or type).
4. On **Review**, edit any section and open the **mock PDF preview**.
5. **Submit** to see the success animation and “what happens next.”

**Talking points:** less clipboard time at arrival, cleaner clinical data, insurance cards captured upfront, same questions as the paper/portal form with a calmer UX that matches Randhawa’s red / charcoal / gold brand.

## Architecture

```
src/
  app/
    layout.tsx          # Barlow Condensed + Source Sans 3, theme provider
    page.tsx            # redirects → /intake
    intake/page.tsx     # wizard host
    globals.css         # brand tokens, atmosphere, motion
  components/
    brand/              # logo, theme toggle
    fields/             # one component per JSON field type
    intake/             # WizardShell, progress, steps, review PDF
    ui/                 # shadcn/ui (Base UI)
  lib/
    schema/             # intake-form.json + inherit resolution + step registry
    validation/         # Zod schemas per step
    storage/            # localStorage autosave / resume
    mocks/              # US states, carriers, meds, address suggestions
  types/intake.ts
references/
  intake-form.json      # authoritative field source (copied into lib/schema)
```

### Schema-driven approach

- [`references/intake-form.json`](references/intake-form.json) is the source of truth for fields, types, and options.
- `secondary_insurance.inherits` clones primary insurance fields under `insurance.secondary.*` so IDs never collide.
- Labels missing in JSON (insurance / consent) are humanized from field ids + practice wording.
- Wizard UX steps remap JSON sections into a patient journey (Welcome → … → Completion). Welcome and Completion sit outside the “Step X of 8” count.

### Form state

- Single React Hook Form instance with namespaced values (`personal.*`, `contact.*`, `insurance.primary.*`, …).
- Step-level Zod validation on **Continue**; Review + mock submit (no backend).
- Debounced `localStorage` drafts (`randhawa-intake-draft-v1`).

## Branding

| Token | Light | Role |
|-------|-------|------|
| Brand red | `#8B1E1E` | Primary actions, emphasis |
| Charcoal | `#1C1917` | Body / UI chrome |
| Gold | `#E8C547` | Soft accent (resume banner, highlights) |
| Surfaces | Warm off-white | Readable form cards on atmospheric gradient |

Typography: **Barlow Condensed** (headings) + **Source Sans 3** (body). Dark mode keeps brand red legible via a lighter red tone.

Intentionally **not** copying the reference portal’s blue chrome.

## Demo features

- Autosave + resume / start over  
- Live step validation, phone `(XXX) XXX-XXXX` + ZIP formatting  
- Mock address autocomplete & insurance carrier searchable select  
- Categorized medical condition chips + conditionals (Other, allergy detail, secondary insurance, Self → prefill subscriber)  
- File upload previews (local only) & canvas / typed signatures  
- Review with edit jumps + mock PDF / print panel  
- Dark mode, step transitions, completion confetti  

## Stack

Next.js App Router · TypeScript · Tailwind CSS v4 · shadcn/ui · React Hook Form · Zod · next-themes
