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
import { Suspense, useEffect, useRef, useState } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "@/components/ui/spinner";

const url = import.meta.env.VITE_API_URL;

interface Cliente {
  id: number;
  name: string;
  cnpj: string;
  proposta: string;
}

function AddProposta() {
  const { data: clientes } = useSuspenseQuery({
    queryKey: ["clientes", ],
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

  const propostaSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    nomeDaProposta: z.string().min(1, "Escreva o nome da Proposta"),
    descricao: z.string().min(1, "Recomendado ter uma descrição"),
    valorProposta: z.string().min(1, "Defina o valor da proposta")
    .transform((val) => {
      const clean = val.replace(/\D/g, '');
      return parseFloat(clean) / 100;
    }),
    files: z
      .instanceof(FileList, {
        error: "Arquivo Obrigatório"
      })
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
          ["application/pdf"].includes(
            files?.[0]?.type
          ),
        "Tipo de arquivo inválido"
      ),
  });

  const form = useForm<z.infer<typeof propostaSchema>>({
    resolver: zodResolver(propostaSchema) as any,
    defaultValues: {
      idCliente: "",
      nomeDaProposta: "",
      descricao: "",
      valorProposta: "" as any,
      files: undefined
    },
  });

  const [responseOk, setResponseOk] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [alertDialog, setAlertDialog] = useState<boolean>(false)



  const onSubmit = async (data: z.infer<typeof propostaSchema>) => {
    try {

      setIsLoading(true)

      const form = new FormData();

      form.set("idCliente", data.idCliente);
      form.set("nomeDaProposta", data.nomeDaProposta);
      form.set("descricao", data.descricao);
      form.set("valorProposta", (parseFloat(data.valorProposta.toString())*100).toString());

      for (let i = 0; i < data.files.length; i++) {
        form.append("files", data.files[i]);
      }

      const response = await fetch(`${url}/proposta`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!response.ok) {
        // Aqui você lida com o erro de forma clara
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      // const body = await response.json();
      setResponseOk(true);
    } catch { } finally { setIsLoading(false), setAlertDialog(true) }

  };

  function CurrencyInput({ field }: { field: any }) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const raw = target.value.replace(/\D/g, '');
        const number = parseFloat(raw) / 100;
        const formatted = number.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        target.value = formatted;
        field.onChange(formatted); // atualiza o valor no RHF
      };

      const input = inputRef.current;
      input?.addEventListener('input', handleInput);

      return () => input?.removeEventListener('input', handleInput);
    }, [field]);

    return (
      <Input
        placeholder="R$ -"
        ref={inputRef}
        defaultValue={field.value}
        name={field.name}
      />
    );
  }


  return (
    <div className="flex flex-col bg-background w-full gap-3 p-4">
      <header>
        <Link to="/propostas">
          <Button>
            <CircleArrowLeftIcon /> Retornar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Adicionar Proposta</h1>
        <p className="text-gray-600">
          Preencha os detalhes da proposta abaixo.
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
                        field.onChange(value);
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
            </div>
            <FormField
              control={form.control}
              name="nomeDaProposta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Da Proposta</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="Nome Da Proposta" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira o nome da proposta
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira a descrição.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valorProposta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Da Proposta</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <CurrencyInput field={field} />
                  </FormControl>
                  <FormDescription>
                    Escreva um valor
                  </FormDescription>
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="files"
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
                            accept=".pdf"
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

            <AlertDialog
              open={alertDialog}
              defaultOpen={alertDialog}
            >
              <AlertDialogTrigger>
                <Button
                  type="submit"
                  className="mt-4 cursor-pointer"
                  variant="default"
                  disabled={isLoading}

                >
                  {isLoading ? <><Spinner /> Criar Proposta</> : <>Criar Proposta</>}

                </Button>
              </AlertDialogTrigger>
              {responseOk ?
                (

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
                      <Link to="/propostas">
                        <AlertDialogAction
                          className="cursor-pointer">Continuar</AlertDialogAction>
                      </Link>
                    </AlertDialogFooter>
                  </AlertDialogContent>

                ) : (

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-destructive flex items-center gap-3">
                        <CircleX /> Erro ao cadastrar proposta
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        A ação de cadastrar o proposta foi mal-sucedida
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        className="cursor-pointer"
                        onClick={() => setAlertDialog(false)}
                      >Voltar</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
            </AlertDialog>
          </form>
        </Form>
      </main>
    </div>
  );
}

function AddPropostaIsLoading() {
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

function AdicionarProposta() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<AddPropostaIsLoading />}>
        <AddProposta />
      </Suspense>
    </ErrorBoundary>
  );
}

export default AdicionarProposta;
