import { createFileRoute } from '@tanstack/react-router'
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview"

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </div>
      <DashboardOverview />
    </div>
  )
}
