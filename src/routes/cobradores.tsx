import { createFileRoute } from '@tanstack/react-router'
import { CollectorsList } from "@/features/collectors/components/CollectorsList"

export const Route = createFileRoute('/cobradores')({
  component: Cobradores,
})

function Cobradores() {
  return (
    <div className="space-y-6">
      <CollectorsList />
    </div>
  )
}
