import { useEffect } from 'react';
import { createRootRoute, Outlet, useLocation, redirect, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { SuperAdminNavbar } from '@/components/layout/SuperAdminNavbar'
import { Box } from '@mantine/core'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem('token');
    const isLoginPage = location.pathname === '/login';

    if (!token && !isLoginPage) {
      throw redirect({ to: '/login' });
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login';
  const isSuperAdminArea = location.pathname.startsWith('/superadmin');

  useEffect(() => {
    const handleAuthExpired = () => {
      navigate({ to: '/login', replace: true });
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [navigate]);

  if (isLoginPage) {
    return (
      <Box component="main" style={{ minHeight: '100vh', backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))' }}>
        <Outlet />
        <TanStackRouterDevtools />
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex', alignItems: 'stretch' }}>
      {isSuperAdminArea ? <SuperAdminNavbar /> : <AppNavbar />}
      <Box component="main" style={{
        flex: 1,
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
      }}>
        <Outlet />
      </Box>
      <TanStackRouterDevtools />
    </Box>
  )
}
