import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CirclePlus, Paperclip } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;

interface Contrato {
  id: number;
  idCliente: number;
  idProposta: number;
  contrato: string;
  nome: string;
  descricao: string;
  status: string;
  local: string;
  createdAt: string;
}

function Contratos() {
  const [contratos] = useState([
    {
      id: 1,
      nome: "Contrato de Prestação de Serviços",
      cliente: "Empresa ABC",
      data: "10/09/2025",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Contrato de Fornecimento",
      cliente: "Empresa XYZ",
      data: "22/08/2025",
      status: "Encerrado",
    },
  ]);

  const {
    //isPending: propostaLoading,
    //error: propostaError,
    data: contratosData,
  } = useQuery({
    queryKey: ["contratos"],
    queryFn: async () => {
      const response = await fetch(`${url}/contratos/`);
      if (!response.ok) throw new Error("Proposta não encontrada");
      const data = await response.json();
      return data as Contrato[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br bg-gray-50 flex flex-col p-8 gap-3">
      <h1 className="text-3xl font-bold text-blue-700">Contratos</h1>
      <p className="text-gray-600">
        Visualize e gerencie os contratos cadastrados no sistema.
      </p>
      <div>
        <Link to="/addContrato">
          <Button variant="default" className="cursor-pointer">
            <CirclePlus />
            Novo Contrato
          </Button>
        </Link>
      </div>
      <Table className="w-full border-collapse mb-8 border rounded-2xl overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="py-3 px-4 text-left rounded-tl-2xl">
              Nome
            </TableHead>
            <TableHead className="py-3 px-4 text-left">Cliente</TableHead>
            <TableHead className="py-3 px-4 text-left">Data</TableHead>
            <TableHead className="py-3 px-4 text-left">Status</TableHead>
            <TableHead className="py-3 px-4 text-center rounded-tr-2xl">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!contratosData ? (
            <TableCell>Não Há Contratos no momento</TableCell>
          ) : (
            contratosData.map((contratos) => (
              <TableRow key={contratos.id} className="bg-white">
                <TableCell className="py-3 px-4">{contratos.nome}</TableCell>
                <TableCell className="py-3 px-4">
                  {contratos.idCliente}
                </TableCell>
                <TableCell className="py-3 px-4">
                  {contratos.createdAt
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contratos.status === "Ativo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {contratos.status}
                  </span>
                </TableCell>
                <TableCell className="py-3 px-4 text-center">
                  <Button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                    Visualizar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Contratos;
