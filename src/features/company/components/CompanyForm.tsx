import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextInput,
  Button,
  Stack,
  Select,
  Group,
  Text,
  Box,
  Divider,
} from '@mantine/core';
import {
  IconBuilding,
  IconBarcode,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { companyFormSchema, type CompanyFormValues } from '../schemas/companyFormSchema';

interface CompanyFormProps {
  onSubmit: (values: CompanyFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<CompanyFormValues>;
  isEditing?: boolean;
}

export function CompanyForm({ onSubmit, onCancel, initialData, isEditing = false }: CompanyFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      identifier: initialData?.identifier ?? '',
      active: initialData?.active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb={4}>
            {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
          </Text>
          <Text size="sm" c="dimmed">
            {isEditing
              ? 'Actualiza los datos de la empresa'
              : 'Completa los datos para registrar una nueva empresa'}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Información de la Empresa
          </Text>
          <Stack gap="md">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Nombre de la empresa"
                  placeholder="Ej. Cobros Rápidos S.A."
                  {...field}
                  error={errors.name?.message}
                  size="md"
                  radius="md"
                  withAsterisk
                  leftSection={<IconBuilding size={18} />}
                />
              )}
            />

            <Controller
              name="identifier"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Identificador fiscal / RUC / NIT"
                  placeholder="Ej. 80012345-6"
                  {...field}
                  error={errors.identifier?.message}
                  size="md"
                  radius="md"
                  leftSection={<IconBarcode size={18} />}
                />
              )}
            />

            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Select
                  label="Estado"
                  placeholder="Seleccione un estado"
                  data={[
                    { value: 'true', label: 'Activa' },
                    { value: 'false', label: 'Inactiva' },
                  ]}
                  value={field.value ? 'true' : 'false'}
                  onChange={(val) => field.onChange(val === 'true')}
                  size="md"
                  radius="md"
                  withAsterisk
                />
              )}
            />
          </Stack>
        </Box>

        <Divider />

        <Group justify="flex-end" gap="md">
          <Button
            variant="subtle"
            onClick={onCancel}
            size="md"
            radius="md"
            disabled={isSubmitting}
            leftSection={<IconX size={18} />}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="md"
            radius="md"
            loading={isSubmitting}
            leftSection={<IconCheck size={18} />}
            color="grape"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Empresa'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
