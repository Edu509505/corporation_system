import { Button } from "@/components/ui/button";
import { formatToBRL } from "brazilian-values";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, Eye } from "lucide-react";
//import { table } from "console";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_API_URL;

interface Propostas {
  id: number;
  nomeDaProposta: string;
  descricao: string;
  valorProposta: string;
  createdAt: string;
  cliente: {
    cliente: string;
  };
}

export default function VerPropostas() {
  const navigate = useNavigate();

  const [propostas, setPropostas] = useState<Propostas[]>([]);

  useEffect(() => {
    async function verPropostas() {
      const response = await fetch(`${url}/propostas`);
      const body = await response.json();
      setPropostas(body);
    }
    verPropostas();
  }, []);

  const handleClick = () => {
    navigate("/criarProposta"); // Navigates to the /dashboard route
  };

  const paginaVersionamento = (propostaId: number) => {
    navigate(`/proposta/versionamento/${propostaId}`);
  };

  return (
    <div className="h-full flex flex-col p-5 gap-4">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">Propostas</h1>

        <Button onClick={handleClick} className="cursor-pointer">
          <CirclePlus />
          Criar Proposta
        </Button>
      </div>

      <div className="border-gray-400 border-2 rounded-2xl h-full">
        <Table className=" h-[100%]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-min-[15%]">Cliente</TableHead>
              <TableHead>Proposta</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propostas.map((proposta) => (
              <TableRow
                key={proposta.id}
                onClick={() => paginaVersionamento(proposta.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-bold">
                  {proposta.cliente.cliente}
                </TableCell>
                <TableCell>{proposta.nomeDaProposta}</TableCell>
                <TableCell>{proposta.descricao}</TableCell>
                <TableCell>
                  {proposta.createdAt
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                </TableCell>
                <TableCell>
                  {formatToBRL(parseInt(proposta.valorProposta))}
                </TableCell>
                <Link to={`/proposta/versionamento/${proposta.id}`}>
                  <TableCell className="cursor-pointer">
                    <div className="flex justify-center w-24 p-2 rounded-full hover:bg-blue-500 hover:text-white hover:font-bold transition">
                      <p>Visualizar</p>
                    </div>
                  </TableCell>
                </Link>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
