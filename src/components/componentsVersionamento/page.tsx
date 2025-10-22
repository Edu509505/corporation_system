import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { columns, type Propostas } from "./columns";
import { DataTable } from "../data-table";
import React, { Suspense } from "react";
import type { ColumnFilter } from "@tanstack/react-table";
import { Skeleton } from "../ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";


const url = import.meta.env.VITE_API_URL;
function PropostaListContent(){
  const [columnFilters, setColumnFilters] = React.useState<ColumnFilter[]>([]);
  // Fetch data from your API here.
  const { data: propostas } = useSuspenseQuery({
    queryKey: ["propostas"],
    queryFn: async () => {
      const response = await fetch(`${url}/propostas/`);
      if (!response.ok) throw new Error("Propostas não encontradas");
      const data = await response.json();
      return data as Propostas[];
    },
  });

  return (
    <DataTable
      columns={columns}
      data={propostas}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
      DadosValorVazio="Nenhuma proposta encontrada"
    />
  )
}

function PropostaListLoading() {
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


export default function TabelaPropostas() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <div className="container mx-auto">
      <ErrorBoundary onReset={reset} fallbackRender={({ error,
        resetErrorBoundary }) => <ErrorFallback error={error}
          resetErrorBoundary={resetErrorBoundary} />} >
        <Suspense fallback={<PropostaListLoading />} >
          <PropostaListContent />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
