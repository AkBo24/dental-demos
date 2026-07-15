# DentStock — Design Document

High-fidelity prototype of an **operations planning** platform for a U.S. general dental practice: inventory management plus procedure-aware supply forecasting.

---

## Product evolution

**Phase 1 (existing):** Detect low stock → purchase list → receive  
**Phase 2 (this module):** Schedule → BOM consumption → forecast shortages → reorder before chair time

The Forecast dashboard is the primary landing page. Classic inventory workflows remain under the Inventory nav section.

---

## Operations user story

> As an Office Manager, I want to view next week’s appointment schedule so I can understand exactly what inventory will be consumed and ensure the practice is fully prepared before patients arrive.

---

## Forecast engine (domain)

`src/domain/forecastEngine.ts` is UI-agnostic:

1. Filter appointments in the forecast week  
2. Resolve each appointment’s `ProcedureTemplate` + `ProcedureSupplyRequirement` BOM  
3. Convert clinical quantities → shelf units via `unitsPerPackage` (+ waste %)  
4. Aggregate consumption; project remaining; flag below-par / stockout / expiry  
5. Chronologically deplete stock to mark **appointments at risk**  
6. Emit **reorder recommendations**, **risk score**, and **timeline events**

Future plugs: PMS schedule sync, historical usage learning, auto-PO, multi-location — without rewriting UI.

---

## Data model additions

| Entity | Role |
|--------|------|
| Provider / Operatory | Who / where |
| ProcedureTemplate | Procedure catalog |
| ProcedureSupplyRequirement | BOM line |
| Appointment | Scheduled instance |
| WeeklyForecast (+ consumption, risk, recommendations, timeline) | Engine output |

Reuses: `InventoryItem`, `Vendor`, `PurchaseList`, transactions.

---

## Navigation

**Operations:** Forecast · Procedure Schedule · Procedure Templates · Supply Usage · Inventory Timeline  
**Inventory:** Stock Dashboard · Inventory · Receive · Reorder · Purchase List

---

## Demo week

Clinic days Mon–Fri for weeks of **2026-07-13** and **2026-07-20** (aligned with prototype “today”).
