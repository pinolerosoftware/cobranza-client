import { createFileRoute } from '@tanstack/react-router'
import { Title, Text, Group } from '@mantine/core'
import { AccountSettings } from '@/features/settings/components/AccountSettings'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="space-y-6">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2} fw={700}>Configuración</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Administra tu cuenta y preferencias del sistema
          </Text>
        </div>
      </Group>
      <AccountSettings />
    </div>
  )
}
