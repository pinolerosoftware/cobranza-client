import { useEffect } from 'react';
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
  Textarea,
} from '@mantine/core';
import {
  IconCheck,
  IconX,
  IconUserSearch,
  IconCoins,
  IconCalendar,
  IconFileDescription,
  IconFlag,
  IconCurrency,
} from '@tabler/icons-react';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useCurrencies } from '@/features/currency/hooks/useCurrency';
import type { LoanApplication } from '@/types/loan-application';
import { FrequencyValues, StatusLoanApplicationValues } from '@/types/loan-application';
import { loanApplicationFormSchema, type LoanApplicationFormValues } from '../schemas/loanApplicationFormSchema';
import { toDateInputValue } from '@/lib/date';

interface LoanApplicationFormProps {
  onSubmit: (values: LoanApplicationFormValues) => void;
  onCancel: () => void;
  initialData?: LoanApplication;
  isEditing?: boolean;
  isLoading?: boolean;
}

const frequencyOptions = [
  { value: String(FrequencyValues.Daily), label: 'Diario' },
  { value: String(FrequencyValues.Weekly), label: 'Semanal' },
  { value: String(FrequencyValues.Biweekly), label: 'Quincenal' },
  { value: String(FrequencyValues.Monthly), label: 'Mensual' },
];

const statusOptions = [
  { value: String(StatusLoanApplicationValues.Approved), label: 'Aprobado' },
  { value: String(StatusLoanApplicationValues.Pending), label: 'Pendiente' },
  { value: String(StatusLoanApplicationValues.Rejected), label: 'Rechazado' },
];

export function LoanApplicationForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  isLoading = false,
}: LoanApplicationFormProps) {
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();

  const customers = customersData?.content || [];
  const customerOptions = customers
    .filter((customer) => typeof customer.customerId === 'number')
    .map((customer) => ({
      value: String(customer.customerId),
      label: `${customer.firstName} ${customer.lastName}${customer.dni ? ` — DNI: ${customer.dni}` : ''}`,
    }));

  const currencyOptions = (currencies || [])
    .filter((currency) => typeof currency.currencyId === 'number')
    .map((currency) => ({
      value: String(currency.currencyId),
      label: `${currency.code} — ${currency.name}`,
    }));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationFormSchema),
    defaultValues: {
      loanApplicationId: initialData?.loanApplicationId,
      customerId: initialData?.customerId,
      frequency: initialData?.frequency ?? FrequencyValues.Monthly,
      amount: initialData?.amount ?? 0,
      description: initialData?.description ?? '',
      dateApplication: toDateInputValue(initialData?.dateApplication) || new Date().toISOString().split('T')[0],
      status: initialData?.status ?? StatusLoanApplicationValues.Pending,
      currencyId: initialData?.currencyId ?? undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        loanApplicationId: initialData.loanApplicationId,
        customerId: initialData.customerId,
        frequency: initialData.frequency,
        amount: initialData.amount,
        description: initialData.description,
        dateApplication: toDateInputValue(initialData.dateApplication) || new Date().toISOString().split('T')[0],
        status: initialData.status,
        currencyId: initialData.currencyId ?? undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.loanApplicationId, reset]);

  const isSaving = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb={4}>
            {isEditing ? 'Editar Solicitud de Préstamo' : 'Nueva Solicitud de Préstamo'}
          </Text>
          <Text size="sm" c="dimmed">
            {isEditing
              ? 'Actualiza los datos de la solicitud'
              : 'Completa los datos para registrar una nueva solicitud'}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Cliente y Moneda
          </Text>
          <Stack gap="md">
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Cliente"
                  placeholder="Selecciona un cliente"
                  data={customerOptions}
                  value={field.value ? String(field.value) : null}
                  onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  error={errors.customerId?.message}
                  searchable
                  nothingFoundMessage="No se encontraron clientes"
                  leftSection={<IconUserSearch size={18} />}
                  size="md"
                  radius="md"
                  withAsterisk
                  disabled={isLoadingCustomers}
                />
              )}
            />

            <Controller
              name="currencyId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Moneda"
                  placeholder="Selecciona una moneda"
                  data={currencyOptions}
                  value={field.value ? String(field.value) : null}
                  onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                  error={errors.currencyId?.message}
                  nothingFoundMessage="No se encontraron monedas"
                  leftSection={<IconCurrency size={18} />}
                  size="md"
                  radius="md"
                  withAsterisk
                  disabled={isLoadingCurrencies}
                />
              )}
            />
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Condiciones
          </Text>
          <Stack gap="md">
            <Group grow>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    label="Monto solicitado"
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
                    leftSection={<IconCoins size={18} />}
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
                    data={frequencyOptions}
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

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Descripción"
                  placeholder="Motivo u observaciones de la solicitud"
                  value={field.value}
                  onChange={(event) => field.onChange(event.currentTarget.value)}
                  error={errors.description?.message}
                  size="md"
                  radius="md"
                  withAsterisk
                  minRows={2}
                  leftSection={<IconFileDescription size={18} />}
                />
              )}
            />
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Fechas y Estado
          </Text>
          <Stack gap="md">
            <Group grow>
              <Controller
                name="dateApplication"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Fecha de solicitud"
                    type="date"
                    value={field.value}
                    onChange={(event) => field.onChange(event.currentTarget.value)}
                    error={errors.dateApplication?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    leftSection={<IconCalendar size={18} />}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Estado"
                    placeholder="Selecciona"
                    data={statusOptions}
                    value={String(field.value)}
                    onChange={(val) => field.onChange(Number(val) as typeof StatusLoanApplicationValues[keyof typeof StatusLoanApplicationValues])}
                    error={errors.status?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    leftSection={<IconFlag size={18} />}
                  />
                )}
              />
            </Group>
          </Stack>
        </Box>

        <Divider />

        <Group justify="flex-end" gap="md">
          <Button
            variant="subtle"
            onClick={onCancel}
            size="md"
            radius="md"
            disabled={isSaving}
            leftSection={<IconX size={18} />}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="md"
            radius="md"
            loading={isSaving}
            leftSection={<IconCheck size={18} />}
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Solicitud'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
