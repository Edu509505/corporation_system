import { Button } from "@/components/ui/button";
import {
  CircleArrowLeftIcon,
  CircleCheckBig,
  CirclePlus,
  CircleX,
  Eye,
  FileImage,
  Paperclip,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
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

const url = import.meta.env.VITE_API_URL;

interface Versionamento {
  id: number;
  versao: number;
  idProposta: number;
  status: string;
  createdAt: string;
  anexos: string;
}

interface versionamentoAprovado {
  id: number;
  idProposta: number;
  status: string;
  updateAt: string;
}

interface Propostas {
  id: number;
  nomeDaProposta: string;
  descricao: string;
  createdAt: string;
  cliente: {
    cliente: string;
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
function Versionamento() {
  const { id } = useParams<{ id: string }>();

  const [idVersao, setidVersao] = useState<number | null>(null);
  const [idVersionamento, setIdVersionamento] = useState<number | null>(null);

  const [anexoVersionamento, setAnexoVersionamento] = useState<
    { url: string }[]
  >([]);

  //ATUALIZA O STATUS DO VERSINAMENTO E JOGA PARA O BANCO

  const [atualizarStatusVersionamento] =
    useState<string | null>(null);
  useEffect(() => {
    async function atualizarVersionamento() {
      const response = await fetch(`${url}/versionamento/${idVersao}`, {
        method: "PUT", // ou PATCH, dependendo da sua API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: atualizarStatusVersionamento,
        }),
      });
      if (!response.ok) throw new Error("Versionamento não encontrado");
    }
    if (atualizarStatusVersionamento) {
      atualizarVersionamento();
    }
  }, [atualizarStatusVersionamento]);

  useEffect(() => {
    async function fetchAnexoVersionamento() {
      const response = await fetch(
        `${url}/versionamento/${idVersao}/anexos/urls`
      );
      console.log(response);
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();

      const anexos = data.url.map((link: string) => ({ url: link }));

      setAnexoVersionamento(anexos);
      console.log("data", anexos);
    }
    console.log(idVersao);
    if (idVersao) {
      fetchAnexoVersionamento();
    }
  }, [idVersao]);

  const {
    //isPending: propostaLoading,
    //error: propostaError,
    data: proposta,
  } = useQuery({
    queryKey: ["proposta", id],
    queryFn: async () => {
      const response = await fetch(`${url}/proposta/${id}`);
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Propostas;
    },
  });

  const [, setTest] = useState<Versionamento | null>(null);
  const {
    data: versionamentos,
    refetch: refetchVersionamentos,
  } = useQuery({
    queryKey: ["versionamento", id],
    queryFn: async () => {
      const response = await fetch(`${url}/proposta/${id}/versionamentos`);
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();
      setTest(data);
      return data as Versionamento[];
    },
  });

   const { data: versionamentoAprovado } = useQuery({
    queryKey: ["versionamento", proposta?.id],
    queryFn: async () => {
      const response = await fetch(
        `${url}/proposta/${proposta?.id.toString()}/verAprovado`
      );
      if (!response.ok) throw new Error("Versionamento não encontrada");
      const data = await response.json();
      return data as Versionamento[];
    },
  });

  console.log("Versionamento Aprovado ", versionamentoAprovado?.map((ver) => ver.id))


  const { data: quantitativa } = useQuery({
    queryKey: ["quantitativa", versionamentoAprovado?.map((ver) => ver.id)],
    queryFn: async () => {
      const response = await fetch(`${url}/quantitativa/${versionamentoAprovado?.map((ver) => ver.id.toString())}`)
      if (!response.ok) throw new Error("Não foi encontrato nenhuma quantitativa")
      const data = await response.json()
      return data as Quantitativa[]
    }
  })

  console.log("Quantitativa", quantitativa);

  const { mutateAsync: updateVersionamento } = useMutation({
    mutationKey: ["updateVersionamento"],
    mutationFn: async ({ id, status }: { id: number;  status: string }) => {
      const response = await fetch(`${url}/versionamento/${id}`, {
        method: "PUT", // ou PATCH, dependendo da sua API
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

  // const { mutateAsync: updateProposta } = useMutation({
  //   mutationKey: ["updateProposta"],
  //   mutationFn: async ({ id, status }: { id: string; status: string }) => {
  //     const response = await fetch(`${url}/proposta/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         status: status,
  //       }),
  //     });
  //     if (!response.ok) throw new Error("Proposta não encontrada");
  //   },
  // });

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
      body: form,
    });

    const body = await response.json();
    console.log(body);
    refetchVersionamentos();
  }

  const [openDialog, setOpenDialog] = useState(false);

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
      await updateVersionamento({
        id: idVersionamento!,
        status: "APROVADA",
      });

      //await updateProposta({ id: id!, status: "APROVADA" });

      await fetch(`${url}/quantitativa`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      refetchVersionamentos();
    } catch { }
  };

  return (
    <div className="h-full flex flex-col p-3 gap-4">
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
          cliente={proposta.cliente.cliente}
          cnpjCliente={proposta.cliente.cnpj}
        />
      )}
      <div className="h-max-[800px] border-1 border-gray-400 rounded-2xl space-x-2 py-4">
        <Table className="h-[100%] space-x-2 py-4">
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
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Visualização da proposta</DialogTitle>
                      </DialogHeader>
                      <DialogDescription className="flex flex-col gap-4 text-black">
                        Situação da proposta
                        <StatusDeAprovacao status={itemVersionamento.status} />
                        <DialogDescription className="font-bold text-2xl flex items-center justify-start gap-3">
                          Itens anexados <Paperclip />
                        </DialogDescription>
                        <div className="flex gap-3 flex-wrap">
                          {anexoVersionamento.length > 0 ? (
                            anexoVersionamento.map((anexo, idx) => (
                              <a
                                key={idx}
                                href={anexo.url}
                                className="bg-green-200 rounded-2xl p-2 transition-all hover:scale-110"
                              >
                                <h1 className="flex font-bold">
                                  {idx + 1} - <FileImage />
                                </h1>
                              </a>
                            ))
                          ) : (
                            <span>Nenhum anexo encontrado.</span>
                          )}
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
                                  <Dialog>
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
                                            >
                                              Definir Quantitativa
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
                        ) : itemVersionamento.status === "APROVADA" ? (
                          <>
                            <strong>PROPOSTA APROVADA</strong>
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
          <TableFooter>
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
                          Criar Nova Proposta
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
                                    >
                                      Enviar
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

export default Versionamento;
