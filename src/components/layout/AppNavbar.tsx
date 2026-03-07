import { useState } from 'react';
import { Group } from '@mantine/core';
import {
  IconFingerprint,
  IconLogout,
  IconUsers,
  IconLayoutDashboard,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import classes from './AppNavbar.module.css';

const data = [
  { link: '/', label: 'Dashboard', icon: IconLayoutDashboard },
  { link: '/clientes', label: 'Clientes', icon: IconUsers },
  { link: '/cobradores', label: 'Cobradores', icon: IconFingerprint },
  // Placeholder links based on Mantine example
  // { link: '/billing', label: 'Billing', icon: IconReceipt2 },
  // { link: '/security', label: 'Security', icon: IconFingerprint },
  // { link: '/settings', label: 'Settings', icon: IconSettings },
];

export function AppNavbar() {
  const [active, setActive] = useState('Dashboard');

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
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
