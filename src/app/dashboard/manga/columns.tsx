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

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SortableButton } from "@/components/ui/data-table";

import { Loader2, MoreHorizontal } from "lucide-react";
import { addManga, deleteManga, updateManga } from "@/lib/data";

import type { Manga } from "@/types/manga";

export const columns: ColumnDef<Manga>[] = [
  {
    header: "No",
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        .flatRows.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    enableHiding: false,
  },
  {
    accessorKey: "coverUrl",
    header: "Cover",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <Image
          src={data.coverUrl}
          alt={data.title}
          width={50}
          height={50}
          objectFit="cover"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <SortableButton column={column} title="Name" />,
    enableHiding: false,
  },
  {
    accessorKey: "synopsis",
    header: ({ column }) => <SortableButton column={column} title="Synopsis" />,
  },
  {
    accessorKey: "releaseDate",
    header: ({ column }) => (
      <SortableButton column={column} title="Release Date" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableButton column={column} title="Created At" />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <SortableButton column={column} title="Updated At" />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;
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
    },
  },
];

export interface MangaDialogProps {
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

export const SaveDialog = ({ isOpen, setIsOpen, data }: MangaDialogProps) => {
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

export const DeleteDialog = ({
  isOpen,
  setIsOpen,
  data,
}: MangaDialogProps) => {
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
          <DialogTitle>Delete {data!.title}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this manga?
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
