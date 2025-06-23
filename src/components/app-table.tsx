"use client";

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpDown,
  Calendar,
  ChevronFirst,
  ChevronLast,
  Download,
  Edit,
  ExternalLink,
  Filter,
  Link2,
  LayoutGrid,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  Table as TableIcon,
  Trash,
  X,
  UploadCloudIcon
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from "react-hook-form";
import { AppTableDialogForm } from './app-table-dialog';
import { PushStatusBadge } from './general/push-status-badge';
interface DataTableProps {
  iconEdit?: ReactNode;
  iconDelete?: ReactNode;
  data: any[];
  columns?: any[];
  onEditRecord?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRowClick?: (row: any) => void;
  onAddNewRecordNavigate?: (row: any) => void;
  onClick?: () => void;
  onClickAddNew?: () => void;
  onClickEdit?: (record: any) => void;
  onAddNewRecord?: (record: any) => void;
  onRefresh?: () => void;
  onSync?: () => void;
  customActions?: {
    label: string;
    icon: any;
    onClick: (row: any) => void;
  }[];
  enableRowSelection?: boolean;
  simpleView?: boolean;
  initialFilters?: Filter[];
  onFilterChange?: (filters: Filter[]) => void;
  onUseFields?: (columns: any[]) => any[];
  columnProps?: Record<string, any>;
}

interface Filter {
  column: string;
  value: string;
}

const PAGE_SIZE_OPTIONS = [15, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 15;

type ViewMode = 'table' | 'grid';

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const defaultColumns = [
  {
    id: 'push status id',
    header: 'Uploading Status',
    accessorKey: 'push_status_id',
    filterType: 'select',
    filterOptions: ['Unknown', 'Uploaded', 'For Upload'],
    sortable: true,
    align: 'center',
    cell: (value: any) => <PushStatusBadge push_status_id={value} size="md" />,
  },
];

export function AppTable({
  data,
  columns: providedColumns,
  onEditRecord,
  onDelete,
  onRowClick,
  onAddNewRecordNavigate,
  onClickAddNew,
  iconEdit,
  iconDelete,
  onClickEdit,
  onAddNewRecord,
  onRefresh,
  onSync,
  customActions,
  enableRowSelection = false,
  simpleView = false,
  initialFilters = [],
  onFilterChange,
  onUseFields,
  columnProps
}: DataTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const initialVisibility: VisibilityState = {};
    if (providedColumns) {
      providedColumns.forEach(col => {
        initialVisibility[col.id] = true;
      });
    } else if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        initialVisibility[key] = true;
      });
    }
    return initialVisibility;
  });

  const [globalFilter, setGlobalFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filter[]>(initialFilters);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [filterInputValue, setFilterInputValue] = useState('');
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null);
  const [rowToDelete, setRowToDelete] = useState<any>(null);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSynching, setIsSynching] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [isloading, setLoading] = useState(false)

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const updateUrl = useCallback((params: Record<string, string | null>) => {
    const queryString = createQueryString(params);
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  }, [router, pathname, createQueryString]);

  const removeSelectedRow = (rowId: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const newSelected = new Set(selectedRows);
    newSelected.delete(rowId);
    setSelectedRows(newSelected);
  };

  const columns = useMemo(() => {
    if (providedColumns) return providedColumns;
    if (data.length === 0) return [];

    const sampleRow = data[0];
    return Object.keys(sampleRow).map(key => ({
      id: key,
      header: key.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      accessorKey: key,
      dataType: typeof sampleRow[key] === 'number' ? 'number' : 'text',
      filterType: typeof sampleRow[key] === 'boolean' ? 'select' : 'text',
      filterOptions: typeof sampleRow[key] === 'boolean' ? ['true', 'false'] : undefined,
      sortable: true,
      filterable: true
    }));
  }, [data, providedColumns]);

  const formColumns = useMemo(() => {
    if (onUseFields) {
      return onUseFields(columns);
    }
    return columns;
  }, [columns, onUseFields]);

  useEffect(() => {
    setLoading(true)
    const loading = setTimeout(() => setLoading(false), 6500)
    if (data.length != 0) {
      setLoading(false)
      clearTimeout(loading)
    }
  }, [data.length])

  useEffect(() => {
    const search = searchParams?.get('search') || '';
    const sort = searchParams?.get('sort');
    const filters = searchParams?.get('filters');
    const currentPage = searchParams?.get('page');
    const size = searchParams?.get('pageSize');
    const visibility = searchParams?.get('columnVisibility');
    const view = searchParams?.get('view') as ViewMode;

    setGlobalFilter(search);
    if (sort) setSorting(JSON.parse(sort));
    if (filters) setActiveFilters(JSON.parse(filters))
    if (currentPage) setPage(parseInt(currentPage));
    if (size) setPageSize(parseInt(size));
    if (visibility) {
      try {
        const parsedVisibility = JSON.parse(visibility);
        setColumnVisibility(prev => ({
          ...prev,
          ...parsedVisibility
        }));
      } catch (error) {
        console.error('Error parsing column visibility:', error);
      }
    }
    if (view) setViewMode(view);
  }, [searchParams]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleSync = async () => {
    if (onSync) {
      setIsSynching(true);
      try {
        await onSync();
      } finally {
        setIsRefreshing(false);
      }
    }
  }

  const toggleRowSelection = (rowId: string, event?: React.MouseEvent) => {
    event?.stopPropagation();
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = (checked: boolean) => {
    if (checked) {
      const allIds = data.map(row => row.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleAddFilter = () => {
    if (selectedColumn) {
      const column = columns.find(col => col.id === selectedColumn);
      const value = column?.filterType === 'select' ? selectedValue : filterInputValue;

      if (value) {
        const newFilters = editingFilter
          ? activeFilters.map(f =>
            f.column === editingFilter.column ? { column: selectedColumn, value } : f
          )
          : [...activeFilters, { column: selectedColumn, value }];

        setActiveFilters(newFilters);

        if (onFilterChange) onFilterChange(newFilters)

        updateUrl({ filters: JSON.stringify(newFilters) });

        const tableColumn = table.getColumn(selectedColumn);
        if (tableColumn) {
          tableColumn.setFilterValue(value);
        }
        setShowFilterDialog(false);
        setSelectedColumn('');
        setSelectedValue('');
        setFilterInputValue('');
        setEditingFilter(null);
      }
    }
  };

  const handleRemoveFilter = (filter: Filter) => {
    const newFilters = activeFilters.filter(f => f.column !== filter.column);
    setActiveFilters(newFilters);
    updateUrl({ filters: JSON.stringify(newFilters) });
    const column = table.getColumn(filter.column);
    if (column) {
      column.setFilterValue('');
    }
  };

  const handleEditFilter = (filter: Filter) => {
    setEditingFilter(filter);
    setSelectedColumn(filter.column);
    const column = columns.find(col => col.id === filter.column);
    if (column?.filterType === 'select') {
      setSelectedValue(filter.value);
    } else {
      setFilterInputValue(filter.value);
    }
    setShowFilterDialog(true);
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setNewRecord(row);
    setShowAddDialog(true);
  };

  const handleDelete = (row: any) => {
    setRowToDelete(row);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (rowToDelete && onDelete) {
      onDelete(rowToDelete);
      setShowDeleteDialog(false);
      setRowToDelete(null);
    }
  };

  const handleSubmitNewRecord = (values: any) => {
    if (editingRow) {
      if (onEditRecord) {
        onEditRecord({ ...editingRow, ...values });
      }
      setEditingRow(null);
    } else if (onAddNewRecord) {
      onAddNewRecord(values);
    }
    setNewRecord({});
    setShowAddDialog(false);
  };

  const handleDownloadCSV = () => {
    const visibleColumns = columns.filter(col => columnVisibility[col.id] !== false);
    const headers = visibleColumns.map(col => col.header).join(',');
    const rows = data.map(row =>
      visibleColumns.map(col => {
        let value = row[col.accessorKey];

        // Remove ₱ and commas if the accessorKey contains "amount"
        if (col.accessorKey.toLowerCase().includes('amount')) {
          value = value?.toString().replace(/[₱,]/g, '').trim();
        }

        return `"${value}"`;
      }).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    const csvWithBOM = '\uFEFF' + csv; // Add BOM for Excel compatibility

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'table-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = () => {
    if (onDelete && selectedRows.size > 0) {
      const rowsToDelete = data.filter(row => selectedRows.has(row.id));
      rowsToDelete.forEach(row => onDelete(row));
      setSelectedRows(new Set());
    }
  };

  const tableColumns: ColumnDef<any>[] = [
    ...(enableRowSelection ? [{
      id: 'select',
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => toggleAllRows(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={selectedRows.has(row.original.id)}
          onCheckedChange={() => toggleRowSelection(row.original.id)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }] : []),
    ...columns.map((col) => ({
      id: col.id,
      accessorKey: col.accessorKey,
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newSorting = column.getIsSorted() === 'asc'
                ? [{ id: col.id, desc: true }]
                : [{ id: col.id, desc: false }];
              setSorting(newSorting);
              updateUrl({ sort: JSON.stringify(newSorting) });
            }}
            className="w-full flex items-center justify-between"
          >
            {col.header}
            {col.sortable && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      enableSorting: col.sortable,
      cell: ({ row }: any) => {
        const value = row.getValue(col.id);
        const alignClass = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
        return (
          <div className={cn(
            alignClass,
            "transition-opacity duration-200",
            isRefreshing && "opacity-50"
          )}>
            {col.cell ? col.cell(value) : col.cellRow ? col.cellRow(row.original) : value}
          </div>
        );
      },
    })),
    {
      id: 'actions',
      header: ({ column }: any) => {
        return (
          <>
          </>
        );
      },
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <div className={cn(
            "flex items-center gap-0.5 transition-opacity duration-200",
            isRefreshing && "opacity-50"
          )}>
            {(onEditRecord || onClickEdit) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onClickEdit) {
                          onClickEdit(rowData)
                        }
                        if (onEditRecord) {
                          handleEdit(rowData);
                        }
                      }}
                      disabled={isRefreshing}
                    >
                      {iconEdit ?? <Edit className="h-10 w-10" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{iconEdit ? "" : "Edit"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onDelete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(rowData);
                      }}
                      disabled={isRefreshing}
                    >
                      {iconDelete ?? <Trash className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{iconDelete ? "" : "Delete"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {customActions && customActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isRefreshing}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                  {customActions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(rowData);
                      }}
                    >
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (visibility) => {
      setColumnVisibility(visibility);
      updateUrl({ columnVisibility: JSON.stringify(Object.fromEntries(Object.entries(visibility).filter(([, value]) => value !== undefined))) });
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      {!simpleView && (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-2">
              <Input
                placeholder="Search..."
                value={globalFilter ?? ''}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  updateUrl({ search: e.target.value });
                }}
                className="max-w-sm"
                disabled={isRefreshing}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingFilter(null);
                        setSelectedColumn('');
                        setSelectedValue('');
                        setFilterInputValue('');
                        setShowFilterDialog(true);
                      }}
                      disabled={isRefreshing}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Filter</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDownloadCSV}
                      disabled={isRefreshing}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" disabled={isRefreshing}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Table Settings</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Table Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <TableIcon className="mr-2 h-4 w-4" />
                        View Mode
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setViewMode('table');
                            updateUrl({ view: 'table' });
                          }}
                        >
                          <TableIcon className="mr-2 h-4 w-4" />
                          Table View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setViewMode('grid');
                            updateUrl({ view: 'grid' });
                          }}
                        >
                          <LayoutGrid className="mr-2 h-4 w-4" />
                          Grid View
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                    Toggle Columns
                  </DropdownMenuLabel>
                  {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={columnVisibility[column.id] !== false}
                      onCheckedChange={(value) =>
                        table.getColumn(column.id)?.toggleVisibility(!!value)
                      }
                    >
                      {column.header}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {onRefresh && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh Data</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {onSync && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSync}
                        disabled={isRefreshing}
                      >
                        <UploadCloudIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload Data</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedRows.size > 0 && onDelete && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={isRefreshing}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Selected ({selectedRows.size})
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete Selected Records</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {(onAddNewRecord || onClickAddNew || onAddNewRecordNavigate) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          if (onClickAddNew) {
                            onClickAddNew()
                          }

                          if (onAddNewRecord) {
                            setEditingRow(null);
                            setNewRecord({});
                            setShowAddDialog(true);
                          }

                          if (onAddNewRecordNavigate) {
                            onAddNewRecordNavigate({});
                          }
                        }}
                        disabled={isRefreshing}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add New
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add New Record</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className='flex gap-2 justify-end'>
              <div className="flex gap-2 items-center flex-1">
                {activeFilters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={cn(
                      "cursor-pointer capitalize",
                      isRefreshing && "opacity-50"
                    )}
                    onClick={() => !isRefreshing && handleEditFilter(filter)}
                  >
                    {filter.column}: {filter.value}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        !isRefreshing && handleRemoveFilter(filter);
                      }}
                      disabled={isRefreshing}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}

              </div>
              <Badge variant="green">Found {table.getRowCount()} Record{table.getRowCount() > 1 ? "s" : ""}</Badge>
            </div>
          )}
        </>
      )}

      {viewMode === 'table' ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          `${simpleView ? 'bg-muted/50 font-bold text-primary' : 'bg-primary text-primary-foreground'}  h-12`,
                          "border-[0.5px] border-primary-foreground/10",
                          "@media (max-width: 768px) {",
                          header.id === headerGroup.headers[0].id || header.id === 'actions' ? 'sticky z-10' : '',
                          header.id === headerGroup.headers[0].id ? 'left-0' : header.id === 'actions' ? 'right-0' : '',
                          "}"
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        "hover:bg-muted/50 cursor-pointer",
                        selectedRows.has(row.original.id) && "bg-muted",
                        isRefreshing && "opacity-50"
                      )}
                      onClick={() => !isRefreshing && onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`  @apply border-b;   @media (max-width: 768px) {     ${cell.column.id === row.getVisibleCells()[0].column.id || cell.column.id === 'actions' ? 'sticky z-10 bg-background' : ''}     ${cell.column.id === row.getVisibleCells()[0].column.id ? 'left-0 border-r' : cell.column.id === 'actions' ? 'right-0 border-l' : ''}     ${cell.column.id === row.getVisibleCells()[0].column.id ? 'left-0' : cell.column.id === 'actions' ? 'right-0' : ''}   } `}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-24 text-center flex justify-center items-center gap-2"
                    >
                      <div className="left-0 right-0 absolute">
                        {isloading ? <div className='flex text-center justify-center items-center gap-2'><Loader2 className="animate-spin" /> <span>Loading...</span></div> : "No Record"}
                      </div>

                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
          isRefreshing && "opacity-50"
        )}>
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors duration-200",
                selectedRows.has(row.original.id) && "bg-muted"
              )}
              onClick={() => !isRefreshing && onRowClick?.(row.original)}
            >
              {enableRowSelection && (
                <div className="flex justify-end mb-2">
                  <Checkbox
                    checked={selectedRows.has(row.original.id)}
                    onCheckedChange={() => toggleRowSelection(row.original.id)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                  />
                </div>
              )}
              {row.getVisibleCells().map((cell) => (
                cell.column.id !== 'select' && cell.column.id !== 'actions' && (
                  <div key={cell.id} className="mb-3">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {columns.find(col => col.id === cell.column.id)?.header}
                    </div>
                    <div>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </div>
                )
              ))}
              <div className="mt-4 flex justify-end gap-1">
                {flexRender(
                  tableColumns[tableColumns.length - 1].cell,
                  { row } as any
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!simpleView && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Total {data.length} records
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                const newSize = parseInt(value);
                setPageSize(newSize);
                setPage(1);
                updateUrl({
                  pageSize: newSize.toString(),
                  page: '1'
                });
              }}
              disabled={isRefreshing}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} rows
                  </SelectItem>
                ))}
                <SelectItem value={data.length.toString()}>All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setPage(1);
                      updateUrl({ page: '1' });
                      table.setPageIndex(0);
                    }}
                    disabled={!table.getCanPreviousPage() || isRefreshing}
                  >
                    <ChevronFirst className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>First Page</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = page - 1;
                setPage(newPage);
                updateUrl({ page: newPage.toString() });
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage() || isRefreshing}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPage = page + 1;
                setPage(newPage);
                updateUrl({ page: newPage.toString() });
                // PersonProfileMasterlist({ page: newPage });
                table.nextPage();
              }}
              disabled={!table.getCanNextPage() || isRefreshing}
            >
              Next
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const lastPage = table.getPageCount() - 1;
                      setPage(lastPage + 1);
                      updateUrl({ page: (lastPage + 1).toString() });
                      table.setPageIndex(lastPage);
                    }}
                    disabled={!table.getCanNextPage() || isRefreshing}
                  >
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Last Page</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}

      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFilter ? 'Edit Filter' : 'Add Filter'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-1 py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Select
                value={selectedColumn}
                onValueChange={setSelectedColumn}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.filter(f => f.filterType !== null).map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedColumn && (
                columns.find(col => col.id === selectedColumn)?.filterType === 'select' ? (
                  <Select
                    value={selectedValue}
                    onValueChange={setSelectedValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns
                        .find(col => col.id === selectedColumn)
                        ?.filterOptions?.map((option: any) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={filterInputValue}
                    onChange={(e) => setFilterInputValue(e.target.value)}
                    placeholder="Enter search value"
                  />
                )
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFilter}>
              {editingFilter ? 'Update' : 'Add'} Filter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRow ? 'Edit Record' : 'Add New Record'}</DialogTitle>
          </DialogHeader>
          <AppTableDialogForm
            columns={formColumns}
            initialData={editingRow}
            onSubmit={handleSubmitNewRecord}
            onCancel={() => setShowAddDialog(false)}
            columnProps={columnProps}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
