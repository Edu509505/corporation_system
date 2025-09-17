import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cnpj } from "cpf-cnpj-validator";
import { CircleArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
    file: null
  })

  const [versionamento, setVersionamento] = useState<Versionamento[]>([{
    id: 0,
    versao: 0,
    idProposta: 0,
    status: "",
    createdAt: ""
  }])

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
          cliente: { cliente: data.cliente || "" }
        });
      } catch (err) { }
    }

    async function fetchCliente() {
      const response = await fetch(`${url}/cliente/${id}`)
      if (!response.ok) throw new Error("Cliente não encontrado")
      const data = await response.json()

      setCliente({
        cliente: data.cliente,
        cnpj: data.cnpj,
        local: data.local,
        status: data.status,
        file: null
      })

    }

    async function fetchVersionamento() {
      const response = await fetch(`${url}/proposta/${id}/versionamentos`)
      if (!response.ok) throw new Error("Versionamento Não encontrado")
      const data = await response.json()

      setVersionamento(data)
    }

    if (id) fetchProposta(), fetchCliente(), fetchVersionamento();
    else {
      console.log("Deu erro aqui");
    }
  }, [id]);

  console.log('versionamento', versionamento)

  return (
    <div className="h-full flex flex-col gap-3 p-5">
      <div className="flex">
        <section>
          <Link to="/propostas">
            <Button variant="ghost"
              //onClick={() => (navigate(-1))}
            >
              <CircleArrowLeftIcon />Retornar
            </Button>

          </Link>
          <h1 className="font-bold text-2xl">Versionamento de Proposta</h1>
          <h1>Nome da Proposta: {proposta.nomeDaProposta}</h1>
          <h1>Data: {proposta.createdAt
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/")}
          </h1>
          <h1>Cliente: {cliente.cliente}</h1>
          <h1>CNPJ: {cnpj.format(cliente.cnpj)}</h1>
        </section>
        <section>
          <iframe></iframe>
        </section>
      </div>
      <div className="h-[800px] border-t-1 border-gray-500">
        <Table className=" h-[100%]">
          <TableHeader>
            <TableRow>
              <TableHead>Versão</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versionamento.map((itemVersionamento) => (
              <TableRow
                key={itemVersionamento.id}
              >
                <TableCell className="font-bold">
                  {itemVersionamento.versao}
                </TableCell>
                <TableCell>{itemVersionamento.status}</TableCell>
                <TableCell>
                  {itemVersionamento.createdAt
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Versionamento;
