import { useState } from 'react';
import { Group, ActionIcon, useMantineColorScheme, useComputedColorScheme, UnstyledButton } from '@mantine/core';
import {
  IconFingerprint,
  IconLogout,
  IconUsers,
  IconLayoutDashboard,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useLogout } from '@/features/auth/hooks/useAuth';
import classes from './AppNavbar.module.css';

const data = [
  { link: '/', label: 'Dashboard', icon: IconLayoutDashboard },
  { link: '/customers', label: 'Clientes', icon: IconUsers },
  { link: '/cobradores', label: 'Cobradores', icon: IconFingerprint },
];

export function AppNavbar() {
  const [active, setActive] = useState('Dashboard');
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const logout = useLogout();

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Sistema Cobros</h2>
          <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="lg"
            aria-label="Toggle color scheme"
          >
            {computedColorScheme === 'light' ? (
              <IconMoon stroke={1.5} />
            ) : (
              <IconSun stroke={1.5} />
            )}
          </ActionIcon>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <UnstyledButton className={classes.link} onClick={() => logout()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Cerrar Sesión</span>
        </UnstyledButton>
      </div>
    </nav>
  );
}
