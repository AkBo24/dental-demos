import { useMemo } from 'react'
import { useInventoryStore } from '@/store/inventoryStore'
import {
  appointments,
  plannedShipments,
  procedureRequirements,
  procedureTemplates,
  unitCosts,
  vendors,
} from '@/data/mockData'
import { computeWeeklyForecast } from '@/domain/forecastEngine'
import type { WeeklyForecast } from '@/types'

/** Default forecast week: Mon Jul 13, 2026 */
export const FORECAST_WEEK_START = '2026-07-13'
export const NEXT_WEEK_START = '2026-07-20'

export function useWeeklyForecast(weekStart: string = FORECAST_WEEK_START): WeeklyForecast {
  const items = useInventoryStore((s) => s.items)

  return useMemo(
    () =>
      computeWeeklyForecast({
        weekStart,
        appointments,
        templates: procedureTemplates,
        requirements: procedureRequirements,
        inventory: items,
        vendors,
        unitCosts,
        plannedShipments,
      }),
    [items, weekStart],
  )
}
