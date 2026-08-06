import { useMemo, type ComponentType } from 'react';
import { Group, ActionIcon, useMantineColorScheme, useComputedColorScheme, UnstyledButton, Tooltip } from '@mantine/core';
import {
  IconBuilding,
  IconCoin,
  IconSettings,
  IconLogout,
  IconSun,
  IconMoon,
  IconShieldCheck,
} from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useLogout } from '@/features/auth/hooks/useAuth';
import classes from './SuperAdminNavbar.module.css';

type IconProps = { className?: string; stroke?: number; size?: number; color?: string };

type EnabledNavItem = {
  link: '/superadmin';
  label: string;
  icon: ComponentType<IconProps>;
  enabled: true;
};

type DisabledNavItem = {
  label: string;
  icon: ComponentType<IconProps>;
  enabled: false;
};

type NavItem = EnabledNavItem | DisabledNavItem;

const data: NavItem[] = [
  { link: '/superadmin', label: 'Empresas', icon: IconBuilding, enabled: true },
  { label: 'Monedas', icon: IconCoin, enabled: false },
  { label: 'Configuración Global', icon: IconSettings, enabled: false },
];

export function SuperAdminNavbar() {
  const { pathname } = useLocation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const logout = useLogout();

  const activeLabel = useMemo(() => {
    const found = data.find((item): item is EnabledNavItem => item.enabled && item.link === pathname);
    return found ? found.label : 'Empresas';
  }, [pathname]);

  const links = data.map((item) => {
    if (!item.enabled) {
      return (
        <Tooltip key={item.label} label="Disponible próximamente" position="right" withArrow>
          <div className={classes.linkDisabled}>
            <span className={classes.linkInner}>
              <item.icon className={classes.linkIcon} stroke={1.5} />
              <span>{item.label}</span>
            </span>
            <span className={classes.comingSoon}>Pronto</span>
          </div>
        </Tooltip>
      );
    }

    return (
      <Link
        className={classes.link}
        data-active={item.label === activeLabel || undefined}
        to={item.link}
        key={item.label}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between" wrap="nowrap">
          <h2 className={classes.headerTitle}>
            <IconShieldCheck size={22} stroke={1.6} color="var(--mantine-color-grape-6)" />
            Administración
          </h2>
          <span className={classes.headerBadge}>Admin</span>
        </Group>

        <p className={classes.sectionLabel}>Gestión del sistema</p>
        {links}
      </div>

      <div className={classes.footer}>
        <Group justify="space-between" align="center">
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
          <UnstyledButton className={classes.link} onClick={() => logout()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Cerrar Sesión</span>
          </UnstyledButton>
        </Group>
      </div>
    </nav>
  );
}
