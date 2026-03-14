import { createFileRoute } from '@tanstack/react-router'
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview"
import { Group, Title, Text, Badge } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const today = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2} fw={700}>Dashboard</Title>
          <Text c="dimmed" size="sm" mt={4}>{today}</Text>
        </div>
        <Badge size="lg" variant="light" color="blue" leftSection={<IconCalendar size={16} />}>
          Período: Marzo 2026
        </Badge>
      </Group>
      <DashboardOverview />
    </div>
  )
}
