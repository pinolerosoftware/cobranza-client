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
  Select
} from '@mantine/core';
import { 
  IconSearch, 
  IconSortAscending, 
  IconSortDescending, 
  IconArrowsSort 
} from '@tabler/icons-react';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchPlaceholder?: string;
}

export function DataTable<TData>({ 
  columns, 
  data, 
  searchPlaceholder = "Buscar..." 
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
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
        <TextInput
          placeholder={searchPlaceholder}
          leftSection={<IconSearch size={18} stroke={1.5} />}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.currentTarget.value)}
          size="md"
          style={{ flex: 1, maxWidth: 400 }}
        />
        <Text size="sm" c="dimmed" mb={5}>
          Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} resultados
        </Text>
      </Group>

      <Paper withBorder radius="md" p="0" style={{ overflow: 'hidden' }}>
        <ScrollArea>
          <Table 
            verticalSpacing="md" 
            horizontalSpacing="md" 
            highlightOnHover
            fz="sm"
          >
            <Table.Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.Th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <Group 
                          gap="xs" 
                          style={{ 
                            cursor: header.column.getCanSort() ? 'pointer' : 'default', 
                            userSelect: 'none' 
                          }} 
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span style={{ fontWeight: 600 }}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getCanSort() && (
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              {{
                                asc: <IconSortAscending size={16} stroke={1.5} />,
                                desc: <IconSortDescending size={16} stroke={1.5} />,
                              }[header.column.getIsSorted() as string] ?? <IconArrowsSort size={16} stroke={1.5} />}
                            </ActionIcon>
                          )}
                        </Group>
                      )}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>
            <Table.Tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={columns.length} style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Text c="dimmed" size="sm">No se encontraron resultados para su búsqueda</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Text size="sm">Mostrar</Text>
          <Select
            size="md"
            w={100}
            data={['5', '10', '20', '50']}
            value={table.getState().pagination.pageSize.toString()}
            onChange={(value) => table.setPageSize(Number(value))}
            allowDeselect={false}
          />
          <Text size="sm">por página</Text>
        </Group>

        <Pagination
          total={table.getPageCount()}
          value={table.getState().pagination.pageIndex + 1}
          onChange={(page) => table.setPageIndex(page - 1)}
          size="md"
          radius="md"
          withEdges
        />
      </Group>
    </Stack>
  );
}
