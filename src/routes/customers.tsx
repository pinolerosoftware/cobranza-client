import { createFileRoute } from '@tanstack/react-router'
import { CustomersList } from "@/features/customers/components/CustomersList"
import { Group, Title, Text } from '@mantine/core';

export const Route = createFileRoute('/customers')({
  component: Customers,
})

function Customers() {
  return (
    <div className="space-y-6">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2} fw={700}>Gestión de Clientes</Title>
          <Text c="dimmed" size="sm" mt={4}>Administra todos los clientes del sistema</Text>
        </div>
      </Group>
      
      <CustomersList />
    </div>
  )
}
