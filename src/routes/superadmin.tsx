import { createFileRoute, redirect } from '@tanstack/react-router'
import { CompanyList } from '@/features/company/components/CompanyList'

export const Route = createFileRoute('/superadmin')({
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
  component: SuperAdmin,
})

function SuperAdmin() {
  return (
    <div className="space-y-6">
      <CompanyList />
    </div>
  )
}
