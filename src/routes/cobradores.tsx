import { createFileRoute } from '@tanstack/react-router'
import { CollectorsList } from "@/features/collectors/components/CollectorsList"
import { Group, Title, Text, Badge } from '@mantine/core';

export const Route = createFileRoute('/cobradores')({
  component: Cobradores,
})

function Cobradores() {
  return (
    <div className="space-y-6">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2} fw={700}>Gestión de Cobradores</Title>
          <Text c="dimmed" size="sm" mt={4}>Administra los cobradores y sus rutas</Text>
        </div>
      </Group>
      
      <CollectorsList />
    </div>
  )
}
