"use client";

import Image from "next/image";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Link from "next/link";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Manga } from "@/types/manga";
import { fetchMangaPagination } from "@/lib/data";
import { ChevronLeft, ChevronRight, Github } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SearchParam } from "@/types/pagination";
import { useMemo, useState } from "react";
import { debounce } from "lodash";

export default function Home() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>("");

  const { data, isFetching } = useQuery({
    queryKey: ["mangaPagination"],
    queryFn: () => fetchMangaPagination(1, 10, ""),
  });

  const { mutate, isPending: isPendingPagination } = useMutation({
    mutationFn: ({ page, size, search }: SearchParam) =>
      fetchMangaPagination(page, size, search),
    onSuccess: (data) => {
      queryClient.setQueryData(["mangaPagination"], () => data);
    },
  });

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery) return;
          mutate({
            page: 1,
            size: 10,
            search: searchQuery,
          });
      }, 500),
    [mutate]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex flex-col lg:max-w-[80%] mx-auto p-4">
      <div className="flex flex-row items-center justify-between py-4 gap-3">
        <Input
          type="text"
          placeholder="Search Title"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex flex-row items-center gap-4">
          <Link href={"/dashboard"}>
            <Button variant="default">Dashboard</Button>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/H-pun/sigma-manga"
          >
            <Button variant="outline" size="icon">
              <Github className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
      {search == "" && (
        <>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Read Now
              </h2>
              <p className="text-sm text-muted-foreground">
                Top picks for you. Updated daily.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            {isFetching ? (
              <Skeleton className="h-[330px] w-full rounded-xl" />
            ) : (
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {data?.data.map((manga) => (
                    <MangaArtwork
                      key={manga.title}
                      manga={manga}
                      className="w-[250px]"
                      aspectRatio="portrait"
                      stringLimit={30}
                      width={250}
                      height={330}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
        </>
      )}

      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Made for You</h2>
        <p className="text-sm text-muted-foreground">
          Your personal preference. Updated daily.
        </p>
      </div>
      <Separator className="my-4" />
      {isFetching || isPendingPagination ? (
        <Skeleton className="h-[170px] w-full rounded-xl" />
      ) : (
        <div className="flex flex-row flex-wrap w-full items-center justify-center gap-4">
          {data?.data.map((manga) => (
            <MangaArtwork
              key={manga.title}
              manga={manga}
              className="w-[170px] mx-auto"
              aspectRatio="square"
              width={170}
              height={170}
            />
          ))}
        </div>
      )}
      <Pagination className="my-4">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              className="gap-1 pl-2.5"
              onClick={() =>
                mutate({ page: data!.page - 1, size: 10, search: "" })
              }
              disabled={isPendingPagination || data?.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>{" "}
          </PaginationItem>
          <PaginationItem>
            <span className="mx-2">{data?.page}</span>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <span className="mx-2">{data?.pages}</span>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              className="gap-1 pr-2.5"
              onClick={() =>
                mutate({ page: data!.page + 1, size: 10, search: "" })
              }
              disabled={isPendingPagination || data?.page === data?.pages}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface MangaArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  manga: Manga;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  stringLimit?: number;
}

function MangaArtwork({
  manga,
  aspectRatio = "portrait",
  width,
  height,
  stringLimit = 15,
  className,
  ...props
}: MangaArtworkProps) {
  return (
    <Dialog>
      <DialogTrigger className="text-left">
        <div className={cn("space-y-3", className)} {...props}>
          <div className="overflow-hidden rounded-md">
            <Image
              src={manga.coverUrl}
              alt={manga.title}
              width={width}
              height={height}
              className={cn(
                "object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
              )}
            />
          </div>

          <div className="space-y-1 text-sm">
            <h3 className="font-medium leading-none">
              {manga.title.length > stringLimit
                ? `${manga.title.substring(0, stringLimit)}...`
                : manga.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {moment(manga.releaseDate).format("MMM DD, YYYY")}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <div className="flex flex-col gap-4 relative">
          <ScrollArea className="max-h-96">
            <div className="flex flex-row gap-5 p-4">
              <div className="overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={manga.coverUrl}
                  alt={manga.title}
                  width={150}
                  height={150}
                  className="object-cover aspect-[3/4]"
                />
              </div>
              <div className="flex flex-col justify-center w-fit">
                <h2 className="text-xl font-bold">{manga.title}</h2>
                <p className="text-sm text-gray-500">
                  Release Date:{" "}
                  {moment(manga.releaseDate).format("MMM DD, YYYY")}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {manga.genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="py-0">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <h4 className="text-center text-xl font-semibold tracking-tight">
              Synopsis
            </h4>
            <div className="whitespace-pre-wrap text-justify p-4">
              {manga.synopsis}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
