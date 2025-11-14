import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query"
import { Skeleton } from "../ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import CardBase from "./CardsHome";

const url = import.meta.env.VITE_API_URL;

interface Proposta {
  id: number;
  idCliente: number;
  nomeDaProposta: string;
  descricao: string;
  valorProposta: string;
  updateAt: string;
}

function CardPropostaEmAndamentoList() {

  const { data: propostasAprovadas } = useSuspenseQuery({
    queryKey: ["propostasAprovadas"],
    queryFn: async () => {
      const response = await fetch(`${url}/propostasAprovadas`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("erro ao encontrar os versionamentos aprovados");
      const data = await response.json();
      return data as Proposta[];
    }
  })
  console.log(propostasAprovadas)
  return (
    <CardBase>
      <div className="flex items-center gap-6">
        <h1 className="text-6xl font-bold">{propostasAprovadas.length}</h1>
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-2xl font-bold">Propostas</h2>
          {propostasAprovadas.length === 0 ? (
            <>Até o momento nenhuma Proposta Aprovada</>
          ) : propostasAprovadas.length === 1 ? (
            <>Proposta em andamento</>
          ) : (
            <>Propostas em andamento</>
          )}
        </div>
      </div>
    </CardBase>
  )
}

function CardPropostaEmAndamentoLoading() {
  return (
    <div className="p-4 w-full h-screen gap-4 flex flex-col bg-background">
      {/* Título da página */}
      <Skeleton className="h-10 w-1/3 rounded-md" />

      {/* Filtros superiores */}
      <div className="flex justify-between gap-4">
        <Skeleton className="h-9 w-1/2 rounded-md" />
        <Skeleton className="h-9 w-1/3 rounded-md" />
      </div>

      {/* Cards de proposta */}
      <div className="w-full flex flex-wrap gap-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            className="w-[22%] h-96 flex flex-col justify-between rounded-2xl border border-gray-200 p-6 gap-4"
          >
            <Skeleton className="h-6 w-2/3 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </Skeleton>
        ))}
      </div>

      {/* Gráfico de M² */}
      <div className="w-full h-[300px] mt-4 rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
        <Skeleton className="h-6 w-1/4 rounded" /> {/* Título do gráfico */}
        <Skeleton className="h-9 w-1/5 rounded" /> {/* Filtro de período */}
        <Skeleton className="h-full w-full rounded-md" /> {/* Área do gráfico */}
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



export function CardPropostaEmAndamento() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary onReset={reset} fallbackRender={({ error,
      resetErrorBoundary }) => <ErrorFallback error={error}
        resetErrorBoundary={resetErrorBoundary} />} >
      <Suspense fallback={<CardPropostaEmAndamentoLoading />} >
        <CardPropostaEmAndamentoList />
      </Suspense>
    </ErrorBoundary>
  )

}
