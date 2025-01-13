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

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addManga, deleteManga, fetchMangas, updateManga } from "@/lib/data";
import { columns } from "./columns";
import { Label } from "@/components/ui/label";

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
    title: string;
    synopsis: string;
    releaseDate: string;
    coverUrl: string;
  };
}

export const SaveDialog = ({ isOpen, setIsOpen, data }: GlobalDialogProps) => {
  const [title, setTitle] = useState<string>("");
  const [synopsis, setSynopsis] = useState<string>("");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");

  const queryClient = useQueryClient();
  interface BaseManga {
    id?: string;
    title: string;
    synopsis: string;
    releaseDate: string;
    coverUrl: string;
  }

  const { mutate: mutateAdd, isPending: isPendingAdd } = useMutation({
    mutationFn: ({ title, synopsis, releaseDate, coverUrl }: BaseManga) =>
      addManga(title, synopsis, releaseDate, coverUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
      setIsOpen(false);
    },
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ id, title, synopsis, releaseDate, coverUrl }: BaseManga) =>
      updateManga(id!, title, synopsis, releaseDate, coverUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
      setIsOpen(false);
    },
  });

  useEffect(() => {
    setTitle(data?.title || "");
    setSynopsis(data?.synopsis || "");
    setReleaseDate(data?.releaseDate || "");
    setCoverUrl(data?.coverUrl || "");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "Update" : "Add"} Manga</DialogTitle>
          <DialogDescription>
            Enter the detail for the manga. Click save when you're done.
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
              disabled={isPendingAdd || isPendingUpdate}
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
              disabled={isPendingAdd || isPendingUpdate}
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
              disabled={isPendingAdd || isPendingUpdate}
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
                    title,
                    synopsis,
                    releaseDate,
                    coverUrl,
                  })
                : mutateAdd({ title, synopsis, releaseDate, coverUrl })
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

interface DeleteDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: {
    id: string;
    title: string;
    synopsis: string;
    releaseDate: string;
    coverUrl: string;
  };
}

export const DeleteDialog = ({
  isOpen,
  setIsOpen,
  data,
}: DeleteDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteManga(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manga"] });
      setIsOpen(false);
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {data.title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this manga?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            type="submit"
            disabled={isPending}
            onClick={() => mutate(data.id)}
          >
            {isPending && <Loader2 className="animate-spin" />}
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
