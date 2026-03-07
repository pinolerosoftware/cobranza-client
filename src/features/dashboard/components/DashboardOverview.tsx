import { SimpleGrid, Paper, Text, Group } from '@mantine/core';
import { IconUsers, IconUserCheck, IconCash, IconReceipt } from '@tabler/icons-react';

const stats = [
  { label: 'Total Clientes', value: '1,234', icon: IconUsers, color: 'blue' },
  { label: 'Total Cobradores', value: '56', icon: IconUserCheck, color: 'teal' },
  { label: 'Cobros del Día', value: '$12,450', icon: IconCash, color: 'indigo' },
  { label: 'Préstamos Activos', value: '892', icon: IconReceipt, color: 'orange' },
];

export const DashboardOverview = () => {
  const items = stats.map((stat) => (
    <Paper withBorder p="md" radius="md" key={stat.label}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
          {stat.label}
        </Text>
        <stat.icon size="1.4rem" stroke={1.5} color={`var(--mantine-color-${stat.color}-6)`} />
      </Group>

      <Group align="flex-end" gap="xs" mt={25}>
        <Text fw={700} size="xl">
          {stat.value}
        </Text>
      </Group>
    </Paper>
  ));

  return (
    <div>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{items}</SimpleGrid>
    </div>
  );
};