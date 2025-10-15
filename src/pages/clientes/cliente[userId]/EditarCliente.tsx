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
import { CircleArrowLeftIcon, CircleCheck, CircleX, Edit } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";

interface Cliente {
  cliente: string;
  cnpj: string;
  local: string;
  status: string;
  path: string;
}

const url = import.meta.env.VITE_API_URL;

const editarClienteSchema = z.object({
  cliente: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  cnpj: z
    .string()
    .min(18, "Escreva um cnpj válido")
    .refine((val) => cnpj.isValid(val), "Cnpj Inválido")
    .nonempty("Campo Obrigatório"),
  local: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  status: z.literal(["ATIVO", "INATIVO"], "Campo Obrigatório"),
  path: z.string(),
});
// Buscar cliente ao carregar

function UpdateCliente() {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL

  const { data: cliente } = useSuspenseQuery({
    queryKey: ["cliente", id],
    queryFn: async () => {
      const response = await fetch(`${url}/cliente/${id}`);
      if (!response.ok) throw new Error("Cliente não encontrado");
      const data = await response.json();
      return data as Cliente;
    },
  });
  const formCliente = useForm<z.infer<typeof editarClienteSchema>>({
    resolver: zodResolver(editarClienteSchema),
    defaultValues: {
      cliente: cliente?.cliente,
      cnpj: cliente?.cnpj,
      local: cliente?.local,
      status: "ATIVO" as "ATIVO" | "INATIVO",
      path: cliente?.path,
    },
  });

  useEffect(() => {
    console.log(cliente);
    if (cliente) {
      formCliente.reset({
        cliente: cliente?.cliente,
        cnpj: cliente?.cnpj,
        local: cliente?.local,
        status: cliente.status as "ATIVO",
        path: cliente?.path,
      });
    }
  }, [cliente, formCliente.reset]);

  const { mutateAsync: updateUsuario } = useMutation({
    mutationKey: ["editar-cliente", id],
    mutationFn: async ({
      id,
      cliente,
      cnpj,
      local,
      status,
      path,
    }: {
      id: number;
      cliente: string;
      cnpj: string;
      local: string;
      status: string;
      path: string;
    }) => {
      const response = await fetch(`${url}/cliente/${id}`, {
        method: "PUT", // ou PATCH, dependendo da sua API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente,
          cnpj,
          local,
          status,
          path,
        }),
      });
      console.log("parei aqui", response);
      if (!response.ok) throw new Error("Erro ao atualizar cliente");
      console.log("cheguei aqui");
      setResponseOk(true);
    },
  });

  const onSubmit = async (data: z.infer<typeof editarClienteSchema>) => {
    console.log(data);

    await updateUsuario({
      id: Number(id),
      cliente: data.cliente,
      cnpj: data.cnpj,
      local: data.local,
      status: data.status,
      path: data.path,
    });
  };

  const [responseOk, setResponseOk] = useState(false);
  return (
    <div className="w-full h-screen flex flex-col p-4 gap-3 bg-gray-50">
      <div className="flex gap-3 items-center">
        <Edit className="size-10" />
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
      </div>
      <Form {...formCliente}>
        <form
          onSubmit={formCliente.handleSubmit(onSubmit)}
          className="flex gap-3 flex-col"
        >
          <FormField
            control={formCliente.control}
            name="cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insira o CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="CNPJ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="local"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Escolha um Local</FormLabel>
                <FormControl>
                  <Input placeholder="Local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Selecionar Proposta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-[300px]">
                    <SelectGroup>
                      <SelectLabel>Proposta</SelectLabel>
                      <SelectItem value="ATIVO">Ativo</SelectItem>
                      <SelectItem value="INATIVO">Inativo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formCliente.control}
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domínio Opicional</FormLabel>
                <FormControl>
                  <Input placeholder="Domínio" {...field} />
                </FormControl>
                <FormLabel className="text-gray-500">
                  O cliente possui algum domínio? Exemplo: cliente.com.br
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <Link to={"/clientes"}>
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
              >
                <CircleArrowLeftIcon /> Voltar
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="submit"
                  variant="default"
                  className="cursor-pointer"
                >
                  <CircleCheck /> Cadastrar
                </Button>
              </AlertDialogTrigger>
              {!responseOk ? (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3 text-destructive">
                      <CircleX />
                      Não foi possível cadastrar o usuário
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tente novamente mais tarde
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Continuar
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              ) : (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3 text-ring">
                      <CircleCheck />
                      Cadastro de Usuario atualizado com sucesso
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      As informações do usario foram atualizados e inserido no
                      sistema
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <Link to={"/clientes"}>
                        <AlertDialogAction className="cursor-pointer">
                          Continuar
                        </AlertDialogAction>
                      </Link>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              )}
            </AlertDialog>
          </div>
        </form>
      </Form>
    </div>
  );
}

function UpdateClienteLoading() {
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
}
function ErrorFallback({
  error,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return <div className="p-5 text-destructive">Erro: {error.message}</div>;
}

export default function EditarCliente() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<UpdateClienteLoading />}>
        <UpdateCliente />
      </Suspense>
    </ErrorBoundary>
  );
}
