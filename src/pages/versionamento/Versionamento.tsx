import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowLeftIcon,
  CircleCheckBig,
  CirclePlus,
  CircleX,
  Eye,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Suspense, useState } from "react";
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
import { useMutation, useQuery, useQueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import StatusDeAprovacao from "@/components/componentsVersionamento/StatusDeAprovaao";
import InfoClientes from "@/components/componentsVersionamento/informacoesCliente";
import {
  Empty,
  EmptyContent,
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

// interface Cliente {
//   cliente: string;
//   cnpj: string;
//   local: string;
//   status: string;
//   file: File | null;
// }
interface formularioComImagem {
  files: FileList | File[] | null;
}

interface AnexoVersionamento {
  url: string;
  path: string;
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

  console.log(currentImageIndex)

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? fetchAnexoVersionamento.length - 1 : prev - 1
    );
  };

  //ATUALIZA O STATUS DO VERSINAMENTO E JOGA PARA O BANCO

  const { data: fetchAnexoVersionamento = [], refetch: refetchAnexoVersionamentos } = useQuery({
    queryKey: ["fetchAnexoVersionamento", idVersao],
    queryFn: async () => {
      if (!idVersao) return [] // Retorna array vazio se idVersao for null

      const response = await fetch(`${url}/versionamento/${idVersao}/anexos/urls`, {
        method: "GET",
        credentials: "include"
      })
      if (!response.ok) throw new Error("Não foi possível encontrar o anexo do Versionamento")
      const data = await response.json()

      console.log("Resposta da API de anexos:", data) // Adiciona log para debug

      // A API retorna { url: [...urls] }, então pegamos o array de urls
      const urlArray = data.url || data.urls || data.anexos || []

      // Transformamos em array de objetos com a estrutura esperada
      const anexos = Array.isArray(urlArray)
        ? urlArray.map((urlString: string) => ({ url: urlString }))
        : []

      console.log("Anexos processados:", anexos) // Log adicional

      return anexos as AnexoVersionamento[]
    },
    enabled: !!idVersao // Só executa a query se idVersao existir
  })

  console.log("ANEXO VERSIONAMENTO", fetchAnexoVersionamento)

  const {
    data: proposta,
    refetch: refetchProposta
  } = useSuspenseQuery({
    queryKey: ["proposta", id],
    queryFn: async () => {
      const response = await fetch(`${url}/proposta/${id}`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Propostas;
    },
  });

  const {
    data: versionamentos,
    refetch: refetchVersionamentos,
  } = useSuspenseQuery({
    queryKey: ["versionamento", id],
    queryFn: async () => {
      const response = await fetch(`${url}/proposta/${id}/versionamentos`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();
      return data as Versionamento[];
    },
  });

  const { data: versionamentoAprovado, refetch: refetchVersionamentoAprovado } = useSuspenseQuery({
    queryKey: ["versionamento", proposta?.id],
    queryFn: async () => {
      const response = await fetch(
        `${url}/proposta/${proposta?.id.toString()}/verAprovado`, {
        method: "GET",
        credentials: "include"
      }
      );
      if (!response.ok) throw new Error("Versionamento não encontrada");
      const data = await response.json();
      return data as Versionamento[];
    },
  });

  console.log("Versionamento Aprovado ", versionamentoAprovado?.map((ver) => ver.id))


  const { data: quantitativa, refetch: refetchQuantitativa } = useQuery({
    queryKey: ["quantitativa", versionamentoAprovado?.map((ver) => ver.id)],
    queryFn: async () => {
      const response = await fetch(`${url}/quantitativa/${versionamentoAprovado?.map((ver) => ver.id.toString())}`, {
        method: "GET",
        credentials: "include"
      })
      if (!response.ok) throw new Error("Não foi encontrato nenhuma quantitativa")
      const data = await response.json()
      return data as Quantitativa[]
    }
  })

  async function refetchAll() {
    await refetchQuantitativa()
    await refetchVersionamentoAprovado()
    await refetchVersionamentos()
    await refetchProposta()
    await refetchAnexoVersionamentos()
    return
  }

  console.log("Quantitativa", quantitativa);

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

  const [novoVersionamento, setNovoVersionamento] =
    useState<formularioComImagem>({
      files: null,
    });

  async function criarNovoVersionamento(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!novoVersionamento.files) return;

    console.log(
      "Quantidade de arquivos no frontend:",
      novoVersionamento.files.length
    );
    console.log("Arquivos:", novoVersionamento.files);

    const form = new FormData();

    for (let i = 0; i < novoVersionamento.files.length; i++) {
      form.append("files", novoVersionamento.files[i]);
    }

    const response = await fetch(`${url}/proposta/${id}/versao`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const body = await response.json();
    console.log(body);
    refetchVersionamentos();
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);

  //FORM DA QUATITATIVA

  const itemSchema = z.object({
    idVersionamento: z.number(),
    descricao: z.string().min(2, "Nome obrigatório"),
    unidadeDeMedida: z.string().min(1, "Unidade obrigatória"),
    quantidade: z.string(),
    valorUnitario: z.string(),
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
    resolver: zodResolver(formSchema),
    defaultValues: {
      itens: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  console.log(form.formState.errors);

  const onSubmit = async (data: Quantitativas) => {
    console.log(data);

    try {
      setIsLoadingRefetch(true);

      await updateVersionamento({
        id: idVersionamento!,
        status: "APROVADA",
      });

      //await updateProposta({ id: id!, status: "APROVADA" });

      await fetch(`${url}/quantitativa`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await refetchAll();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingRefetch(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col p-3 gap-4">
      <Link to="/propostas">
        <Button variant="ghost" className="cursor-pointer">
          <CircleArrowLeftIcon />
          Retornar
        </Button>
      </Link>
      {proposta && (
        <InfoClientes
          nomeDaProposta={proposta.nomeDaProposta}
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
              <TableHead className="text-center">Status</TableHead>
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
                        setIdVersionamento(itemVersionamento.id)
                      )}
                      className="cursor-pointer"
                    >
                      <Eye />
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
                            const pdfAnexos = (fetchAnexoVersionamento || []).filter((anexo) => {
                              // const extFromPath = anexo?.path?.split(".").pop()?.toLowerCase();
                              const extFromUrl = anexo?.url?.split(".").pop()?.split("?")[0]?.toLowerCase();
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
                                      <PdfView url={pdfAnexos[currentImageIndex]?.url} />
                                    </div>

                                    <span className="text-sm font-semibold text-gray-600">
                                      {currentImageIndex + 1} de {pdfAnexos.length}
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
                                      className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? "w-6 bg-blue-500" : "w-2 bg-gray-300"}`}
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
                                    DEPOIS EU PENSO NO QUE ESCREVER
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <DialogClose asChild>
                                    <AlertDialogAction
                                      className="cursor-pointer"
                                      onClick={async () => {
                                        await updateVersionamento({
                                          id: itemVersionamento.id,
                                          status: "REPROVADA",
                                        });
                                        setOpenDialog(false);
                                        refetchVersionamentos();
                                        refetchAll();
                                      }}
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </DialogClose>
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
                                    <DialogContent className="sm:max-w-[70%] [&>button]:hidden flex flex-col gap-3"

                                    >
                                      <DialogHeader>
                                        <DialogTitle>
                                          Adicionar quantitativa
                                        </DialogTitle>
                                        <DialogDescription>
                                          Para prosseguir, é necessário adicionar
                                          a quantitativa dessa proposta, item,
                                          unidade e preço
                                        </DialogDescription>
                                      </DialogHeader>
                                      <Form {...form}>
                                        <form
                                          onSubmit={form.handleSubmit(onSubmit)}
                                          className="flex flex-col gap-3"
                                        >
                                          <div className="flex gap-3 items-center border-1 border-gray-500 rounded-2xl p-4 scroll-auto">
                                            <div className="space-y-4">
                                              <div className="flex flex-col gap-4 justify-center items-center">
                                                {fields.map((field, index) => (
                                                  <div
                                                    key={field.id}
                                                    className="flex items-start gap-1"
                                                  >
                                                    <FormField
                                                      control={form.control}
                                                      name={`itens.${index}.descricao`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel>
                                                            Nome
                                                          </FormLabel>
                                                          <FormControl>
                                                            <Input
                                                              placeholder="Nome do item"
                                                              {...field}
                                                            />
                                                          </FormControl>
                                                          <FormMessage />
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
                                                          <FormControl>
                                                            <Input
                                                              placeholder="Unidade de medida"
                                                              {...field}
                                                            />
                                                          </FormControl>
                                                          <FormMessage />
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
                                                          <FormControl>
                                                            <Input
                                                              placeholder="R$ -"
                                                              {...field}
                                                            />
                                                          </FormControl>
                                                          <FormMessage />
                                                        </FormItem>
                                                      )}
                                                    />
                                                    <Button
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
                                              <Button
                                                type="button"
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
                                                Adicionar item
                                              </Button>
                                            </div>
                                          </div>
                                          <DialogFooter className="flex gap-3">
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
                                            >
                                              {isLoadingRefetch ? <><Spinner className="size-3" />Carregando... </> : "Definir Quantitativa"}
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
                    <Dialog>
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
                            <form
                              onSubmit={criarNovoVersionamento}
                              className="flex flex-col gap-4"
                            >
                              <Empty className="border border-dashed">
                                <EmptyHeader>
                                  <EmptyMedia variant="icon">
                                    <Paperclip />
                                  </EmptyMedia>
                                  <EmptyTitle>Selecione um Arquivo</EmptyTitle>
                                  <EmptyDescription>
                                    Escolha um aruivo de seu dispositivo para
                                    realizar o Upload
                                    <Input
                                      className="cursor-pointer"
                                      type="file"
                                      multiple
                                      onChange={(event) => {
                                        const files = event.target.files;
                                        if (!files) return;
                                        const filesArray = Array.from(files);
                                        setNovoVersionamento({
                                          ...novoVersionamento,
                                          files: filesArray,
                                        });
                                      }}
                                    />
                                  </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                  <DialogClose asChild>
                                    <Button
                                      variant="outline"
                                      type="submit"
                                      className="cursor-pointer"
                                      onClick={() => refetchAll()}
                                    >
                                      Criar
                                    </Button>
                                  </DialogClose>
                                </EmptyContent>
                              </Empty>
                            </form>
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
            <Table className="rounded-2xl">
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
                    <TableCell > {item.descricao}</TableCell>
                    <TableCell > {formatToNumber(item.quantidade)}</TableCell>
                    <TableCell > {item.unidadeDeMedida}</TableCell>
                    <TableCell >{formatToBRL(item.valorUnitario)}</TableCell>
                  </TableRow>
                ))
                }
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



