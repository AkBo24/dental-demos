# GreenCart — Curbside / Desk Pickup

Single-store grocery **order ahead + desk pickup** prototype. Buyers browse a mock catalog, pay online (mock), then walk in and collect a packed bag at the desk. Packers work a queue: pack items, mark ready, mark picked up at handoff.

This is **not** delivery and **not** curb-only “I’m here” handoff — v1 pickup is walk-in desk pickup after mock payment.

## Quick start

```bash
cd curbside-pickup
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (Buyer catalog).

```bash
npm run build   # typecheck + production build
```

## Docker

Build and run with Docker (multi-stage Vite build, nginx on port 80):

```bash
cd curbside-pickup
docker build -t greencart .
docker run --rm -p 5173:80 greencart
```

Open [http://localhost:5173](http://localhost:5173).

Or with Compose:

```bash
cd curbside-pickup
docker compose up --build
```

## Routes

| Route | Role | Purpose |
|-------|------|---------|
| `/` | — | Redirects to `/buyer` |
| `/buyer` | Buyer | Product catalog |
| `/buyer/cart` | Buyer | Cart |
| `/buyer/checkout` | Buyer | Mock payment |
| `/buyer/orders` | Buyer | Order list |
| `/buyer/orders/:id` | Buyer | Order status + details |
| `/packer` | Packer | Pickup queue |
| `/packer/orders/:id` | Packer | Pack checklist + ready / picked up |

Use the **Buyer / Packer** switcher in the header (no auth).

## Order status flow

`paid` → `packing` → `ready` → `picked_up`

## 2-minute happy-path demo

1. **Buyer:** Add a few items → Cart → Checkout → Pay (mock always succeeds). Note status **Paid**.
2. Switch to **Packer** → open the order → check off items (or Pack all) → **Mark ready for pickup**.
3. Switch to **Buyer** → My orders → open the order → see **Ready**.
4. Switch to **Packer** → open the order → **Mark picked up**.
5. Switch to **Buyer** → confirm status **Picked up**.

Cart and orders persist in `localStorage` (`greencart-pickup`). Use **Reset demo data** in the footer to clear.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · Zustand · React Router · date-fns · Lucide

## Scope notes

- One hardcoded store (`storeId` on products/orders for a future multi-store extension)
- ~35 mock products; no inventory CRUD, real payments, SMS, maps, or substitutions
