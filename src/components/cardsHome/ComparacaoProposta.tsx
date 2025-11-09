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

function CardComparacaoPropostasList() {

    const { data: comparacaoProposta } = useSuspenseQuery({
        queryKey: ["comparacao-propostas"],
        queryFn: async () => {
            const response = await fetch(`${url}/comparacao-propostas`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) throw new Error("Erro ao encontrar comparação de propostas");

            const data = await response.json();
            console.log("estou aqui(data comparação)", data);

            return data as ComparacaoPropostasProps[];
        }
    });

    const quantidadeAtual = comparacaoProposta.map((valor) => valor.mesAtual);

    const diferenca = comparacaoProposta.map((valor) => valor.diferenca)
    const diferencaAtual = diferenca[diferenca.length - 1] // última diferença


    return (
        <CardBase>
            <div className="flex items-center gap-6">
                <h1 className="text-6xl font-bold">{quantidadeAtual}</h1>
                <div className="flex flex-col justify-center gap-2">
                    <h2 className="text-2xl font-bold">Propostas mês atual</h2>
                    <p
                        className={`${diferencaAtual < 0 ? 'text-red-500' : 'text-green-500'
                            }`}
                    >
                        {diferencaAtual < 0
                            ? `${diferencaAtual} propostas a menos que o mês anterior`
                            : `${diferencaAtual} propostas a mais que o mês anterior`}
                    </p>
                </div>
            </div>
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


export function CardComparacaoPropostas() {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <ErrorBoundary onReset={reset} fallbackRender={({ error,
            resetErrorBoundary }) => <ErrorFallback error={error}
                resetErrorBoundary={resetErrorBoundary} />} >
            <Suspense fallback={<SkeletonPropostas />} >
                <CardComparacaoPropostasList />
            </Suspense>
        </ErrorBoundary>
    )
}



