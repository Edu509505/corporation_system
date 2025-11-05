import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns/format";

export interface Medicoes {
  id: number;
  idCliente: number;
  idProposta: {
    id: number;
    idCliente: number;
    nomeDaProposta: string;
  };
  observacao: string;
  periodoInicial: string;
  periodoFinal: string;
  createdAt: Date;
}

export const colunaVersionamento: ColumnDef<Medicoes>[] = [
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | null;
      let data = createdAt ? format(new Date(createdAt), "dd/mm/yyyy") : "";
      return <div>{data}</div>;
    },
  },
  {
    accessorKey: "idProposta",
    header: "Obra",
    cell: ({ row }) => {
      const proposta = row.getValue("idProposta") as Medicoes["idProposta"];
      return <div>{proposta?.nomeDaProposta ?? "—"}</div>;
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
];
