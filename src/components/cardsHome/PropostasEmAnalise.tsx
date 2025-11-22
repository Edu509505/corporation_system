import { url } from "@/url";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import CardBase from "./CardsHome";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

type PropostasEmAnaliseProps = {
  quantity: number;
};

function CardPropostasEmAnaliseList() {
  const { data: propostasEmAnalise } =
    useSuspenseQuery<PropostasEmAnaliseProps>({
      queryKey: ["propostasEmAnalise"],
      queryFn: async () => {
        const response = await fetch(`${url}/propostasEmAnalise`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        return data as PropostasEmAnaliseProps;
      },
    });

  const propostasTotalEmAnalise = propostasEmAnalise.quantity;

  return (
    <CardBase>
      <div className="flex items-center gap-6">
        <h1 className="text-6xl font-bold">{propostasTotalEmAnalise}</h1>
        <div className="flex flex-col justify-center gap-2">
          <h2 className="text-2xl font-bold">Propostas em análise</h2>
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

export function CardPropostasEmAnalise() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<SkeletonPropostas />}>
        <CardPropostasEmAnaliseList />
      </Suspense>
    </ErrorBoundary>
  );
}
