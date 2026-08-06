import { createFileRoute, redirect } from '@tanstack/react-router'
import { CompanyDetail } from '@/features/company/components/CompanyDetail'

export const Route = createFileRoute('/superadmin_/companies/$companyId')({
  beforeLoad: () => {
    const userStr = localStorage.getItem('user')
    if (!userStr || userStr === 'undefined') return

    let user: { role?: string }
    try {
      user = JSON.parse(userStr)
    } catch {
      return
    }

    if (user.role !== 'SuperAdmin') {
      throw redirect({ to: '/' })
    }
  },
  component: CompanyDetailRoute,
})

function CompanyDetailRoute() {
  const { companyId } = Route.useParams()
  return (
    <div className="space-y-6">
      <CompanyDetail companyId={Number(companyId)} />
    </div>
  )
}
