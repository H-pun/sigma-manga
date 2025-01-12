"use client";

import { fetchGenres } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  // const data = fetchGenres("");
  // const debouncedSearch = useMemo(
  //   () =>
  //     debounce(async (searchQuery: string) => {
  //       if (!searchQuery) return;
  //       await fetchGenres(searchQuery);
  //     }, 500),
  //   [],
  // );

  // const handleSearch = async (value: string) => {
  //   setQuery(value);
  //   debouncedSearch(value);
  // }

  const { data } = useQuery({
    queryKey: ["genre"],
    queryFn: () => fetchGenres(""),
  });

  return (
    <div className="container p-4">
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
