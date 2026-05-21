import { useMemo, useState } from 'react';
import { Badge, Stack, Button, Group, Drawer, Text, Title, Avatar, LoadingOverlay, Paper, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { IconPlus, IconPhone, IconMail } from '@tabler/icons-react';
import { DataTable } from '@/components/data-table/DataTable';
import { CollectorForm } from './CollectorForm';
import { useCollectors } from '@/features/collectors/hooks/useCollectors';
import { useCreateUser, useUpdateUser, useDeleteUser } from '@/features/users/hooks/useUsers';
import { type UserResponse } from '@/types/user';
import { type CollectorFormValues } from '../schemas/collectorFormSchema';

export const CollectorsList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [editingCollector, setEditingCollector] = useState<UserResponse | null>(null);
  const [collectorToDelete, setCollectorToDelete] = useState<UserResponse | null>(null);

  const { data: collectorsData, isLoading } = useCollectors();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const collectors = collectorsData?.content || [];

  const columns = useMemo<ColumnDef<UserResponse>[]>(
    () => [
      {
        id: 'name',
        header: 'Cobrador',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => {
          const name = `${row.original.firstName} ${row.original.lastName}`;
          return (
            <Group gap="sm">
              <Avatar size="sm" radius="xl" color="blue">
                {row.original.firstName[0]}{row.original.lastName[0]}
              </Avatar>
              <div>
                <Text size="sm" fw={500}>{name}</Text>
                {row.original.email && <Text size="xs" c="dimmed">{row.original.email}</Text>}
              </div>
            </Group>
          );
        },
      },
      {
        accessorKey: 'userName',
        header: 'Usuario',
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ getValue }) => {
          const phone = getValue<string | null>();
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
          const email = getValue<string | null>();
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

  const userToFormValues = (user: UserResponse): Partial<CollectorFormValues> => ({
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email ?? '',
    phone: user.phone ?? '',
    active: user.active,
  });

  const handleSave = (values: CollectorFormValues) => {
    const userId = String(editingCollector?.id ?? '');
    if (editingCollector) {
      updateUser.mutate({
        id: userId,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          userName: values.userName,
          role: 'Cobrador',
          email: values.email || null,
          phone: values.phone || null,
        },
      }, {
        onSuccess: () => {
          close();
          setEditingCollector(null);
        },
        onError: (error) => {
          console.error('Error updating collector:', error);
        },
      });
    } else {
      createUser.mutate({
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        password: values.password || '123456',
        role: 'Cobrador',
        email: values.email || null,
        phone: values.phone || null,
      }, {
        onSuccess: () => {
          close();
          setEditingCollector(null);
        },
        onError: (error) => {
          console.error('Error creating collector:', error);
        },
      });
    }
  };

  const handleEdit = (collector: UserResponse) => {
    setEditingCollector(collector);
    open();
  };

  const handleDelete = (collector: UserResponse) => {
    setCollectorToDelete(collector);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (collectorToDelete) {
      deleteUser.mutate(String(collectorToDelete.id), {
        onSuccess: () => {
          closeDeleteModal();
          setCollectorToDelete(null);
        },
      });
    }
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

      <Paper pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <DataTable 
          columns={columns} 
          data={collectors} 
          searchPlaceholder="Buscar cobrador por nombre, usuario o teléfono..."
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
        <CollectorForm 
          onSubmit={handleSave} 
          onCancel={handleCloseDrawer}
          initialData={editingCollector ? userToFormValues(editingCollector) : undefined}
          isEditing={!!editingCollector}
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
          ¿Estás seguro de que deseas eliminar al cobrador{' '}
          <Text component="span" fw={600}>
            {collectorToDelete?.firstName} {collectorToDelete?.lastName}
          </Text>
          ? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmDelete} loading={deleteUser.isPending}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
