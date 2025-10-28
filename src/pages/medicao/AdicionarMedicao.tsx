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
  noop,
  useQuery,
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
  CalendarIcon,
  CircleArrowLeftIcon,
  CircleCheckBigIcon,
  CircleX,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";

const url = import.meta.env.VITE_API_URL;

interface Cliente {
  id: number;
  cliente: string;
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
      const response = await fetch(`${url}/clientes/`);
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
          `${url}/cliente/${idCliente}/propostasAprovadas`
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
    observacao: z.string(),
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    periodoInicial: z.date("Data Inicial Obrigatória"),
    periodoFinal: z.date("Data Final Obrigatória"),
  });

  const form = useForm<z.infer<typeof contratoSchema>>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      idCliente: "",
      observacao: "",
      idProposta: "",
    },
  });

  const [responseOk, setResponseOk] = useState<boolean>(false);
  const [responseNotOk, setResponseNotOk] = useState<boolean>(false);

  const [dataInicial, setDataInicial] = useState<Date | null>(null);
  const [dataFinal, setDataFinal] = useState<Date | null>(null);

  console.log("Data Inicial", dataInicial);
  console.log("Data Final", dataFinal);
  console.log("As duas datas", dataInicial && dataFinal);

  const { data: periodo } = useSuspenseQuery({
    queryKey: ["getPeriodoDeObra"],
    queryFn: async () => {
      const response = await fetch(`${url}/usuarios`);
      if (!response.ok) throw new Error("Propostas não encontradas");
      const data = await response.json();
      return data;
    },
  });

  console.log("Periodo", periodo);

  const onSubmit = async (data: z.infer<typeof contratoSchema>) => {
    console.log("data ", data);

    try {
      const form = new FormData();

      form.set("idCliente", data.idCliente);
      form.set("idProposta", data.idProposta);
      form.set("observacao", data.observacao);

      setResponseOk(true);
      const response = await fetch(`${url}/contrato`, {
        method: "POST",
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
        <Link to="/medicao">
          <Button>
            <CircleArrowLeftIcon /> Retornar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Fechamento de Medição</h1>
        <p className="text-gray-600">
          Selecoine o período para preencher os itens que pertencem a esse
          fechamento.
        </p>
        <p className="text-sm text-gray-500">
          <strong>Observação:</strong> Para iniciar o fechamento da medição,
          selecione o cliente e a proposta. Em seguida, defina o período
          desejado.
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
                      //value={idCliente.id}
                      onValueChange={(value) => {
                        setIdCliente(value.toString());
                        field.onChange(value);
                        propostasAprovadas;
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="[w-300px]">
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
                              {cliente.cliente}
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
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação - Opicional</FormLabel>
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
            <h1>Selecione um período para que seja feito o fechamento</h1>
            <section className="flex gap-3">
              <FormField
                control={form.control}
                name="periodoInicial"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Inicial</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d/MM/yy")
                            ) : (
                              <span>Selecionar Data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => (
                            field.onChange(value), setDataInicial(value as Date)
                          )}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Escolha a data inicial</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="periodoFinal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Final</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d/MM/yy")
                            ) : (
                              <span>Selecionar Data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => (
                            field.onChange(value), setDataFinal(value as Date)
                          )}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Escolha a data inicial</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
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
