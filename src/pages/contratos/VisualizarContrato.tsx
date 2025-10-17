import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";
import { ArrowLeftCircleIcon, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { formatToBRL, formatToNumber } from 'brazilian-values';

const url = import.meta.env.VITE_API_URL;

interface Contratos {
  id: number;
  titulo: string;
  status: string;
  createdAt: string;
  clientesContratos: {
    id: number;
    cliente: string;
    cnpj: string;
    local: string;
  };
  proposta: {
    id: number;
    nomeDaProposta: string;
    descricao: string;
    valorProposta: number;
    updatedAt: string;
  };
}

interface Versionamento {
  id: number;
  idProposta: number;
  status: string;
  updateAt: string;
}

interface AnexoVersionamento {
  url: string;
}

interface AnexoContrato {
  url: string;
}

interface Quantitativa {
  id: number;
  idVersionamento: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  unidadeDeMedida: string;
}

function GetInfoContratos() {
  const { id } = useParams<{ id: string }>();

  const { data: dadosCliente } = useSuspenseQuery({
    queryKey: ["dadosCliente", id],
    queryFn: async () => {
      const response = await fetch(`${url}/contrato/${id}`);
      if (!response.ok) throw new Error("Cliente não encontrato");
      const data = await response.json();
      return data as Contratos;
    },
  });

  console.log("dadosCliente", dadosCliente)

  const { data: versionamento } = useSuspenseQuery({
    queryKey: ["versionamento", dadosCliente?.proposta.id],
    queryFn: async () => {
      const response = await fetch(
        `${url}/proposta/${dadosCliente?.proposta.id}/verAprovado`
      );
      if (!response.ok) throw new Error("Versionamento não encontrada");
      const data = await response.json();
      return data as Versionamento;
    },
  });

  console.log("versionamento", versionamento)

  const { data: anexoVersionamento } = useSuspenseQuery({
    queryKey: ["anexoVersionamento", versionamento?.id],
    queryFn: async () => {
      const response = await fetch(
        `${url}/versionamento/${versionamento?.id}/anexos/urls`
      )
      if (!response.ok) throw new Error("Anexo não encontrada");
      const data = await response.json();
      return (data.url || []) as AnexoVersionamento[]
    }
  })

  const { data: anexoContrato } = useSuspenseQuery({
    queryKey: ["anexoContrato", versionamento?.id],
    queryFn: async () => {
      const response = await fetch(`${url}/contrato/${id}/anexoContrato/url`)
      if (!response.ok) throw new Error("Não foi encontrado o Anexo do contrato")
      const data = await response.json()
      return (data.url || []) as AnexoContrato[]
    }
  })


  const { data: quantitativa } = useSuspenseQuery({
    queryKey: ["quantitativa", versionamento?.id],
    queryFn: async () => {
      const response = await fetch(`${url}/quantitativa/${0}`)
      if (!response.ok) throw new Error("Não foi encontrato nenhuma quantitativa")
      const data = await response.json()
      return data as Quantitativa[]
    }
  })


  return (
    <div className="w-full flex flex-col flex-wrap gap-3 p-4 bg-gray-50">
      <Link to={'/contratos'}>
        <Button className="cursor-pointer"><ArrowLeftCircleIcon />Retornar</Button>
      </Link>
      <h1 className="text-2xl font-bold">Visualização do contrato</h1>
      <div className="flex gap-3 flex-wrap">
        <section className="w-[340px] bg-white rounded-2xl border-1 border-ring p-4">
          <h1 className="text-2xl font-bold">Informações do Cliente</h1>
          <h1>
            <strong>Cliente:</strong> {dadosCliente?.clientesContratos.cliente}
          </h1>
          <h1>
            <strong>CNPJ:</strong>{" "}
            {cnpj.format(dadosCliente?.clientesContratos.cnpj as string)}
          </h1>
          <h1>
            <strong>Local do Cliente:</strong>{" "}
            {dadosCliente?.clientesContratos.local}
          </h1>
        </section>
        <section className="w-[340px] bg-white rounded-2xl border-1 border-ring p-4">
          <h1 className="text-2xl font-bold">Informações do Contrato</h1>
          <h1>
            <strong>Contrato: </strong>
            {dadosCliente?.titulo}
          </h1>
          <h1>
            <strong>Criado em: </strong>{" "}
            {dadosCliente?.createdAt
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </h1>
        </section>
        <section className="w-[340px] bg-white rounded-2xl border-1 border-ring p-4">
          <h1 className="text-2xl font-bold">Proposta Referente ao contrato</h1>
          <h1>
            <strong>Proposta: </strong> {dadosCliente?.proposta.nomeDaProposta}
          </h1>
          <h1>
            <strong>Descrição: </strong> {dadosCliente?.proposta.descricao}
          </h1>
          <h1>
            <strong>Aprovada em: </strong>{" "}
            {dadosCliente?.proposta.updatedAt
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </h1>
          <h1>
            <strong>Valor: </strong> {dadosCliente?.proposta.valorProposta}
          </h1>
        </section>
      </div>
      <div className=" flex flex-wrap gap-3">
        <div className="gap-3 flex flex-col bg-white border-1 border-ring p-4 rounded-2xl">
          <h1 className="text-2xl font-bold">Anexos da Proposta</h1>
          {anexoVersionamento === undefined ? (
            <span>Nenhum anexo encontrado.</span>
          ) : (
            anexoVersionamento.map((anexo, idx) => (
              <a
                key={idx}
                href={anexo.toString()}
                download="olha_aqui_nome_novo"
              >
                <div className="w-[65px] flex justify-center bg-green-200 rounded-2xl p-2 transition-all hover:scale-110">
                  <h1 className="flex font-bold">
                    {idx + 1} - <FileImage />
                  </h1>
                </div>
              </a>
            ))
          )}
        </div>
        <div className="gap-3 flex flex-col bg-white border-1 border-ring p-4 rounded-2xl">
          <h1 className="text-2xl font-bold">Anexos da Contrato</h1>
          {anexoContrato === undefined ? (
            <span>Nenhum anexo encontrado.</span>
          ) : (
            anexoContrato?.map((anexo, idx) => (
              <a
                key={idx}
                href={anexo.toString()}
                className="w-[65px] flex justify-center bg-green-200 rounded-2xl p-2 transition-all hover:scale-110"
                download="porqueNaoTaRenomeando"
              >
                <h1 className="flex font-bold">
                  {idx + 1} - <FileImage />
                </h1>
              </a>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-2xl">Quantitativas imposta na Proposta</h1>
        {quantitativa === undefined ? (
          <span>Nenhuma quantitativa foi encontrada</span>
        ) : (quantitativa.map((item) => (
          <div key={item.id} className="flex flex-wrap gap-3 border-1 rounded-2xl border-ring p-3 bg-white">
            <h1 ><strong>item:</strong> {item.descricao}</h1>
            <h1 ><strong>Quantidade:</strong> {formatToNumber(item.quantidade)}</h1>
            <h1 ><strong>Unidade de Medida:</strong> {item.unidadeDeMedida}</h1>
            <h1 ><strong>Valor Unitário:</strong> {formatToBRL(item.valorUnitario)}</h1>
          </div>
        )))}
      </div>
    </div>
  )
}

function VisualizarContratoLoading() {
  return (
    <div className="w-full flex flex-col flex-wrap gap-3 p-4 ">
      <Skeleton className="h-9 w-25"/>
      <Skeleton className="h-9 w-100"/>
      <div className="flex gap-3 flex-wrap">
        <Skeleton className="h-50 w-80" />
        <Skeleton className="h-50 w-80" />
        <Skeleton className="h-50 w-80" />
      </div>
      <div className=" flex flex-wrap gap-3">
        <Skeleton className="h-40 w-70" />
        <Skeleton className="h-40 w-70" />
      </div>
      <Skeleton className="h-9 w-100"/>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-11 w-full"/>
        <Skeleton className="h-11 w-full"/>
        <Skeleton className="h-11 w-full"/>
      </div>
    </div>
  )
}

function ErrorFallback({
  error,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return <div className="p-5 text-destructive">Erro: {error.message}</div>;
}

function VisualizarContrato() {
    const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<VisualizarContratoLoading />}>
        <GetInfoContratos />
      </Suspense>
    </ErrorBoundary>
  );
}

export default VisualizarContrato;
