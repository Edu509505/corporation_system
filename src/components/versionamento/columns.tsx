import type { ColumnDef } from "@tanstack/react-table";
//import { CircleAlertIcon, CircleCheck, CircleX } from "lucide-react";
import StatusDeAprovacao from "../componentsVersionamento/StatusDeAprovaao";

export type Propostas = {
  id: number;
  nomeDaProposta: string;
  statusProposta: string;
  createdAt: string | null;
  descricao: string;
  valorProposta: string;
  cliente: {
    cliente: string;
    local: string;
  };
};

export const columns: ColumnDef<Propostas>[] = [
  {
    accessorKey: "id",
    header: "Número",
  },
  {
    accessorKey: "cliente.cliente",
    header: "Empresa",
  },
  {
    accessorKey: "nomeDaProposta",
    header: "Nome Da Proposta",
  },
  {
    accessorKey: "statusProposta",
    header: () => <div className="text-center">Situação</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <StatusDeAprovacao prop={row.getValue("statusProposta")} />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Emissão",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string | null;
      let data = createdAt
        ? createdAt.split("T")[0].split("-").reverse().join("/")
        : "";
      return <div>{data}</div>;
    },
  },
  {
    accessorKey: "valorProposta",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valorProposta"));
      const formatted = new Intl.NumberFormat("PT-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
