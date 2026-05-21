import { createFileRoute } from '@tanstack/react-router'
import { CustomersList } from "@/features/customers/components/CustomersList"

export const Route = createFileRoute('/customers')({
  component: Customers,
})

function Customers() {
  return (
    <div className="space-y-6">
      <CustomersList />
    </div>
  )
}
