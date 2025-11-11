import { url } from "@/url";
import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CardBase from "./CardsHome";
import { CardAction, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

type CardFaturamentoPropos = {
  totalAtual: number;
  variacaoPercentual: string | number;
};

function CardListFaturamento() {
  const { data: faturamentoData } = useSuspenseQuery<CardFaturamentoPropos>({
    queryKey: ['cardFaturamento'],
    queryFn: async () => {
      const response = await fetch(`${url}/cardFaturamento`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Erro ao buscar faturamento");

      const data = await response.json();
      console.log("data Faturamento", data);
      return data;
    }
  });

  const valorFormatado = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(faturamentoData.totalAtual) || 0);

  const variacaoRaw = faturamentoData.variacaoPercentual;
  const variacao = typeof variacaoRaw === "string" && variacaoRaw === "N/A"
    ? null
    : Number(variacaoRaw);

  const variacaoFormatada = variacao !== null && isFinite(variacao)
    ? `${variacao.toFixed(2)}%`
    : "N/A";

  const badgeClass =
    variacao === null ? "text-muted-foreground border-muted-foreground" :
      variacao > 0 ? "text-green-600 border-green-600" :
        variacao < 0 ? "text-red-600 border-red-600" :
          "text-black border-black";

  const badgeIcon =
    variacao === null ? <Minus /> :
      variacao > 0 ? <TrendingUp /> :
        variacao < 0 ? <TrendingDown /> :
          <Minus />;

  console.log({ variacao, variacaoPercentual: faturamentoData.variacaoPercentual });


  return (
    <CardBase>
      <h2 className="font-bold">Faturamento Mensal</h2>

      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        {valorFormatado}
      </CardTitle>

      <CardAction>
        <Badge variant="outline" className={badgeClass}>
          <span className="flex items-center gap-1">
            {badgeIcon}
            {variacaoFormatada}
          </span>
        </Badge>
      </CardAction>

      <div className="mt-2 text-sm text-muted-foreground">
        {variacao === null && (
          <span>Não há dados suficientes para calcular a variação.</span>
        )}
        {typeof variacao === "number" && variacao > 0 && (
          <span className="text-green-600">
            O faturamento aumentou em {variacao.toFixed(2)}% em relação ao mês anterior.
          </span>
        )}
        {typeof variacao === "number" && variacao < 0 && (
          <span className="text-red-600">
            O faturamento caiu {Math.abs(variacao).toFixed(2)}% em relação ao mês anterior.
          </span>
        )}
        {variacao === 0 && (
          <span>O faturamento se manteve estável em relação ao mês anterior.</span>
        )}
      </div>
    </CardBase>
  );
}


function SkeletonCardFaturamento() {
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





export function CardFaturamento() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary onReset={reset} fallbackRender={({ error,
      resetErrorBoundary }) => <ErrorFallback error={error}
        resetErrorBoundary={resetErrorBoundary} />} >
      <Suspense fallback={<SkeletonCardFaturamento />} >
        <CardListFaturamento />
      </Suspense>
    </ErrorBoundary>
  )
}