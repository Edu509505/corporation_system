import { useSuspenseQuery } from "@tanstack/react-query"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React from "react";
import dayjs from "dayjs";

interface todosOsItensDoDia {
    dataDia: string;
    total_m2: number;
}

function Grafico() {
    const [timeRange, setTimeRange] = React.useState("90d");

    // Define o número de dias com base no filtro
    const dias = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;

    // Calcula datas com dayjs
    const dataFinal = dayjs().format("YYYY-MM-DD");
    const dataInicial = dayjs().subtract(dias, "day").format("YYYY-MM-DD");

    const url = import.meta.env.VITE_API_URL;

    const { data: chartData } = useSuspenseQuery({
        queryKey: ["itensDoDia", timeRange],
        queryFn: async () => {
            const response = await fetch(`${url}/dashboard/${dataInicial}/${dataFinal}`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) throw new Error("erro ao encontrar propostas");
            const data = await response.json();
            return data as todosOsItensDoDia[];
        }
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
                    <CardDescription>
                        periodo de quanto está sendo feito o M²
                    </CardDescription>
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
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillM2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="dataDia"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={8}
                            interval={0}
                            padding={{ left: 20, right: 20 }} // 👈 aqui está o ajuste!
                            tickFormatter={(value) => dayjs(value).format("DD/MM")}
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
                            type="natural"
                            fill="url(#fillM2)"
                            stroke="var(--chart-2)"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default Grafico