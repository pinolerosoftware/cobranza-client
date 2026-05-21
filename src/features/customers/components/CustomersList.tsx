import { useMemo, useState } from 'react';
import { Badge, Stack, Button, Group, Drawer, Text, Title, Avatar, LoadingOverlay, Paper, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { IconPlus, IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import { DataTable } from '@/components/data-table/DataTable';
import { CustomerForm } from './CustomerForm';
import { useCustomers, useCreateCustomer, useDeleteCustomer, useUpdateCustomer } from '@/features/customers/hooks/useCustomers';
import { type CustomerFormValues } from '../schemas/customerFormSchema';
import { type Customer } from '@/types/customer';

export const CustomersList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  
  const { data: customersData, isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  
  const customers = customersData?.content || [];

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        id: 'name',
        header: 'Cliente',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => {
          const name = `${row.original.firstName} ${row.original.lastName}`;
          return (
            <Group gap="sm">
              <Avatar size="sm" radius="xl" color={row.original.active ? 'teal' : 'gray'}>
                {row.original.firstName[0]}{row.original.lastName[0]}
              </Avatar>
              <div>
                <Text size="sm" fw={500}>{name}</Text>
                <Text size="xs" c="dimmed">DNI: {row.original.dni || '-'}</Text>
              </div>
            </Group>
          );
        },
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ getValue }) => {
          const phone = getValue<string>();
          return phone ? (
            <Group gap="xs" wrap="nowrap">
              <IconPhone size={14} color="gray" />
              <Text size="sm">{phone}</Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">-</Text>
          );
        },
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
        accessorKey: 'active',
        header: 'Estado',
        cell: ({ getValue }) => {
          const active = getValue<boolean>();
          return active ? (
            <Badge color="teal" variant="light">Activo</Badge>
          ) : (
            <Badge color="gray" variant="light">Inactivo</Badge>
          );
        },
      },
    ],
    []
  );

  const handleAddCustomer = (values: CustomerFormValues) => {
    if (editingCustomer) {
      updateCustomer.mutate({
        ...editingCustomer,
        ...values,
      }, {
        onSuccess: () => {
          close();
          setEditingCustomer(null);
        },
        onError: (error) => {
          console.error('Error updating customer:', error);
        },
      });
    } else {
      createCustomer.mutate({
        ...values,
        active: true,
      }, {
        onSuccess: () => {
          close();
          setEditingCustomer(null);
        },
        onError: (error) => {
          console.error('Error creating customer:', error);
        },
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    open();
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer.mutate(customerToDelete);
    }
    closeDeleteModal();
    setCustomerToDelete(null);
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
          key={editingCustomer?.customerId ?? 'new'}
          onSubmit={handleAddCustomer} 
          onCancel={handleCloseDrawer}
          initialData={editingCustomer ?? undefined}
          isEditing={!!editingCustomer}
        />
      </Drawer>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={
          <Group gap="xs">
            <IconAlertTriangle size={20} color="red" />
            <Text fw={600}>Confirmar eliminación</Text>
          </Group>
        }
        centered
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Text size="sm" mb="lg">
          ¿Estás seguro de que deseas eliminar al cliente{' '}
          <Text component="span" fw={600}>
            {customerToDelete?.firstName} {customerToDelete?.lastName}
          </Text>
          ? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmDelete} loading={deleteCustomer.isPending}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
