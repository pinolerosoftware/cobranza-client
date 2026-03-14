import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  TextInput, 
  Button, 
  Stack, 
  Select, 
  NumberInput,
  Group,
  Text,
  Box,
  ThemeIcon,
  Divider,
  Progress
} from '@mantine/core';
import { 
  IconUser, 
  IconMapPin, 
  IconChartBar,
  IconCheck,
  IconX
} from '@tabler/icons-react';

export const collectorSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  route: z.string().min(2, 'La ruta es obligatoria'),
  efficiency: z.number().min(0).max(100, 'La eficiencia debe estar entre 0 y 100'),
  status: z.enum(['active', 'inactive']),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

type CollectorFormValues = z.infer<typeof collectorSchema>;

interface CollectorFormProps {
  onSubmit: (values: CollectorFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<CollectorFormValues>;
  isEditing?: boolean;
}

export function CollectorForm({ onSubmit, onCancel, initialData, isEditing = false }: CollectorFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CollectorFormValues>({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      efficiency: initialData?.efficiency ?? 0,
      status: initialData?.status ?? 'active',
      name: initialData?.name ?? '',
      route: initialData?.route ?? '',
      phone: initialData?.phone ?? '',
      email: initialData?.email ?? '',
    },
  });

  const statusValue = watch('status');
  const efficiencyValue = watch('efficiency') ?? 0;

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
                label="Teléfono"
                placeholder="555-123-4567"
                {...register('phone')}
                error={errors.phone?.message}
                size="md"
                radius="md"
              />
              <TextInput
                label="Email"
                placeholder="correo@ejemplo.com"
                {...register('email')}
                error={errors.email?.message}
                size="md"
                radius="md"
              />
            </Group>
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Asignación</Text>
          <Stack gap="md">
            <TextInput
              label="Ruta asignada"
              placeholder="Ej. Zona Norte"
              {...register('route')}
              error={errors.route?.message}
              size="md"
              radius="md"
              withAsterisk
              leftSection={<IconMapPin size={18} />}
            />

            <NumberInput
              label="Eficiencia inicial (%)"
              placeholder="0-100"
              value={efficiencyValue}
              onChange={(val) => setValue('efficiency', typeof val === 'number' ? val : 0)}
              error={errors.efficiency?.message}
              min={0}
              max={100}
              size="md"
              radius="md"
              withAsterisk
              leftSection={<IconChartBar size={18} />}
              suffix="%"
              hideControls
            />
            <Box>
              <Group justify="space-between" mb={4}>
                <Text size="xs" c="dimmed">Progreso</Text>
                <Text size="xs" fw={500}>{efficiencyValue}%</Text>
              </Group>
              <Progress 
                value={efficiencyValue} 
                size="sm" 
                radius="xl"
                color={efficiencyValue >= 90 ? 'teal' : efficiencyValue >= 70 ? 'blue' : 'orange'} 
              />
            </Box>
          </Stack>
        </Box>

        <Box>
          <Text fw={600} size="sm" mb="xs" c="dimmed" tt="uppercase">Estado</Text>
          <Select
            label="Estado del cobrador"
            placeholder="Seleccione un estado"
            data={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ]}
            value={statusValue}
            onChange={(val) => setValue('status', val as 'active' | 'inactive')}
            error={errors.status?.message}
            size="md"
            radius="md"
            withAsterisk
            allowDeselect={false}
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
