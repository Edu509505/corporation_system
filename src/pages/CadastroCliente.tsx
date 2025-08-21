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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck, CircleFadingPlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import type { Cliente } from "../Tipagens"

interface Cliente {
  cliente: string;
  cnpj: string;
  local: string;
  status: "Ativo" | "Pendente" | "Inativo" | null;
  path: string | null;
}

const url = import.meta.env.VITE_API_URL;
//Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática

export default function CriarCliente() {
  const navigate = useNavigate();

  const voltar = () => {
    navigate(-1);
  };

  const [novoCliente, setNovoCliente] = useState<Cliente>({
    cliente: "",
    cnpj: "",
    local: "",
    status: "Ativo",
    path: "",
  });

  console.log(novoCliente);

  async function criarCliente(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch(`${url}/clientes`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        cliente: novoCliente.cliente,
        cnpj: novoCliente.cnpj,
        local: novoCliente.local,
        status: novoCliente.status,
        path: novoCliente.path,
      }),
    });
    const body = await response.json();
  }

  const mensagemDeOkay = "Okay";

  const mensagemAlert = [
    {
      submitOkay: {
        alertDialogTitle: "Cliente Cadastrado!",
        alertDialogDescription: "Cliente foi cadastrado com sucesso!",
      },
      submitError: {
        alertDialogTitle: "Erro ao cadastrar usuário",
        alertDialogDescription:
          "Você precisa preencher todos os campos para que o cadastro seja realizado",
      },
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-[url('./src/assets/img/IMG-20240823-WA0007.jpg')] bg-cover bg-center">
      <div className="w-full h-full flex flex-col backdrop-blur-xl bg-[rgba(255,255,255,0.40)]">
        <form onSubmit={criarCliente} className="flex gap-3 flex-col p-5">
          <div className="flex gap-3 items-center">
            <CircleFadingPlusIcon className="size-10" />
            <h1 className="text-2xl font-bold">Cadastrar novo Cliente</h1>
          </div>

          <Input
            type="text"
            name="cliente"
            placeholder="Nome do cliente"
            value={novoCliente.cliente}
            onChange={(event) =>
              setNovoCliente({
                ...novoCliente,
                cliente: event.target.value,
              })
            }
            className="bg-white"
          />
          <Input
            type="text"
            name="cnpj"
            placeholder="Cnpj do cliente"
            value={novoCliente.cnpj}
            onChange={(event) =>
              setNovoCliente({
                ...novoCliente,
                cnpj: event.target.value,
              })
            }
            className="bg-white"
          />
          <Input
            type="text"
            name="local"
            placeholder="local do cliente"
            value={novoCliente.local}
            onChange={(event) =>
              setNovoCliente({
                ...novoCliente,
                local: event.target.value,
              })
            }
            className="bg-white"
          />
          <select
            className="bg-white rounded-md h-8"
            name="select"
            onChange={(event) =>
              setNovoCliente({
                ...novoCliente,
                status: event.target.value as "Ativo" | "Pendente" | "Inativo",
              })
            }
          >
            <option value="Ativo">Ativo</option>
            <option value="Pendente">Pendente</option>
            <option value="Inativo">Inativo</option>
          </select>

          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="bg-ring">
                <CircleCheck /> Cadastrar
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  {mensagemAlert.map((mensagem) =>
                    mensagemDeOkay !== "Okay" ? (
                      <>
                        <AlertDialogTitle>
                          {mensagem.submitError.alertDialogTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {mensagem.submitError.alertDialogDescription}
                        </AlertDialogDescription>
                      </>
                    ) : (
                      <>
                        <AlertDialogTitle>
                          {mensagem.submitOkay.alertDialogTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {mensagem.submitOkay.alertDialogDescription}
                        </AlertDialogDescription>
                      </>
                    )
                  )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    type="submit"
                    className="cursor-pointer"
                    onClick={voltar}
                  >
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogTrigger>
          </AlertDialog>
        </form>
      </div>
    </div>
  );
}
