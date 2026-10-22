import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextInput,
  NumberInput,
  Select,
  Button,
  Stack,
  Group,
  Text,
  Box,
  Divider,
  Paper,
  Table,
  ScrollArea,
  Badge,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { IconInfoCircle, IconCheck, IconX, IconCalculator, IconCreditCard, IconUserSearch } from '@tabler/icons-react';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useLoanPreview } from '@/features/loans/hooks/useLoanPreview';
import { useLoanStore } from '@/features/loans/store/useLoanStore';
import { loanPreviewFormSchema, type LoanPreviewFormValues } from '@/features/loans/schemas/loanPreviewSchema';
import type { LoanPreview, LoanInstallmentPreview } from '@/types/loan';
import { FrequencyValues, InterestTypeValues, LoanStatusValues } from '@/types/loan';
import type { Customer } from '@/types/customer';

interface LoanFormProps {
  onClose: () => void;
}

function getFrequencyLabel(value: number): string {
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

function getInterestTypeLabel(value: number): string {
  switch (value) {
    case InterestTypeValues.Simple:
      return 'Simple';
    case InterestTypeValues.Compound:
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

function computeTotals(installments: LoanInstallmentPreview[]) {
  return installments.reduce(
    (acc, installment) => ({
      amount: acc.amount + installment.amount,
      capital: acc.capital + installment.capital,
      interest: acc.interest + installment.interest,
    }),
    { amount: 0, capital: 0, interest: 0 }
  );
}

export function LoanForm({ onClose }: LoanFormProps) {
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers();
  const preview = useLoanPreview();
  const addLoan = useLoanStore((state) => state.addLoan);
  const [generatedPreview, setGeneratedPreview] = useState<LoanPreview | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customers = customersData?.content || [];

  const customerOptions = customers
    .filter((customer) => typeof customer.customerId === 'number')
    .map((customer) => {
      const label = `${customer.firstName} ${customer.lastName}`;
      const extra = customer.dni ? `DNI: ${customer.dni}` : 'Sin identificación';
      return {
        value: String(customer.customerId),
        label: `${label} (${extra})`,
        customer,
      };
    });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoanPreviewFormValues>({
    resolver: zodResolver(loanPreviewFormSchema),
    defaultValues: {
      customerId: 0,
      amount: 0,
      interestRate: 0,
      term: 0,
      frequency: FrequencyValues.Monthly,
      interestType: InterestTypeValues.Simple,
      startDate: new Date().toISOString(),
    },
  });

  const watchedFrequency = watch('frequency');
  const watchedInterestType = watch('interestType');

  const handleGeneratePreview = handleSubmit((values) => {
    const payload = {
      id: 0,
      loanApplicationId: 0,
      amount: values.amount,
      interestRate: values.interestRate,
      term: values.term,
      frequency: values.frequency,
      interestType: values.interestType,
      startDate: values.startDate,
      installments: [],
    };

    preview.mutate(payload, {
      onSuccess: (data) => {
        setGeneratedPreview(data);
      },
    });
  });

  const handleSaveLoan = () => {
    if (!generatedPreview || !selectedCustomer) return;

    const newLoan = {
      id: generatedPreview.id || Date.now(),
      loanApplicationId: generatedPreview.loanApplicationId || 0,
      customerId: selectedCustomer.customerId || 0,
      customerName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      amount: generatedPreview.amount,
      interestRate: generatedPreview.interestRate,
      term: generatedPreview.term,
      frequency: generatedPreview.frequency,
      interestType: generatedPreview.interestType,
      startDate: generatedPreview.startDate,
      status: LoanStatusValues.Draft,
      installments: generatedPreview.installments,
      createdAt: new Date().toISOString(),
    };

    addLoan(newLoan);
    onClose();
  };

  const handleReset = () => {
    setGeneratedPreview(null);
    setSelectedCustomer(null);
    setValue('customerId', 0);
    setValue('amount', 0);
    setValue('interestRate', 0);
    setValue('term', 0);
    setValue('frequency', FrequencyValues.Monthly);
    setValue('interestType', InterestTypeValues.Simple);
    setValue('startDate', new Date().toISOString());
  };

  const isSaving = isSubmitting || preview.isPending;

  return (
    <form onSubmit={handleGeneratePreview}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb={4}>
            Nuevo Préstamo
          </Text>
          <Text size="sm" c="dimmed">
            Busca al cliente y configura los datos para calcular el plan de pagos.
          </Text>
        </Box>

        <Divider />

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Cliente
          </Text>
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <Select
                label="Buscar cliente"
                placeholder="Escribe el nombre, DNI o teléfono"
                data={customerOptions}
                value={field.value ? String(field.value) : null}
                onChange={(val) => {
                  const numericValue = val ? Number(val) : 0;
                  field.onChange(numericValue);
                  const match = customerOptions.find((option) => option.value === val);
                  setSelectedCustomer(match?.customer || null);
                }}
                error={errors.customerId?.message}
                searchable
                nothingFoundMessage="No se encontraron clientes"
                leftSection={<IconUserSearch size={18} />}
                size="md"
                radius="md"
                withAsterisk
                disabled={isLoadingCustomers}
                comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
              />
            )}
          />
          {selectedCustomer && (
            <Alert icon={<IconInfoCircle size={18} />} variant="light" color="blue" mt="sm" radius="md">
              <Text size="sm">
                <strong>Cliente seleccionado:</strong>{' '}
                {selectedCustomer.firstName} {selectedCustomer.lastName}
                {selectedCustomer.dni && <> — DNI: {selectedCustomer.dni}</>}
              </Text>
            </Alert>
          )}
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Condiciones del préstamo
          </Text>
          <Stack gap="md">
            <Group grow>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Monto del préstamo"
                    placeholder="Ej. 1,000.00"
                    value={field.value}
                    onChange={(val) => field.onChange(Number(val) || 0)}
                    error={errors.amount?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    prefix="$ "
                    decimalScale={2}
                    thousandSeparator=","
                    leftSection={<IconCreditCard size={18} />}
                  />
                )}
              />
              <Controller
                name="interestRate"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Tasa de interés"
                    placeholder="Ej. 10"
                    value={field.value}
                    onChange={(val) => field.onChange(Number(val) || 0)}
                    error={errors.interestRate?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    suffix=" %"
                    decimalScale={2}
                    leftSection={<IconCalculator size={18} />}
                  />
                )}
              />
            </Group>

            <Group grow>
              <Controller
                name="term"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Plazo (cuotas)"
                    placeholder="Ej. 12"
                    value={field.value}
                    onChange={(val) => field.onChange(Number(val) || 0)}
                    error={errors.term?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    min={1}
                    decimalScale={0}
                  />
                )}
              />
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Frecuencia de pago"
                    placeholder="Selecciona"
                    data={[
                      { value: String(FrequencyValues.Daily), label: 'Diario' },
                      { value: String(FrequencyValues.Weekly), label: 'Semanal' },
                      { value: String(FrequencyValues.Biweekly), label: 'Quincenal' },
                      { value: String(FrequencyValues.Monthly), label: 'Mensual' },
                    ]}
                    value={String(field.value)}
                    onChange={(val) => field.onChange(Number(val) as typeof FrequencyValues[keyof typeof FrequencyValues])}
                    error={errors.frequency?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                  />
                )}
              />
            </Group>

            <Group grow>
              <Controller
                name="interestType"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Tipo de interés"
                    placeholder="Selecciona"
                    data={[
                      { value: String(InterestTypeValues.Simple), label: 'Simple' },
                      { value: String(InterestTypeValues.Compound), label: 'Compuesto' },
                    ]}
                    value={String(field.value)}
                    onChange={(val) => field.onChange(Number(val) as typeof InterestTypeValues[keyof typeof InterestTypeValues])}
                    error={errors.interestType?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                  />
                )}
              />
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Fecha de inicio"
                    placeholder="Selecciona la fecha"
                    type="date"
                    value={field.value ? field.value.split('T')[0] : ''}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      field.onChange(value ? new Date(value).toISOString() : '');
                    }}
                    error={errors.startDate?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                  />
                )}
              />
            </Group>
          </Stack>
        </Box>

        <Divider />

        <Group justify="space-between" gap="md">
          <Button
            type="button"
            variant="subtle"
            onClick={onClose}
            size="md"
            radius="md"
            disabled={isSaving}
            leftSection={<IconX size={18} />}
          >
            Cancelar
          </Button>
          <Group gap="sm">
            {generatedPreview && (
              <Button
                type="button"
                variant="light"
                color="gray"
                onClick={handleReset}
                size="md"
                radius="md"
              >
                Nuevo cálculo
              </Button>
            )}
            <Button
              type="submit"
              size="md"
              radius="md"
              loading={preview.isPending}
              leftSection={<IconCalculator size={18} />}
            >
              Generar preview
            </Button>
          </Group>
        </Group>

        {generatedPreview && (
          <>
            <Divider />
            <Box>
              <Text fw={700} size="lg" mb="xs">
                Resumen del plan de pagos
              </Text>
              <Group gap="sm" mb="md">
                <Badge variant="light" color="blue" size="lg" radius="md">
                  Frecuencia: {getFrequencyLabel(watchedFrequency)}
                </Badge>
                <Badge variant="light" color="teal" size="lg" radius="md">
                  Tipo: {getInterestTypeLabel(watchedInterestType)}
                </Badge>
                <Badge variant="light" color="gray" size="lg" radius="md">
                  Cuotas: {generatedPreview.installments.length}
                </Badge>
              </Group>

              <Paper withBorder radius="md" pos="relative" mb="md">
                <LoadingOverlay visible={false} />
                <Group gap="md" p="md" justify="space-between">
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase">Total a pagar</Text>
                    <Text fw={700} size="lg">
                      {formatCurrency(computeTotals(generatedPreview.installments).amount)}
                    </Text>
                  </Stack>
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase">Capital</Text>
                    <Text fw={700} size="lg">
                      {formatCurrency(computeTotals(generatedPreview.installments).capital)}
                    </Text>
                  </Stack>
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase">Interés</Text>
                    <Text fw={700} size="lg">
                      {formatCurrency(computeTotals(generatedPreview.installments).interest)}
                    </Text>
                  </Stack>
                </Group>
              </Paper>

              <Paper withBorder radius="md" pos="relative">
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
                      {generatedPreview.installments.map((installment) => (
                        <Table.Tr key={installment.id || installment.number}>
                          <Table.Td>{installment.number}</Table.Td>
                          <Table.Td>{new Date(installment.dueDate).toLocaleDateString('es-SV')}</Table.Td>
                          <Table.Td>{formatCurrency(installment.amount)}</Table.Td>
                          <Table.Td>{formatCurrency(installment.capital)}</Table.Td>
                          <Table.Td>{formatCurrency(installment.interest)}</Table.Td>
                          <Table.Td>{formatCurrency(installment.remainingBalance)}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>

              <Button
                type="button"
                fullWidth
                size="md"
                radius="md"
                mt="md"
                color="teal"
                leftSection={<IconCheck size={18} />}
                onClick={handleSaveLoan}
                disabled={!selectedCustomer}
              >
                Guardar préstamo
              </Button>
            </Box>
          </>
        )}
      </Stack>
    </form>
  );
}
