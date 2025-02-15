"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  // CardFooter,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { fetchGenres, fetchMangaCountByYear } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MangaCountByYear } from "@/types/manga";
import { Skeleton } from "@/components/ui/skeleton";

interface GenreChart {
  name: string;
  mangaCount: number;
  fill: string;
}

export default function Page() {
  const [chartDataGenre, setChartDataGenre] = useState<GenreChart[]>([]);
  const [chartConfigGenre, setChartConfigGenre] = useState<ChartConfig>({});
  const [chartDataMangaCount, setChartDataMangaCount] = useState<
    MangaCountByYear[]
  >([]);
  const [chartConfigMangaCount, setChartConfigMangaCount] =
    useState<ChartConfig>({});

  const { data: dataMangaCount, isFetching: isFetchingMangaCount } = useQuery({
    queryKey: ["mangaCountByYear"],
    queryFn: () => fetchMangaCountByYear(2015),
    initialData: [],
  });

  const { data: dataGenre, isFetching: isFetchingGenre } = useQuery({
    queryKey: ["genres"],
    queryFn: () => fetchGenres(),
  });

  useEffect(() => {
    if (!dataMangaCount) return;
    const transformedData = dataMangaCount.map((manga, index) => {
      return {
        mangaData: {
          year: manga.year,
          count: manga.count,
          fill: `hsl(${
            (index * (360 / dataMangaCount.length) + 30) % 360
          }, 70%, 60%)`,
        },
        configData: { [manga.year]: { label: manga.year } },
      };
    });

    setChartDataMangaCount(
      transformedData.map((item) => item.mangaData)
      // .filter((item) => item.mangaCount > 15)
    );

    setChartConfigMangaCount({
      count: {
        label: "Count",
      },
      ...transformedData.reduce(
        (acc, item) => ({ ...acc, ...item.configData }),
        {}
      ),
    });
  }, [dataMangaCount]);

  useEffect(() => {
    if (!dataGenre) return;
    const transformedData = dataGenre.data.map((genre, index) => {
      const key = genre.name.replace(/\s+/g, "").toLowerCase();
      return {
        genreData: {
          name: key,
          mangaCount: genre.mangaCount,
          fill: `hsl(${
            (index * (360 / dataGenre.data.length) + 30) % 360
          }, 70%, 60%)`,
        },
        configData: { [key]: { label: genre.name } },
      };
    });

    setChartDataGenre(
      transformedData
        .map((item) => item.genreData)
        .filter((item) => item.mangaCount > 15)
    );

    setChartConfigGenre({
      mangaCount: {
        label: "Manga Count",
      },
      ...transformedData.reduce(
        (acc, item) => ({ ...acc, ...item.configData }),
        {}
      ),
    });
  }, [dataGenre]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {isFetchingGenre ? (
          <Skeleton className="h-[330px] w-full rounded-xl" />
        ) : (
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Recharts - Genre</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 font-medium leading-none">
                  Most popular genre:{" "}
                  {dataGenre?.data.find(
                    (genre) =>
                      genre.mangaCount ===
                      Math.max(...dataGenre.data.map((g) => g.mangaCount))
                  )?.name || ""}
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ChartContainer
                config={chartConfigGenre}
                className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={chartDataGenre}
                    dataKey="mangaCount"
                    label
                    nameKey="name"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
        {isFetchingGenre ? (
          <Skeleton className="h-[330px] w-full rounded-xl" />
        ) : (
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Highchart - Genre</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 font-medium leading-none">
                  Most popular genre:{" "}
                  {dataGenre?.data.find(
                    (genre) =>
                      genre.mangaCount ===
                      Math.max(...dataGenre.data.map((g) => g.mangaCount))
                  )?.name || ""}
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <PieChartHC data={chartDataGenre} />
            </CardContent>
          </Card>
        )}
        {isFetchingMangaCount ? (
          <Skeleton className="h-[330px] w-full rounded-xl" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recharts - Year Manga</CardTitle>
              <CardDescription>
                Top 100 MyMangaList
                {dataMangaCount.length > 0
                  ? ` ${dataMangaCount[0].year} - ${
                      dataMangaCount[dataMangaCount.length - 1].year
                    }`
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigMangaCount}>
                <BarChart
                  accessibilityLayer
                  data={chartDataMangaCount}
                  layout="vertical"
                  margin={{
                    left: 0,
                  }}
                >
                  <YAxis
                    dataKey="year"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    interval={0}
                    // tickFormatter={(value) =>
                    //   chartConfig[value as keyof typeof chartConfig]?.label
                    // }
                  />
                  <XAxis dataKey="count" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="count" layout="vertical" radius={5} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter> */}
          </Card>
        )}
        {isFetchingMangaCount ? (
          <Skeleton className="h-[330px] w-full rounded-xl" />
        ) : (
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Highchart - Year Manga</CardTitle>
              <CardDescription>
                Top 100 MyMangaList
                {dataMangaCount.length > 0
                  ? ` ${dataMangaCount[0].year} - ${
                      dataMangaCount[dataMangaCount.length - 1].year
                    }`
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ColumnChartHC data={chartDataMangaCount} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

const PieChartHC = ({ data }: { data: GenreChart[] }) => {
  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
      height: 220,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    title: {
      text: undefined,
    },
    series: [
      {
        type: "pie",
        name: "Genres",
        data: data.map((genre) => ({
          name: genre.name,
          y: genre.mangaCount,
        })),
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        },
      },
    ],
    colors: [
      "#7cb5ec",
      "#434348",
      "#90ed7d",
      "#f7a35c",
      "#8085e9",
      "#f15c80",
      "#e4d354",
      "#8085e8",
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

const ColumnChartHC = ({ data }: { data: MangaCountByYear[] }) => {
  const options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      spacing: [20, 0, 0, 0],
      height: 220,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories: data.map((item) => item.year),
      labels: {
        style: {
          color: "hsl(var(--muted-foreground))",
        },
      },
    },
    yAxis: {
      min: 0,
      max: Math.max(...data.map((item) => item.count)) + 1,
      title: {
        text: "Manga Count",
      },
      labels: {
        style: {
          color: "hsl(var(--muted-foreground))",
        },
      },
    },
    series: [
      {
        name: "Manga Count",
        data: data.map((item) => item.count),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
