import { useMemo, useState } from 'react';
import { Badge, Stack, Button, Group, Drawer, Text, Title, Avatar, Progress } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { type ColumnDef } from '@tanstack/react-table';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/data-table/DataTable';
import { CollectorForm } from './CollectorForm';
import * as z from 'zod';
import { collectorSchema } from './CollectorForm';

type CollectorFormValues = z.infer<typeof collectorSchema>;

interface Collector {
  id: string;
  name: string;
  route: string;
  efficiency: number;
  status: 'active' | 'inactive';
  phone?: string;
  email?: string;
}

const mockData: Collector[] = [
  { id: '1', name: 'Carlos Gómez', route: 'Zona Norte', efficiency: 95, status: 'active', phone: '555-1234', email: 'carlos@email.com' },
  { id: '2', name: 'Ana Martínez', route: 'Zona Sur', efficiency: 88, status: 'active', phone: '555-5678' },
  { id: '3', name: 'Roberto Sosa', route: 'Zona Este', efficiency: 72, status: 'inactive', phone: '555-9012' },
  { id: '4', name: 'Lucía Fernández', route: 'Centro', efficiency: 98, status: 'active', phone: '555-3456', email: 'lucia@email.com' },
  { id: '5', name: 'Miguel Torres', route: 'Zona Oeste', efficiency: 85, status: 'active', phone: '555-7890' },
  { id: '6', name: 'Sofia Ramírez', route: 'Norte II', efficiency: 91, status: 'active', phone: '555-2345' },
  { id: '7', name: 'Jorge Luis', route: 'Sur II', efficiency: 45, status: 'inactive', phone: '555-6789' },
];

export const CollectorsList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState<Collector[]>(mockData);
  const [editingCollector, setEditingCollector] = useState<Collector | null>(null);

  const columns = useMemo<ColumnDef<Collector>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Cobrador',
        cell: ({ row }) => (
          <Group gap="sm">
            <Avatar size="sm" radius="xl" color="blue">
              {row.original.name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>{row.original.name}</Text>
              {row.original.email && <Text size="xs" c="dimmed">{row.original.email}</Text>}
            </div>
          </Group>
        ),
      },
      {
        accessorKey: 'route',
        header: 'Ruta',
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
      },
      {
        accessorKey: 'efficiency',
        header: 'Eficiencia',
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <Group gap="xs" wrap="nowrap">
              <Progress 
                value={value} 
                size="sm" 
                w={60} 
                radius="xl"
                color={value >= 90 ? 'teal' : value >= 70 ? 'blue' : value >= 50 ? 'yellow' : 'red'} 
              />
              <Text size="sm" fw={500}>{value}%</Text>
            </Group>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return status === 'active' ? (
            <Badge color="teal" variant="light">Activo</Badge>
          ) : (
            <Badge color="gray" variant="light">Inactivo</Badge>
          );
        },
      },
    ],
    []
  );

  const handleAddCollector = (values: CollectorFormValues) => {
    if (editingCollector) {
      setData((prev) => prev.map(c => c.id === editingCollector.id ? { ...c, ...values } : c));
    } else {
      const newCollector: Collector = {
        id: Math.random().toString(36).substr(2, 9),
        ...values,
      };
      setData((prev) => [newCollector, ...prev]);
    }
    close();
    setEditingCollector(null);
  };

  const handleEdit = (collector: Collector) => {
    setEditingCollector(collector);
    open();
  };

  const handleDelete = (collector: Collector) => {
    setData((prev) => prev.filter(c => c.id !== collector.id));
  };

  const handleCloseDrawer = () => {
    close();
    setEditingCollector(null);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} fw={700}>Cobradores</Title>
          <Text c="dimmed" size="sm" mt={4}>Gestiona los cobradores y sus rutas</Text>
        </div>
        <Button 
          leftSection={<IconPlus size={18} stroke={1.5} />} 
          size="md" 
          onClick={open}
          radius="md"
        >
          Nuevo Cobrador
        </Button>
      </Group>

      <DataTable 
        columns={columns} 
        data={data} 
        searchPlaceholder="Buscar cobrador por nombre, ruta o teléfono..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Drawer
        opened={opened}
        onClose={handleCloseDrawer}
        title={null}
        position="right"
        size="500px"
        padding="xl"
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <CollectorForm 
          onSubmit={handleAddCollector} 
          onCancel={handleCloseDrawer}
          initialData={editingCollector ?? undefined}
          isEditing={!!editingCollector}
        />
      </Drawer>
    </Stack>
  );
};
