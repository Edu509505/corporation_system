import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { Suspense } from "react";
import dayjs from "dayjs";
import { Skeleton } from "../ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { url } from "@/url";
import "dayjs/locale/pt-br";

interface TodosOsItensDoDia {
  dataDia: string;
  total_m2: number;
}

function GraficoDados() {
  dayjs.locale("pt-br");
  const [timeRange, setTimeRange] = React.useState("90d");

  // Define o número de dias com base no filtro
  const dias = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;

  // Calcula datas com dayjs
  const dataFinal = dayjs().format("YYYY-MM-DD");
  const dataInicial = dayjs().subtract(dias, "day").format("YYYY-MM-DD");

  const { data: chartData } = useSuspenseQuery({
    queryKey: ["itensDoDia", timeRange],
    queryFn: async () => {
      const response = await fetch(
        `${url}/dashboard/${dataInicial}/${dataFinal}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("erro ao encontrar propostas");
      const data = await response.json();
      return data as TodosOsItensDoDia[];
    },
  });

  const maiorValor = Math.max(...chartData.map((val) => val.total_m2));
  const menorValor = Math.min(...chartData.map((val) => val.total_m2));

  const filteredData = chartData.filter((item) => {
    const date = dayjs(item.dataDia);
    const today = dayjs();
    if (timeRange === "7d") return date.isAfter(today.subtract(7, "day"));
    if (timeRange === "30d") return date.isAfter(today.subtract(30, "day"));
    if (timeRange === "90d") return date.isAfter(today.subtract(90, "day"));
    return true;
  });

  const chartConfig = {
    total_m2: {
      label: "M²",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Gráfico do M²</CardTitle>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillM2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ring)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--ring)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dataDia"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              interval="preserveStartEnd"
              padding={{ left: 20, right: 20 }}
              tickFormatter={(value) => dayjs(value).format("DD/MM")}
            />
            <YAxis
              domain={[menorValor, maiorValor]}
              allowDataOverflow={true}
              tickFormatter={(val) =>
                `${Intl.NumberFormat("PT-BR").format(val)}M²`
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => dayjs(value).format("DD/MM")}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_m2"
              type="monotone"
              fill="url(#fillM2)"
              stroke="var(--ring)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function LoadingGrafico() {
  return <Skeleton></Skeleton>;
}

function ErrorFallback({
  error,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return <div className="p-5 text-destructive">Erro: {error.message}</div>;
}

export function GraficoM2() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<LoadingGrafico />}>
        <GraficoDados />
      </Suspense>
    </ErrorBoundary>
  );
}

export default GraficoM2;
