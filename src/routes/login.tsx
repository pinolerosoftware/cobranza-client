import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ search }) => {
    const token = localStorage.getItem('token');
    if (token) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
      <LoginForm />
    </div>
  );
}
