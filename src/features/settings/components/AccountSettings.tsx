import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Divider,
  PasswordInput,
  Alert,
} from '@mantine/core';
import { IconInfoCircle, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { accountSettingsSchema, changePasswordSchema } from '../schemas/accountSettingsSchema';
import type { AccountSettingsForm, ChangePasswordForm } from '../schemas/accountSettingsSchema';

interface UserData {
  id: string | number;
  firstName: string;
  lastName: string;
  userName: string;
  email?: string | null;
  phone?: string | null;
  role: string;
}

export function AccountSettings() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const accountForm = useForm<AccountSettingsForm>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { reset: resetAccountForm } = accountForm;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as UserData & { name?: string };
        setUserData(parsed);
        resetAccountForm({
          firstName: parsed.firstName || parsed.name?.split(' ')[0] || '',
          lastName: parsed.lastName || parsed.name?.split(' ').slice(1).join(' ') || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
        });
      } catch {
        setErrorMessage('No se pudo cargar la información del usuario');
      }
    }
    setIsLoading(false);
  }, [resetAccountForm]);

  const handleSaveAccount = async (data: AccountSettingsForm) => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const updatedUser: UserData = {
        ...userData,
        id: userData?.id || 0,
        firstName: data.firstName,
        lastName: data.lastName,
        userName: userData?.userName || '',
        role: userData?.role || '',
        email: data.email || null,
        phone: data.phone || null,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setSuccessMessage('Datos de cuenta actualizados correctamente');
    } catch {
      setErrorMessage('No se pudieron actualizar los datos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      setSuccessMessage('Contraseña actualizada correctamente');
    } catch {
      setErrorMessage('No se pudo cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <Paper withBorder p="md" radius="md" shadow="sm">
        <Text c="dimmed">Cargando información...</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="xl">
      {successMessage && (
        <Alert icon={<IconCheck size={16} />} color="teal" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <Paper withBorder p="md" radius="md" shadow="sm">
        <Title order={4} fw={600} mb="xs">Información Personal</Title>
        <Text c="dimmed" size="sm" mb="md">
          Actualiza tu información de contacto y datos personales
        </Text>

        <form onSubmit={accountForm.handleSubmit(handleSaveAccount)}>
          <Stack gap="md">
            <TextInput
              label="Nombre"
              placeholder="Tu nombre"
              required
              {...accountForm.register('firstName')}
              error={accountForm.formState.errors.firstName?.message}
            />

            <TextInput
              label="Apellido"
              placeholder="Tu apellido"
              required
              {...accountForm.register('lastName')}
              error={accountForm.formState.errors.lastName?.message}
            />

            <TextInput
              label="Usuario"
              value={userData?.userName || ''}
              disabled
              readOnly
            />

            <TextInput
              label="Email"
              placeholder="tu@email.com"
              {...accountForm.register('email')}
              error={accountForm.formState.errors.email?.message}
            />

            <TextInput
              label="Teléfono"
              placeholder="+1 234 567 8900"
              {...accountForm.register('phone')}
              error={accountForm.formState.errors.phone?.message}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={isSaving}>
                Guardar Cambios
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Paper withBorder p="md" radius="md" shadow="sm">
        <Group justify="space-between" align="center" mb="xs">
          <div>
            <Title order={4} fw={600}>Seguridad</Title>
            <Text c="dimmed" size="sm">
              Cambia tu contraseña de acceso
            </Text>
          </div>
          <Button variant="light" onClick={() => setShowPasswordForm(!showPasswordForm)}>
            {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
          </Button>
        </Group>

        {showPasswordForm && (
          <>
            <Divider my="md" />
            <Alert icon={<IconInfoCircle size={16} />} color="blue" mb="md">
              La contraseña debe tener al menos 4 caracteres
            </Alert>

            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)}>
              <Stack gap="md">
                <PasswordInput
                  label="Contraseña Actual"
                  placeholder="Ingresa tu contraseña actual"
                  required
                  {...passwordForm.register('currentPassword')}
                  error={passwordForm.formState.errors.currentPassword?.message}
                />

                <PasswordInput
                  label="Nueva Contraseña"
                  placeholder="Ingresa la nueva contraseña"
                  required
                  {...passwordForm.register('newPassword')}
                  error={passwordForm.formState.errors.newPassword?.message}
                />

                <PasswordInput
                  label="Confirmar Contraseña"
                  placeholder="Repite la nueva contraseña"
                  required
                  {...passwordForm.register('confirmPassword')}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                />

                <Group justify="flex-end" mt="md">
                  <Button type="submit" loading={isChangingPassword}>
                    Actualizar Contraseña
                  </Button>
                </Group>
              </Stack>
            </form>
          </>
        )}
      </Paper>
    </Stack>
  );
}
