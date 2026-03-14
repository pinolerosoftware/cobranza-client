import { useMemo, useState } from 'react';
import { Badge, Stack, Button, Group, Drawer, Text, Title, Avatar, LoadingOverlay, Paper, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { type ColumnDef } from '@tanstack/react-table';
import { IconPlus, IconEdit, IconTrash, IconMapPin, IconPhone, IconMail, IconUsers, IconAlertCircle } from '@tabler/icons-react';
import { DataTable } from '@/components/data-table/DataTable';
import { CustomerForm } from './CustomerForm';
import { useCustomers, useCreateCustomer, useDeleteCustomer } from '@/features/customers/hooks/useCustomers';
import * as z from 'zod';
import { customerSchema } from './CustomerForm';

type CustomerFormValues = z.infer<typeof customerSchema>;

interface Client {
  id: string;
  name: string;
  dni: string;
  phone: string;
  email?: string;
  address?: string;
  status: 'active' | 'overdue';
  notes?: string;
  receivesVisits: boolean;
}

export const CustomersList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCustomer, setEditingCustomer] = useState<Client | null>(null);
  
  const { data: customersData, isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();
  
  const customers = customersData?.customers || [];

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Cliente',
        cell: ({ row }) => (
          <Group gap="sm">
            <Avatar size="sm" radius="xl" color={row.original.status === 'active' ? 'teal' : 'red'}>
              {row.original.name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>{row.original.name}</Text>
              <Text size="xs" c="dimmed">DNI: {row.original.dni}</Text>
            </div>
          </Group>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ getValue }) => (
          <Group gap="xs" wrap="nowrap">
            <IconPhone size={14} color="gray" />
            <Text size="sm">{getValue<string>()}</Text>
          </Group>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ getValue }) => {
          const email = getValue<string>();
          return email ? (
            <Group gap="xs" wrap="nowrap">
              <IconMail size={14} color="gray" />
              <Text size="sm" c="dimmed">{email}</Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">-</Text>
          );
        },
      },
      {
        accessorKey: 'address',
        header: 'Dirección',
        cell: ({ getValue }) => {
          const address = getValue<string>();
          return address ? (
            <Group gap="xs" wrap="nowrap">
              <IconMapPin size={14} color="gray" />
              <Text size="sm" c="dimmed" lineClamp={1}>{address}</Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">-</Text>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return status === 'active' ? (
            <Badge color="teal" variant="light">Al día</Badge>
          ) : (
            <Badge color="red" variant="light">En mora</Badge>
          );
        },
      },
    ],
    []
  );

  const handleAddCustomer = (values: CustomerFormValues) => {
    createCustomer.mutate(values, {
      onSuccess: () => {
        close();
        setEditingCustomer(null);
      },
    });
  };

  const handleEdit = (customer: Client) => {
    setEditingCustomer(customer);
    open();
  };

  const handleDelete = (customer: Client) => {
    deleteCustomer.mutate(customer.id);
  };

  const handleCloseDrawer = () => {
    close();
    setEditingCustomer(null);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} fw={700}>Clientes</Title>
          <Text c="dimmed" size="sm" mt={4}>Gestiona los clientes y su información</Text>
        </div>
        <Button 
          leftSection={<IconPlus size={18} stroke={1.5} />} 
          size="md" 
          onClick={open}
          radius="md"
        >
          Nuevo Cliente
        </Button>
      </Group>

      <Paper pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <DataTable 
          columns={columns} 
          data={customers} 
          searchPlaceholder="Buscar cliente por nombre, DNI, teléfono o email..."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

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
        <CustomerForm 
          onSubmit={handleAddCustomer} 
          onCancel={handleCloseDrawer}
          initialData={editingCustomer ?? undefined}
          isEditing={!!editingCustomer}
        />
      </Drawer>
    </Stack>
  );
};
