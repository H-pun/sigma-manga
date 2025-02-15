"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";

import { Plus } from "lucide-react";

import { useState } from "react";

import { fetchMangas } from "@/lib/data";
import { columns, SaveDialog } from "./columns";
import { useDataTable } from "@/hooks/use-data-table";
import { ColumnVisibilityToggle } from "@/components/ui/column-visibility-toggle";

export default function Page() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { filter, setFilter, table, isFetching } = useDataTable({
    key: "mangas",
    fetch: fetchMangas,
    columns: columns
  });

  return (
    <div className="container p-4">
      <div className="flex items-center py-4 gap-3">
        <Input
          placeholder="Filter manga..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <ColumnVisibilityToggle table={table} />
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <span>Add</span>
          <Plus />
        </Button>
        <SaveDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <DataTable table={table} loading={isFetching} />
    </div>
  );
}
