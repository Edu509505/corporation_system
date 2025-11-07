import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
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
    header: "Situação",
  },
  {
    accessorKey: "valorTotal",
    header: () => <>Valor</>,
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valorTotal"));
      const formatted = new Intl.NumberFormat("PT-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
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
