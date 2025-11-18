import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "../../ui/badge";
import { CircleCheck, CircleX, Timer } from "lucide-react";
import { format } from "date-fns";

export interface Contrato {
  id: number;
  idCliente: number;
  idProposta: number;
  contrato: string;
  titulo: string;
  descricao: string;
  status: string;
  local: string;
  createdAt: string;
  clientesContratos: {
    name: string;
  };
}

export const columns: ColumnDef<Contrato>[] = [
  {
    id: "clientesContratos.name",
    accessorKey: "clientesContratos.name",
    header: "Empresa",
  },
  {
    id: "titulo",
    accessorKey: "titulo",
    header: "Contrato",
  },
  {
     id: "status",
    accessorKey: "status",
     header: () => <>Situação</>,
    cell: ({ row }) => {
      const proposta = row.getValue("status");

      if (proposta === "EM_ANALISE") {
        return <Badge className="text-blue-600 bg-blue-100 border border-blue-500"><Timer /> Em Análise</Badge>
      } else if (proposta === "ATIVO") {
        return <Badge className="text-green-600 bg-green-100 border border-green-500"> <CircleCheck /> Aprovada </Badge>
      } else if (proposta === "CANCELADA") {
        return <Badge className="text-red-600 bg-red-100 border border-red-500"> <CircleX /> Cancelada </Badge>
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <>Data</>,
    cell: ({ row }) => {
      const formatted = format(new Date(row.getValue("createdAt")), "dd/MM/yyyy");
      return formatted;
    },
  },
  {
    id: "acoes",
    header: () => <>Ações</>,
    cell: ({ row }) => {
      return (
        <Link to={`/visualizarContrato/${row.original.id}`}>
          <Button className="rounded-2xl bg-blue-100 text-blue-600 border-blue-600 border-1 hover:bg-blue-600 hover:text-white cursor-pointer h-8 w-21">
            Visualizar
          </Button>
        </Link>
      );
    },
  },
];
