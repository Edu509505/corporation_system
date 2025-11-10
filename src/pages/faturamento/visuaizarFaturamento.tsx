import { Button } from "@/components/ui/button";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import {
  CircleArrowDown,
  CircleArrowLeftIcon,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { format } from "date-fns/format";
import { Label } from "@/components/ui/label";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const url = import.meta.env.VITE_API_URL;

interface Faturamento {
  id: number;
  idCliente: number;
  idFaturamento: number;
  idMedicao: number;
  idProposta: number;
  tipo: string;
  updatedAt: string;
  valor: number;
  vencimento: string;
  pagamento: null;
  createdAt: string;
  clienteFaturamento: {
    cnpj: string;
    createdAt: string;
    id: number;
    local: string;
    name: string;
    path: string;
    status: string;
    updatedAt: string;
  };
  medicaoFaturamento: {
    createdAt: string;
    faturado: string;
    id: number;
    idCliente: number;
    idContrato: null;
    idProposta: number;
    observacao: string;
    periodoFinal: string;
    periodoInicial: string;
    updatedAt: string;
    valorTotal: number;
  };
  propostaFaturamento: {
    createdAt: string;
    descricao: string;
    id: number;
    idCliente: number;
    nomeDaProposta: string;
    statusProposta: string;
    updatedAt: string;
    valorProposta: number;
  };
}

interface AnexoFaturamento {
  url: string;
  path: string;
}

function VisualizarNotaFiscal() {

  const { id } = useParams<{ id: string }>();

  const { data: faturamento } = useSuspenseQuery({
    queryKey: ["faturamento", id],
    queryFn: async () => {
      const response = await fetch(`${url}/getFaturamentoId/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Faturamento;
    }
  })

  const { data: anexoFaturamento } = useSuspenseQuery({
    queryKey: ["anexoVersionamento", id],
    queryFn: async () => {
      const response = await fetch(
        `${url}/faturamento/${id}/anexoFaturamento/url`, {
        method: "GET",
        credentials: "include"
      }
      )
      if (!response.ok) throw new Error("Anexo não encontrada");
      const data = await response.json();
      return data as AnexoFaturamento
    }
  })

  console.log("Faturamento", anexoFaturamento.path.split('.').reverse()[0])

  return (
    <div className="flex flex-col h-auto gap-3 p-4">
      <header>
        <Link to="/notasFiscais">
          <Button>
            <CircleArrowLeftIcon /> Retornar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Visualizar Nota Fiscal</h1>
        <p className="text-gray-600">Preencha os detalhe abaixo.</p>
        <p className="text-sm text-gray-500">
          <strong>Atenção:</strong> Ao cadastrar uma nova Nota Fiscal é
          necessário selecionar o cliente a qual essa nota pertence e a qual
          mediçõa ela estará referenciando
        </p>
      </header>
      <main className="flex flex-col gap-3">
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-col gap-2">
            <Label>Cliente</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 bg-white pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>{faturamento.clienteFaturamento.name}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Cnpj</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 bg-white pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>{faturamento.clienteFaturamento.cnpj}</h1>
            </div>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-col gap-2">
            <Label>Número Da Nota</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 bg-white pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>68</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tipo</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 bg-white pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>{faturamento.tipo === "LOCACAO" ? "Locação" : "Serviço"}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Valor Da Nota</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 bg-white pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>{Intl.NumberFormat("PT-BR", { style: "currency", currency: "BRL" }).format(faturamento.valor)}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Vencimento</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 bg-white pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>{format(new Date(faturamento.vencimento), "dd/MM/yyyy")}</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Situação</Label>
            <div className="rounded-[0.5rem] border-1 border-gray-300 bg-white pl-2 pr-10 pt-1 pb-1 flex justify-start">
              <h1>{faturamento.pagamento === null ? "Em Aberto" : new Date(faturamento.createdAt) > new Date() ? "Atrasada" : faturamento.pagamento === "PAGO" ? "Pago" : ""}</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Ações</Label>
          <div>
            <h1>Selecione uma das opções para a nota Fiscal</h1>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Arquivo</Label>
          <div className="flex flex-col gap-3">
            <div>
            <Link to={anexoFaturamento.url}>
              <Button className="cursor-pointer" > <CircleArrowDown /> Fazer Download do Arquivo</Button>
            </Link>
            </div>
            {
              anexoFaturamento.path.split('.').reverse()[0] != "pdf" ? <><img src={anexoFaturamento.url}></img></>
                :
                <div style={{ height: '750px' }}>
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={anexoFaturamento.url} />
                  </Worker>
                </div>

            }
          </div>

        </div>

      </main>
    </div>
  );
}

function VisualizarNotaFiscalLoading() {
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

function VisuNotaFiscal() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<VisualizarNotaFiscalLoading />}>
        <VisualizarNotaFiscal />
      </Suspense>
    </ErrorBoundary>
  );
}

export default VisuNotaFiscal;
