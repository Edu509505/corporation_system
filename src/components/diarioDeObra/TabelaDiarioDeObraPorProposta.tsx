import { useQuery, useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query"
import { url } from '../../url'
import { columnsDiario, type DiarioDeObra } from "./ColumsDiario"

import { DataTable } from "../data-table"
import { Skeleton } from "../ui/skeleton"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { useParams } from "react-router-dom"



function DiarioListContent() {
    const { idProposta } = useParams<{ idProposta: string }>(); // Pega o ID da URL
    const { data: diarioDeObraPorProposta } = useSuspenseQuery<DiarioDeObra[]>({
        queryKey: ["DiarioDeObraPorProposta", idProposta],
        queryFn: async () => {
            const response = await fetch(`${url}/diario-de-obra/proposta/${idProposta}`)
            if (!response.ok) throw new Error('Erro ao buscar diário de obra');
            const data = await response.json();
            return data as DiarioDeObra[];
        }
    })
    return (
        <DataTable 
        columns={columnsDiario} 
        data={diarioDeObraPorProposta} 
        DadosValorVazio="Nada encontrado"
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



export function TabelaDiariosDeObrasPorProposta() {
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