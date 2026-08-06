import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Select,
  Group,
  Text,
  Box,
  Divider,
} from '@mantine/core';
import {
  IconUser,
  IconPhone,
  IconMail,
  IconCheck,
  IconX,
  IconLock,
  IconBuilding,
  IconShield,
} from '@tabler/icons-react';
import { superAdminUserSchema, type SuperAdminUserFormValues } from '../schemas/superAdminUserSchema';
import { useCompanyList } from '@/features/company/hooks/useCompany';

interface SuperAdminUserFormProps {
  onSubmit: (values: SuperAdminUserFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<SuperAdminUserFormValues> & { tenantId?: number };
  isEditing?: boolean;
}

export function SuperAdminUserForm({ onSubmit, onCancel, initialData, isEditing = false }: SuperAdminUserFormProps) {
  const { data: companiesData } = useCompanyList();
  const companies = companiesData?.content || [];

  const companyOptions = useMemo(
    () =>
      companies.map((c) => ({
        value: c.companyId.toString(),
        label: c.name,
      })),
    [companies]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SuperAdminUserFormValues>({
    resolver: zodResolver(superAdminUserSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      userName: initialData?.userName ?? '',
      password: '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      companyId: initialData?.companyId ?? initialData?.tenantId ?? 0,
      role: initialData?.role ?? 'Admin',
      active: initialData?.active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Box>
          <Text fw={700} size="xl" mb={4}>
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario del Sistema'}
          </Text>
          <Text size="sm" c="dimmed">
            {isEditing
              ? 'Actualiza los datos del usuario'
              : 'Asigna un nuevo usuario a una empresa del sistema'}
          </Text>
        </Box>

        <Divider />

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Asignación
          </Text>
          <Stack gap="md">
            <Controller
              name="companyId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Empresa"
                  placeholder="Seleccione una empresa"
                  data={companyOptions}
                  value={field.value ? field.value.toString() : null}
                  onChange={(val) => field.onChange(val ? Number(val) : 0)}
                  error={errors.companyId?.message}
                  size="md"
                  radius="md"
                  withAsterisk
                  searchable
                  leftSection={<IconBuilding size={18} />}
                  disabled={isEditing}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  label="Rol"
                  placeholder="Seleccione un rol"
                  data={[
                    { value: 'Admin', label: 'Administrador' },
                    { value: 'Cobrador', label: 'Cobrador' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.role?.message}
                  size="md"
                  radius="md"
                  withAsterisk
                  leftSection={<IconShield size={18} />}
                />
              )}
            />
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Información Personal
          </Text>
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
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Acceso al Sistema
          </Text>
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
                  leftSection={<IconUser size={18} />}
                  disabled={isEditing}
                />
              )}
            />
            {!isEditing && (
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
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
            {isEditing && (
              <Text size="xs" c="dimmed">
                Deja la contraseña vacía si no deseas cambiarla.
              </Text>
            )}
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">
            Estado
          </Text>
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Select
                label="Estado del usuario"
                placeholder="Seleccione un estado"
                data={[
                  { value: 'true', label: 'Activo' },
                  { value: 'false', label: 'Deshabilitado' },
                ]}
                value={field.value ? 'true' : 'false'}
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
            color="grape"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
