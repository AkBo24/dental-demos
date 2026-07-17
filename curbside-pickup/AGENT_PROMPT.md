# Coding agent prompt — Curbside Pickup

Copy and paste the block below into a coding agent to build the app.

```text
Build a single-store grocery “order ahead + desk pickup” prototype in the `curbside-pickup/` directory of this repo.

## Product
Busy buyers browse a mock grocery catalog, place an order, complete mock online payment, then walk into the store and pick up a packed bag at the desk. Store packers work a queue: pack items, mark orders ready, mark picked up at handoff.

This is NOT Instacart delivery and NOT classic curb-only handoff. v1 pickup = walk-in desk pickup after online (mock) payment.

## Personas / routes
1. Buyer
   - Browse catalog, add to cart, checkout with mock payment
   - See order status (paid → packing → ready → picked_up)
   - Simple “my orders” or current-order view
2. Packer
   - Queue of orders needing work (paid / packing / ready)
   - Open an order: check off items as packed, mark order ready
   - Mark ready orders as picked_up at desk handoff

No auth required: use a simple role switcher or `/buyer` and `/packer` routes. No owner/admin/inventory-editing UI.

## Scope (in)
- One store (hardcoded). Include `storeId` on entities so multi-store can be added later.
- Mock catalog: ~25–40 products (name, price, category, optional image placeholder)
- Cart + mock checkout (fake card form or “Pay” button that always succeeds)
- Order lifecycle: paid → packing → ready → picked_up
- Client-side state only (Zustand or equivalent), seeded with mock data; persist to localStorage optional but nice
- Clean, usable UI for desktop; mobile-friendly enough for a demo

## Scope (out)
- Real payments, accounts, SMS, maps
- Curbside “I’m here”, time-slot scheduling, substitutions, out-of-stock handling
- Multi-store marketplace UI
- Inventory management / product CRUD
- Backend/API (mock in-app is enough)

## Tech (match sibling demo `dental-inventory-managment`)
- Vite + React 19 + TypeScript + Tailwind 4
- React Router for `/buyer`, `/packer` (and nested routes as needed)
- Zustand for cart/orders/catalog state
- Lucide for icons
- npm; add a short README (purpose, `npm install` / `npm run dev`, route table, stack)

## UX notes
- Buyer: catalog → cart → checkout → confirmation with status
- Packer: queue prioritized by status/time; order detail with item checklist; clear Ready / Picked up actions
- Visual status badges; packer should always see what’s next

## Acceptance criteria
- Buyer can place a paid mock order and see it progress
- Packer can pack that order to ready, then mark picked_up
- Buyer sees status updates after packer actions (same app state)
- App runs via `npm install && npm run dev` from `curbside-pickup/`
- README documents how to demo the happy path in <2 minutes

Replace the empty `curbside-pickup` file with this app directory if needed. Do not modify sibling apps.
```
