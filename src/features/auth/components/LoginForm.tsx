import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconAlertCircle } from '@tabler/icons-react';
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
    <Container size={420} my={40}>
      <Title ta="center" order={1} fw={900}>
        Bienvenido
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Ingresa tus credenciales para acceder al sistema
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack>
            {error && (
              <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" variant="light">
                Credenciales incorrectas o error en el servidor.
              </Alert>
            )}

            <TextInput
              label="Usuario"
              placeholder="Tu usuario"
              required
              {...form.register('username')}
              error={form.formState.errors.username?.message}
            />
            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              required
              {...form.register('password')}
              error={form.formState.errors.password?.message}
            />
            <Button type="submit" fullWidth mt="xl" loading={isPending}>
              Iniciar Sesión
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
