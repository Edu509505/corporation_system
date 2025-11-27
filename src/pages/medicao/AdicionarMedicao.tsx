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
  useMutation,
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
  CircleCheck,
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
  AlertDialogTrigger,
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
import PeriodoFechamento from "@/components/medicao/periodoFechamento";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

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
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await fetch(`${url}/clientes`, {
        method: "GET",
        credentials: "include",
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
          `${url}/cliente/${idCliente}/propostasAprovadas`,
          {
            method: "GET",
            credentials: "include",
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

  const [idProposta, setIdProposta] = useState<string | undefined>(undefined);

  const medicaoSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    observacao: z.string(),
    periodoInicial: z.date("Data Inicial Obrigatória"),
    periodoFinal: z.date("Data Final Obrigatória"),
  });

  const form = useForm<z.infer<typeof medicaoSchema>>({
    resolver: zodResolver(medicaoSchema),
    defaultValues: {
      idCliente: "",
      idProposta: "",
      observacao: "",
    },
  });

  const [dataInicial, setDataInicial] = useState<Date | null>(null);
  const [dataFinal, setDataFinal] = useState<Date | null>(null);

  const [desableSelectProposta, setDesableSelectProposta] =
    useState<boolean>(true);
  const [periodoInicial, setPeriodoInicial] = useState<boolean>(true);
  const [periodoFinal, setPeriodoFinal] = useState<boolean>(true);

  const criarMedicao = useMutation({
    mutationKey: ["criarMedicao"],
    mutationFn: async (data: z.infer<typeof medicaoSchema>) => {
      const response = await fetch(`${url}/criarMedicao`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      return response.json();
    },
  });

  //AQUI É FEITO O REGISTRO
  const onSubmit = async (data: z.infer<typeof medicaoSchema>) => {
    toast.promise(criarMedicao.mutateAsync(data), {
      loading: "Cadastrando Medição...",
      success: () => "Medição cadastrada com sucesso!",
      error: (err) => `Erro: ${(err as Error).message}`,
    });
    form.reset();
  };
  return (
    <div className="flex flex-col bg-background w-full gap-3 p-4">
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
        <p className="text-sm text-background0">
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
                      onValueChange={(value) => {
                        setIdCliente(value.toString());
                        field.onChange(value);
                        propostasAprovadas;
                        setDesableSelectProposta(false);
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
                    <FormLabel>Obra</FormLabel>
                    <Select
                      onValueChange={(value) => (
                        setIdProposta(value.toString()),
                        field.onChange(value),
                        setPeriodoInicial(false)
                      )}
                      defaultValue={field.value}
                      disabled={desableSelectProposta}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder="Selecionar Obra" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectGroup>
                          <SelectLabel>Obras</SelectLabel>
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
                    <Input placeholder="Observação" {...field} />
                  </FormControl>
                  <FormDescription>Inserir Observação.</FormDescription>
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
                              "w-34 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={periodoInicial}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
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
                            field.onChange(value),
                            setDataInicial(value as Date),
                            setPeriodoFinal(false)
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
                              "w-34 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={periodoFinal}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
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
                            date > new Date() ||
                            date < new Date("1900-01-01") ||
                            date < new Date(dataInicial as Date) ||
                            dataInicial == null
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
            {dataInicial && dataFinal ? (
              <PeriodoFechamento
                dataInicial={dataInicial}
                dataFinal={dataFinal}
                idProposta={idProposta}
              />
            ) : (
              <h1>Nenhum Periodo Selecionado</h1>
            )}
            <AlertDialog open={criarMedicao.isSuccess || criarMedicao.isError}>
              <AlertDialogTrigger asChild>
                <Button
                  type="submit"
                  disabled={criarMedicao.isPending}
                  className="cursor-pointer"
                >
                  {criarMedicao.isPending ? (
                    <>
                      <Spinner /> Cadastrar
                    </>
                  ) : (
                    <>
                      <CircleCheck /> Cadastrar
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              {criarMedicao.isError ? (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3 text-destructive">
                      <CircleX />
                      Não foi possível cadastrar o Medição
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tente novamente mais tarde
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">
                        Voltar
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              ) : (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-3 text-ring">
                      <CircleCheck />
                      Medição cadastrada com sucesso
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Medição cadastrada e inserido no sistema
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <Link to={"/medicao"}>
                        <AlertDialogAction className="cursor-pointer">
                          Continuar
                        </AlertDialogAction>
                      </Link>
                    </AlertDialogFooter>
                  </AlertDialogHeader>
                </AlertDialogContent>
              )}
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
