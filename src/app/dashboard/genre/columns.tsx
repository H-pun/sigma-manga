"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Genre } from "@/types/genre";
import { SortableButton } from "@/components/ui/data-table";
import { useState } from "react";
import { DeleteDialog, SaveDialog } from "./page";

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
