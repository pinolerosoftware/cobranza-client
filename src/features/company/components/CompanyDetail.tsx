import { useMemo, useState } from 'react';
import {
  Badge,
  Stack,
  Button,
  Group,
  Drawer,
  Text,
  Title,
  Avatar,
  LoadingOverlay,
  Paper,
  Modal,
  ThemeIcon,
  Anchor,
  Breadcrumbs,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconPlus,
  IconPhone,
  IconMail,
  IconArrowLeft,
  IconBuilding,
  IconUsersGroup,
  IconBarcode,
} from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { SuperAdminUserForm } from './SuperAdminUserForm';
import { useCompanyList } from '@/features/company/hooks/useCompany';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/features/users/hooks/useUsers';
import type { UserResponse } from '@/types/user';
import type { SuperAdminUserFormValues } from '../schemas/superAdminUserSchema';

interface CompanyDetailProps {
  companyId: number;
}

export const CompanyDetail = ({ companyId }: CompanyDetailProps) => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);

  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanyList();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({ companyId });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const company = useMemo(
    () => companiesData?.content.find((c) => c.companyId === companyId),
    [companiesData, companyId]
  );

  const users = usersData?.content || [];

  const columns = useMemo<ColumnDef<UserResponse>[]>(
    () => [
      {
        id: 'name',
        header: 'Usuario',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => {
          const u = row.original;
          const fullName = `${u.firstName} ${u.lastName}`;
          return (
            <Group gap="sm">
              <Avatar size="sm" radius="xl" color={u.active === false ? 'gray' : 'grape'}>
                {u.firstName[0]}{u.lastName[0]}
              </Avatar>
              <div>
                <Text size="sm" fw={500}>{fullName}</Text>
                <Text size="xs" c="dimmed">@{u.userName}</Text>
              </div>
            </Group>
          );
        },
      },
      {
        id: 'role',
        header: 'Rol',
        accessorFn: (row) => row.role,
        cell: ({ getValue }) => {
          const role = getValue<string>();
          const color = role === 'Admin' ? 'grape' : role === 'Cobrador' ? 'blue' : 'gray';
          return (
            <Badge color={color} variant="light" tt="capitalize">
              {role}
            </Badge>
          );
        },
      },
      {
        id: 'contact',
        header: 'Contacto',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <Stack gap={2}>
              {u.email && (
                <Group gap={4} wrap="nowrap">
                  <IconMail size={12} color="gray" />
                  <Text size="xs" c="dimmed">{u.email}</Text>
                </Group>
              )}
              {u.phone && (
                <Group gap={4} wrap="nowrap">
                  <IconPhone size={12} color="gray" />
                  <Text size="xs" c="dimmed">{u.phone}</Text>
                </Group>
              )}
              {!u.email && !u.phone && <Text size="xs" c="dimmed">—</Text>}
            </Stack>
          );
        },
      },
      {
        id: 'active',
        header: 'Estado',
        accessorFn: (row) => row.active,
        cell: ({ getValue }) => {
          const active = getValue<boolean | undefined>();
          return active === false ? (
            <Badge color="red" variant="light">Deshabilitado</Badge>
          ) : (
            <Badge color="teal" variant="light">Activo</Badge>
          );
        },
      },
    ],
    []
  );

  const handleSave = (values: SuperAdminUserFormValues) => {
    if (editingUser) {
      updateUser.mutate({
        id: editingUser.id,
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        password: values.password || undefined,
        role: values.role,
        email: values.email || null,
        phone: values.phone || null,
        tenantId: companyId,
        active: values.active,
      }, {
        onSuccess: () => { close(); setEditingUser(null); },
        onError: (error) => console.error('Error updating user:', error),
      });
    } else {
      createUser.mutate({
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        password: values.password || '123456',
        role: values.role,
        email: values.email || null,
        phone: values.phone || null,
        tenantId: companyId,
        active: values.active,
      }, {
        onSuccess: () => { close(); setEditingUser(null); },
        onError: (error) => console.error('Error creating user:', error),
      });
    }
  };

  const handleEdit = (user: UserResponse) => {
    setEditingUser(user);
    open();
  };

  const handleDelete = (user: UserResponse) => {
    setUserToDelete(user);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate({ id: userToDelete.id, tenantId: companyId });
    }
    closeDeleteModal();
    setUserToDelete(null);
  };

  const handleCloseDrawer = () => {
    close();
    setEditingUser(null);
  };

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Anchor
          component="button"
          type="button"
          onClick={() => navigate({ to: '/superadmin' })}
          c="dimmed"
          size="sm"
        >
          <Group gap={4}>
            <IconArrowLeft size={14} />
            <span>Volver a Empresas</span>
          </Group>
        </Anchor>

        <Breadcrumbs separator="/">
          <Text size="sm" c="dimmed">Administración</Text>
          <Text size="sm" c="dimmed">Empresas</Text>
          <Text size="sm" fw={500}>{company?.name ?? `Empresa #${companyId}`}</Text>
        </Breadcrumbs>
      </Stack>

      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="md">
            <ThemeIcon size={56} radius="md" variant="light" color="grape">
              <IconBuilding size={28} stroke={1.5} />
            </ThemeIcon>
            <div>
              <Title order={2} fw={700}>
                {company?.name ?? `Empresa #${companyId}`}
              </Title>
              <Group gap="md" mt={4}>
                {company?.identifier && (
                  <Group gap={4}>
                    <IconBarcode size={14} color="gray" />
                    <Text size="sm" c="dimmed" ff="monospace">{company.identifier}</Text>
                  </Group>
                )}
                <Group gap={4}>
                  <IconUsersGroup size={14} color="gray" />
                  <Text size="sm" c="dimmed">
                    {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
                  </Text>
                </Group>
                {company && (
                  <Badge
                    color={company.active ? 'teal' : 'gray'}
                    variant="light"
                    size="sm"
                  >
                    {company.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                )}
              </Group>
            </div>
          </Group>

          <Button
            leftSection={<IconPlus size={18} stroke={1.5} />}
            size="md"
            onClick={open}
            radius="md"
            color="grape"
          >
            Nuevo Usuario
          </Button>
        </Group>
      </Paper>

      <Paper pos="relative">
        <LoadingOverlay visible={isLoadingUsers || isLoadingCompanies} overlayProps={{ blur: 2 }} />
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Buscar usuario por nombre, usuario o email..."
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <Drawer
        opened={opened}
        onClose={handleCloseDrawer}
        title={null}
        position="right"
        size="560px"
        padding="xl"
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <SuperAdminUserForm
          key={editingUser?.id ?? 'new'}
          onSubmit={handleSave}
          onCancel={handleCloseDrawer}
          initialData={editingUser ? {
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            userName: editingUser.userName,
            role: editingUser.role,
            email: editingUser.email ?? undefined,
            phone: editingUser.phone ?? undefined,
            active: editingUser.active,
            companyId,
          } : { companyId }}
          isEditing={!!editingUser}
        />
      </Drawer>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={
          <Group gap="xs">
            <IconAlertTriangle size={20} color="red" />
            <Text fw={600}>Deshabilitar usuario</Text>
          </Group>
        }
        centered
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Text size="sm" mb="lg">
          ¿Estás seguro de que deseas deshabilitar al usuario{' '}
          <Text component="span" fw={600}>
            {userToDelete?.firstName} {userToDelete?.lastName}
          </Text>
          ? No podrá iniciar sesión, pero sus datos se conservarán.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmDelete} loading={deleteUser.isPending}>
            Deshabilitar
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
