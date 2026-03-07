import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { Box } from '@mantine/core'

export const Route = createRootRoute({
  component: () => (
    <Box style={{ display: 'flex' }}>
      <AppNavbar />
      <Box component="main" style={{ flex: 1, padding: '20px', minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Outlet />
      </Box>
      <TanStackRouterDevtools />
    </Box>
  ),
})
