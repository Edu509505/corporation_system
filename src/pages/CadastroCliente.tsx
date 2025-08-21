import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleCheck, CircleFadingPlusIcon, CircleX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cnpj } from 'cpf-cnpj-validator'
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
  console.log(cnpj.isValid(novoCliente.cnpj))

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

  let verificacao = false;

  if(novoCliente.cliente.length >= 3){
    if(cnpj.isValid(novoCliente.cnpj) === true){
      if(novoCliente.local.length > 3){
        verificacao = true
      }
    }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[url('./src/assets/img/IMG-20240823-WA0007.jpg')] bg-cover bg-center">
      <div className="w-full h-full flex flex-col backdrop-blur-xl bg-[rgba(255,255,255,0.50)]">
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
          {novoCliente.cnpj.length === 18 && cnpj.isValid(novoCliente.cnpj) === !true ? <div className="text-destructive flex items-center gap-3"><CircleX /> <h2>Cnpj Inválido</h2></div> : ''}
          <Input
            type="text"
            name="cnpj"
            maxLength={18}
            placeholder="Cnpj do cliente"
            value={novoCliente.cnpj}
            onChange={(event) =>
              setNovoCliente({
                ...novoCliente,
                cnpj: cnpj.format(event.target.value)
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
                    {verificacao === true ? (
                      <>
                        <AlertDialogTitle>
                          Cliente Cadastrado!
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Cliente foi cadastrado com sucesso!
                        </AlertDialogDescription>

                        <AlertDialogFooter>
                          <AlertDialogAction
                            type="button"
                            className="cursor-pointer"
                            onClick={voltar}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </>
                    ) : (
                      <>
                        <AlertDialogTitle>
                          Erro ao cadastrar usuário
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Você precisa preencher todos os campos para que o cadastro seja realizado
                        </AlertDialogDescription>
                      </>
                    )
                  }
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialogTrigger>
          </AlertDialog>
        </form>
      </div>
    </div>
  );
}
