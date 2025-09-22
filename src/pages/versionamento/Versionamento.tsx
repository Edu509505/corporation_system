import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cigarette, CircleArrowLeftIcon, CircleCheckBig, CircleX, Divide, Paperclip, TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cnpj } from "cpf-cnpj-validator";
import { da } from "zod/v4/locales";

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

// interface AnexoVersionamento {
//   url: [string];
// }

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
    <div className="h-full flex flex-col p-3">
      <div className="flex items-start justify-between gap-4">
        <section>
          <Link to="/propostas">
            <Button
              variant="ghost"
            >
              <CircleArrowLeftIcon />
              Retornar
            </Button>
          </Link>
          <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
          <h1>Nome da Proposta: {proposta.nomeDaProposta}</h1>
          <h1>
            Data:{" "}
            {proposta.createdAt.split("T")[0].split("-").reverse().join("/")}
          </h1>
          <h1>Cliente: {cliente.cliente}</h1>
          <h1>CNPJ: {cnpj.format(cliente.cnpj)}</h1>
        </section>
        <section className="flex flex-col gap-4">
          <div className="border-2 border-gray-400 rounded-2xl p-2 w-2xs">
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
          </div>
        </section>
      </div>
      <div className="h-[800px] border-t-1 border-gray-500">
        <Table className=" h-[100%]">
          <TableHeader>
            <TableRow>
              <TableHead>Versão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Ações</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionamento.map((itemVersionamento) => (
              <TableRow key={itemVersionamento.id}>
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
                <TableCell>{
                  itemVersionamento.status === 'EM_ANALISE' ?
                    <>
                      <div className="flex items-center justify-center gap-3 text-chart-1 bg-amber-50 rounded-2xl">
                        <TimerIcon />Em Análise
                      </div>
                    </>
                    : itemVersionamento.status ==="REPROVADA" ? 
                    <>
                      <div className="flex items-center justify-center gap-3 text-destructive bg-red-100 rounded-2xl">
                        <TimerIcon />Em Análise
                      </div>
                    </>
                    : itemVersionamento.status ==="APROVADA"?
                    <>
                      <div className="flex items-center justify-center gap-3 text-ring bg-green-100 rounded-2xl">
                        <TimerIcon />Em Análise
                      </div>
                    </>
                    :''
                  }
                </TableCell>
                {/* <TableCell className="flex gap-3">
                  <div className="flex flex-col items-center text-[0.8rem] text-destructive rounded-2xl p-2 bg-red-100">
                  <CircleX className="size-5"/>
                  Reprovada
                  </div>
                  <div className="flex flex-col items-center text-[0.8rem] text-ring rounded-2xl p-2 bg-green-100">
                  <CircleCheckBig className="size-5"/>
                  Aprovada
                  </div>

                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex items-center justify-between">
                  Ações
                  <div className="flex gap-3">
                    <div className="flex gap-2 items-center text-[0.8rem] text-destructive rounded-2xl p-2 cursor-pointer bg-red-200 ">
                      <CircleX className="size-5" />
                      Reprovada
                    </div>
                    <div className="flex gap-2 items-center text-[0.8rem] text-ring rounded-2xl p-2 cursor-pointer bg-green-200">
                      <CircleCheckBig className="size-5" />
                      Aprovada
                    </div>
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
