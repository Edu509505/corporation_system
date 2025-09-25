import { Button } from "@/components/ui/button";
import { CircleArrowLeftIcon, CircleCheckBig, CirclePlus, CircleX, Paperclip, TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";

const url = import.meta.env.VITE_API_URL;

interface Versionamento {
  id: number;
  versao: number;
  idProposta: number;
  status: string;
  createdAt: string;
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

interface AnexoVersionamento {
  url: [string];
}




function Versionamento() {



  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
    },
  ]);

  const [anexoVersionamento, setAnexoVersionamento] = useState<
    { url: string }[]
  >([]);

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
      } catch (err) { }
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

    async function fetchAnexoVersionamento() {
      const response = await fetch(`${url}/versionamento/${id}/anexos/urls`);
      if (!response.ok) throw new Error("Versionamento Não encontrado");
      const data = await response.json();

      const anexos = data.url.map((link: string) => ({ url: link }));

      setAnexoVersionamento(anexos);
      console.log("data", anexos);
    }

    // console.log("Anexo Versionamento: ", anexoVersionamento);
    if (id)
      fetchProposta(),
        fetchCliente(),
        fetchVersionamento(),
        fetchAnexoVersionamento();
    else {
      console.log("Deu erro aqui");
    }
  }, [id]);

  // console.log("versionamento", versionamento);
  console.log("Anexo Versionamento: ", anexoVersionamento);
  return (
    <div className="h-full flex flex-col p-3 gap-4">
      <Link to="/propostas">
        <Button
          variant="ghost"
          className="cursor-pointer"
        >
          <CircleArrowLeftIcon />
          Retornar
        </Button>
      </Link>
      <div className="flex items-start justify-between gap-4">
        <section>
          <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
          <h1>Nome da Proposta: {proposta.nomeDaProposta}</h1>
          <h1>
            Data:
            {proposta.createdAt.split("T")[0].split("-").reverse().join("/")}
          </h1>
          <h1>Cliente: {cliente.cliente}</h1>
          <h1>CNPJ: {cnpj.format(cliente.cnpj)}</h1>
        </section>

        <section className="flex flex-col gap-4">
          <div className="border-1 border-gray-400 rounded-2xl p-2 w-2xs">
            <h1 className="font-bold text-2xl flex items-center justify-start gap-3">Items anexados <Paperclip /></h1>
            {anexoVersionamento.length > 0 ? (
              anexoVersionamento.map((anexo, idx) => (
                <a key={idx} href={anexo.url} className=" bg-gray-500 cursor-pointer">
                  <h1>{idx + 1} Arquivo anexado</h1>
                </a>
              ))
            ) : (
              <span>Nenhum PDF encontrado.</span>
            )}
            <h1 className="text-[0.8rem]">Clique para efetuar o Download</h1>
          </div>

        </section>
      </div>
      <div className="h-[800px] border-1 border-gray-400 rounded-2xl">
        <Table className=" h-[100%]">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Versão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Quantidade de Anexos</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionamento.map((itemVersionamento) => (
              <TableRow key={itemVersionamento.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <Checkbox id="toggle" />
                  </div>
                </TableCell>
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
                <TableCell>{anexoVersionamento.length}</TableCell>
                <TableCell>{
                  itemVersionamento.status === 'EM_ANALISE' ?
                    <>
                      <div className="flex items-center justify-center gap-3 text-chart-1 bg-amber-50 rounded-2xl">
                        <TimerIcon />Em Análise
                      </div>
                    </>
                    : itemVersionamento.status === "REPROVADA" ?
                      <>
                        <div className="flex items-center justify-center gap-3 text-destructive bg-red-100 rounded-2xl">
                          <TimerIcon />Em Análise
                        </div>
                      </>
                      : itemVersionamento.status === "APROVADA" ?
                        <>
                          <div className="flex items-center justify-center gap-3 text-ring bg-green-100 rounded-2xl">
                            <TimerIcon />Em Análise
                          </div>
                        </>
                        : ''
                }
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
                    <Button variant="destructive" className="flex gap-2 items-center cursor-pointer">
                      <CircleX />
                      Reprovada
                    </ Button>
                    <Button className="flex gap-2 items-center cursor-pointer">
                      <CircleCheckBig />
                      Aprovada
                    </Button>
                    <Button variant="outline" className="flex gap-2 items-center cursor-pointer">
                      <CirclePlus />
                      Criar Nova Proposta
                    </Button>
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