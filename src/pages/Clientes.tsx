import { Button } from "@/components/ui/button";
import {
  Building,
  CircleAlert,
  CircleCheck,
  CirclePlusIcon,
  CircleX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Cliente } from "../Tipagens";

export default function VerClientes() {
  const url = import.meta.env.VITE_API_URL;
  //Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática

  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
    async function VerClientes() {
      const response = await fetch(`${url}/clientes`);
      const body = await response.json();
      setClientes(body);
    }
    VerClientes();
    // async function itensRelacionados(){
    //   const response = await fetch(`${url}/${VerClientes.length}/contratos`)
    //   const corpo = await response.json()
    //   itensRelacionados(corpo);
    // }
    // itensRelacionados();
  }, []);

  // async function deletarCliente() {

  // }

  return (
    <div className="w-full h-screen p-5 flex flex-col bg-gray-50">
      <div className="flex items-center gap-3">
        <Building /> <h1 className="text-2xl font-bold">Clientes cadastrados</h1>
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
      <section className="w-full h-full gap-3 flex flex-row flex-wrap overflow-x-auto">

        {
          //Caso a tabela donde fica cadastrado os clientes estiver vazia ele retorna essa mensagem
          clientes.length === 0 || null ?

            <div className="w-full h-full flex flex-col justify-center items-center text-center gap-3 text-muted-foreground">
              <CircleX className="size-20" />
              <h1 className="text-4xl">Não há clientes cadastrados</h1>
            </div>

            : ''
        }

        {clientes.map((c) => (
          <div
            key={c.id}
            className="w-3xs h-96 flex flex-col items-center rounded-2xl border-[1px] b p-6 bg-white gap-3 "
          >
            {
              c.status === "Ativo" ? (
                <div className="w-[8rem] h-[8rem] border-2 flex justify-center items-center border-ring rounded-full text-center">
                  <h1 className="text-5xl ">{
                    (c.cliente)?.split(' ').map(palavra => palavra[0]).join('')
                    //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                  }
                  </h1>
                </div>
              ) : c.status === "Pendente" ? (
                <div className="w-[8rem] h-[8rem] border-2 flex justify-center items-center border-chart-1 rounded-full text-center">
                  <h1 className="text-5xl ">{
                    (c.cliente)?.split(' ').map(palavra => palavra[0]).join('').toUpperCase()
                    //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                  }
                  </h1>
                </div>
              ) : c.status === "Inativo" ? (
                <div className="w-[8rem] h-[8rem] border-2 flex justify-center items-center border-destructive rounded-full text-center">
                  <h1 className="text-5xl ">{
                    (c.cliente)?.split(' ').map(palavra => palavra[0]).join('')
                    //Essa função pega o nome do cliente, elimina os espaços dividindo em 2 textos, depois pega a primeira letra de cada um e no final junta
                  }
                  </h1>
                </div>
              ) : (
                ""
              )
            }
            <p>
              <strong>Cliente:</strong> {c.cliente}
            </p>
            <div className="w-full flex flex-col gap-2">
              <p>
                <strong>CNPJ:</strong> {c.cnpj}
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
          </div>
        ))}
      </section>
    </div>
  );
}
