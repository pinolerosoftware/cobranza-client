import { useMemo, useState } from 'react';
import {
  Badge,
  Stack,
  Button,
  Group,
  Drawer,
  Text,
  Title,
  LoadingOverlay,
  Paper,
  Modal,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from '@tanstack/react-router';
import { IconAlertTriangle, IconPlus, IconBarcode } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { CompanyForm } from './CompanyForm';
import {
  useCompanyList,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from '@/features/company/hooks/useCompany';
import type { CompanyFormValues } from '../schemas/companyFormSchema';
import type { CompanyResponse } from '@/types/company';

export const CompanyList = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<CompanyResponse | null>(null);

  const { data: companiesData, isLoading } = useCompanyList();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const companies = companiesData?.content || [];

  const columns = useMemo<ColumnDef<CompanyResponse>[]>(
    () => [
      {
        id: 'name',
        header: 'Empresa',
        accessorFn: (row) => row.name,
        cell: ({ row }) => {
          const company = row.original;
          return (
            <Group gap="sm">
              <ThemeIcon
                size="lg"
                radius="xl"
                variant="light"
                color={company.active ? 'grape' : 'gray'}
              >
                <IconBarcode size={18} stroke={1.5} />
              </ThemeIcon>
              <div>
                <Text size="sm" fw={500}>
                  {company.name}
                </Text>
                <Text size="xs" c="dimmed">
                  ID: {company.companyId}
                </Text>
              </div>
            </Group>
          );
        },
      },
      {
        id: 'identifier',
        header: 'Identificador',
        accessorFn: (row) => row.identifier ?? '',
        cell: ({ row }) => {
          const identifier = row.original.identifier;
          return identifier ? (
            <Text size="sm" ff="monospace">
              {identifier}
            </Text>
          ) : (
            <Text size="sm" c="dimmed">
              —
            </Text>
          );
        },
      },
      {
        id: 'active',
        header: 'Estado',
        accessorFn: (row) => row.active,
        cell: ({ getValue }) => {
          const active = getValue<boolean | undefined>();
          return active ? (
            <Badge color="teal" variant="light">
              Activa
            </Badge>
          ) : (
            <Badge color="gray" variant="light">
              Inactiva
            </Badge>
          );
        },
      },
    ],
    []
  );

  const handleAddCompany = (values: CompanyFormValues) => {
    if (editingCompany) {
      updateCompany.mutate(
        {
          companyId: editingCompany.companyId,
          name: values.name,
          identifier: values.identifier || null,
          active: values.active,
        },
        {
          onSuccess: () => {
            close();
            setEditingCompany(null);
          },
          onError: (error) => {
            console.error('Error updating company:', error);
          },
        }
      );
    } else {
      createCompany.mutate(
        {
          name: values.name,
          identifier: values.identifier || null,
          active: values.active,
        },
        {
          onSuccess: () => {
            close();
            setEditingCompany(null);
          },
          onError: (error) => {
            console.error('Error creating company:', error);
          },
        }
      );
    }
  };

  const handleEdit = (company: CompanyResponse) => {
    setEditingCompany(company);
    open();
  };

  const handleViewUsers = (company: CompanyResponse) => {
    navigate({ to: '/superadmin/companies/$companyId', params: { companyId: company.companyId.toString() } });
  };

  const handleDelete = (company: CompanyResponse) => {
    setCompanyToDelete(company);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      deleteCompany.mutate({
        companyId: companyToDelete.companyId,
        name: companyToDelete.name,
        identifier: companyToDelete.identifier ?? null,
        active: companyToDelete.active,
      });
    }
    closeDeleteModal();
    setCompanyToDelete(null);
  };

  const handleCloseDrawer = () => {
    close();
    setEditingCompany(null);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} fw={700}>
            Empresas
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Gestiona las empresas registradas en el sistema
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={18} stroke={1.5} />}
          size="md"
          onClick={open}
          radius="md"
          color="grape"
        >
          Nueva Empresa
        </Button>
      </Group>

      <Paper pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <DataTable
          columns={columns}
          data={companies}
          searchPlaceholder="Buscar empresa por nombre o identificador..."
          onView={handleViewUsers}
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
        <CompanyForm
          key={editingCompany?.companyId ?? 'new'}
          onSubmit={handleAddCompany}
          onCancel={handleCloseDrawer}
          initialData={editingCompany ? {
            name: editingCompany.name,
            identifier: editingCompany.identifier ?? undefined,
            active: editingCompany.active,
          } : undefined}
          isEditing={!!editingCompany}
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
          ¿Estás seguro de que deseas eliminar la empresa{' '}
          <Text component="span" fw={600}>
            {companyToDelete?.name}
          </Text>
          ? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmDelete} loading={deleteCompany.isPending}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
