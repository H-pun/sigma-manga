"use client";

import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useQuery } from "@tanstack/react-query";

import Link from "next/link";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Manga } from "@/types/manga";
import { fetchMangas } from "@/lib/data";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["manga"],
    queryFn: () => fetchMangas(""),
    initialData: [],
  });

  return (
    <div className="flex flex-col lg:max-w-[75%] mx-auto p-4">
      <div className="flex flex-row items-center justify-between py-4 gap-3">
        <Input type="text" placeholder="Search Title" />
        <div className="flex flex-row items-center gap-4">
          <Link href={"/dashboard"}>
            <Button variant="default">Dashboard</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Read Now</h2>
          <p className="text-sm text-muted-foreground">
            Top picks for you. Updated daily.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {data.map((manga) => (
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
      </div>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Made for You</h2>
        <p className="text-sm text-muted-foreground">
          Your personal preference. Updated daily.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {data.map((manga) => (
              <MangaArtwork
                key={manga.title}
                manga={manga}
                className="w-[150px]"
                aspectRatio="square"
                width={150}
                height={150}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
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
  );
}
