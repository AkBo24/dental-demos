import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { CatalogPage } from '@/pages/buyer/CatalogPage'
import { CartPage } from '@/pages/buyer/CartPage'
import { CheckoutPage } from '@/pages/buyer/CheckoutPage'
import { OrdersPage } from '@/pages/buyer/OrdersPage'
import { BuyerOrderDetailPage } from '@/pages/buyer/BuyerOrderDetailPage'
import { PackerQueuePage } from '@/pages/packer/PackerQueuePage'
import { PackOrderPage } from '@/pages/packer/PackOrderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/buyer" replace />} />
          <Route path="buyer" element={<CatalogPage />} />
          <Route path="buyer/cart" element={<CartPage />} />
          <Route path="buyer/checkout" element={<CheckoutPage />} />
          <Route path="buyer/orders" element={<OrdersPage />} />
          <Route path="buyer/orders/:id" element={<BuyerOrderDetailPage />} />
          <Route path="packer" element={<PackerQueuePage />} />
          <Route path="packer/orders/:id" element={<PackOrderPage />} />
          <Route path="*" element={<Navigate to="/buyer" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
