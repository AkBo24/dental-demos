# DentStock

High-fidelity prototype for a dental practice **operations planning** platform: inventory management plus procedure-aware supply forecasting.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — lands on the **Forecast** mission-control dashboard.

## What’s included

### Operations (new)

| Route | Purpose |
|-------|---------|
| `/` | Forecast dashboard (primary landing) |
| `/operations/schedule` | Weekly procedure calendar |
| `/operations/appointments/:id` | Appointment supply readiness |
| `/operations/templates` | Procedure catalog + BOM |
| `/operations/usage` | Aggregated projected consumption |

### Inventory (existing)

Stock dashboard, inventory list/detail, receive, reorder, purchase list — unchanged in purpose, now under the Inventory nav section.

## Demo data scale

- **200** inventory products  
- **50** procedure templates with realistic BOMs  
- **12** providers · **8** operatories  
- **10** appointments on the procedure schedule (week of Jul 13, 2026)

## Forecast engine

Pure domain logic in `src/domain/forecastEngine.ts` (no UI coupling):

- Maps each appointment → procedure template → supply requirements  
- Converts clinical BOM units → shelf units via `unitsPerPackage`  
- Aggregates weekly consumption, remaining stock, below-par / stockout  
- Scores inventory risk, flags at-risk appointments, emits reorder recommendations + timeline events  

Designed so PMS sync, historical learning, and auto-PO can plug in later.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · Zustand · React Router · date-fns · Lucide
