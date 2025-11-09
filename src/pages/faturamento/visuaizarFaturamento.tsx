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

function VisualizarNotaFiscal() {
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

  const contratoSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    idMedicao: z.string().min(1, "Selecione a Medição"),
    valor: z.string().min(1, "Deina um valor"),
    vencimento: z.date("Defina a data para o vencimento"),
    tipo: z.string().min(1, "Selecione o tipo"),
    anexo: z
      .instanceof(File)
      .refine((file) => !!file, "Você deve selecionar ao menos um arquivo")
      .refine(
        (file) => file.size <= 50 * 1024 * 1024,
        "Arquivo deve ter até 50MB"
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
        "Tipo de arquivo inválido"
      ),
  });

  const form = useForm<z.infer<typeof contratoSchema>>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      idCliente: "",
      idMedicao: "",
      anexo: undefined,
      idProposta: "",
      tipo: "",
      valor: "",
    },
  });

  const [responseOk, setResponseOk] = useState<boolean>(false);
  const [responseNotOk, setResponseNotOk] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof contratoSchema>) => {
    console.log("data ", data);
    console.log("files: ", data.anexo);

    try {
      const form = new FormData();

      form.set("idCliente", data.idCliente);
      form.set("idProposta", data.idProposta);
      form.set("idMedicao", data.idMedicao);
      form.set("valor", data.valor);
      form.set("vencimento", data.vencimento.toString());
      form.set("tipo", data.tipo);
      form.append("anexo", data.anexo);

      for (let [key, value] of form.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("FORM ", form);

      const response = await fetch(`${url}/createFaturamento`, {
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
        <h1 className="text-2xl font-bold">Visualizar Nota Fiscal</h1>
        <p className="text-gray-600">Preencha os detalhe abaixo.</p>
        <p className="text-sm text-gray-500">
          <strong>Atenção:</strong> Ao cadastrar uma nova Nota Fiscal é
          necessário selecionar o cliente a qual essa nota pertence e a qual
          mediçõa ela estará referenciando
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        setIdProposta(value.toString());
                        setEnabled(true);
                      }}
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
              <FormField
                control={form.control}
                name="idMedicao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medicao</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={false}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[300px]">
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
                        <SelectTrigger className="w-[300px]">
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
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="R$ - " {...field} />
                    </FormControl>
                    <FormMessage />
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
                            accept=".jpg,.png,.pdf"
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
            >
              Cadastrar Nota Fiscal
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

function VisualizarNotaFiscalLoading() {
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

function VisuNotaFiscal() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<VisualizarNotaFiscalLoading />}>
        <VisualizarNotaFiscal />
      </Suspense>
    </ErrorBoundary>
  );
}

export default VisuNotaFiscal;
