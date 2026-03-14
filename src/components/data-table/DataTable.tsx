import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useMantineColorScheme } from '@mantine/core';
import { 
  Table, 
  Paper, 
  ScrollArea, 
  TextInput, 
  Group, 
  Text, 
  ActionIcon, 
  Stack,
  Pagination,
  Select,
  Box,
  Badge,
  Tooltip
} from '@mantine/core';
import { 
  IconSearch, 
  IconSortAscending, 
  IconSortDescending, 
  IconArrowsSort,
  IconEye,
  IconPencil,
  IconTrash,
  IconSelector
} from '@tabler/icons-react';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchPlaceholder?: string;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onView?: (row: TData) => void;
}

export function DataTable<TData extends { id?: string }>({ 
  columns, 
  data, 
  searchPlaceholder = "Buscar...",
  onEdit,
  onDelete,
  onView
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const actionColumn: ColumnDef<TData> = {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <Group gap="xs" wrap="nowrap">
        {onView && (
          <Tooltip label="Ver detalles">
            <ActionIcon 
              variant="subtle" 
              color="blue" 
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onView(row.original);
              }}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip label="Editar">
            <ActionIcon 
              variant="subtle" 
              color="orange" 
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.original);
              }}
            >
              <IconPencil size={18} />
            </ActionIcon>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip label="Eliminar">
            <ActionIcon 
              variant="subtle" 
              color="red" 
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original);
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    ),
    enableSorting: false,
  };

  const hasActions = !!(onEdit || onDelete || onView);
  const tableColumns = hasActions ? [...columns, actionColumn] : columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-end">
        <Group gap="md">
          <TextInput
            placeholder={searchPlaceholder}
            leftSection={<IconSearch size={18} stroke={1.5} />}
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.currentTarget.value)}
            size="md"
            radius="md"
            style={{ flex: 1, maxWidth: 400 }}
          />
          <Badge variant="light" color="gray" size="lg">
            {table.getFilteredRowModel().rows.length} registros
          </Badge>
        </Group>
      </Group>

      <Paper withBorder radius="md" shadow="sm" style={{ overflow: 'hidden' }}>
        <ScrollArea>
          <Table 
            verticalSpacing="md" 
            horizontalSpacing="md" 
            highlightOnHover
            fz="sm"
            style={{ minWidth: table.getTotalSize() }}
          >
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr 
                  key={headerGroup.id} 
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--mantine-color-gray-0)'
                  }}
                >
                  {headerGroup.headers.map((header) => (
                    <Table.Th 
                      key={header.id}
                      style={{ 
                        cursor: header.column.getCanSort() ? 'pointer' : 'default', 
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        color: 'var(--mantine-color-gray-7)'
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Group gap="xs" wrap="nowrap">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <Box component="span">
                            {{
                              asc: <IconSortAscending size={16} stroke={1.5} />,
                              desc: <IconSortDescending size={16} stroke={1.5} />,
                            }[header.column.getIsSorted() as string] ?? <IconSelector size={16} stroke={1.5} style={{ opacity: 0.3 }} />}
                          </Box>
                        )}
                      </Group>
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <Table.Tr 
                    key={row.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 
                        ? 'transparent' 
                        : isDark 
                          ? 'rgba(255, 255, 255, 0.03)' 
                          : 'rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={tableColumns.length} style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Stack align="center" gap="xs">
                      <Text c="dimmed" size="lg">No se encontraron resultados</Text>
                      <Text c="dimmed" size="sm">Intenta con otros criterios de búsqueda</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Text size="sm" c="dimmed">Mostrar</Text>
          <Select
            size="sm"
            w={80}
            data={['5', '10', '20', '50']}
            value={table.getState().pagination.pageSize.toString()}
            onChange={(value) => table.setPageSize(Number(value))}
            allowDeselect={false}
            radius="md"
          />
          <Text size="sm" c="dimmed">por página</Text>
        </Group>

        <Group gap="sm">
          <Text size="sm" c="dimmed">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </Text>
          <Pagination
            total={table.getPageCount()}
            value={table.getState().pagination.pageIndex + 1}
            onChange={(page) => table.setPageIndex(page - 1)}
            size="sm"
            radius="md"
            withEdges
            siblings={1}
            boundaries={1}
          />
        </Group>
      </Group>
    </Stack>
  );
}
