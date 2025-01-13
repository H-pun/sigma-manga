"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { fetchGenres } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface GenreChart {
  name: string;
  mangaCount: number;
  fill: string;
}

export default function Page() {
  const [chartData, setChartData] = useState<GenreChart[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const { data } = useQuery({
    queryKey: ["genre"],
    queryFn: () => fetchGenres(""),
    initialData: [],
  });

  useEffect(() => {
    if (!data) return;
    const transformedData = data.map((genre, index) => {
      const key = genre.name.replace(/\s+/g, "").toLowerCase();
      return {
        genreData: {
          name: key,
          mangaCount: genre.mangaCount,
          fill: `hsl(${(index * (360 / data.length) + 30) % 360}, 70%, 60%)`,
        },
        configData: { [key]: { label: genre.name } },
      };
    });

    setChartData(
      transformedData
        .map((item) => item.genreData)
        .filter((item) => item.mangaCount > 15)
    );

    setChartConfig({
      mangaCount: {
        label: "Manga Count",
      },
      ...transformedData.reduce(
        (acc, item) => ({ ...acc, ...item.configData }),
        {}
      ),
    });
  }, [data]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Recharts - Genre</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 font-medium leading-none">
                Most popular genre:{" "}
                {data.find(
                  (genre) =>
                    genre.mangaCount ===
                    Math.max(...data.map((g) => g.mangaCount))
                )?.name || ""}
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="mangaCount"
                  label
                  nameKey="name"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Highchart - Genre</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 font-medium leading-none">
                Most popular genre:{" "}
                {data.find(
                  (genre) =>
                    genre.mangaCount ===
                    Math.max(...data.map((g) => g.mangaCount))
                )?.name || ""}
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <PieChartHC data={chartData} />
          </CardContent>
        </Card>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}

const PieChartHC = ({ data }: { data: GenreChart[] }) => {
  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      spacing: [0, 0, 0, 0],
      height: 250,
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
