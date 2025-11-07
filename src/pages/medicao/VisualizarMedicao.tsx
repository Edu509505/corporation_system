import { Button } from "@/components/ui/button";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { Suspense } from "react";
import {
  Calendar,
  CircleArrowLeftIcon,
} from "lucide-react";

import { Link, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import PeriodoFechamentoIdMedicao from "@/components/medicao/periodoFechamentoIdMedicao";

const url = import.meta.env.VITE_API_URL;

interface Medicao {
  clienteMedicao: {
    cnpj: string
    createdAt: string
    id: number
    local: string
    name: string
    path: string
    status: string
    updatedAt: string
  }
  createdAt: string
  faturado: string
  id: string
  idCliente: number
  idContrato: number
  idProposta: string
  observacao: string
  periodoFinal: string
  periodoInicial: string
  propostaMedicao: {
    createdAt: string
    descricao: string
    id: number
    idCliente: number
    nomeDaProposta: string
    statusProposta: string
    updatedAt: string
    valorProposta: number
  }
  updatedAt: string
  valorTotal: number

}

function VisualMedicao() {
  const { id } = useParams<{ id: string }>();

  const { data: medicao } = useSuspenseQuery({
    queryKey: ["clientes", id],
    queryFn: async () => {
      const response = await fetch(`${url}/getMedicao/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Clientes não encontrados");
      const data = await response.json();
      return data as Medicao;
    },
  });

  console.log(medicao)

  return (
    <div className="flex flex-col bg-gray-50 w-full gap-3 p-4">
      <header>
        <Link to="/medicao">
          <Button>
            <CircleArrowLeftIcon /> Retornar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Medição</h1>
        <p className="text-gray-600">
          Visualização da Medição
        </p>
        <p className="text-sm text-gray-500">
          <strong>Observação:</strong> Página dedicada para visualizar medição
        </p>
      </header>
      <main className="flex flex-col gap-3">
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <Label>Cliente</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>{medicao.clienteMedicao.name}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Proposta</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 pl-2 pr-4 pt-1 pb-1 flex justify-start">
              <h1>{medicao.propostaMedicao.nomeDaProposta}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Stuação</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 pl-2 pr-4 pt-1 pb-1 flex justify-start">
              <h1>{medicao.faturado}</h1>
            </div>
          </div>
        </div>
        {medicao?.observacao ? (
          <div className="flex flex-col gap-2">
            <Label>Observação</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 pl-2 pr-2 pt-1 pb-1 flex justify-start">
              <h1>{medicao.observacao}</h1>
            </div>
          </div>
        ): (<div className="flex flex-col gap-2">
            <Label>Observação</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 pl-2 pr-2 pt-1 pb-1 flex justify-start">
              <h1>Sem Observações</h1>
            </div>
          </div>)}
        
        <h1>Período do fechamento</h1>
        <section className="flex gap-3">
          <div className="flex flex-col gap-2">
            <Label>Data Inicial</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 pl-2 pr-2 pt-1 pb-1 flex gap-3 justify-start items-center">
              <h1>{format(new Date(medicao.periodoInicial), "dd/MM/yyyy")}</h1>
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Data Final</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 pl-2 pr-2 pt-1 pb-1 flex gap-3 justify-start items-center">
              <h1>{format(new Date(medicao.periodoFinal), "dd/MM/yyyy")}</h1>
              <Calendar className="size-4" />
            </div>
          </div>

        </section>
        <PeriodoFechamentoIdMedicao
          dataInicial={new Date(medicao.periodoInicial)}
          dataFinal={new Date(medicao.periodoFinal)}
          idProposta={medicao.idProposta}
          idMedicao={medicao.id}
        />
      </main>
    </div>
  );
}

function VisualizarMedicaoLoading() {
  return (
    <div className="w-full flex flex-col flex-wrap gap-2 p-4 ">
      <Skeleton className="h-9 w-25" />
      <Skeleton className="h-9 w-80" />
      <Skeleton className="h-5 w-115" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-75" />
      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-90" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-90" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-25" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-5 w-50" />
      </div>
      <div className=" flex flex-wrap gap-3">
        <Skeleton className="h-5 w-25" />
        <Skeleton className="h-100 w-full" />
      </div>
      <div className="w-full flex justify-center items-center flex-wrap gap-3">
        <Skeleton className="h-12 w-100" />
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

function VisualizarMedicao() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<VisualizarMedicaoLoading />}>
        <VisualMedicao />
      </Suspense>
    </ErrorBoundary>
  );
}

export default VisualizarMedicao;
