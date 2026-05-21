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
  IconCheck,
  IconX,
  IconLock
} from '@tabler/icons-react';
import { collectorSchema, type CollectorFormValues } from '../schemas/collectorFormSchema';

interface CollectorFormProps {
  onSubmit: (values: CollectorFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<CollectorFormValues>;
  isEditing?: boolean;
}

export function CollectorForm({ onSubmit, onCancel, initialData, isEditing = false }: CollectorFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectorFormValues>({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      userName: initialData?.userName ?? '',
      password: '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      active: initialData?.active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb={4}>
            {isEditing ? 'Editar Cobrador' : 'Nuevo Cobrador'}
          </Text>
          <Text size="sm" c="dimmed">
            {isEditing ? 'Actualiza los datos del cobrador' : 'Completa los datos para registrar un nuevo cobrador'}
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
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Acceso al Sistema</Text>
          <Stack gap="md">
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Nombre de usuario"
                  placeholder="Ej. juan.perez"
                  {...field}
                  error={errors.userName?.message}
                  size="md"
                  radius="md"
                  withAsterisk
                  leftSection={<IconId size={18} />}
                  disabled={isEditing}
                />
              )}
            />
            {!isEditing && (
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Contraseña"
                    placeholder="••••••"
                    {...field}
                    error={errors.password?.message}
                    size="md"
                    radius="md"
                    withAsterisk
                    leftSection={<IconLock size={18} />}
                  />
                )}
              />
            )}
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Estado</Text>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Select
                label="Estado del cobrador"
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
                allowDeselect={false}
              />
            )}
          />
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
            {isEditing ? 'Guardar Cambios' : 'Crear Cobrador'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
