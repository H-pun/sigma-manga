"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SortableButton } from "@/components/ui/data-table";

import moment from "moment";
import { Loader2, MoreHorizontal } from "lucide-react";
import { addGenre, deleteGenre, updateGenre } from "@/lib/data";

import type { Genre } from "@/types/genre";

export const columns: ColumnDef<Genre>[] = [
  {
    header: "No",
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        .flatRows.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableButton column={column} title="Name" />,
    enableHiding: false,
  },
  {
    accessorKey: "mangaCount",
    header: ({ column }) => <SortableButton column={column} title="Manga Count" />,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableButton column={column} title="Created At" />
    ),
    cell: ({ row }) => moment(row.original.createdAt).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <SortableButton column={column} title="Updated At" />
    ),
    cell: ({ row }) => moment(row.original.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell data={row.original} />,
  },
];

const ActionCell = ({ data }: { data: Genre }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(data.id)}
          >
            Copy data ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsUpdateOpen(true)}>
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SaveDialog
        isOpen={isUpdateOpen}
        setIsOpen={setIsUpdateOpen}
        data={data}
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        data={data}
      />
    </>
  );
};

export interface GenreDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data?: {
    id: string;
    name: string;
  };
}

export const SaveDialog = ({ isOpen, setIsOpen, data }: GenreDialogProps) => {
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
  }, [isOpen, data]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "Update" : "Add"} Genre</DialogTitle>
          <DialogDescription>
            Enter the name for the genre. Click save when you&apos;re done.
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

export const DeleteDialog = ({ isOpen, setIsOpen, data }: GenreDialogProps) => {
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
