import { useMemo, useState } from 'react';
import { Badge, Stack, Button, Group, Drawer, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { type ColumnDef } from '@tanstack/react-table';
import { IconPlus } from '@tabler/icons-react';
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
}

const mockData: Collector[] = [
  { id: '1', name: 'Carlos Gómez', route: 'Zona Norte', efficiency: 95, status: 'active' },
  { id: '2', name: 'Ana Martínez', route: 'Zona Sur', efficiency: 88, status: 'active' },
  { id: '3', name: 'Roberto Sosa', route: 'Zona Este', efficiency: 72, status: 'inactive' },
  { id: '4', name: 'Lucía Fernández', route: 'Centro', efficiency: 98, status: 'active' },
];

export const CollectorsList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState<Collector[]>(mockData);

  const columns = useMemo<ColumnDef<Collector>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
      },
      {
        accessorKey: 'route',
        header: 'Ruta',
      },
      {
        accessorKey: 'efficiency',
        header: 'Eficiencia',
        cell: ({ getValue }) => `${getValue<number>()}%`,
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return status === 'active' ? (
            <Badge color="blue" variant="light">Activo</Badge>
          ) : (
            <Badge color="gray" variant="light">Inactivo</Badge>
          );
        },
      },
    ],
    []
  );

  const handleAddCollector = (values: CollectorFormValues) => {
    const newCollector: Collector = {
      id: Math.random().toString(36).substr(2, 9),
      ...values,
    };
    setData((prev) => [newCollector, ...prev]);
    close();
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <Stack gap={0}>
        </Stack>
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
        searchPlaceholder="Buscar cobrador por nombre o ruta..."
      />

      <Drawer
        opened={opened}
        onClose={close}
        title={<Text fw={700} size="xl">Agregar Nuevo Cobrador</Text>}
        position="right"
        size="500px"
        padding="xl"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <CollectorForm 
          onSubmit={handleAddCollector} 
          onCancel={close} 
        />
      </Drawer>
    </Stack>
  );
};