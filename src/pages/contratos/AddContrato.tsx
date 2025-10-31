import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Suspense, useState } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  CircleArrowLeftIcon,
  CircleCheckBigIcon,
  CircleX,
  Paperclip,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";

const url = import.meta.env.VITE_API_URL;

interface Cliente {
  id: number;
  name: string;
  cnpj: string;
  proposta: string;
}

interface Propostas {
  id: number;
  idCliente: number;
  nomeDaProposta: string;
  statusProposta: string;
}

function AdicionarContrato() {
  const { data: clientes } = useSuspenseQuery({
    queryKey: ["clientes", ""],
    queryFn: async () => {
      const response = await fetch(`${url}/clientes`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Clientes não encontrados");
      const data = await response.json();
      return data as Cliente[];
    },
  });

  const [idCliente, setIdCliente] = useState<string | undefined>(undefined);

  const { data: propostasAprovadas } = useSuspenseQuery({
    queryKey: ["propostasAprovadas", idCliente],
    queryFn: async () => {
      if (idCliente !== "") {
        const response = await fetch(
          `${url}/cliente/${idCliente}/propostasAprovadas`,{
            method: "GET",
            credentials: "include"
          }
        );
        if (!response.ok) throw new Error("Propostas não encontradas");
        const data = await response.json();
        return data as Propostas[];
      } else {
        return;
      }
    },
  });

  const contratoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    anexo: z
      .instanceof(FileList)
      .refine(
        (files) => files?.length >= 1,
        "Você deve selecionar ao menos um arquivo"
      )
      .refine(
        (files) => files?.[0]?.size <= 15 * 1024 * 1024,
        "Arquivo deve ter até 50MB"
      )
      .refine(
        (files) =>
          ["image/jpeg", "image/png", "application/pdf"].includes(
            files?.[0]?.type
          ),
        "Tipo de arquivo inválido"
      ),
  });

  const form = useForm<z.infer<typeof contratoSchema>>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      idCliente: "",
      titulo: "",
      anexo: undefined,
      idProposta: "",
    },
  });

  const [responseOk, setResponseOk] = useState<boolean>(false);
  const [responseNotOk, setResponseNotOk] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof contratoSchema>) => {
    console.log("data ", data);
    console.log("files: ", data.anexo.length);

    try {
      const form = new FormData();

      form.set("idCliente", data.idCliente);
      form.set("idProposta", data.idProposta);
      form.set("titulo", data.titulo);

      for (let i = 0; i < data.anexo.length; i++) {
        console.log(data.anexo[i]);
        form.append("anexo", data.anexo[i]);
      }
      setResponseOk(true);
      const response = await fetch(`${url}/contrato`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      console.log("response", response);
      if (!response.ok) {
        // Aqui você lida com o erro de forma clara
        setResponseNotOk(true);
        setResponseOk(false);
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      console.log("estou aqui");
      const body = await response.json();
      setResponseOk(true);
      setResponseNotOk(false);
      console.log("Cliente criado com sucesso:", body);
    } catch {}
  };
  return (
    <div className="flex flex-col bg-gray-50 w-full gap-3 p-4">
      <header>
        <Link to="/contratos">
          <Button>
            <CircleArrowLeftIcon /> Retornar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Adicionar Contrato</h1>
        <p className="text-gray-600">
          Preencha os detalhes do novo contrato abaixo.
        </p>
        <p className="text-sm text-gray-500">
          <strong>Atenção:</strong> O preenchimento do contrato deve ser
          realizado em comum acordo entre ambas as partes envolvidas, garantindo
          que todas as informações estejam corretas, completas e devidamente
          validadas. É fundamental que os dados inseridos reflitam fielmente os
          termos negociados, evitando divergências futuras e assegurando a
          conformidade legal do documento.
        </p>
      </header>
      <main className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4 flex-wrap">
              <FormField
                control={form.control}
                name="idCliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        setIdCliente(value.toString());
                        field.onChange(value);
                        propostasAprovadas;
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Selecionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectGroup>
                          <SelectLabel>Clientes</SelectLabel>
                          {clientes?.map((cliente) => (
                            <SelectItem
                              key={cliente.id}
                              value={cliente.id.toString()}
                            >
                              {cliente.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idProposta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposta</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={false}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Selecionar Proposta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectGroup>
                          <SelectLabel>Proposta</SelectLabel>
                          {propostasAprovadas?.map((proposta) => (
                            <SelectItem
                              key={proposta.id}
                              value={proposta.id.toString()}
                            >
                              {proposta.nomeDaProposta}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="Título do contrato" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira o título do contrato.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolha um arquivo</FormLabel>
                  <FormControl>
                    <Empty className="border border-dashed">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Paperclip />
                        </EmptyMedia>
                        <EmptyTitle>Selecione um Arquivo</EmptyTitle>
                        <EmptyDescription>
                          Escolha um aruivo de seu dispositivo para realizar o
                          Upload
                          <Input
                            className="cursor-pointer"
                            type="file"
                            multiple
                            accept=".jpg,.png,.pdf"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 cursor-pointer"
              variant="default"
            >
              Cadastrar Contrato
            </Button>
            <AlertDialog
              open={responseOk}
              onOpenChange={(open) => {
                setResponseOk(open);
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-ring flex items-center gap-3">
                    <CircleCheckBigIcon /> Contrato cadastrado com sucesso
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Seu contrato foi cadastrado e inserido no sistema
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Link to="/contratos">
                    <AlertDialogAction>Continuar</AlertDialogAction>
                  </Link>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog
              open={responseNotOk}
              onOpenChange={(open) => {
                setResponseNotOk(open);
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive flex items-center gap-3">
                    <CircleX /> Erro ao cadastrar contrato
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    A ação de cadastrar o contrato foi mal-sucedida
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </main>
    </div>
  );
}

function AddContratoIsLoading() {
  return (
    <div className="w-full flex flex-col flex-wrap gap-2 p-4 ">
      <Skeleton className="h-9 w-25" />
      <Skeleton className="h-9 w-80" />
      <Skeleton className="h-5 w-115" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-75" />
      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-90" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-90" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-25" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-5 w-50" />
      </div>
      <div className=" flex flex-wrap gap-3">
        <Skeleton className="h-5 w-25" />
        <Skeleton className="h-100 w-full" />
      </div>
      <div className="w-full flex justify-center items-center flex-wrap gap-3">
        <Skeleton className="h-12 w-100" />
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

function AddContrato() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<AddContratoIsLoading />}>
        <AdicionarContrato />
      </Suspense>
    </ErrorBoundary>
  );
}

export default AddContrato;
