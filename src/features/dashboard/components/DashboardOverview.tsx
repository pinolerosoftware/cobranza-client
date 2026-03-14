import { 
  SimpleGrid, 
  Paper, 
  Text, 
  Group, 
  Title, 
  Box, 
  Stack,
  Badge,
  Avatar,
  Progress,
  Table,
  rem
} from '@mantine/core';
import { 
  IconUsers, 
  IconUserCheck, 
  IconCash, 
  IconReceipt,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconArrowDownRight
} from '@tabler/icons-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const dailyData = [
  { name: 'Lun', cobros: 4500, prestamos: 3200 },
  { name: 'Mar', cobros: 5200, prestamos: 2800 },
  { name: 'Mié', cobros: 4800, prestamos: 3500 },
  { name: 'Jue', cobros: 6100, prestamos: 4200 },
  { name: 'Vie', cobros: 5500, prestamos: 3800 },
  { name: 'Sáb', cobros: 6700, prestamos: 4500 },
  { name: 'Dom', cobros: 3200, prestamos: 2100 },
];

const weeklyData = [
  { name: 'Sem 1', cobros: 28000, prestamos: 22000 },
  { name: 'Sem 2', cobros: 32000, prestamos: 25000 },
  { name: 'Sem 3', cobros: 29500, prestamos: 28000 },
  { name: 'Sem 4', cobros: 35000, prestamos: 31000 },
];

const statusData = [
  { name: 'Al Día', value: 65, color: '#40c057' },
  { name: 'Atrasados', value: 25, color: '#fab005' },
  { name: 'Morosos', value: 10, color: '#fa5252' },
];

const recentActivity = [
  { id: 1, client: 'María González', action: 'Pago realizado', amount: '$1,500', time: 'Hace 5 min', type: 'success' },
  { id: 2, client: 'Juan Pérez', action: 'Nuevo préstamo', amount: '$5,000', time: 'Hace 15 min', type: 'info' },
  { id: 3, client: 'Ana López', action: 'Pago realizado', amount: '$800', time: 'Hace 32 min', type: 'success' },
  { id: 4, client: 'Carlos Ruiz', action: 'Pago vencido', amount: '$2,200', time: 'Hace 1 hora', type: 'warning' },
  { id: 5, client: 'Pedro Sánchez', action: 'Nuevo cliente', amount: '-', time: 'Hace 2 horas', type: 'info' },
];

const topCollectors = [
  { name: 'Roberto Díaz', collected: 18500, target: 20000, efficiency: 92 },
  { name: 'Laura Mendoza', collected: 16200, target: 18000, efficiency: 90 },
  { name: 'Miguel Torres', collected: 14800, target: 17000, efficiency: 87 },
  { name: 'Sofia Ramírez', collected: 12100, target: 15000, efficiency: 81 },
];

const stats = [
  { 
    label: 'Total Clientes', 
    value: '1,234', 
    icon: IconUsers, 
    color: 'blue',
    change: '+12%',
    trend: 'up'
  },
  { 
    label: 'Cobradores Activos', 
    value: '56', 
    icon: IconUserCheck, 
    color: 'teal',
    change: '+3%',
    trend: 'up'
  },
  { 
    label: 'Cobros del Día', 
    value: '$12,450', 
    icon: IconCash, 
    color: 'indigo',
    change: '+8%',
    trend: 'up'
  },
  { 
    label: 'Préstamos Activos', 
    value: '892', 
    icon: IconReceipt, 
    color: 'orange',
    change: '-2%',
    trend: 'down'
  },
];

const COLORS = ['#40c057', '#fab005', '#fa5252'];

export const DashboardOverview = () => {
  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        {stats.map((stat) => (
          <Paper withBorder p="md" radius="md" key={stat.label} shadow="sm">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                  {stat.label}
                </Text>
                <Text fw={700} size="xl" mt={4}>
                  {stat.value}
                </Text>
                <Group gap={4} mt={4}>
                  {stat.trend === 'up' ? (
                    <IconArrowUpRight size={16} color="#40c057" />
                  ) : (
                    <IconArrowDownRight size={16} color="#fa5252" />
                  )}
                  <Text size="xs" c={stat.trend === 'up' ? 'teal' : 'red'}>
                    {stat.change}
                  </Text>
                  <Text size="xs" c="dimmed">vs semana anterior</Text>
                </Group>
              </div>
              <Box
                p={10}
                style={{ 
                  borderRadius: 8, 
                  background: `var(--mantine-color-${stat.color}-0)` 
                }}
              >
                <stat.icon size={24} color={`var(--mantine-color-${stat.color}-6)`} />
              </Box>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }}>
        <Paper withBorder p="md" radius="md" shadow="sm">
          <Group justify="space-between" mb="md">
            <div>
              <Title order={4} fw={600}>Cobros Semanales</Title>
              <Text size="xs" c="dimmed">Últimas 4 semanas</Text>
            </div>
            <Group gap="xs">
              <Badge color="blue" variant="dot">Cobros</Badge>
              <Badge color="orange" variant="dot">Préstamos</Badge>
            </Group>
          </Group>
          <Box h={280}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                />
                <Bar dataKey="cobros" fill="#228be6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prestamos" fill="#fd7e14" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        <Paper withBorder p="md" radius="md" shadow="sm">
          <Group justify="space-between" mb="md">
            <div>
              <Title order={4} fw={600}>Tendencia Diaria</Title>
              <Text size="xs" c="dimmed">Cobros y préstamos por día</Text>
            </div>
          </Group>
          <Box h={280}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCobros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#228be6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#228be6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrestamos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fd7e14" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fd7e14" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                />
                <Area type="monotone" dataKey="cobros" stroke="#228be6" fillOpacity={1} fill="url(#colorCobros)" />
                <Area type="monotone" dataKey="prestamos" stroke="#fd7e14" fillOpacity={1} fill="url(#colorPrestamos)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 3 }}>
        <Paper withBorder p="md" radius="md" shadow="sm">
          <Title order={4} fw={600} mb="md">Estado de Cartera</Title>
          <Box h={200} mb="md">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Stack gap="xs">
            {statusData.map((item) => (
              <Group key={item.name} justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} style={{ borderRadius: 3, background: item.color }} />
                  <Text size="sm">{item.name}</Text>
                </Group>
                <Text size="sm" fw={600}>{item.value}%</Text>
              </Group>
            ))}
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md" shadow="sm" style={{ gridColumn: 'span 2' }}>
          <Title order={4} fw={600} mb="md">Top Cobradores</Title>
          <Table.ScrollContainer minWidth={500}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cobrador</Table.Th>
                  <Table.Th>Recaudado</Table.Th>
                  <Table.Th>Meta</Table.Th>
                  <Table.Th>Eficiencia</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {topCollectors.map((collector) => (
                  <Table.Tr key={collector.name}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size="sm" radius="xl" color="blue">
                          {collector.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Text size="sm" fw={500}>{collector.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>${collector.collected.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">${collector.target.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Progress 
                          value={collector.efficiency} 
                          size="sm" 
                          w={80} 
                          color={collector.efficiency >= 90 ? 'teal' : collector.efficiency >= 80 ? 'yellow' : 'red'}
                        />
                        <Text size="xs" fw={500}>{collector.efficiency}%</Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="md" radius="md" shadow="sm">
        <Group justify="space-between" mb="md">
          <Title order={4} fw={600}>Actividad Reciente</Title>
          <Text size="xs" c="blue" style={{ cursor: 'pointer' }}>Ver todas</Text>
        </Group>
        <Table.ScrollContainer minWidth={600}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Cliente</Table.Th>
                <Table.Th>Acción</Table.Th>
                <Table.Th>Monto</Table.Th>
                <Table.Th>Hora</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentActivity.map((activity) => (
                <Table.Tr key={activity.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size="sm" radius="xl" color="gray">
                        {activity.client.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Text size="sm">{activity.client}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      color={
                        activity.type === 'success' ? 'teal' : 
                        activity.type === 'warning' ? 'yellow' : 'blue'
                      } 
                      variant="light"
                      size="sm"
                    >
                      {activity.action}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{activity.amount}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{activity.time}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </Stack>
  );
};
