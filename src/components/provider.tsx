"use client";

import Highcharts from "highcharts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

if (typeof window !== "undefined") {
  Highcharts.setOptions({
    credits: {
      enabled: false,
    },
    chart: {
      backgroundColor: "transparent",
    },
    legend: {
      itemStyle: {
        color: "hsl(var(--foreground))",
      },
      itemHoverStyle: {
        color: "hsl(var(--foreground))",
      },
    },
    title: {
      style: {
        color: "hsl(var(--foreground))",
      },
    },
    xAxis: {
      title: {
        style: { color: "hsl(var(--foreground))" },
      },
      labels: {
        style: { color: "hsl(var(--foreground))" },
      },
      gridLineColor: "hsl(var(--foreground))",
      lineColor: "hsl(var(--foreground))",
    },
    yAxis: {
      title: {
        style: { color: "hsl(var(--foreground))" },
      },
      labels: {
        style: { color: "hsl(var(--foreground))" },
      },
      gridLineColor: "hsl(var(--foreground))",
      lineColor: "hsl(var(--foreground))",
    },
  });
}

const Provider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Provider;
