import { useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import CardClient from "./CardClient";
import { Skeleton } from "../ui/skeleton";
import { CircleX } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

interface Cliente {
  id: number;
  name: string;
  cnpj: string;
  local: string;
  status: "ATIVO" | "INATIVO";
  path: string;
};

function ClientListContent() {

    const url = import.meta.env.VITE_API_URL;

    const { data: clientes } = useSuspenseQuery({
        queryKey: ["clientes"],
        queryFn: async () => {
            const response = await fetch(`${url}/clientes`, {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) throw new Error('Failed to fetch clientes');
            const data = await response.json();
            
            console.log(data);
            
            return data as Cliente[];
        }
    });

    if (clientes.length === 0) {
        return (

            //Caso a tabela donde fica cadastrado os clientes estiver vazia ele retorna essa mensagem

            <div className="w-full flex flex-col justify-center items-center text-center gap-3 text-muted-foreground">
                <CircleX className="size-20" />
                <h1 className="text-4xl">Não há clientes cadastrados</h1>
            </div>
        )
    }

    return (
        <div>
            <ul className="w-full gap-3 flex flex-wrap">
                {clientes.map(cliente => (
                    <CardClient key={cliente.id}
                        id={cliente.id}
                        name={cliente.name}
                        cnpjCliente={cliente.cnpj}
                        local={cliente.local}
                        status={cliente.status}
                        path={cliente.path}
                    />
                ))}
            </ul>
        </div>
    )
}


function ClientListLoading() {
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



export function ClientList() {
    const { reset } = useQueryErrorResetBoundary();

    return (
        <ErrorBoundary onReset={reset} fallbackRender={({ error,
            resetErrorBoundary }) => <ErrorFallback error={error}
                resetErrorBoundary={resetErrorBoundary} />} >
            <Suspense fallback={<ClientListLoading />} >
                <ClientListContent />
            </Suspense>
        </ErrorBoundary>
    )
}