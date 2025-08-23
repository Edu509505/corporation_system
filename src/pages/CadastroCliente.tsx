import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { CircleAlert, CircleArrowLeftIcon, CircleCheck, CircleFadingPlusIcon, CircleX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cnpj } from 'cpf-cnpj-validator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";

interface Cliente {
  cliente: string;
  cnpj: string;
  local: string;
  status: string;
  file: File | null;
}

const url = import.meta.env.VITE_API_URL;
//Qualquer Link relacionado ao Back-End sempre importar o .env como boa prática

export default function CriarCliente() {
  const navigate = useNavigate()

  const [novoCliente, setNovoCliente] = useState<Cliente>({
    cliente: '',
    cnpj: '',
    local: '',
    status: '',
    file: null
  });

  console.log(novoCliente);
  console.log(cnpj.isValid(novoCliente.cnpj))


  // function convertFileToBase64(file: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       resolve(reader.result as string);       
  //     };

  //     reader.onerror = (error) => {
  //       reject(error);
  //     };

  //     reader.readAsDataURL(file);
  //   });
  // }

  async function criarCliente(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (novoCliente.cliente.length < 3 || !cnpj.isValid(novoCliente.cnpj) || novoCliente.local.length < 3 || novoCliente.status === "") return

    // if(!novoCliente.file) return;
    // const fileBase64 = await convertFileToBase64(novoCliente.file);

    // const [, fileBase64SemAPrimeiraParte ] = fileBase64.split(',');
    // const [, ...resto] = fileBase64SemAPrimeiraParte

    try {
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
        }),
      });

    if (!response.ok) {
      // Aqui você lida com o erro de forma clara
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const body = await response.json();
    console.log("Cliente criado com sucesso:", body);

  } catch (error) {
    console.error("Falha ao criar cliente:", error);
  }
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
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
        {
          novoCliente.cnpj.length === 18 &&
            cnpj.isValid(novoCliente.cnpj) === !true ?
            <div className="text-destructive flex items-center gap-3"><CircleX />
              <h2>Cnpj Inválido</h2>
            </div>
            :
            <><h2>Digite o CNPJ</h2></>
        }
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

        <Select
          value={novoCliente.status}
          onValueChange={(event) =>
            setNovoCliente({
              ...novoCliente,
              status: event
            })
          }
        >
          <SelectTrigger className="bg-white cursor-pointer w-48">
            <SelectValue placeholder="Selecione o Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Localidade</SelectLabel>
              <SelectItem className="cursor-pointer" value="Ativo">Ativo</SelectItem>
              <SelectItem className="cursor-pointer" value="Pendente">Pendente</SelectItem>
              <SelectItem className="cursor-pointer" value="Inativo">Inativo</SelectItem>
            </SelectGroup>
          </SelectContent>

        </Select>

        <div className="flex gap-3">
          <Button type="button" variant='destructive' className="cursor-pointer" onClick={() => navigate(-1)}>
            <CircleArrowLeftIcon /> Voltar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant='default' className="cursor-pointer">
                <CircleCheck /> Cadastrar
              </Button>
              <AlertDialogContent>

                <AlertDialogHeader>
                  {novoCliente.cliente.length < 3 ||
                    !cnpj.isValid(novoCliente.cnpj) ||
                    novoCliente.local.length < 3 ||
                    novoCliente.status === "" ? (
                    <>
                      <AlertDialogTitle className="flex items-center gap-3">
                        <CircleX className="text-destructive" /> Erro ao cadastrar
                      </AlertDialogTitle>
                      <AlertDialogDescription className="flex items-center gap-3">
                        {novoCliente.cliente.length < 3 ? (<><CircleAlert /> Você precisa inserir um nome válido para o Cliente</>)
                          : !cnpj.isValid(novoCliente.cnpj) ? (<><CircleAlert /> Você precisa inserir um CNPJ válido</>)
                            : novoCliente.local.length < 3 ? (<><CircleAlert /> Você precisa inserir um local válido</>)
                              : novoCliente.status === "" ? (<><CircleAlert /> Você precisa inserir o Status do cliente</>) : ''}
                      </AlertDialogDescription>
                    </>
                  ) : (
                    <>
                      <AlertDialogTitle className="flex items-center gap-3">
                        <CircleCheck className="text-ring" /> Usuário cadastrado com sucesso
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Usuário cadastrado e inserido no sistema
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={() => { navigate(-1) }}
                        >
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </>
                  )
                  }
                </AlertDialogHeader>

              </AlertDialogContent>
            </AlertDialogTrigger>

          </AlertDialog>

        </div>
        {/* <div>
            <input type='file' className="bg-white cursor-pointer" onChange={((event) => {
              const files = event.target.files;
              if(!files) return;
              const filesArray = Array.from(files);
              const file = filesArray[0];
              setNovoCliente({
                ...novoCliente,
                file
              })
            })} />
          </div> */}

      </form>
    </div>
  );
}
