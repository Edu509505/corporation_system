import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useMutation,
  useQuery,
  useQueryClient,
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
  CalendarIcon,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
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

interface Medicao {
  id: number;
  idCliente: number;
  idProposta: number;
  observacao: string;
  periodoInicial: string;
  periodoFinal: string;
  faturado: string;
  createdAt: string;
}

function AdicionarNotaFiscal() {
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
  const [enabled, setEnabled] = useState<boolean>(false);
  const { data: medicao } = useQuery({
    enabled: enabled,
    queryKey: ["medicao", idProposta],
    queryFn: async () => {
      const response = await fetch(
        `${url}/getMedicoes/propostas/${idProposta}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Nenhuma Medição encontrada");
      const data = await response.json();
      return data as Medicao[];
    },
  });

  console.log("Medicoes ", medicao)

  const contratoSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    idMedicao: z.string().min(1, "Selecione a Medição"),
    valor: z.string().min(1, "Defina o valor da proposta")
      .transform((val) => {
        const clean = val.replace(/\D/g, '');
        return parseFloat(clean) / 100;
      }),
    vencimento: z.date("Defina a data para o vencimento"),
    tipo: z.string().min(1, "Selecione o tipo"),
    numeroDaNota: z.string().min(2, "Precisa conter um número"),
    anexo: z
      .instanceof(File, {
        error: "Arquivo Obrigatório"
      })
      .refine((file) => !!file, "Você deve selecionar ao menos um arquivo")
      .refine(
        (file) => file.size <= 50 * 1024 * 1024,
        "Arquivo deve ter até 50MB"
      )
      .refine(
        (file) =>
          ["application/pdf"].includes(file.type),
        "Tipo de arquivo inválido"
      ),
  });

  const form = useForm<z.infer<typeof contratoSchema>>({
    resolver: zodResolver(contratoSchema) as any,
    defaultValues: {
      idCliente: "",
      idMedicao: "",
      anexo: undefined,
      idProposta: "",
      tipo: "",
      valor: "0" as any,
      numeroDaNota: "",
    },
  });

  // const [responseOk, setResponseOk] = useState<boolean>(false);
  // const [responseNotOk, setResponseNotOk] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const criarNotaMutation = useMutation({
    mutationKey: ["createFaturamento"],
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${url}/createFaturamento`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || `Erro ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      form.reset();
      // optional: invalidate queries
      queryClient.invalidateQueries();
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error("Erro ao criar nota fiscal:", error);
    },
  });

  const onSubmit = (data: z.infer<typeof contratoSchema>) => {
    const formData = new FormData();
    formData.set("idCliente", data.idCliente);
    formData.set("idProposta", data.idProposta);
    formData.set("idMedicao", data.idMedicao);
    formData.set("valor", (parseFloat(data.valor.toString()) * 100).toString());
    formData.set("vencimento", data.vencimento.toString());
    formData.set("tipo", data.tipo);
    formData.set("numeroDaNota", data.numeroDaNota);
    if (data.anexo) formData.append("anexo", data.anexo);

    criarNotaMutation.mutate(formData);
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
        <Link to="/notasFiscais">
          <Button>
            <CircleArrowLeftIcon /> Retornar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Adicionar Nota Fiscal</h1>
        <p className="text-gray-600">Preencha os detalhe abaixo.</p>
        <p className="text-sm text-background0">
          <strong>Atenção:</strong> Ao cadastrar uma nova Nota Fiscal é
          necessário selecionar o cliente a qual essa nota pertence e a qual
          medição ela estará referenciando
        </p>
      </header>
      <main className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4  flex-wrap">
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
                        <SelectTrigger className="w-[300px] bg-white">
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        setIdProposta(value.toString());
                        setEnabled(true);
                      }}
                      defaultValue={field.value}
                      disabled={false}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px] bg-white">
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
              <FormField
                control={form.control}
                name="idMedicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicão</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={false}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px] bg-white">
                          <SelectValue placeholder="Selecionar Medição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectGroup>
                          <SelectLabel>Medições</SelectLabel>
                          {medicao?.map((medicao) => (
                            <SelectItem
                              key={medicao.id}
                              value={medicao.id.toString()}
                            >
                              {medicao.id} -
                              {format(
                                new Date(medicao.createdAt),
                                "dd/MM/yyyy"
                              )}
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
                name="numeroDaNota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número Da Nota</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        // onInputCapture={(value) => value.replace(/[^0-9]/g, '')}
                        placeholder="N° - "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vencimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vencimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-34 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          onSelect={(value) => field.onChange(value)}
                          disabled={(date) => date < new Date()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px] bg-white">
                          <SelectValue placeholder="Selecionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[300px]">
                        <SelectGroup>
                          <SelectLabel>Proposta</SelectLabel>
                          <SelectItem value="LOCACAO">Locação</SelectItem>
                          <SelectItem value="SERVICO">Serviço</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Da Nota</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <CurrencyInput field={field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="anexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolha um arquivo</FormLabel>
                  <FormControl>
                    <Empty className="border border-dashed bg-white">
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
                            accept=".pdf"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
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
              disabled={criarNotaMutation.isPending}
            >
              {criarNotaMutation.isPending ? <><Spinner/> Enviando...</> : "Cadastrar Nota Fiscal"}
            </Button>

            {/* sucesso */}
            <AlertDialog
              open={criarNotaMutation.isSuccess}
              onOpenChange={(open) => {
                if (!open) criarNotaMutation.reset();
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-ring flex items-center gap-3">
                    <CircleCheckBigIcon /> Nota cadastrada com sucesso
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Sua nota foi cadastrada e inserida no sistema
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Link to="/notasFiscais">
                    <AlertDialogAction>Continuar</AlertDialogAction>
                  </Link>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* erro */}
            <AlertDialog
              open={criarNotaMutation.isError}
              onOpenChange={(open) => {
                if (!open) criarNotaMutation.reset();
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive flex items-center gap-3">
                    <CircleX /> Erro ao cadastrar nota
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    A ação de cadastrar a nota fiscal falhou. Tente novamente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Fechar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </main>
    </div>
  );
}

function AddNotaFiscalLoading() {
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

function AddNotaFiscal() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<AddNotaFiscalLoading />}>
        <AdicionarNotaFiscal />
      </Suspense>
    </ErrorBoundary>
  );
}

export default AddNotaFiscal;
