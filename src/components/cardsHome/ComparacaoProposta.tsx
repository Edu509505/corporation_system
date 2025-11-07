import { url } from "@/url";
import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CardBase from "./CardsHome";




type ComparacaoPropostasProps = {
    mesAtual: number;
    mesAnterior: number;
    diferenca: number;
    variacaoPercentual: string | null;
};

function CardComparacaoPropostas() {
    const { data } = useSuspenseQuery<ComparacaoPropostasProps>({
        queryKey: ['comparacaoPropostas'],
        queryFn: async () => {
            const response = await fetch(`${url}/comparacao-propostas`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) throw new Error("erro ao encontrar propostas");

            const data = await response.json();
            return data as ComparacaoPropostasProps;
        }
    });


    return (
        <CardBase>
            <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Comparação de Propostas</h2>
            <p className="mb-2">Mês Atual: <strong>{data.mesAtual}</strong></p>
            <p className="mb-2">Mês Anterior: <strong>{data.mesAnterior}</strong></p>
            <p
                className={`font-semibold ${data.diferenca > 0 ? 'text-green-600' : data.diferenca < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}
            >
                {data.diferenca > 0
                    ? `Houve um aumento de ${data.diferenca} em relação ao mês anterior.`
                    : data.diferenca < 0
                        ? `Houve uma queda de ${data.diferenca} proposta em relação ao mês anterior.`
                        : 'Sem variação em relação ao mês anterior.'}
            </p>
        </CardBase>

    );

}


function SkeletonPropostas() {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-10 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
            <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
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


export function ComparacaoPropostas() {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <ErrorBoundary onReset={reset} fallbackRender={({ error,
            resetErrorBoundary }) => <ErrorFallback error={error}
                resetErrorBoundary={resetErrorBoundary} />} >
            <Suspense fallback={<SkeletonPropostas />} >
                <CardComparacaoPropostas />
            </Suspense>
        </ErrorBoundary>
    )


}



