import { Button } from "@/components/ui/button";
import {
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
    <div className="w-full h-screen flex flex-col bg-[url('./src/assets/img/nossotrab2.jpg')] bg-cover bg-center">
      <div className="w-full h-full p-5 flex flex-col backdrop-blur-xl bg-[rgba(255,255,255,0.40)]">
        <h1 className="text-2xl font-bold">Clientes cadastrados</h1>
        <div className="w-full h-20 flex justify-between items-center">
          <h2 className="text-2xl ">Lista de Clientes</h2>
          <Link to="/cadastro">
            <Button className="cursor-pointer">
              <CirclePlusIcon className="size-5" />
              Adicionar
            </Button>
          </Link>
        </div>
        <section className="w-full h-full gap-3 flex flex-row flex-wrap overflow-auto p-4 max-[1153.50px]:justify-center">
          {clientes.map((c) => (
            <div
              key={c.id}
              className="w-3xs h-96 flex flex-col items-center rounded-2xl border-[1px] b p-6 bg-white gap-3 "
            >
              <div className="w-[8rem] h-[8rem] border-2 flex justify-center items-center border-ring rounded-full">
                Imagem
              </div>
              <p>
                <strong>Cliente</strong> {c.cliente}
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
    </div>
  );
}
