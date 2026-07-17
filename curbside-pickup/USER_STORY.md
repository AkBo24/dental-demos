# Curbside Pickup — User Story (v1)

Single-store grocery **order ahead + desk pickup** demo. Buyers pay online (mock), packers prepare bags, buyers walk in and collect at the desk.

## Locked product decisions

- **Flow (v1):** Order + **mock pay online** → store packs → buyer **walks in**, picks up bag at desk → leaves (no curb / “I’m here”).
- **Scope:** One grocery store demo; data model includes a `storeId` (or equivalent) so multi-store is a later extension, not built now.
- **Roles:** **Buyer** + **Packer** only (no owner/inventory admin UI).
- **Catalog:** Fixed mock products (~20–40 items).
- **Payment:** Mock only (no real processor).

## Personas

### Buyer

As a busy professional, I want to browse a local store’s catalog online, place and pay for an order (mock), then walk into the store, pick up a ready bag at the desk, and leave—without shopping the aisles.

### Packer

As a store packer, I want a queue of paid orders, to work an order item-by-item (mark packed), mark the order ready for pickup, and mark it picked up when the buyer collects it—so desk handoff is fast and clear.

## Order status flow (v1)

`paid` → `packing` → `ready` → `picked_up`

## Out of scope

- Out of stock / substitutions
- Time-slot scheduling
- Curbside “I’m here” / curb-only handoff
- Real payments, accounts, SMS, maps
- Multi-store marketplace UI
- Inventory management / product CRUD
- Backend/API (client-side mock is enough)

## Happy-path demo script

1. As buyer: add items → mock pay → note order is `paid`.
2. As packer: open order → check items → mark `ready`.
3. As buyer: see `ready`.
4. As packer: mark `picked_up` at desk handoff.
5. As buyer: see `picked_up`.
