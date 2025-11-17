import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";;
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { url } from "@/url";


interface FaturamentoPropos {
    quantity: number;
}


function GraficoFaturamentoDados() {
  const { data } = useSuspenseQuery({
    queryKey: ["faturamentoTodosMeses"],
    queryFn: async () => {
      const response = await fetch(`${url}/dashboardFaturamento`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("erro ao encontrar faturamentos");
      const data = await response.json();
      return data as FaturamentoPropos[]; // array com vários meses
    },
  });

  const chartData = data ?? [];

  const chartConfig = {
    quantity: {
      label: "faturamento",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Faturamento</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mesReferencia"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value, name) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value ?? 0);
                    const valorFormatado = new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      maximumFractionDigits: 0,
                    }).format(numericValue);

                    const nameStr = name == null ? "" : String(name);
                    const nomeFormatado = nameStr
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str: string) => str.toUpperCase());

                    return `${nomeFormatado}: ${valorFormatado}`;
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="totalPago"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}



function LoadingGrafico() {
    return (
        <Skeleton></Skeleton>
    )
}

function ErrorFallback({
    error,
}: {
    error: Error;
    resetErrorBoundary: () => void;
}) {
    return <div className="p-5 text-destructive">Erro: {error.message}</div>;
}

export function GraficoFaturamento() {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <ErrorBoundary onReset={reset} fallbackRender={({ error,
            resetErrorBoundary }) => <ErrorFallback error={error}
                resetErrorBoundary={resetErrorBoundary} />} >
            <Suspense fallback={<LoadingGrafico />} >
                <GraficoFaturamentoDados />
            </Suspense>
        </ErrorBoundary>
    )
}

export default GraficoFaturamento;