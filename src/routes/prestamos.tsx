import { createFileRoute } from '@tanstack/react-router'
import { LoanApplicationList } from '@/features/loan-application/components/LoanApplicationList'

export const Route = createFileRoute('/prestamos')({
  component: Prestamos,
})

function Prestamos() {
  return (
    <div className="space-y-6">
      <LoanApplicationList />
    </div>
  )
}
