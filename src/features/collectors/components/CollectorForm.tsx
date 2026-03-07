import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  TextInput, 
  Button, 
  Stack, 
  Select, 
  NumberInput,
  Group
} from '@mantine/core';

export const collectorSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  route: z.string().min(2, 'La ruta es obligatoria'),
  efficiency: z.number().min(0).max(100, 'La eficiencia debe estar entre 0 y 100'),
  status: z.enum(['active', 'inactive']),
});

type CollectorFormValues = z.infer<typeof collectorSchema>;

interface CollectorFormProps {
  onSubmit: (values: CollectorFormValues) => void;
  onCancel: () => void;
}

export function CollectorForm({ onSubmit, onCancel }: CollectorFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CollectorFormValues>({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      efficiency: 0,
      status: 'active',
    },
  });

  const statusValue = watch('status');
  const efficiencyValue = watch('efficiency');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nombre completo"
          placeholder="Ej. Juan Pérez"
          {...register('name')}
          error={errors.name?.message}
          size="md"
          withAsterisk
        />

        <TextInput
          label="Ruta asignada"
          placeholder="Ej. Zona Norte"
          {...register('route')}
          error={errors.route?.message}
          size="md"
          withAsterisk
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
          withAsterisk
        />

        <Select
          label="Estado"
          placeholder="Seleccione un estado"
          data={[
            { value: 'active', label: 'Activo' },
            { value: 'inactive', label: 'Inactivo' },
          ]}
          value={statusValue}
          onChange={(val) => setValue('status', val as 'active' | 'inactive')}
          error={errors.status?.message}
          size="md"
          withAsterisk
          allowDeselect={false}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={onCancel} size="md" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" size="md" loading={isSubmitting}>
            Guardar Cobrador
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
