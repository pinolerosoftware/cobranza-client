import { createFileRoute } from '@tanstack/react-router'
import { LoansList } from '@/features/loans/components/LoansList'

export const Route = createFileRoute('/prestamos')({
  component: Prestamos,
})

function Prestamos() {
  return (
    <div className="space-y-6">
      <LoansList />
    </div>
  )
}
