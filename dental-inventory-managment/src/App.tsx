import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { InventoryListPage } from '@/pages/InventoryListPage'
import { InventoryDetailPage } from '@/pages/InventoryDetailPage'
import { ReceiveInventoryPage } from '@/pages/ReceiveInventoryPage'
import { ReorderPage } from '@/pages/ReorderPage'
import { PurchaseListPage } from '@/pages/PurchaseListPage'
import { ForecastDashboardPage } from '@/pages/operations/ForecastDashboardPage'
import { ProcedureSchedulePage } from '@/pages/operations/ProcedureSchedulePage'
import { AppointmentDetailPage } from '@/pages/operations/AppointmentDetailPage'
import { ProcedureTemplatesPage } from '@/pages/operations/ProcedureTemplatesPage'
import { ProcedureTemplateDetailPage } from '@/pages/operations/ProcedureTemplateDetailPage'
import { SupplyUsagePage } from '@/pages/operations/SupplyUsagePage'
import { InventoryTimelinePage } from '@/pages/operations/InventoryTimelinePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<ForecastDashboardPage />} />
          <Route path="operations/forecast" element={<ForecastDashboardPage />} />
          <Route path="operations/schedule" element={<ProcedureSchedulePage />} />
          <Route path="operations/appointments/:id" element={<AppointmentDetailPage />} />
          <Route path="operations/templates" element={<ProcedureTemplatesPage />} />
          <Route path="operations/templates/:id" element={<ProcedureTemplateDetailPage />} />
          <Route path="operations/usage" element={<SupplyUsagePage />} />
          <Route path="operations/timeline" element={<InventoryTimelinePage />} />

          <Route path="inventory/dashboard" element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryListPage />} />
          <Route path="inventory/:id" element={<InventoryDetailPage />} />
          <Route path="receive" element={<ReceiveInventoryPage />} />
          <Route path="reorder" element={<ReorderPage />} />
          <Route path="purchase-list" element={<PurchaseListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
