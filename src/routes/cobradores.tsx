import { createFileRoute } from '@tanstack/react-router'
import { CollectorsList } from "@/features/collectors/components/CollectorsList"

export const Route = createFileRoute('/cobradores')({
  component: Cobradores,
})

function Cobradores() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Gestión de Cobradores</h1>
      </div>
      <CollectorsList />
    </div>
  )
}
