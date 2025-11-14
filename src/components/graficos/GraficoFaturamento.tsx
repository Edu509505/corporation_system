import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";;
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import dayjs from "dayjs";
import { url } from "@/url";


interface FaturamentoPropos {
    quantity: number;
}


function GraficoFaturamantoDados() {

    const dataMes = dayjs().format('YYYY-MM');


    const { data } = useSuspenseQuery({
        queryKey: ["itensDoDia", dataMes],
        queryFn: async () => {
            const response = await fetch(`${url}/dashboardFaturamento/${dataMes}`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) throw new Error("erro ao encontrar faturamentos");
            const data = await response.json();
            return data as FaturamentoPropos[];
        }
    });

    const chartData = data ? [data] : [];


    const chartConfig = {
        quantity: {
            label: "faturamento",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig

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
                            minTickGap={32}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        const date = new Date(value);
                                        return date.toLocaleDateString("pt-BR", {
                                            day: "numeric",
                                            month: "short",
                                        }); // Ex: "1 nov"
                                    }}
                                    formatter={(value, name) => {
                                        // Formata o número como moeda brasileira
                                        const valorFormatado = new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                            maximumFractionDigits: 0,
                                        }).format(value); // Ex: "R$ 10.000.000"

                                        // Formata o nome do campo (ex: "totalPago" → "Total Pago")
                                        const nomeFormatado = name
                                            .replace(/([A-Z])/g, ' $1') // separa camelCase
                                            .replace(/^./, (str: string) => str.toUpperCase()); // capitaliza

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
    )
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
                <GraficoFaturamantoDados />
            </Suspense>
        </ErrorBoundary>
    )
}

export default GraficoFaturamento;