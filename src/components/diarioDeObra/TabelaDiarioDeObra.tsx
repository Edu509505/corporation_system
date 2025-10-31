import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import type { ColumnFilter } from "@tanstack/react-table";
import React, { Suspense } from "react";
import { DataTable } from "../data-table";
import { columnsDiario, type DiarioDeObra } from './ColumsDiario'
import { Skeleton } from "../ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";

const url = import.meta.env.VITE_API_URL;

function DiarioListContent() {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFilter[]>([]);

    const { data: todosDiariosDeObra } = useSuspenseQuery({
        queryKey: ["todosDiariosDeObra"],
        queryFn: async () => {
            const response = await fetch(`${url}/diarioDeObra`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) throw new Error('Erro ao buscar diários de obra');
            const data = await response.json();
            return data as DiarioDeObra[];
        }
    });

    //  if (todosDiariosDeObra.length === 0) {
    //     return (

    //         //Caso a tabela donde fica cadastrado os clientes estiver vazia ele retorna essa mensagem

    //         <div className="w-full flex flex-col justify-center items-center text-center gap-3 text-muted-foreground">
    //             <CircleX className="size-20" />
    //             <h1 className="text-4xl">Não há diários de obra </h1>
    //         </div>
    //     )
    // }

    return (
        <DataTable
            columns={columnsDiario}
            data={todosDiariosDeObra}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            DadosValorVazio="Nenhuma diario de obra encontrado"
        />
    )
}

function DiarioListLoading() {
    return (
        <div className="p-2 w-full h-screen gap-3 flex flex-col">
            <Skeleton className="h-9 w-100" />
            <div className="gap-3 flex justify-between">
                <Skeleton className="h-9 w-50" />
                <Skeleton className="h-9 w-30" />
            </div>
            <div className="w-full h-full flex flex-wrap gap-3">
                <Skeleton className="w-3xs h-96 flex flex-col justify-between rounded-2xl border-[1px] p-6 gap-3 " />
                <Skeleton className="w-3xs h-96 flex flex-col justify-between rounded-2xl border-[1px] p-6 gap-3 " />
                <Skeleton className="w-3xs h-96 flex flex-col justify-between rounded-2xl border-[1px] p-6 gap-3 " />
                <Skeleton className="w-3xs h-96 flex flex-col justify-between rounded-2xl border-[1px] p-6 gap-3 " />
            </div>
        </div>
    );
}

function ErrorFallback({
    error,
}: {
    error: Error;
    resetErrorBoundary: () => void;
}) {
    return <div className="p-5 text-destructive">Erro: {error.message}</div>;
}



export default function TabelaDiariosDeObras() {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <div className="container mx-auto">
            <ErrorBoundary onReset={reset} fallbackRender={({ error,
                resetErrorBoundary }) => <ErrorFallback error={error}
                    resetErrorBoundary={resetErrorBoundary} />} >
                <Suspense fallback={<DiarioListLoading />} >
                    <DiarioListContent />
                </Suspense>
            </ErrorBoundary>
        </div>
    )
}
