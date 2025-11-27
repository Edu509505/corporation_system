import { Button } from "@/components/ui/button";
import {
  useMutation,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import {
  AlertCircleIcon,
  CircleArrowDown,
  CircleArrowLeftIcon,
  CircleCheck,
  CircleX,
  Timer,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { format } from "date-fns/format";
import { Label } from "@/components/ui/label";

//BAGULHO DO PDF

// Create new plugin instance
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PdfView from "@/components/pdfView";

const url = import.meta.env.VITE_API_URL;

interface Faturamento {
  id: number;
  numeroDaNota: string;
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

  const { data: faturamento, refetch: refetchFaturamento } = useSuspenseQuery({
    queryKey: ["faturamento", id],
    queryFn: async () => {
      const response = await fetch(`${url}/getFaturamentoId/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Faturamento;
    },
  });

  const { data: anexoFaturamento } = useSuspenseQuery({
    queryKey: ["anexoVersionamento", id],
    queryFn: async () => {
      const response = await fetch(
        `${url}/faturamento/${id}/anexoFaturamento/url`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Anexo não encontrada");
      const data = await response.json();
      return data as AnexoFaturamento;
    },
  });

  const { mutateAsync: updateStatusFaturamento } = useMutation({
    mutationKey: ["updateFaturamento", id],
    mutationFn: async ({ pagamento }: { pagamento: string }) => {
      const response = await fetch(
        `${url}/updateStatusNotaFiscal/notaFiscal/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pagamento,
          }),
        }
      );
      if (!response.ok) throw new Error("Faturamento não encontrado");
    },
  });

  function situacao() {
    if (faturamento.pagamento === "ABERTO") {
      if (new Date() > new Date(faturamento.vencimento as string)) {
        return (
          <Badge className="text-orange-600 bg-orange-100 border border-orange-500">
            {" "}
            <AlertCircleIcon /> Em Atraso{" "}
          </Badge>
        );
      }
      return (
        <Badge className="text-blue-600 bg-blue-100 border border-blue-500">
          <Timer /> Em aberto
        </Badge>
      );
    } else if (faturamento.pagamento === "PAGA") {
      return (
        <Badge className="text-green-600 bg-green-100 border border-green-500">
          {" "}
          <CircleCheck /> Paga{" "}
        </Badge>
      );
    } else if (faturamento.pagamento === "CANCELADA") {
      return (
        <Badge className="text-red-600 bg-red-100 border border-red-500">
          {" "}
          <CircleX /> Cancelada{" "}
        </Badge>
      );
    }
  }

  return (
    <div className="flex flex-col h-auto gap-3 bg-background p-4">
      <header>
        <Link to="/notasFiscais">
          <Button className="cursor-pointer">
            <CircleArrowLeftIcon /> Retornar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Visualizar Nota Fiscal</h1>
      </header>
      <main className="flex flex-col gap-3">
        <div className="flex gap-3 flex-wrap">
          <div className="flex flex-col gap-2">
            <Label>Empresa</Label>
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
              <h1>N°{faturamento.numeroDaNota}</h1>
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
              <h1>
                {Intl.NumberFormat("PT-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(faturamento.valor / 100)}
              </h1>
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
            <div className=" pl-2 pr-10 pt-1 pb-1 flex justify-start items-center">
              {situacao()}
            </div>
          </div>
        </div>

        {faturamento.pagamento === "PAGA" ? (
          <></>
        ) : faturamento.pagamento === "CANCELADA" ? (
          <></>
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Ações</Label>
            <h1 className="text-[0.9rem]">
              {" "}
              Qualquer ação feita aqui não poderá ser desfeita{" "}
            </h1>
            <div className="flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="cursor-pointer">
                    {" "}
                    <CircleCheck /> Paga
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Marcar a nota como Paga?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não poderá ser desfeita
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      voltar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      onClick={async () => {
                        await updateStatusFaturamento({ pagamento: "PAGA" }),
                          refetchFaturamento();
                      }}
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="cursor-pointer" variant="destructive">
                    {" "}
                    <CircleX /> Cancelada
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Marcar a nota como Cancelada?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não poderá ser desfeita
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      voltar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      onClick={async () => {
                        await updateStatusFaturamento({
                          pagamento: "CANCELADA",
                        }),
                          refetchFaturamento();
                      }}
                    >
                      Continuar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Label>Arquivo</Label>
          <div className="flex flex-col gap-3">
            {anexoFaturamento.path.split(".").reverse()[0] != "pdf" ? (
              <>
                <div className="flex flex-col gap-3">
                  <Link to={anexoFaturamento.url}>
                    <Button className="cursor-pointer">
                      {" "}
                      <CircleArrowDown /> Fazer Download do Arquivo
                    </Button>
                  </Link>
                  <img src={anexoFaturamento.url}></img>
                </div>
              </>
            ) : (
              <div className="h-[500px]">
                <PdfView url={anexoFaturamento.url} />
              </div>
            )}
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
