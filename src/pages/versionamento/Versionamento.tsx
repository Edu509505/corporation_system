import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowLeftIcon,
  CircleCheckBig,
  CirclePlus,
  CircleX,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useMutation,
  useQuery,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import StatusDeAprovacao from "@/components/componentsVersionamento/StatusDeAprovaao";
import InfoClientes from "@/components/componentsVersionamento/informacoesCliente";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatToBRL, formatToNumber } from "brazilian-values";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import PdfView from "@/components/pdfView";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const url = import.meta.env.VITE_API_URL;

interface Versionamento {
  id: number;
  versao: number;
  idProposta: number;
  status: string;
  createdAt: string;
  anexos: string;
}

// interface versionamentoAprovado {
//   id: number;
//   idProposta: number;
//   status: string;
//   updateAt: string;
// }

interface Propostas {
  id: number;
  nomeDaProposta: string;
  descricao: string;
  createdAt: string;
  valorProposta: number;
  cliente: {
    name: string;
    cnpj: string;
  };
}

interface Quantitativa {
  id: number;
  idVersionamento: number;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  unidadeDeMedida: string;
}

interface AnexoVersionamento {
  url: string;
  path: string;
}

let valorInicial = "0" as string;

function CurrencyInput2({
  onValueChange,
}: {
  onValueChange: (valor: number) => void;
}) {
  const [displayValue, setDisplayValue] = useState(`${valorInicial}`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const number = parseFloat(raw) / 100;

    const formatted = isNaN(number)
      ? ""
      : number.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

    setDisplayValue(formatted); // 🔁 atualiza o input
    onValueChange(isNaN(number) ? 0 : number); // 🔎 envia o número pro pai
  };

  return (
    <Input
      placeholder="R$ -"
      value={displayValue}
      onChange={handleChange}
      name="currency"
    />
  );
}

function VersionamentoPage() {
  const { id } = useParams<{ id: string }>();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [idVersao, setidVersao] = useState<number | null>(null);
  const [idVersionamento, setIdVersionamento] = useState<number | null>(null);
  const [isLoadingRefetch, setIsLoadingRefetch] = useState(false);

  //Carroucel

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === fetchAnexoVersionamento.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? fetchAnexoVersionamento.length - 1 : prev - 1
    );
  };

  //ATUALIZA O STATUS DO VERSINAMENTO E JOGA PARA O BANCO

  const {
    data: fetchAnexoVersionamento = [],
    refetch: refetchAnexoVersionamentos,
  } = useQuery({
    queryKey: ["fetchAnexoVersionamento", idVersao],
    queryFn: async () => {
      if (!idVersao) return []; // Retorna array vazio se idVersao for null

      const response = await fetch(
        `${url}/versionamento/${idVersao}/anexos/urls`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok)
        throw new Error("Não foi possível encontrar o anexo do Versionamento");
      const data = await response.json();

      // A API retorna { url: [...urls] }, então pegamos o array de urls
      const urlArray = data.url || data.urls || data.anexos || [];

      // Transformamos em array de objetos com a estrutura esperada
      const anexos = Array.isArray(urlArray)
        ? urlArray.map((urlString: string) => ({ url: urlString }))
        : [];
      return anexos as AnexoVersionamento[];
    },
    enabled: !!idVersao, // Só executa a query se idVersao existir
  });

  const { data: proposta, refetch: refetchProposta } = useSuspenseQuery({
    queryKey: ["proposta", id],
    queryFn: async () => {
      const response = await fetch(`${url}/proposta/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Propostas;
    },
  });

  const [valorProposta, setValorProposta] = useState<number>(0);

  console.log(proposta.valorProposta);
  valorInicial = Intl.NumberFormat("PT-BR", {
    style: "currency",
    currency: "BRL",
  }).format(proposta.valorProposta / 100);

  const { data: versionamentos, refetch: refetchVersionamentos } =
    useSuspenseQuery({
      queryKey: ["versionamento", id],
      queryFn: async () => {
        const response = await fetch(`${url}/proposta/${id}/versionamentos`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Versionamento Não encontrado");
        const data = await response.json();
        return data as Versionamento[];
      },
    });

  const { data: quantitativa, refetch: refetchQuantitativa } = useQuery({
    queryKey: ["quantitativas", proposta?.id],
    queryFn: async () => {
      const response = await fetch(`${url}/quantitativa/${proposta?.id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Versionamento não quantitativa");
      const data = await response.json();
      return data as Quantitativa[];
    },
    // O método .some retorna um valor booleano se a condição for verdadeira hehehe
    enabled: versionamentos.some((val) =>
      val.status === "APROVADA" ? true : false
    ),
  });

  async function refetchAll() {
    await refetchQuantitativa();
    await refetchVersionamentos();
    await refetchProposta();
    await refetchAnexoVersionamentos();
    return;
  }

  const { mutateAsync: updateVersionamento } = useMutation({
    mutationKey: ["updateVersionamento"],
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`${url}/versionamento/${id}`, {
        method: "PUT", // ou PATCH, dependendo da sua API
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
        }),
      });
      if (!response.ok) throw new Error("Versionamento não encontrado");
    },
  });

  const novoVersionamentoSchema = z.object({
    files: z
      .instanceof(FileList, {
        error: "Selecione um Arquivo",
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
        (files) => ["application/pdf"].includes(files?.[0]?.type),
        "Tipo de arquivo inválido"
      ),
  });
  const formNovoVersionamento = useForm<
    z.infer<typeof novoVersionamentoSchema>
  >({
    resolver: zodResolver(novoVersionamentoSchema),
    defaultValues: {
      files: undefined,
    },
  });

  const { mutateAsync: updateValorProposta } = useMutation({
    mutationKey: ["updateValorProposta"],
    mutationFn: async (novoValor: number) => {
      const response = await fetch(`${url}/updateProposta/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valorProposta: novoValor * 100 }),
      });

      if (!response.ok) throw new Error("Versionamento não encontrado");
      return response.json();
    },
  });

  const onSubmitNovoVersionamento = async (
    data: z.infer<typeof novoVersionamentoSchema>
  ) => {
    try {
      setIsLoadingRefetch(true);
      const form = new FormData();

      for (let i = 0; i < data.files.length; i++) {
        form.append("files", data.files[i]);
      }

      const response = await fetch(`${url}/proposta/${id}/versao`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      await updateValorProposta(valorProposta);

      setOpenNovoVersionamento(false);
      refetchVersionamentos();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingRefetch(false);
    }
  };

  const [openDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openNovoVersionamento, setOpenNovoVersionamento] = useState(false);

  //FORM DA QUATITATIVA

  const itemSchema = z.object({
    idVersionamento: z.number(),
    descricao: z.string().min(2, "Nome obrigatório"),
    unidadeDeMedida: z.string().min(1, "Unidade obrigatória"),
    quantidade: z.string().refine((val) => val.replace(",", ".")),
    valorUnitario: z
      .string()
      .min(1, "Defina o valor da proposta")
      .transform((val) => {
        const clean = val.replace(/\D/g, "");
        return parseFloat(clean) / 100;
      }),
  });

  const formSchema = z.object({
    itens: z.array(itemSchema).min(1, "Adicione pelo menos um item"),
  });

  type Quantitativas = {
    itens: {
      idVersionamento: number;
      descricao: string;
      quantidade: string;
      valorUnitario: string;
      unidadeDeMedida: string;
    }[];
  };

  const form = useForm<Quantitativas>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      itens: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  // console.log(form.formState.errors);

  const onSubmit = async (data: Quantitativas) => {
    try {
      setIsLoadingRefetch(true);

      await updateVersionamento({
        id: idVersionamento!,
        status: "APROVADA",
      });

      const payload = {
        itens: data.itens.map((item) => ({
          ...item,
          valorUnitario: Math.round(
            parseFloat(item.valorUnitario.toString()) * 100
          ).toString(),
        })),
      };

      await fetch(`${url}/quantitativa`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      await refetchAll();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingRefetch(false);
    }
  };

  function CurrencyInput({ field }: { field: any }) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const raw = target.value.replace(/\D/g, "");
        const number = parseFloat(raw) / 100;
        const formatted = number.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        target.value = formatted;
        field.onChange(formatted); // atualiza o valor no RHF
      };

      const input = inputRef.current;
      input?.addEventListener("input", handleInput);

      return () => input?.removeEventListener("input", handleInput);
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
    <div className="h-max bg-background flex flex-col p-3 gap-4">
      <Link to="/propostas">
        <Button className="cursor-pointer">
          <CircleArrowLeftIcon />
          Retornar
        </Button>
      </Link>
      {proposta && (
        <InfoClientes
          nomeDaProposta={proposta.nomeDaProposta}
          valorProposta={proposta.valorProposta}
          createdAt={proposta.createdAt}
          cliente={proposta.cliente.name}
          cnpjCliente={proposta.cliente.cnpj}
        />
      )}
      <div className="h-max-[800px] rounded-2xl space-x-2 py-4">
        <Table className="h-[100%] space-x-2 py-4 bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Versão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionamentos?.map((itemVersionamento) => (
              <TableRow key={itemVersionamento.id}>
                {/* <TableCell> {itemVersionamento.id} </TableCell> */}
                <TableCell className="font-bold">
                  {itemVersionamento.versao}
                </TableCell>
                <TableCell>
                  {itemVersionamento.createdAt
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                </TableCell>
                <TableCell>
                  <StatusDeAprovacao status={itemVersionamento.status} />
                </TableCell>
                <TableCell className="flex flex-col justify-center items-center">
                  <Dialog defaultOpen={openDialog}>
                    <DialogTrigger
                      onClick={() => (
                        setidVersao(itemVersionamento.id),
                        setIdVersionamento(itemVersionamento.id),
                        setCurrentImageIndex(0)
                      )}
                      className="cursor-pointer"
                    >
                      <Button className="rounded-2xl bg-blue-100 text-blue-600 border-blue-600 border-1 hover:bg-blue-600 hover:text-white cursor-pointer h-8 w-21">
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[70%] h-[90%] overflow-auto">
                      <DialogHeader className="p-0 m-0">
                        <DialogTitle>Visualização da proposta</DialogTitle>
                      </DialogHeader>
                      <DialogDescription className="flex flex-col gap-4 text-black">
                        Situação da proposta
                        <StatusDeAprovacao status={itemVersionamento.status} />
                        {/* <DialogDescription className=" flex flex-col w-full items-center justify-start gap-3">
                        </DialogDescription> */}
                        <div className="flex gap-3 flex-wrap">
                          {(() => {
                            const pdfAnexos = (
                              fetchAnexoVersionamento || []
                            ).filter((anexo) => {
                              // const extFromPath = anexo?.path?.split(".").pop()?.toLowerCase();
                              const extFromUrl = anexo?.url
                                ?.split(".")
                                .pop()
                                ?.split("?")[0]
                                ?.toLowerCase();
                              return extFromUrl === "pdf";
                            });

                            if (pdfAnexos.length === 0) {
                              return <span>Nenhum anexo PDF encontrado.</span>;
                            }

                            return (
                              <div className="w-full flex flex-col gap-4">
                                <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-2">
                                  <button
                                    onClick={handlePrevImage}
                                    className="p-1 rounded hover:bg-gray-200"
                                  >
                                    <ChevronLeft className="w-6 h-6" />
                                  </button>

                                  <div className="flex flex-col items-center gap-3 flex-1 mx-4">
                                    <div className="w-full h-[500px] bg-white rounded overflow-hidden shadow-sm">
                                      <PdfView
                                        url={
                                          fetchAnexoVersionamento[
                                            currentImageIndex
                                          ]?.url
                                        }
                                      />
                                    </div>

                                    <span className="text-sm font-semibold text-gray-600">
                                      {currentImageIndex + 1} de{" "}
                                      {pdfAnexos.length}
                                    </span>
                                  </div>

                                  <button
                                    onClick={handleNextImage}
                                    className="p-1 rounded hover:bg-gray-200"
                                  >
                                    <ChevronRight className="w-6 h-6" />
                                  </button>
                                </div>

                                <div className="flex gap-2 justify-center mt-2">
                                  {pdfAnexos.map((_, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setCurrentImageIndex(idx)}
                                      className={`h-2 rounded-full transition-all ${
                                        idx === currentImageIndex
                                          ? "w-6 bg-blue-500"
                                          : "w-2 bg-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        {itemVersionamento.status == "EM_ANALISE" ? (
                          <>
                            <strong>Ações:</strong>
                            Para atualizar a situação da proposta atual, basta
                            clicar em um dos botões a baixo
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  className="cursor-pointer"
                                >
                                  {" "}
                                  <CircleX /> Recusada
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    A proposta foi recusada?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Uma vez recusada não será possível aprovar
                                    novamente
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="cursor-pointer"
                                    onClick={async () => {
                                      await updateVersionamento({
                                        id: itemVersionamento.id,
                                        status: "REPROVADA",
                                      });
                                      // setOpenDialog(false);
                                      await refetchVersionamentos();
                                      await refetchAll();
                                    }}
                                    disabled={isLoadingRefetch}
                                  >
                                    {isLoadingRefetch ? (
                                      <>
                                        {" "}
                                        <Spinner /> Continuar
                                      </>
                                    ) : (
                                      <>Continuar</>
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {/* 
                              
                                Abaixo tem o Alert Dialog para aprovação, dentro dele terá outro Dialog para adicionar as 
                                Quantitativas
                              
                              */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  className="cursor-pointer"
                                  disabled={versionamentos?.some(
                                    (item) => item.status === "APROVADA"
                                  )}
                                >
                                  <CircleCheckBig /> Aprovada
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    A proposta foi aprovada?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Uma vez que aprovada a ação não poderá ser
                                    revertida
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">
                                    Cancelar
                                  </AlertDialogCancel>

                                  {/* A baixo está o Dialog para adicionar as quantitativas */}
                                  <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                      <Button className="cursor-pointer">
                                        Aprovar
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[70%] [&>button]:hidden flex flex-col gap-3">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Adicionar quantitativa
                                        </DialogTitle>
                                        <DialogDescription>
                                          Para prosseguir, é necessário
                                          adicionar a quantitativa dessa
                                          proposta, item, unidade e preço
                                        </DialogDescription>
                                      </DialogHeader>
                                      <Form {...form}>
                                        <form
                                          onSubmit={form.handleSubmit(onSubmit)}
                                          className="flex flex-col gap-3"
                                        >
                                          <div className="flex gap-3 items-center border-b-1 border-gray-300 p-2">
                                            <div className="flex flex-col gap-3 w-full">
                                              <div className="w-full flex flex-col gap-4 justify-start items-center h-[250px] overflow-auto p-4">
                                                {fields.map((field, index) => (
                                                  <div
                                                    key={field.id}
                                                    className="flex items-start gap-1"
                                                  >
                                                    {/* <div className="flex h-full w-5 items-center justify-center"><Label>{index++}</Label></div> */}
                                                    <FormField
                                                      control={form.control}
                                                      name={`itens.${index}.descricao`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel>
                                                            Item
                                                          </FormLabel>
                                                          <Select
                                                            value={field.value}
                                                            onValueChange={
                                                              field.onChange
                                                            }
                                                          >
                                                            <FormControl>
                                                              <SelectTrigger className="w-[180px] cursor-pointer">
                                                                <SelectValue placeholder="Selecione o Item" />
                                                              </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                              <SelectGroup>
                                                                <SelectLabel>
                                                                  Itens
                                                                </SelectLabel>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="Retroescavadeira"
                                                                >
                                                                  Retroescavadeira
                                                                </SelectItem>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="Rolocompactador"
                                                                >
                                                                  Rolocompactador
                                                                </SelectItem>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="Calçamento"
                                                                >
                                                                  Calçamento
                                                                </SelectItem>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="Homem Hora"
                                                                >
                                                                  Homem Hora
                                                                </SelectItem>
                                                              </SelectGroup>
                                                            </SelectContent>
                                                            <FormMessage />
                                                          </Select>
                                                        </FormItem>
                                                      )}
                                                    />
                                                    <FormField
                                                      control={form.control}
                                                      name={`itens.${index}.unidadeDeMedida`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel>
                                                            Unidade
                                                          </FormLabel>
                                                          <Select
                                                            value={field.value}
                                                            onValueChange={
                                                              field.onChange
                                                            }
                                                          >
                                                            <FormControl>
                                                              <SelectTrigger className="w-[180px] cursor-pointer">
                                                                <SelectValue placeholder="Selecione o Item" />
                                                              </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                              <SelectGroup>
                                                                <SelectLabel>
                                                                  Itens
                                                                </SelectLabel>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="M²"
                                                                >
                                                                  M²
                                                                </SelectItem>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="M³"
                                                                >
                                                                  M³
                                                                </SelectItem>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="Hora"
                                                                >
                                                                  Hora
                                                                </SelectItem>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="Diária"
                                                                >
                                                                  Diária
                                                                </SelectItem>
                                                                <SelectItem
                                                                  className="cursor-pointer"
                                                                  value="Kg"
                                                                >
                                                                  Kg
                                                                </SelectItem>
                                                              </SelectGroup>
                                                            </SelectContent>
                                                            <FormMessage />
                                                          </Select>
                                                        </FormItem>
                                                      )}
                                                    />
                                                    <FormField
                                                      control={form.control}
                                                      name={`itens.${index}.quantidade`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel>
                                                            Quantidade
                                                          </FormLabel>
                                                          <FormControl>
                                                            <Input
                                                              className="bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                              type="number"
                                                              inputMode="numeric"
                                                              pattern="[0-9]*"
                                                              placeholder="Quantidade"
                                                              {...field}
                                                            />
                                                          </FormControl>
                                                          <FormMessage />
                                                        </FormItem>
                                                      )}
                                                    />
                                                    <FormField
                                                      control={form.control}
                                                      name={`itens.${index}.valorUnitario`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel>
                                                            Valor
                                                          </FormLabel>
                                                          <FormMessage />
                                                          <FormControl>
                                                            <CurrencyInput
                                                              field={field}
                                                            />
                                                          </FormControl>
                                                        </FormItem>
                                                      )}
                                                    />
                                                    <Button
                                                      className="cursor-pointer"
                                                      type="button"
                                                      variant="ghost"
                                                      size="icon"
                                                      onClick={() =>
                                                        remove(index)
                                                      }
                                                    >
                                                      <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                  </div>
                                                ))}
                                              </div>
                                              <div className="flex gap-3">
                                                <Button
                                                  className="cursor-pointer"
                                                  type="button"
                                                  disabled={isLoadingRefetch}
                                                  onClick={() =>
                                                    append({
                                                      idVersionamento:
                                                        itemVersionamento.id,
                                                      descricao: "",
                                                      unidadeDeMedida: "",
                                                      quantidade: "",
                                                      valorUnitario: "",
                                                    })
                                                  }
                                                >
                                                  {isLoadingRefetch ? (
                                                    <>
                                                      <Spinner className="size-3" />{" "}
                                                      Adicionar item
                                                    </>
                                                  ) : (
                                                    <>Adicionar item</>
                                                  )}
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                          <DialogFooter className="flex gap-3 justify-center items-end">
                                            <div className="w-full flex flex-col gap-3">
                                              <Label>
                                                Atribuir um novo valor a
                                                proposta
                                              </Label>
                                              <CurrencyInput2
                                                onValueChange={setValorProposta}
                                              />
                                            </div>
                                            <DialogClose>
                                              <Button
                                                variant="outline"
                                                type="button"
                                                className="cursor-pointer"
                                              >
                                                Fechar
                                              </Button>
                                            </DialogClose>
                                            <Button
                                              className="cursor-pointer"
                                              type="submit"
                                              disabled={isLoadingRefetch}
                                              onClick={() => {
                                                updateValorProposta(
                                                  valorProposta
                                                );
                                              }}
                                            >
                                              {isLoadingRefetch ? (
                                                <>
                                                  <Spinner className="size-3" />
                                                  Carregando...{" "}
                                                </>
                                              ) : (
                                                "Definir Quantitativa"
                                              )}
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </Form>
                                    </DialogContent>
                                  </Dialog>
                                  {/* fim */}
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        ) : itemVersionamento.status == "REPROVADA" ? (
                          <>
                            <strong>PROPOSTA RECUSADA</strong>
                          </>
                        ) : (
                          ""
                        )}
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-gray-200">
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex items-center justify-between">
                  Ações
                  <div>
                    <Dialog
                      open={openNovoVersionamento}
                      onOpenChange={setOpenNovoVersionamento}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          disabled={versionamentos?.some(
                            (item) => item.status === "APROVADA"
                          )}
                        >
                          <CirclePlus />
                          Criar Novo Versionamento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Adicionar um novo versionamento
                          </DialogTitle>
                          <DialogDescription className="">
                            <Form {...formNovoVersionamento}>
                              <form
                                onSubmit={formNovoVersionamento.handleSubmit(
                                  onSubmitNovoVersionamento
                                )}
                                className="flex flex-col gap-4"
                              >
                                <FormField
                                  control={formNovoVersionamento.control}
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
                                            <EmptyTitle>
                                              Selecione um Arquivo
                                            </EmptyTitle>
                                            <EmptyDescription>
                                              Escolha um arquivo de seu
                                              dispositivo para realizar o Upload
                                              <Input
                                                className="cursor-pointer"
                                                type="file"
                                                multiple
                                                accept=".pdf"
                                                onChange={(e) =>
                                                  field.onChange(e.target.files)
                                                }
                                              />
                                            </EmptyDescription>
                                          </EmptyHeader>
                                          <Button
                                            className="cursor-pointer"
                                            type="submit"
                                            disabled={isLoadingRefetch}
                                          >
                                            {isLoadingRefetch ? (
                                              <>
                                                <Spinner className="size-3" />
                                                Criando...{" "}
                                              </>
                                            ) : (
                                              <>Criar</>
                                            )}
                                          </Button>
                                        </Empty>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </form>
                            </Form>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="flex flex-col gap-3">
        {quantitativa === undefined ? (
          <span></span>
        ) : (
          <>
            <h1 className="font-bold">Quantitativa</h1>
            <Table className="rounded-2xl bg-white">
              <TableHeader className="bg-gray-300">
                <TableRow>
                  <TableHead>item:</TableHead>
                  <TableHead>Quantidade:</TableHead>
                  <TableHead>Unidade de Medida:</TableHead>
                  <TableHead>Valor Unitário:</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quantitativa.map((item) => (
                  <TableRow>
                    <TableCell> {item.descricao}</TableCell>
                    <TableCell> {formatToNumber(item.quantidade)}</TableCell>
                    <TableCell> {item.unidadeDeMedida}</TableCell>
                    <TableCell>
                      {formatToBRL(item.valorUnitario / 100)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
}

function VersionamentoIsLoading() {
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

function Versionamento() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<VersionamentoIsLoading />}>
        <VersionamentoPage />
      </Suspense>
    </ErrorBoundary>
  );
}

export default Versionamento;
