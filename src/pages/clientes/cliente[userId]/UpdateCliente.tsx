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
import { CircleAlert, CircleArrowLeftIcon, CircleCheck, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cnpj } from 'cpf-cnpj-validator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";

interface Cliente {
  cliente: string;
  cnpj: string;
  local: string;
  status: string;
}

const url = import.meta.env.VITE_API_URL;

export default function EditarCliente() {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente>({
    cliente: '',
    cnpj: '',
    local: '',
    status: '',
  });

  const [loading, setLoading] = useState(true);
  const [responseOk, setResponseOk] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar cliente ao montar o componente
  useEffect(() => {
    async function fetchCliente() {
      try {
        const response = await fetch(`${url}/clientes/${id}`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar cliente: ${response.status}`);
        }
        const data: Cliente = await response.json();

        setCliente({
          cliente: data.cliente,
          cnpj: cnpj.format(data.cnpj),
          local: data.local,
          status: data.status,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCliente();
    } else {
      setError("ID do cliente não fornecido.");
      setLoading(false);
    }
  }, [id]);

  // Atualizar cliente
  async function atualizarCliente(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      cliente.cliente.length < 3 ||
      !cnpj.isValid(cliente.cnpj) ||
      cliente.local.length < 3 ||
      cliente.status === ""
    ) {
      return;
    }

    try {
      const response = await fetch(`${url}/clientes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: cliente.cliente,
          cnpj: cliente.cnpj.replace(/\D/g, ""),
          local: cliente.local,
          status: cliente.status,
        }),
      });

      if (!response.ok) {
        setResponseOk(false);
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const body = await response.json();
      console.log("Cliente atualizado com sucesso:", body);
      setResponseOk(true);
    } catch (error) {
      console.error("Falha ao atualizar cliente:", error);
      setResponseOk(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Carregando dados do cliente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-destructive text-center">
          <CircleX className="mx-auto size-10" />
          <h2>Erro</h2>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <form onSubmit={atualizarCliente} className="flex gap-3 flex-col p-5">
        <div className="flex gap-3 items-center">
          <CircleCheck className="size-10 text-blue-600" />
          <h1 className="text-2xl font-bold">Editar Cliente</h1>
        </div>

        <Input
          type="text"
          name="cliente"
          placeholder="Nome do cliente"
          value={cliente.cliente}
          onChange={(e) =>
            setCliente({
              ...cliente,
              cliente: e.target.value,
            })
          }
          className="bg-white"
        />

        <div>
          <h2>Digite o CNPJ</h2>
          {cliente.cnpj.length === 18 && !cnpj.isValid(cliente.cnpj) && (
            <div className="text-destructive flex items-center gap-1 mt-1">
              <CircleX className="size-4" />
              <span className="text-sm">CNPJ inválido</span>
            </div>
          )}
        </div>

        <Input
          type="text"
          name="cnpj"
          maxLength={18}
          placeholder="CNPJ do cliente"
          value={cliente.cnpj}
          onChange={(e) =>
            setCliente({
              ...cliente,
              cnpj: cnpj.format(e.target.value),
            })
          }
          className="bg-white"
        />

        <Input
          type="text"
          name="local"
          placeholder="Local do cliente"
          value={cliente.local}
          onChange={(e) =>
            setCliente({
              ...cliente,
              local: e.target.value,
            })
          }
          className="bg-white"
        />

        <Select
          value={cliente.status}
          onValueChange={(value) =>
            setCliente({
              ...cliente,
              status: value,
            })
          }
        >
          <SelectTrigger className="bg-white cursor-pointer w-48">
            <SelectValue placeholder="Selecione o Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem className="cursor-pointer" value="Ativo">
                Ativo
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Pendente">
                Pendente
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Inativo">
                Inativo
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <CircleArrowLeftIcon /> Voltar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" className="cursor-pointer">
                <CircleCheck /> Salvar Alterações
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                {cliente.cliente.length < 3 ||
                !cnpj.isValid(cliente.cnpj) ||
                cliente.local.length < 3 ||
                cliente.status === "" ||
                !responseOk ? (
                  <>
                    <AlertDialogTitle className="flex items-center gap-3 text-destructive">
                      <CircleX /> Erro ao salvar
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex items-center gap-3">
                      {cliente.cliente.length < 3 ? (
                        <><CircleAlert /> Nome deve ter pelo menos 3 caracteres</>
                      ) : !cnpj.isValid(cliente.cnpj) ? (
                        <><CircleAlert /> CNPJ inválido</>
                      ) : cliente.local.length < 3 ? (
                        <><CircleAlert /> Local deve ter pelo menos 3 caracteres</>
                      ) : cliente.status === "" ? (
                        <><CircleAlert /> Selecione um status</>
                      ) : !responseOk ? (
                        <><CircleX /> Erro interno no servidor</>
                      ) : null}
                    </AlertDialogDescription>
                  </>
                ) : (
                  <>
                    <AlertDialogTitle className="flex items-center gap-3 text-green-600">
                      <CircleCheck /> Cliente atualizado com sucesso!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      As alterações foram salvas no sistema.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={() => navigate(-1)}
                      >
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </>
                )}
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  );
}