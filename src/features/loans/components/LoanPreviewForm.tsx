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
  Alert,
} from '@mantine/core';
import { IconInfoCircle, IconCalculator, IconX, IconCreditCard } from '@tabler/icons-react';
import { useLoanPreview } from '@/features/loans/hooks/useLoanPreview';
import { loanPreviewFormSchema, type LoanPreviewFormValues } from '@/features/loans/schemas/loanPreviewSchema';
import type { LoanPreview, LoanInstallmentPreview } from '@/types/loan';
import { FrequencyValues, InterestTypeValues, type Frequency } from '@/types/loan';

interface LoanPreviewFormProps {
  loanApplicationId: number;
  customerName: string;
  defaultAmount?: number;
  defaultFrequency?: Frequency;
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

export function LoanPreviewForm({
  loanApplicationId,
  customerName,
  defaultAmount = 0,
  defaultFrequency = FrequencyValues.Monthly,
  onClose,
}: LoanPreviewFormProps) {
  const preview = useLoanPreview();
  const [generatedPreview, setGeneratedPreview] = useState<LoanPreview | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoanPreviewFormValues>({
    resolver: zodResolver(loanPreviewFormSchema),
    defaultValues: {
      customerId: 0,
      amount: defaultAmount,
      interestRate: 0,
      term: 0,
      frequency: defaultFrequency,
      interestType: InterestTypeValues.Simple,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const watchedFrequency = watch('frequency');
  const watchedInterestType = watch('interestType');

  const handleGeneratePreview = handleSubmit((values) => {
    const payload = {
      id: 0,
      loanApplicationId,
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

  const handleReset = () => {
    setGeneratedPreview(null);
    setValue('amount', defaultAmount);
    setValue('interestRate', 0);
    setValue('term', 0);
    setValue('frequency', defaultFrequency);
    setValue('interestType', InterestTypeValues.Simple);
    setValue('startDate', new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleGeneratePreview}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb={4}>
            Calcular Plan de Pagos
          </Text>
          <Text size="sm" c="dimmed">
            Configura las condiciones para previsualizar el plan de pagos del préstamo.
          </Text>
        </Box>

        <Alert icon={<IconInfoCircle size={18} />} variant="light" color="blue" radius="md">
          <Text size="sm">
            <strong>Cliente:</strong> {customerName}
          </Text>
        </Alert>

        <Divider />

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
                    value={field.value}
                    onChange={(event) => field.onChange(event.currentTarget.value)}
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
            disabled={preview.isPending}
            leftSection={<IconX size={18} />}
          >
            Cerrar
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
              Generar plan de pagos
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

              <Paper withBorder radius="md" mb="md">
                <Group gap="md" p="md" justify="space-between">
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Total a pagar
                    </Text>
                    <Text fw={700} size="lg">
                      {formatCurrency(computeTotals(generatedPreview.installments).amount)}
                    </Text>
                  </Stack>
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Capital
                    </Text>
                    <Text fw={700} size="lg">
                      {formatCurrency(computeTotals(generatedPreview.installments).capital)}
                    </Text>
                  </Stack>
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed" tt="uppercase">
                      Interés
                    </Text>
                    <Text fw={700} size="lg">
                      {formatCurrency(computeTotals(generatedPreview.installments).interest)}
                    </Text>
                  </Stack>
                </Group>
              </Paper>

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
            </Box>
          </>
        )}
      </Stack>
    </form>
  );
}
