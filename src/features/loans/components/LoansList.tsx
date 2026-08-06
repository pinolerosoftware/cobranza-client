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
  Table,
  ScrollArea,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle, IconPlus, IconCreditCard } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/DataTable';
import { LoanForm } from './LoanForm';
import { useLoanStore } from '@/features/loans/store/useLoanStore';
import type { LoanItem, LoanStatus } from '@/types/loan';
import { LoanStatusValues } from '@/types/loan';

function getStatusLabel(status: LoanStatus): string {
  switch (status) {
    case LoanStatusValues.Draft:
      return 'Borrador';
    case LoanStatusValues.Active:
      return 'Activo';
    case LoanStatusValues.Paid:
      return 'Pagado';
    case LoanStatusValues.Cancelled:
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
}

function getStatusColor(status: LoanStatus): string {
  switch (status) {
    case LoanStatusValues.Draft:
      return 'gray';
    case LoanStatusValues.Active:
      return 'blue';
    case LoanStatusValues.Paid:
      return 'teal';
    case LoanStatusValues.Cancelled:
      return 'red';
    default:
      return 'gray';
  }
}

function getFrequencyLabel(value: number): string {
  switch (value) {
    case 1:
      return 'Diario';
    case 2:
      return 'Semanal';
    case 3:
      return 'Quincenal';
    case 4:
      return 'Mensual';
    default:
      return 'Desconocido';
  }
}

function getInterestTypeLabel(value: number): string {
  switch (value) {
    case 1:
      return 'Simple';
    case 2:
      return 'Compuesto';
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

export function LoansList() {
  const [opened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);

  const loans = useLoanStore((state) => state.loans);
  const removeLoan = useLoanStore((state) => state.removeLoan);

  const columns = useMemo<ColumnDef<LoanItem>[]>(
    () => [
      {
        id: 'customer',
        header: 'Cliente',
        accessorFn: (row) => row.customerName,
        cell: ({ row }) => {
          const loan = row.original;
          return (
            <Group gap="sm">
              <Avatar size="sm" radius="xl" color="blue">
                {loan.customerName.charAt(0)}
              </Avatar>
              <div>
                <Text size="sm" fw={500}>
                  {loan.customerName}
                </Text>
                <Text size="xs" c="dimmed">
                  {getFrequencyLabel(loan.frequency)} — {getInterestTypeLabel(loan.interestType)}
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
        accessorKey: 'interestRate',
        header: 'Tasa',
        cell: ({ getValue }) => `${getValue<number>()}%`,
      },
      {
        accessorKey: 'term',
        header: 'Plazo',
        cell: ({ getValue }) => `${getValue<number>()} cuotas`,
      },
      {
        accessorKey: 'startDate',
        header: 'Inicio',
        cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString('es-SV'),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ getValue }) => {
          const status = getValue<LoanStatus>();
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

  const handleView = (loan: LoanItem) => {
    setSelectedLoan(loan);
    openViewModal();
  };

  const handleDelete = (loan: LoanItem) => {
    setSelectedLoan(loan);
    openDeleteModal();
  };

  const confirmDelete = () => {
    if (selectedLoan) {
      removeLoan(selectedLoan.id);
    }
    closeDeleteModal();
    setSelectedLoan(null);
  };

  const handleCloseDrawer = () => {
    close();
    setSelectedLoan(null);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} fw={700}>
            Préstamos
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Gestiona los préstamos activos y sus planes de pago
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={18} stroke={1.5} />}
          size="md"
          onClick={open}
          radius="md"
        >
          Nuevo Préstamo
        </Button>
      </Group>

      <Paper pos="relative">
        <LoadingOverlay visible={false} overlayProps={{ blur: 2 }} />
        <DataTable
          columns={columns}
          data={loans}
          searchPlaceholder="Buscar préstamo por cliente, monto o estado..."
          onView={handleView}
          onDelete={handleDelete}
        />
      </Paper>

      <Drawer
        opened={opened}
        onClose={handleCloseDrawer}
        title={null}
        position="right"
        size="700px"
        padding="xl"
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <LoanForm key={String(opened)} onClose={handleCloseDrawer} />
      </Drawer>

      <Modal
        opened={viewModalOpened}
        onClose={closeViewModal}
        title={
          <Group gap="xs">
            <IconCreditCard size={20} />
            <Text fw={600}>Detalle del préstamo</Text>
          </Group>
        }
        centered
        radius="md"
        size="xl"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {selectedLoan && (
          <Stack gap="md">
            <Group justify="space-between">
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase">
                  Cliente
                </Text>
                <Text fw={600}>{selectedLoan.customerName}</Text>
              </Box>
              <Badge color={getStatusColor(selectedLoan.status)} variant="light" size="lg">
                {getStatusLabel(selectedLoan.status)}
              </Badge>
            </Group>

            <Group grow>
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase">
                  Monto
                </Text>
                <Text fw={600}>{formatCurrency(selectedLoan.amount)}</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase">
                  Tasa
                </Text>
                <Text fw={600}>{selectedLoan.interestRate}%</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed" tt="uppercase">
                  Plazo
                </Text>
                <Text fw={600}>{selectedLoan.term} cuotas</Text>
              </Box>
            </Group>

            <Box>
              <Text fw={600} size="sm" mb="xs">
                Plan de pagos
              </Text>
              <Paper withBorder radius="md">
                <ScrollArea>
                  <Table striped highlightOnHover fz="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>#</Table.Th>
                        <Table.Th>Vencimiento</Table.Th>
                        <Table.Th>Cuota</Table.Th>
                        <Table.Th>Capital</Table.Th>
                        <Table.Th>Interés</Table.Th>
                        <Table.Th>Saldo</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {selectedLoan.installments.map((installment) => (
                        <Table.Tr key={installment.id || installment.number}>
                          <Table.Td>{installment.number}</Table.Td>
                          <Table.Td>{new Date(installment.dueDate).toLocaleDateString('es-SV')}</Table.Td>
                          <Table.Td>{formatCurrency(installment.amount)}</Table.Td>
                          <Table.Td>{formatCurrency(installment.capital)}</Table.Td>
                          <Table.Td>{formatCurrency(installment.inerest)}</Table.Td>
                          <Table.Td>{formatCurrency(installment.remainingBalance)}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Box>
          </Stack>
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
          ¿Estás seguro de que deseas eliminar el préstamo de{' '}
          <Text component="span" fw={600}>
            {selectedLoan?.customerName}
          </Text>
          ? Esta acción no se puede deshacer.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
