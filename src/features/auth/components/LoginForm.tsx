import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Group,
  Box,
  List,
  ThemeIcon,
  rem,
  Container,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  IconAlertCircle, 
  IconCheck, 
  IconShieldLock, 
  IconChartBar, 
  IconDeviceMobile,
  IconUsers
} from '@tabler/icons-react';
import { loginSchema } from '@/types/auth';
import type { LoginCredentials } from '@/types/auth';
import { useLogin } from '../hooks/useAuth';

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginCredentials) => {
    login(values);
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100%',
      backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
    }}>
      {/* Lateral informativo - Solo visible en pantallas medianas y grandes */}
      <Box
        visibleFrom="md"
        style={{
          flex: 1,
          position: 'relative',
          background: 'linear-gradient(135deg, var(--mantine-color-blue-9) 0%, var(--mantine-color-blue-5) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: rem(60),
          color: 'var(--mantine-color-white)',
        }}
      >
        <Stack gap="xl" maw={500}>
          <div>
            <Title order={1} fw={900} fz={rem(45)} style={{ lineHeight: 1.1 }}>
              Sistema de Gestión <br />
              <Text component="span" inherit c="blue.2" variant="text">
                de Cobranzas
              </Text>
            </Title>
            <Text mt="md" fz="lg" opacity={0.9}>
              Optimiza el control de tus rutas, clientes y préstamos en una sola plataforma segura y eficiente.
            </Text>
          </div>

          <List
            spacing="md"
            size="lg"
            center
            icon={
              <ThemeIcon color="blue.4" size={24} radius="xl">
                <IconCheck style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            }
          >
            <List.Item>Monitoreo de cobros en tiempo real</List.Item>
            <List.Item>Gestión avanzada de carteras de clientes</List.Item>
            <List.Item>Reportes detallados de rendimiento diario</List.Item>
            <List.Item>Acceso seguro para múltiples roles</List.Item>
          </List>

          <Group gap="lg" mt="xl">
            <Stack gap={0}>
              <Text fz="xs" tt="uppercase" fw={700} opacity={0.7}>Módulo</Text>
              <Group gap={5}>
                <IconShieldLock size={18} />
                <Text fw={500}>Seguridad</Text>
              </Group>
            </Stack>
            <Stack gap={0}>
              <Text fz="xs" tt="uppercase" fw={700} opacity={0.7}>Análisis</Text>
              <Group gap={5}>
                <IconChartBar size={18} />
                <Text fw={500}>Estadísticas</Text>
              </Group>
            </Stack>
          </Group>
        </Stack>

        <Text style={{ position: 'absolute', bottom: 20, left: 60 }} fz="xs" opacity={0.5}>
          © 2024 Sistema de Cobros - v1.0.0
        </Text>
      </Box>

      {/* Lado del Formulario */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: rem(20),
        }}
      >
        <Container size={420} w="100%">
          <Paper withBorder shadow="xl" p={40} radius="lg">
            <Stack align="center" mb="xl">
              <ThemeIcon size={60} radius="md" variant="light" color="blue">
                <IconUsers size={34} stroke={1.5} />
              </ThemeIcon>
              <div style={{ textAlign: 'center' }}>
                <Title ta="center" order={2} fw={800}>
                  ¡Bienvenido de nuevo!
                </Title>
                <Text c="dimmed" fz="sm">
                  Ingresa tus credenciales para continuar
                </Text>
              </div>
            </Stack>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Stack>
                {error && (
                  <Alert icon={<IconAlertCircle size="1rem" />} title="Error de acceso" color="red" variant="light">
                    Usuario o contraseña incorrectos. Por favor, verifica tus datos.
                  </Alert>
                )}

                <TextInput
                  label="Nombre de usuario"
                  placeholder="admin_cobros"
                  size="md"
                  required
                  {...form.register('username')}
                  error={form.formState.errors.username?.message}
                />
                
                <PasswordInput
                  label="Contraseña"
                  placeholder="Tu contraseña secreta"
                  size="md"
                  required
                  {...form.register('password')}
                  error={form.formState.errors.password?.message}
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  size="md" 
                  mt="xl" 
                  loading={isPending}
                  variant="filled"
                  color="blue"
                  radius="md"
                >
                  Acceder al Sistema
                </Button>

                <Text ta="center" fz="xs" c="dimmed" mt="sm">
                  Si has olvidado tu acceso, contacta al administrador del sistema.
                </Text>
              </Stack>
            </form>
          </Paper>

          {/* Información extra visible solo en móviles */}
          <Box hiddenFrom="md" mt="xl" ta="center">
            <Group justify="center" gap="xs">
              <IconDeviceMobile size={16} color="gray" />
              <Text fz="xs" c="dimmed">App optimizada para dispositivos móviles</Text>
            </Group>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
