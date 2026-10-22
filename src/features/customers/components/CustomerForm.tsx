import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  TextInput, 
  Button, 
  Stack, 
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
  IconX,
  IconEPassport
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
      passport: initialData?.passport ?? '',
      phoneNumber: initialData?.phone || initialData?.phoneNumber || '',
      email: initialData?.email ?? '',
      address: initialData?.address ?? '',
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
                name="passport"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Pasaporte"
                    placeholder="Ej. AB1234567"
                    {...field}
                    error={errors.passport?.message}
                    size="md"
                    radius="md"
                    leftSection={<IconEPassport size={18} />}
                  />
                )}
              />
            </Group>

            <Group grow>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Teléfono"
                    placeholder="555-123-4567"
                    {...field}
                    error={errors.phoneNumber?.message}
                    size="md"
                    radius="md"
                    leftSection={<IconPhone size={18} />}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Email"
                    placeholder="correo@ejemplo.com"
                    {...field}
                    error={errors.email?.message}
                    size="md"
                    radius="md"
                    leftSection={<IconMail size={18} />}
                  />
                )}
              />
            </Group>
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
