"use client";

import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

import { ChevronDown, Loader2, Plus } from "lucide-react";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addGenre, deleteGenre, fetchGenres, updateGenre } from "@/lib/data";
import { columns } from "./columns";

export default function Page() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data, isPending } = useQuery({
    queryKey: ["genre"],
    queryFn: () => fetchGenres(""),
  });

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return (
    <div className="container p-4">
      <div className="flex items-center py-4 gap-3">
        <Input
          placeholder="Filter genre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <span>Add</span>
          <Plus />
        </Button>
        <SaveDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <DataTable columns={columns} table={table} loading={isPending} />
      <DataTablePagination table={table} />
    </div>
  );
}

interface GlobalDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data?: {
    id: string;
    name: string;
  };
}

export const SaveDialog = ({ isOpen, setIsOpen, data }: GlobalDialogProps) => {
  const [name, setName] = useState<string>("");

  const queryClient = useQueryClient();

  interface BaseGenre {
    id: string;
    name: string;
  }

  const { mutate: mutateAdd, isPending: isPendingAdd } = useMutation({
    mutationFn: (name: string) => addGenre(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genre"] });
      setIsOpen(false);
    },
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, name }: BaseGenre) => updateGenre(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genre"] });
      setIsOpen(false);
    },
  });

  useEffect(() => {
    setName(data?.name || "");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "Update" : "Add"} Genre</DialogTitle>
          <DialogDescription>
            Enter the name for the genre. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="col-span-3"
              disabled={isPendingAdd || isPendingUpdate}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isPendingAdd || isPendingUpdate}
            onClick={() =>
              data
                ? mutateUpdate({
                    id: data.id,
                    name,
                  })
                : mutateAdd(name)
            }
          >
            {(isPendingAdd || isPendingUpdate) && (
              <Loader2 className="animate-spin" />
            )}
            <span>Save changes</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteDialog = ({
  isOpen,
  setIsOpen,
  data,
}: GlobalDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genre"] });
      setIsOpen(false);
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {data!.name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this genre?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            type="submit"
            disabled={isPending}
            onClick={() => mutate(data!.id)}
          >
            {isPending && <Loader2 className="animate-spin" />}
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
