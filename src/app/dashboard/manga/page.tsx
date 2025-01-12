"use client";

import { fetchMangas } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["manga"],
    queryFn: () => fetchMangas(""),
  });

  return (
    <div className="container p-4">
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
