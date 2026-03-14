import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  TextInput, 
  Button, 
  Stack, 
  Select,
  Group,
  Text,
  Box,
  Divider,
  Checkbox,
  Textarea
} from '@mantine/core';
import { 
  IconUser, 
  IconId,
  IconPhone,
  IconMail,
  IconMapPin,
  IconCheck,
  IconX,
  IconCash
} from '@tabler/icons-react';

export const customerSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  dni: z.string().min(5, 'El DNI es obligatorio'),
  phone: z.string().min(8, 'El teléfono es obligatorio'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.enum(['active', 'overdue']),
  notes: z.string().optional(),
  receivesVisits: z.boolean().default(false),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<CustomerFormValues>;
  isEditing?: boolean;
}

export function CustomerForm({ onSubmit, onCancel, initialData, isEditing = false }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      status: initialData?.status ?? 'active',
      receivesVisits: initialData?.receivesVisits ?? true,
      name: initialData?.name ?? '',
      dni: initialData?.dni ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
      address: initialData?.address ?? '',
      notes: initialData?.notes ?? '',
    },
  });

  const statusValue = watch('status');
  const receivesVisits = watch('receivesVisits');

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
            <TextInput
              label="Nombre completo"
              placeholder="Ej. Juan Pérez García"
              {...register('name')}
              error={errors.name?.message}
              size="md"
              radius="md"
              withAsterisk
              leftSection={<IconUser size={18} />}
            />

            <Group grow>
              <TextInput
                label="DNI / Identificación"
                placeholder="Ej. 12345678-9"
                {...register('dni')}
                error={errors.dni?.message}
                size="md"
                radius="md"
                withAsterisk
                leftSection={<IconId size={18} />}
              />
              <TextInput
                label="Teléfono"
                placeholder="555-123-4567"
                {...register('phone')}
                error={errors.phone?.message}
                size="md"
                radius="md"
                withAsterisk
                leftSection={<IconPhone size={18} />}
              />
            </Group>

            <TextInput
              label="Email (opcional)"
              placeholder="correo@ejemplo.com"
              {...register('email')}
              error={errors.email?.message}
              size="md"
              radius="md"
              leftSection={<IconMail size={18} />}
            />
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Ubicación</Text>
          <Stack gap="md">
            <TextInput
              label="Dirección"
              placeholder="Calle, número, colonia, ciudad"
              {...register('address')}
              error={errors.address?.message}
              size="md"
              radius="md"
              leftSection={<IconMapPin size={18} />}
            />
            <Checkbox
              label="Recibe visitas en domicilio"
              checked={receivesVisits}
              onChange={(e) => setValue('receivesVisits', e.currentTarget.checked)}
              size="md"
            />
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Estado y Notas</Text>
          <Stack gap="md">
            <Select
              label="Estado del cliente"
              placeholder="Seleccione un estado"
              data={[
                { value: 'active', label: 'Al día' },
                { value: 'overdue', label: 'En mora' },
              ]}
              value={statusValue}
              onChange={(val) => setValue('status', val as 'active' | 'overdue')}
              error={errors.status?.message}
              size="md"
              radius="md"
              withAsterisk
              leftSection={statusValue === 'active' ? <IconCash size={18} color="#40c057" /> : <IconCash size={18} color="#fa5252" />}
            />

            <Textarea
              label="Notas adicionales"
              placeholder="Información relevante sobre el cliente..."
              {...register('notes')}
              error={errors.notes?.message}
              size="md"
              radius="md"
              minRows={3}
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
