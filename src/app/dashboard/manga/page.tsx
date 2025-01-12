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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

import { ChevronDown, Loader2, Plus } from "lucide-react";

import { ChangeEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addManga, fetchMangas } from "@/lib/data";
import { columns } from "./columns";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data, isPending } = useQuery({
    queryKey: ["manga"],
    queryFn: () => fetchMangas(""),
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
          placeholder="Filter manga..."
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
        <AddDialog />
      </div>
      <DataTable columns={columns} table={table} loading={isPending} />
      <DataTablePagination table={table} />
    </div>
  );
}

const AddDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");

  const queryClient = useQueryClient();
  interface BaseManga {
    title: string;
    synopsis: string;
    releaseDate: string;
    coverUrl: string;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, synopsis, releaseDate, coverUrl }: BaseManga) =>
      addManga(title, synopsis, releaseDate, coverUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
      setIsOpen(false);
    },
  });

  const handleSubmit = () => {
    mutate({ title, synopsis, releaseDate, coverUrl });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span>Add</span>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Manga</DialogTitle>
          <DialogDescription>
            Enter the detail for the new manga. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="synopsis" className="text-right">
              Synopsis
            </Label>
            <Input
              id="synopsis"
              value={synopsis}
              onChange={(event) => setSynopsis(event.target.value)}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="releaseDate" className="text-right">
              Release Date
            </Label>
            <Input
              id="releaseDate"
              value={releaseDate}
              onChange={(event) => setReleaseDate(event.target.value)}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coverUrl" className="text-right">
              Cover URL
            </Label>
            <Input
              id="coverUrl"
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              className="col-span-3"
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            onClick={() => handleSubmit()}
          >
            {isPending && <Loader2 className="animate-spin" />}
            <span>Save changes</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
