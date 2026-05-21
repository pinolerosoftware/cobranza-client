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
  Divider
} from '@mantine/core';
import { 
  IconUser, 
  IconId,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { type Customer } from '@/types/customer';
import { customerSchema, type CustomerFormValues } from '../schemas/customerFormSchema';

interface CustomerFormProps {
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<Customer>;
  isEditing?: boolean;
}

export function CustomerForm({ onSubmit, onCancel, initialData, isEditing = false }: CustomerFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      dni: initialData?.dni ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      address: initialData?.address ?? '',
      active: initialData?.active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb={4}>
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Text>
          <Text size="sm" c="dimmed">
            {isEditing ? 'Actualiza los datos del cliente' : 'Completa los datos para registrar un nuevo cliente'}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Información Personal</Text>
          <Stack gap="md">
            <Group grow>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Nombre"
                    placeholder="Ej. Juan"
                    {...field}
                    error={errors.firstName?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    leftSection={<IconUser size={18} />}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Apellido"
                    placeholder="Ej. Pérez"
                    {...field}
                    error={errors.lastName?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    leftSection={<IconUser size={18} />}
                  />
                )}
              />
            </Group>

            <Group grow>
              <Controller
                name="dni"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="DNI / Identificación"
                    placeholder="Ej. 12345678-9"
                    {...field}
                    error={errors.dni?.message}
                    size="md"
                    radius="md"
                    leftSection={<IconId size={18} />}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Teléfono"
                    placeholder="555-123-4567"
                    {...field}
                    error={errors.phone?.message}
                    size="md"
                    radius="md"
                    leftSection={<IconPhone size={18} />}
                  />
                )}
              />
            </Group>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Email (opcional)"
                  placeholder="correo@ejemplo.com"
                  {...field}
                  error={errors.email?.message}
                  size="md"
                  radius="md"
                  leftSection={<IconMail size={18} />}
                />
              )}
            />
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Ubicación y Estado</Text>
          <Stack gap="md">
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Dirección"
                  placeholder="Calle, número, colonia, ciudad"
                  {...field}
                  error={errors.address?.message}
                  size="md"
                  radius="md"
                  leftSection={<IconMapPin size={18} />}
                />
              )}
            />
            
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Select
                  label="Estado del cliente"
                  placeholder="Seleccione un estado"
                  data={[
                    { value: 'true', label: 'Activo' },
                    { value: 'false', label: 'Inactivo' },
                  ]}
                  value={field.value?.toString() ?? 'true'}
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
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
