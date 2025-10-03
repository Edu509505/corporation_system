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
import {
  CircleAlert,
  CircleArrowLeftIcon,
  CircleCheck,
  CircleX,
  Edit,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

interface Cliente {
  cliente: string;
  cnpj: string;
  local: string;
  status: string;
  // file: File | null; // opcional, caso use upload
}

const url = import.meta.env.VITE_API_URL;

export default function EditarCliente() {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente>({
    cliente: "",
    cnpj: "",
    local: "",
    status: "",
    // file: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseOk, setResponseOk] = useState(true);

  // Buscar cliente ao carregar
  useEffect(() => {
    async function fetchCliente() {
      try {
        const response = await fetch(`${url}/cliente/${id}`);
        if (!response.ok) throw new Error("Cliente não encontrado");
        const data = await response.json();
        setCliente({
          cliente: data.cliente || "",
          cnpj: cnpj.format(data.cnpj || ""),
          local: data.local || "",
          status: data.status || "",
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCliente();
    else {
      setError("ID inválido");
      setLoading(false);
    }
  }, [id]);

  // Atualizar cliente
  async function atualizarCliente(e: React.FormEvent) {
    e.preventDefault();

    if (
      cliente.cliente.length < 3 ||
      !cnpj.isValid(cliente.cnpj) ||
      cliente.local.length < 3 ||
      cliente.status === ""
    )
      return;
    try {
      const response = await fetch(`${url}/clientes/${id}`, {
        method: "PUT", // ou PATCH, dependendo da sua API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: cliente.cliente,
          cnpj: cnpj.strip(cliente.cnpj),
          local: cliente.local,
          status: cliente.status,
        }),
      });

      if (!response.ok) {
        setResponseOk(false);
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      setResponseOk(true);
    } catch (err) {
      console.error("Falha ao atualizar cliente:", err);
      setResponseOk(false);
    }
  }

  if (loading)
    return (
      <div className="p-5 gap-5 flex flex-col">
        <Skeleton className="h-9 w-58" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9" />
        <Skeleton className="h-9 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-25" />
          <Skeleton className="h-9 w-50" />
        </div>
      </div>
    );

  if (error) return <div className="p-5 text-destructive">Erro: {error}</div>;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <form onSubmit={atualizarCliente} className="flex gap-3 flex-col p-5">
        <div className="flex gap-3 items-center">
          <Edit className="size-6" />
          <h1 className="text-2xl font-bold">Editar Cliente</h1>
        </div>

        <Label>Insira o nome do cliente</Label>
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

        {/* Validação CNPJ */}
        <Label>Insira o cnpj do cliente</Label>
        {cliente.cnpj.length === 18 && !cnpj.isValid(cliente.cnpj) && (
          <div className="text-destructive flex items-center gap-3 text-sm leading-none font-medium">
            <CircleX className="size-[18px]" />
            <h2>CNPJ Inválido</h2>
          </div>
        )}

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

        <Label>Insira o local do cliente</Label>
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

        <Label>Insira a situação inicial</Label>
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
            className="cursor-pointer"
            type="button"
            variant="destructive"
            onClick={() => navigate(-1)}
          >
            <CircleArrowLeftIcon /> Voltar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="submit"
                variant="default"
                className="cursor-pointer"
              >
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
                      <CircleX /> Erro ao atualizar
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex items-center gap-3">
                      {cliente.cliente.length < 3 ? (
                        <>
                          <CircleAlert /> Nome do cliente inválido
                        </>
                      ) : !cnpj.isValid(cliente.cnpj) ? (
                        <>
                          <CircleAlert /> CNPJ inválido
                        </>
                      ) : cliente.local.length < 3 ? (
                        <>
                          <CircleAlert /> Local inválido
                        </>
                      ) : cliente.status === "" ? (
                        <>
                          <CircleAlert /> Selecione um status
                        </>
                      ) : (
                        <>
                          <CircleX /> Erro interno no servidor
                        </>
                      )}
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogAction className="cursor-pointer">
                        Retornar
                      </AlertDialogAction>
                    </AlertDialogFooter>
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
