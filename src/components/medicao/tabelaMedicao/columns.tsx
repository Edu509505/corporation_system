import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Timer } from "lucide-react";
import { Link } from "react-router-dom";

export interface Medicao {
  id: number;
  idCliente: number;
  idProposta: number;
  observacao: string;
  periodoInicial: string;
  periodoFinal: string;
  faturado: string;
  valorTotal: number;
}

export const columns: ColumnDef<Medicao>[] = [
  {
    accessorKey: "id",
    header: "Número",
  },
  {
    id: "clienteMedicao.name",
    accessorKey: "clienteMedicao.name",
    header: "Empresa",
  },
  {
    id: "propostaMedicao.nomeDaProposta",
    accessorKey: "propostaMedicao.nomeDaProposta",
    header: "Obra",
  },
  {
    id: "faturado",
    accessorKey: "faturado",
    header: () => "Situação",
    cell: ({row}) => {
      const situacao = row.getValue("faturado") as string ;
      const formatacao = situacao.toUpperCase();
      if (formatacao === "NAO_FATURADO") {
        return <Badge className="text-blue-600 bg-blue-100 border border-blue-500"><Timer /> Não Faturado</Badge>
      } else if (formatacao === "FATURADO") {
        return <Badge className="text-green-600 bg-green-100 border border-green-500"> <CircleCheck /> Faturado </Badge>
      }
    }
  },
  {
    accessorKey: "valorTotal",
    header: () => <>Valor</>,
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valorTotal"));
      const formatted = new Intl.NumberFormat("PT-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor / 100);
      return formatted;
    },
  },
  {
    id: "acoes",
    header: () => <>Ações</>,
    cell: ({ row }) => {
      return (
        <Link to={`/visualizarMedicao/${row.original.id}`}>
          <Button className="rounded-2xl bg-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer">
            Visualizar
          </Button>
        </Link>

      )
    }
  }
];
