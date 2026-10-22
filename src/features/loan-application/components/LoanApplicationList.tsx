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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle, IconPlus, IconCalculator } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { LoanApplicationForm } from './LoanApplicationForm';
import { LoanPreviewForm } from '@/features/loans/components/LoanPreviewForm';
import {
  useLoanApplications,
  useCreateLoanApplication,
  useUpdateLoanApplication,
  useDeleteLoanApplication,
} from '@/features/loan-application/hooks/useLoanApplication';
import type { LoanApplication, StatusLoanApplication, Frequency } from '@/types/loan-application';
import { StatusLoanApplicationValues, FrequencyValues } from '@/types/loan-application';
import type { LoanApplicationFormValues } from '../schemas/loanApplicationFormSchema';
import { toLocalIsoDateTime } from '@/lib/date';

function getStatusLabel(status: StatusLoanApplication): string {
  switch (status) {
    case StatusLoanApplicationValues.Approved:
      return 'Aprobado';
    case StatusLoanApplicationValues.Pending:
      return 'Pendiente';
    case StatusLoanApplicationValues.Rejected:
      return 'Rechazado';
    default:
      return 'Desconocido';
  }
}

function getStatusColor(status: StatusLoanApplication): string {
  switch (status) {
    case StatusLoanApplicationValues.Approved:
      return 'teal';
    case StatusLoanApplicationValues.Pending:
      return 'yellow';
    case StatusLoanApplicationValues.Rejected:
      return 'red';
    default:
      return 'gray';
  }
}

function getFrequencyLabel(value: Frequency): string {
  switch (value) {
    case FrequencyValues.Daily:
      return 'Diario';
    case FrequencyValues.Weekly:
      return 'Semanal';
    case FrequencyValues.Biweekly:
      return 'Quincenal';
    case FrequencyValues.Monthly:
      return 'Mensual';
    default:
      return 'Desconocido';
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function preparePayload(values: LoanApplicationFormValues): LoanApplicationFormValues {
  return {
    ...values,
    dateApplication: toLocalIsoDateTime(values.dateApplication),
    dateApproved: values.dateApproved ? toLocalIsoDateTime(values.dateApproved) : null,
    dateRejected: values.dateRejected ? toLocalIsoDateTime(values.dateRejected) : null,
  };
}

export function LoanApplicationList() {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [editingApplication, setEditingApplication] = useState<LoanApplication | null>(null);
  const [previewApplication, setPreviewApplication] = useState<LoanApplication | null>(null);
  const [applicationToDelete, setApplicationToDelete] = useState<LoanApplication | null>(null);

  const { data: applicationsData, isLoading } = useLoanApplications();
  const createApplication = useCreateLoanApplication();
  const updateApplication = useUpdateLoanApplication();
  const deleteApplication = useDeleteLoanApplication();

  const applications = (applicationsData?.content || []).filter((app) => app.active !== false);

  const columns = useMemo<ColumnDef<LoanApplication>[]>(
    () => [
      {
        id: 'customer',
        header: 'Cliente',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => {
          const application = row.original;
          return (
            <Group gap="sm">
              <div>
                <Text size="sm" fw={500}>
                  {application.firstName} {application.lastName}
                </Text>
                <Text size="xs" c="dimmed">
                  DNI: {application.dni || '-'}
                </Text>
              </div>
            </Group>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
        cell: ({ getValue }) => formatCurrency(getValue<number>()),
      },
      {
        accessorKey: 'frequency',
        header: 'Frecuencia',
        cell: ({ getValue }) => getFrequencyLabel(getValue<Frequency>()),
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ getValue }) => (
          <Text size="sm" lineClamp={1}>
            {getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const status = getValue<StatusLoanApplication>();
          return (
            <Badge color={getStatusColor(status)} variant="light">
              {getStatusLabel(status)}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const handleAddApplication = (values: LoanApplicationFormValues) => {
    const payload = preparePayload(values);

    if (editingApplication) {
      updateApplication.mutate(
        { ...payload, loanApplicationId: editingApplication.loanApplicationId },
        {
          onSuccess: () => {
            closeDrawer();
            setEditingApplication(null);
          },
          onError: (error) => {
            console.error('Error al actualizar:', error);
            alert(`Error al actualizar: ${error.message}`);
          },
        }
      );
    } else {
      createApplication.mutate(payload, {
        onSuccess: () => {
          closeDrawer();
          setEditingApplication(null);
        },
        onError: (error) => {
          console.error('Error al crear:', error);
          alert(`Error al crear: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (application: LoanApplication) => {
    setEditingApplication(application);
    openDrawer();
  };

  const handleDelete = (application: LoanApplication) => {
    setApplicationToDelete(application);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      deleteApplication.mutate(
        {
          loanApplicationId: applicationToDelete.loanApplicationId,
          customerId: applicationToDelete.customerId,
          frequency: applicationToDelete.frequency,
          amount: applicationToDelete.amount,
          description: applicationToDelete.description,
          dateApplication: applicationToDelete.dateApplication,
          dateApproved: applicationToDelete.dateApproved ?? null,
          dateRejected: applicationToDelete.dateRejected ?? null,
          status: applicationToDelete.status,
          currencyId: applicationToDelete.currencyId ?? 0,
        },
        {
          onSuccess: () => {
            closeDeleteModal();
            setApplicationToDelete(null);
          },
          onError: (error) => {
            console.error('Error al eliminar:', error);
            alert(`Error al eliminar: ${error.message}`);
          },
        }
      );
    }
  };

  const handleOpenPreview = (application: LoanApplication) => {
    setPreviewApplication(application);
    openPreview();
  };

  const handleCloseDrawer = () => {
    closeDrawer();
    setEditingApplication(null);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} fw={700}>
            Solicitudes de Préstamo
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Gestiona las solicitudes y calcula planes de pago
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={18} stroke={1.5} />}
          size="md"
          onClick={openDrawer}
          radius="md"
        >
          Nueva Solicitud
        </Button>
      </Group>

      <Paper pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <DataTable
          columns={columns}
          data={applications}
          searchPlaceholder="Buscar solicitud por cliente, monto o estado..."
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleOpenPreview}
        />
      </Paper>

      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        title={null}
        position="right"
        size="600px"
        padding="xl"
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <LoanApplicationForm
          key={editingApplication?.loanApplicationId ?? 'new'}
          onSubmit={handleAddApplication}
          onCancel={handleCloseDrawer}
          initialData={editingApplication ?? undefined}
          isEditing={!!editingApplication}
          isLoading={createApplication.isPending || updateApplication.isPending}
        />
      </Drawer>

      <Modal
        opened={previewOpened}
        onClose={closePreview}
        title={
          <Group gap="xs">
            <IconCalculator size={20} />
            <Text fw={600}>Calcular plan de pagos</Text>
          </Group>
        }
        centered
        radius="md"
        size="xl"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {previewApplication && (
          <LoanPreviewForm
            loanApplicationId={previewApplication.loanApplicationId}
            customerName={`${previewApplication.firstName} ${previewApplication.lastName}`}
            defaultAmount={previewApplication.amount}
            defaultFrequency={previewApplication.frequency}
            onClose={closePreview}
          />
        )}
      </Modal>

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
          ¿Estás seguro de que deseas eliminar la solicitud de{' '}
          <Text component="span" fw={600}>
            {applicationToDelete?.firstName} {applicationToDelete?.lastName}
          </Text>
          ? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmDelete} loading={deleteApplication.isPending}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
