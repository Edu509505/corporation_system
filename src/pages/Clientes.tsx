import { Button } from "@/components/ui/button";
import {
  Building,
  CircleAlert,
  CircleCheck,
  CirclePlusIcon,
  CircleX,
  Edit,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Cliente } from "../Tipagens";
import { Skeleton } from "@/components/ui/skeleton";
import { cnpj } from "cpf-cnpj-validator";

export default function VerClientes() {
  const navigate = useNavigate();

  const url = import.meta.env.VITE_API_URL;
  //Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseOk, setResponseOk] = useState(true);

  useEffect(() => {
    async function verClientes() {
      try {
        const response = await fetch(`${url}/clientes`);
        const body = await response.json();
        setClientes(body);

        if (!response.ok) {
          setResponseOk(true);
          const erro = await response.text();
          throw new Error(`Erro ${response.status}: ${erro}`);
        }
        setResponseOk(false);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    verClientes();
  }, []);

  if (loading)
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

  if (responseOk)
    return (
      <div className="w-full h-screen flex flex-row items-center justify-around">
        <div className="flex flex-col items-center justify-center gap-3 text-red-500">
          <h1 className="text-3xl">Erro Inesperado</h1>
          <h2>Tente novamente mais tarde</h2>
          <CircleX className="size-20" />
          <h1>Ops! Parece que ocorreu um erro inesperado</h1>
        </div>
      </div>
    );

  const editarCliente = (clienteId: number) => {
    navigate(`/clientes/${clienteId}`); // Navega para a rota específica do cliente
  };

  return (
    <div className="w-full h-screen p-2 flex flex-col bg-gray-50">
      <div className="flex items-center gap-3">
        <Building />
        <h1 className="text-2xl font-bold">Clientes cadastrados</h1>
      </div>

      <div className="w-full h-20 flex justify-between items-center">
        <h2 className="text-2xl ">Lista de Clientes</h2>
        <Link to="/cadastro">
          <Button className="cursor-pointer">
            <CirclePlusIcon className="size-5" />
            Adicionar
          </Button>
        </Link>
      </div>
      <section className="w-full h-full gap-2 flex flex-row flex-wrap overflow-x-auto">
        {
          //Caso a tabela donde fica cadastrado os clientes estiver vazia ele retorna essa mensagem
          clientes.length === 0 || null ? (
            <div className="w-full h-full flex flex-col justify-center items-center text-center gap-3 text-muted-foreground">
              <CircleX className="size-20" />
              <h1 className="text-4xl">Não há clientes cadastrados</h1>
            </div>
          ) : (
            ""
          )
        }

        {clientes.map((c) => (
          <div
            key={c.id}
            className="w-3xs h-96 flex flex-col justify-between rounded-2xl border-[1px] p-6 bg-white gap-3 "
          >
            <section className="flex flex-col items-center justify-between w-full gap-2">
              {c.status === "Ativo" ? (
                <div className="w-[8rem] h-[8rem] border-4 flex justify-center items-center border-ring rounded-full text-center">
                  <h1 className="text-5xl ">
                    {
                      c.cliente
                        ?.split(" ")
                        .slice(0, 2)
                        .map((palavra) => palavra[0])
                        .join("")
                        .toUpperCase()

                      //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                    }
                  </h1>
                </div>
              ) : c.status === "Pendente" ? (
                <div className="w-[8rem] h-[8rem] border-4 flex justify-center items-center border-chart-1 rounded-full text-center">
                  <h1 className="text-5xl ">
                    {
                      c.cliente
                        ?.split(" ")
                        .slice(0, 2)
                        .map((palavra) => palavra[0])
                        .join("")
                        .toUpperCase()
                      //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                    }
                  </h1>
                </div>
              ) : c.status === "Inativo" ? (
                <div className="w-[8rem] h-[8rem] border-4 flex justify-center items-center border-destructive rounded-full text-center">
                  <h1 className="text-5xl ">
                    {
                      c.cliente
                        ?.trim()
                        .split(" ")
                        .slice(0, 2) //função que pega as duas primeiras palavras
                        .map((palavra) => palavra[0].toUpperCase())
                        .join("")
                      //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                    }
                  </h1>
                </div>
              ) : (
                ""
              )}
              <p>
                <strong>Cliente:</strong> {c.cliente}
              </p>
              <div className="w-full flex flex-col gap-2">
                <p>
                  <strong>CNPJ:</strong> {cnpj.format(c.cnpj)}
                </p>
                <p>
                  <strong>Local:</strong> {c.local}
                </p>
                {c.status === "Ativo" ? (
                  <p className="flex itens-center gap-2 font-bold text-ring">
                    <CircleCheck /> {c.status}
                  </p>
                ) : c.status === "Pendente" ? (
                  <p className="flex itens-center gap-2 font-bold text-chart-1">
                    <CircleAlert /> {c.status}
                  </p>
                ) : c.status === "Inativo" ? (
                  <p className="flex itens-center gap-2 font-bold text-destructive">
                    <CircleX /> {c.status}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </section>
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                className="flex itens-center gap-2 font-bold cursor-pointer"
                onClick={() => editarCliente(c.id)}
              >
                <Edit /> Editar
              </Button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
