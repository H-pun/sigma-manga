import * as React from "react";

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/use-debounce";
import { Pagination, PaginationQuery } from "@/types/pagination";

interface UseDataTableProps<TData, TValue> {
  key: string;
  fetch: (params: PaginationQuery) => Promise<Pagination<TData> | null>;
  columns: ColumnDef<TData, TValue>[];
  hiddenColumns?: VisibilityState;
}

export function useDataTable<TData, TValue>({
  key,
  fetch,
  columns,
  hiddenColumns,
}: UseDataTableProps<TData, TValue>) {
  const [filter, setFilter] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
      ...hiddenColumns,
  });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [filter]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const debouncedFilter = useDebounce(filter, 500);
  const { data, isFetching } = useQuery({
    queryKey: [key, pagination, debouncedFilter],
    queryFn: () =>
      fetch({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        search: debouncedFilter,
      }),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
  const table = useReactTable({
    data: data?.data ?? [],
    rowCount: data?.total ?? 0,
    columns: memoizedColumns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
      columnVisibility,
      pagination,
    },
  });
  return {
    table,
    pagination,
    filter,
    setFilter,
    debouncedFilter,
    isFetching,
  };
}
