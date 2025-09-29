import { Button } from "@/components/ui/button";
import {
  CircleArrowLeftIcon,
  CircleCheckBig,
  CirclePlus,
  CircleX,
  Eye,
  FileImage,
  Paperclip,
  TimerIcon,
  Trash2,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";

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
import { Label } from "@/components/ui/label";
//import { no } from "zod/v4/locales";

const url = import.meta.env.VITE_API_URL;

interface Versionamento {
  id: number;
  versao: number;
  idProposta: number;
  status: string;
  createdAt: string;
  anexos: string;
}

interface Propostas {
  nomeDaProposta: string;
  descricao: string;
  createdAt: string;
  cliente: {
    cliente: string;
  };
}

interface Cliente {
  cliente: string;
  cnpj: string;
  local: string;
  status: string;
  file: File | null;
}
interface formularioComImagem {
  files: FileList | File[] | null;
}

interface Quantitativas {
  descricao: string;
  quantidade: number | null;
  valorUnitario: string;
  unidade: string;
}

function Versionamento() {
  const { id } = useParams<{ id: string }>();

  const [proposta, setProposta] = useState<Propostas>({
    nomeDaProposta: "",
    descricao: "",
    createdAt: "",
    cliente: { cliente: "" },
  });

  const [cliente, setCliente] = useState<Cliente>({
    cliente: "",
    cnpj: "",
    local: "",
    status: "",
    file: null,
  });

  const [versionamento, setVersionamento] = useState<Versionamento[]>([
    {
      id: 0,
      versao: 0,
      idProposta: 0,
      status: "",
      createdAt: "",
      anexos: "",
    },
  ]);
  const [idVersionamento, setIdVersionamento] = useState<number | null>(null);
  const [anexoVersionamento, setAnexoVersionamento] = useState<
    { url: string }[]
  >([]);

  //ATUALIZA O STATUS DO VERSINAMENTO E JOGA PARA O BANCO
  const [atualizarStatusVersionamento, setAtualiarStatusVersionamento] =
    useState<string | null>(null);
  useEffect(() => {
    async function atualizarVersionamento() {
      const response = await fetch(`${url}/versionamento/${idVersionamento}`, {
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
        `${url}/versionamento/${idVersionamento}/anexos/urls`
      );
      console.log(response);
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();

      const anexos = data.url.map((link: string) => ({ url: link }));

      setAnexoVersionamento(anexos);
      console.log("data", anexos);
    }
    console.log(idVersionamento);
    if (idVersionamento) {
      fetchAnexoVersionamento();
    }
  }, [idVersionamento]);

  useEffect(() => {
    async function fetchProposta() {
      try {
        const response = await fetch(`${url}/proposta/${id}`);
        if (!response.ok) throw new Error("Proposta não encontrada");
        const data = await response.json();
        setProposta({
          nomeDaProposta: data.nomeDaProposta || "",
          descricao: data.descricao || "",
          createdAt: data.createdAt || "",
          cliente: { cliente: data.cliente || "" },
        });
      } catch (err) {}
    }

    async function fetchCliente() {
      const response = await fetch(`${url}/cliente/${id}`);
      if (!response.ok) throw new Error("Cliente não encontrado");
      const data = await response.json();

      setCliente({
        cliente: data.cliente,
        cnpj: data.cnpj,
        local: data.local,
        status: data.status,
        file: null,
      });
    }

    async function fetchVersionamento() {
      const response = await fetch(`${url}/proposta/${id}/versionamentos`);
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();

      setVersionamento(data);
    }

    if (id) fetchProposta(), fetchCliente(), fetchVersionamento();
    else {
      console.log("Deu erro aqui");
    }
  }, [id]);

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
  }

  const [openDialog, setOpenDialog] = useState(false);

  //Nesse ponto, será colocado um Array para acrescentar ou tirar um item da quantitativa

  const [itens, setItens] = useState<Quantitativas[]>([
    { descricao: "", unidade: "", valorUnitario: "", quantidade: null },
  ]);

  function adicionarItem() {
    setItens([
      ...itens,
      { descricao: "", unidade: "", valorUnitario: "", quantidade: null },
    ]);
  }

  function removerItem(index: number) {
    setItens(itens.filter((_, i) => i !== index));
  }

  function atualizarItem(
    index: number,
    campo: keyof Quantitativas,
    valor: string | number
  ) {
    const novosItens = [...itens];
    if (campo === "quantidade") {
      novosItens[index][campo] = Number(valor) as Quantitativas["quantidade"];
    } else {
      novosItens[index][campo] = valor as Quantitativas[typeof campo];
    }
    setItens(novosItens);
  }

  return (
    <div className="h-full flex flex-col p-3 gap-4">
      <Link to="/propostas">
        <Button variant="ghost" className="cursor-pointer">
          <CircleArrowLeftIcon />
          Retornar
        </Button>
      </Link>
      <div className="flex items-start justify-between gap-4">
        <section>
          <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
          <h1>Nome da Proposta: {proposta.nomeDaProposta}</h1>
          <h1>
            Data:{" "}
            {proposta.createdAt.split("T")[0].split("-").reverse().join("/")}
          </h1>
          <h1>Cliente: {cliente.cliente}</h1>
          <h1>CNPJ: {cnpj.format(cliente.cnpj)}</h1>
        </section>
      </div>
      <div className="h-max-[800px] border-1 border-gray-400 rounded-2xl">
        <Table className="h-[100%]">
          <TableHeader>
            <TableRow>
              <TableHead>Versão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionamento.map((itemVersionamento) => (
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
                {/* <TableCell>{anexoVersionamento.length}</TableCell> */}
                <TableCell>
                  {itemVersionamento.status === "EM_ANALISE" ? (
                    <>
                      <div className="flex items-center justify-center gap-3 text-chart-1 bg-amber-50 rounded-2xl">
                        <TimerIcon />
                        Em Análise
                      </div>
                    </>
                  ) : itemVersionamento.status === "REPROVADA" ? (
                    <>
                      <div className="flex items-center justify-center gap-3 text-destructive bg-red-100 rounded-2xl">
                        <CircleX /> Reprovada
                      </div>
                    </>
                  ) : itemVersionamento.status === "APROVADA" ? (
                    <>
                      <div className="flex items-center justify-center gap-3 text-ring bg-green-100 rounded-2xl">
                        <CircleCheckBig /> Aprovada
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell className="flex flex-col justify-center items-center">
                  <Dialog defaultOpen={openDialog}>
                    <DialogTrigger
                      onClick={() => setIdVersionamento(itemVersionamento.id)}
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
                        {itemVersionamento.status === "EM_ANALISE" ? (
                          <>
                            <div className="flex items-center justify-center gap-3 text-chart-1 bg-amber-50 rounded-2xl">
                              <TimerIcon />
                              Em Análise
                            </div>
                          </>
                        ) : itemVersionamento.status === "REPROVADA" ? (
                          <>
                            <div className="flex items-center justify-center gap-3 text-destructive bg-red-100 rounded-2xl">
                              <CircleX /> Reprovada
                            </div>
                          </>
                        ) : itemVersionamento.status === "APROVADA" ? (
                          <>
                            <div className="flex items-center justify-center gap-3 text-ring bg-green-100 rounded-2xl">
                              <CircleCheckBig /> Aprovada
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        <h1 className="font-bold text-2xl flex items-center justify-start gap-3">
                          Itens anexados <Paperclip />
                        </h1>
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
                                    Deseja recusar a proposta?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    DEPOIS EU PENSO NO QUE ESCREVER
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="cursor-pointer">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="cursor-pointer"
                                    onClick={() => (
                                      setAtualiarStatusVersionamento(
                                        "REPROVADA"
                                      ),
                                      setOpenDialog(false)
                                    )}
                                  >
                                    Continue
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
                                <Button className="cursor-pointer">
                                  <CircleCheckBig /> Aprovada
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Deseja aprovar a Proposta?
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
                                    <form>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="default"
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setAtualiarStatusVersionamento(
                                              "APROVADA"
                                            )
                                          }
                                        >
                                          Aprovar
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[70%]">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Adocionar quantitativa
                                          </DialogTitle>
                                          <DialogDescription>
                                            Para proseguir, é necessário
                                            adicionar a quantitativa dessa
                                            proposta, item, unidade e preço
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4">
                                          <div className="flex gap-3 items-center border-1 border-gray-500 rounded-2xl p-3">
                                            <div className="space-y-4">
                                              {itens.map((item, index) => (
                                                <div
                                                  key={index}
                                                  className="flex items-center gap-4"
                                                >
                                                  <Input
                                                    placeholder="Nome"
                                                    value={item.descricao}
                                                    onChange={(e) =>
                                                      atualizarItem(
                                                        index,
                                                        "descricao",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <Input
                                                    placeholder="Unidade"
                                                    value={item.unidade}
                                                    onChange={(e) =>
                                                      atualizarItem(
                                                        index,
                                                        "unidade",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <Input
                                                    type="number"
                                                    placeholder="Quantidade"
                                                    value={
                                                      item.quantidade ?? ""
                                                    }
                                                    onChange={(e) =>
                                                      atualizarItem(
                                                        index,
                                                        "quantidade",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <Input
                                                    placeholder="Valor Unitário"
                                                    value={item.valorUnitario}
                                                    onChange={(e) =>
                                                      atualizarItem(
                                                        index,
                                                        "valorUnitario",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                      removerItem(index)
                                                    }
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              ))}

                                              <Button onClick={adicionarItem}>
                                                Adicionar
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                        <Button
                                          variant="outline"
                                          className="cursor-pointer"
                                        >
                                          Adicionar Item
                                        </Button>
                                        <DialogFooter>
                                          <DialogClose asChild>
                                            <Button variant="outline">
                                              Cancel
                                            </Button>
                                          </DialogClose>
                                          <Button type="submit">
                                            Save changes
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </form>
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
                  <div className="flex gap-3">
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          variant="outline"
                          className="flex gap-2 items-center cursor-pointer"
                        >
                          <CirclePlus />
                          Criar Nova Proposta
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col gap-3">
                        <DialogHeader>
                          <DialogTitle>
                            Adicionar um novo versionamento
                          </DialogTitle>
                          <DialogDescription>
                            <h1>Adicionar Anexo</h1>
                            <form onSubmit={criarNovoVersionamento}>
                              <Input
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
                              <Button type="submit">Submit</Button>
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
    </div>
  );
}

export default Versionamento;
