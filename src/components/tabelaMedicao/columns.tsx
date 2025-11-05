import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns/format";

export interface Medicoes {
  id: number;
  idCliente: number;
  propostaMedicao: {
    id: number;
    idCliente: number;
    descricao: string;
  };
  observacao: string;
  periodoInicial: string;
  periodoFinal: string;
  createdAt: Date;
  valorTotal: number;
}

export const colunaVersionamento: ColumnDef<Medicoes>[] = [
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | null;
      let data = createdAt ? format(new Date(createdAt), "dd/MM/yyyy") : "";
      return <div>{data}</div>;
    },
  },
  {
    accessorKey: "idProposta",
    header: "Obra",
    cell: ({ row }) => {
      const proposta = row.getValue("propostaMedicao") as
        | Medicoes["propostaMedicao"]
        | undefined;
      return <div>{proposta?.descricao}</div>;
    },
  },
  {
    accessorKey: "periodoInicial",
    header: "Periodo Inicial",
    cell: ({ row }) => {
      const periodoInicial = row.getValue("periodoInicial") as string | null;
      let data = periodoInicial
        ? format(new Date(periodoInicial), "dd/MM/yyyy")
        : "";
      return <div>{data}</div>;
    },
  },
  {
    accessorKey: "periodoFinal",
    header: "Periodo Inicial",
    cell: ({ row }) => {
      const periodoFinal = row.getValue("periodoFinal") as string | null;
      let data = periodoFinal
        ? format(new Date(periodoFinal), "dd/MM/yyyy")
        : "";
      return <div>{data}</div>;
    },
  },
  {
    accessorKey: "valorTotal",
    header: "Valor Da Medição",
    cell: ({ row }) => {
      const valorTotal = row.getValue("valorTotal") as number | null;
      let data = valorTotal
        ? Intl.NumberFormat("PT-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valorTotal / 100)
        : "-";

      return <div>{data}</div>;
    },
  },
];
