import { useMemo } from 'react'
import { useInventoryStore } from '@/store/inventoryStore'
import { useOperationsStore } from '@/store/operationsStore'
import {
  appointments,
  plannedShipments,
  procedureTemplates,
  unitCosts,
  vendors,
} from '@/data/mockData'
import { computeWeeklyForecast } from '@/domain/forecastEngine'
import type { Appointment, WeeklyForecast } from '@/types'

/** Default forecast week: Mon Jul 13, 2026 */
export const FORECAST_WEEK_START = '2026-07-13'
export const NEXT_WEEK_START = '2026-07-20'

export function useWeeklyForecast(weekStart: string = FORECAST_WEEK_START): WeeklyForecast {
  const items = useInventoryStore((s) => s.items)
  const templateRequirements = useOperationsStore((s) => s.templateRequirements)
  const visitOverrides = useOperationsStore((s) => s.visitOverrides)

  return useMemo(
    () =>
      computeWeeklyForecast({
        weekStart,
        appointments,
        templates: procedureTemplates,
        requirements: templateRequirements,
        inventory: items,
        vendors,
        unitCosts,
        plannedShipments,
        getRequirementsForAppointment: (appt: Appointment) => {
          const override = visitOverrides[appt.id]
          if (override) return override
          return templateRequirements.filter((r) => r.procedureTemplateId === appt.procedureTemplateId)
        },
      }),
    [items, weekStart, templateRequirements, visitOverrides],
  )
}
