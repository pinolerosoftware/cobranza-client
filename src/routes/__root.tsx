import { createRootRoute, Outlet, useLocation, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppNavbar } from '@/components/layout/AppNavbar'
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
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <Box component="main" style={{ minHeight: '100vh', backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))' }}>
        <Outlet />
        <TanStackRouterDevtools />
      </Box>
    );
  }

  return (
    <Box style={{ display: 'flex' }}>
      <AppNavbar />
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
