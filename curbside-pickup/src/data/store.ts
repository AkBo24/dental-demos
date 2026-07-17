import type { Store } from '@/types'

/** Single demo store — multi-store can extend later via storeId on entities */
export const DEMO_STORE: Store = {
  id: 'store-market-street',
  name: 'Market Street Grocer',
  address: '214 Market Street, Downtown',
  deskHours: 'Desk pickup 8am – 8pm',
}

export const TAX_RATE = 0.0825
