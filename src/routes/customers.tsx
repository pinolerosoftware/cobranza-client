import { createFileRoute } from '@tanstack/react-router'
import { CustomersList } from "@/features/customers/components/CustomersList"

export const Route = createFileRoute('/customers')({
  component: Customers,
})

function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Gestión de Clientes</h1>
      </div>
      <CustomersList />
    </div>
  )
}