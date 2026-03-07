import { useMemo } from 'react';
import { Badge, Stack } from '@mantine/core';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';

interface Client {
  id: string;
  name: string;
  dni: string;
  phone: string;
  status: 'active' | 'overdue';
}

const mockData: Client[] = [
  { id: '1', name: 'Juan Pérez', dni: '12345678-9', phone: '555-0123', status: 'active' },
  { id: '2', name: 'Maria Rodriguez', dni: '98765432-1', phone: '555-4567', status: 'overdue' },
  { id: '3', name: 'Pedro Alcántara', dni: '45678912-3', phone: '555-8899', status: 'active' },
];

export const CustomersList = () => {
  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
      },
      {
        accessorKey: 'dni',
        header: 'DNI',
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return status === 'active' ? (
            <Badge color="green" variant="light">Al día</Badge>
          ) : (
            <Badge color="red" variant="light">En mora</Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <Stack gap="md">
      <DataTable columns={columns} data={mockData} />
    </Stack>
  );
};
